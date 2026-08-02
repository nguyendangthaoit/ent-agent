"use client";
import { cn } from "@/src/lib/utils";
import { Bot, User } from "lucide-react";

export interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp?: Date;
}

interface ChatMessageProps {
    message: Message;
    isStreaming?: boolean;
}

export function ChatMessage({ message, isStreaming }: ChatMessageProps) {
    const isUser = message.role === "user";

    return (
        <div
            className={cn(
                "flex w-full gap-3 px-4 py-3",
                isUser ? "justify-end" : "justify-start",
            )}
        >
            {/* Avatar */}
            {!isUser && (
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Bot className="size-4" />
                </div>
            )}

            {/* Message Bubble */}
            <div
                className={cn(
                    "max-w-[70%] rounded-2xl px-4 py-2 text-sm",
                    isUser
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md",
                )}
            >
                <p className="whitespace-pre-wrap">
                    {message.content}
                    {isStreaming && (
                        <span className="ml-0.5 inline-block h-4 w-1 animate-pulse bg-foreground align-text-bottom" />
                    )}
                </p>
            </div>

            {/* User Avatar */}
            {isUser && (
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                    <User className="size-4" />
                </div>
            )}
        </div>
    );
}