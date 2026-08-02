"use client";

import { useState, useRef, useEffect } from "react";
import type { Message } from "@/src/components/chat/ChatMessage";
import { apiClient, ApiError } from "@/src/lib/apiClient";

interface UseChatResult {
    messages: Message[];
    isStreaming: boolean;
    sendMessage: (content: string) => void;
    clearMessages: () => void;
}

interface SSEEvent {
    type: "token" | "done" | "error";
    content?: string;
    message?: string;
}
function parseSSELines(buffer: string): { events: SSEEvent[]; remainder: string } {
    const lines = buffer.split("\n");
    const remainder = lines.pop() ?? "";
    const events: SSEEvent[] = [];

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith("data: ")) continue;

        try {
            events.push(JSON.parse(trimmed.slice(6)));
        } catch {
            console.warn("Failed to parse SSE line:", trimmed);
        }
    }

    return { events, remainder };
}
export function useChat(): UseChatResult {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isStreaming, setIsStreaming] = useState(false);

    const sessionIdRef = useRef<string | null>(null);
    if (sessionIdRef.current === null) {
        // eslint-disable-next-line react-hooks/purity
        sessionIdRef.current = `session-${Date.now()}`;
    }

    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    function sendMessage(content: string) {
        const trimmed = content.trim();
        if (!trimmed || isStreaming) return;

        const userMessage: Message = {
            id: `user-${Date.now()}`,
            role: "user",
            content: trimmed,
            timestamp: new Date(),
        };

        const assistantId = `ai-${Date.now()}`;
        const assistantMessage: Message = {
            id: assistantId,
            role: "assistant",
            content: "",
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage, assistantMessage]);
        setIsStreaming(true);

        abortControllerRef.current?.abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;

        function appendToAssistant(delta: string) {
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === assistantId ? { ...msg, content: msg.content + delta } : msg,
                ),
            );
        }

        function setAssistantError(errorText: string) {
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === assistantId && !msg.content
                        ? { ...msg, content: `Error: ${errorText}` }
                        : msg,
                ),
            );
        }

        (async () => {
            try {
                const response = await apiClient.stream(
                    "/api/v1/chat",
                    { prompt: trimmed, session_id: sessionIdRef.current },
                    controller.signal,
                );

                const reader = response.body?.getReader();
                if (!reader) throw new Error("No response body");

                const decoder = new TextDecoder();
                let buffer = "";

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const { events, remainder } = parseSSELines(buffer);
                    buffer = remainder;

                    for (const event of events) {
                        if (event.type === "token" && event.content) {
                            appendToAssistant(event.content);
                        } else if (event.type === "error") {
                            throw new Error(event.message ?? "Stream error");
                        } else if (event.type === "done") {
                            await reader.cancel();
                            return;
                        }
                    }
                }
            } catch (err: unknown) {
                if (err instanceof DOMException && err.name === "AbortError") return;

                console.error("Chat stream error:", err);
                const errorText =
                    err instanceof ApiError
                        ? `${err.message}: ${JSON.stringify(err.body)}`
                        : err instanceof Error
                            ? err.message
                            : "An unexpected error occurred";

                setAssistantError(errorText);
            } finally {
                setIsStreaming(false);
                abortControllerRef.current = null;
            }
        })();
    }

    function clearMessages() {
        abortControllerRef.current?.abort();
        setMessages([]);
        setIsStreaming(false);
        sessionIdRef.current = `session-${Date.now()}`;
    }

    return { messages, isStreaming, sendMessage, clearMessages };
}