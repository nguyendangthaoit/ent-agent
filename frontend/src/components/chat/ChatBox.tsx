"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { ChatMessage, type Message } from "./ChatMessage";
import { Button } from "../ui/button";
import { cn } from "@/src/lib/utils";

// Placeholder messages for preview
const MOCK_MESSAGES: Message[] = [
    {
        id: "m1",
        role: "assistant",
        content: "Hello! How can I help you today?",
        timestamp: new Date(),
    },
    {
        id: "m2",
        role: "user",
        content: "Can you explain the project architecture?",
        timestamp: new Date(),
    },
    {
        id: "m3",
        role: "assistant",
        content:
            "Sure! The project follows a modular architecture with:\n\n- **Frontend**: Next.js (App Router) + Tailwind CSS + Shadcn UI\n- **Backend**: FastAPI microservices\n- **State Management**: Zustand for global UI state\n- **AI Integration**: Vercel AI SDK for streaming responses\n\nWhat specific part would you like to explore?",
        timestamp: new Date(),
    },
];

export function ChatBox() {
    const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
    const [input, setInput] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-scroll to bottom when new messages appear
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Auto-resize textarea
    const autoResizeTextarea = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
        }
    };

    useEffect(() => {
        autoResizeTextarea();
    }, [input]);

    const handleSend = () => {
        if (!input.trim() || isStreaming) return;

        const userMessage: Message = {
            id: `user-${Date.now()}`,
            role: "user",
            content: input.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        // Reset textarea height after clearing
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }
        setIsStreaming(true);

        // Simulate an AI response after a brief delay (placeholder for real streaming)
        setTimeout(() => {
            const aiMessage: Message = {
                id: `ai-${Date.now()}`,
                role: "assistant",
                content: "This is a placeholder response. Real AI streaming will be integrated later.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiMessage]);
            setIsStreaming(false);
        }, 1500);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex h-full flex-1 flex-col">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto py-4">
                <div className="mx-auto max-w-4xl space-y-1">
                    {messages.map((msg) => (
                        <ChatMessage
                            key={msg.id}
                            message={msg}
                            isStreaming={isStreaming && msg === messages[messages.length - 1] && msg.role === "assistant"}
                        />
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="border-t border-border bg-background px-4 py-3">
                <div className="mx-auto flex max-w-4xl items-end gap-2">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message…"
                        disabled={isStreaming}
                        rows={1}
                        className={cn(
                            "flex w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm",
                            "placeholder:text-muted-foreground",
                            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                            "disabled:cursor-not-allowed disabled:opacity-50",
                            "min-h-10 max-h-50",
                        )}
                    />
                    <Button
                        onClick={handleSend}
                        disabled={!input.trim() || isStreaming}
                        size="icon"
                        className="mb-0.5 shrink-0"
                    >
                        <Send className="size-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}