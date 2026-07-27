"use client"
import { Plus, MessageSquare } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";

// Placeholder type for a chat history item
interface ChatSession {
    id: string;
    title: string;
    lastMessage?: string;
    timestamp: Date;
}

// Placeholder data — will be replaced with real API data later
const MOCK_SESSIONS: ChatSession[] = [
    {
        id: "1",
        title: "Project Architecture Discussion",
        lastMessage: "Let's review the microservices...",
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
        id: "2",
        title: "Code Review: PR #42",
        lastMessage: "The error boundary approach looks good...",
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
        id: "3",
        title: "Bug Analysis: Login Flow",
        lastMessage: "I think the issue is in the token refresh...",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    {
        id: "4",
        title: "API Design for User Module",
        lastMessage: "We should use cursor-based pagination...",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
];

interface ChatSidebarProps {
    activeSessionId?: string;
    onSessionSelect?: (sessionId: string) => void;
    onNewChat?: () => void;
}

export function ChatSidebar({ activeSessionId, onSessionSelect, onNewChat }: ChatSidebarProps) {
    return (
        <aside className="flex h-full w-72 flex-col border-r border-border bg-muted/30">
            {/* New Chat Button */}
            <div className="p-3">
                <Button onClick={onNewChat} className="w-full justify-start gap-2" variant="outline">
                    <Plus className="size-4" />
                    <span>New Chat</span>
                </Button>
            </div>

            {/* Sessions List */}
            <div className="flex-1 overflow-y-auto px-2 pb-2">
                <div className="space-y-1">
                    {MOCK_SESSIONS.map((session) => (
                        <button
                            key={session.id}
                            onClick={() => onSessionSelect?.(session.id)}
                            className={cn(
                                "flex w-full items-start gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors",
                                "hover:bg-accent hover:text-accent-foreground",
                                activeSessionId === session.id
                                    ? "bg-accent text-accent-foreground"
                                    : "text-muted-foreground",
                            )}
                        >
                            <MessageSquare className="mt-0.5 size-4 shrink-0" />
                            <div className="flex-1 overflow-hidden">
                                <p className="truncate font-medium text-foreground">{session.title}</p>
                                {session.lastMessage && (
                                    <p className="truncate text-xs text-muted-foreground">{session.lastMessage}</p>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </aside>
    );
}