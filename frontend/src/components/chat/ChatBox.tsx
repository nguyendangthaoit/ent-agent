"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { Button } from "../ui/button";
import { cn } from "@/src/lib/utils";
import { useChat } from "@/src/hooks/useChat";

export function ChatBox() {
    const { messages, isStreaming, sendMessage } = useChat();
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Auto-resize textarea
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
        }
    }, [input]);

    const handleSend = () => {
        if (!input.trim() || isStreaming) return;
        sendMessage(input);
        setInput("");
        // Reset textarea height
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }
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
                            isStreaming={
                                isStreaming &&
                                msg === messages[messages.length - 1] &&
                                msg.role === "assistant"
                            }
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