"use client"
import { useState } from "react";
import { ChatSidebar } from "@/src/components/chat/ChatSidebar";
import { ChatBox } from "@/src/components/chat/ChatBox";

export default function ChatPage() {
  const [activeSessionId, setActiveSessionId] = useState<string | undefined>();

  return (
    <div className="flex h-full">
      <ChatSidebar
        activeSessionId={activeSessionId}
        onSessionSelect={setActiveSessionId}
        onNewChat={() => setActiveSessionId(undefined)}
      />
      <ChatBox />
    </div>
  );
}