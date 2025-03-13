"use client";

import { useState } from "react";
import { Bot, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatInterface from "@/components/chat/chat-interface";

export default function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <>
      {/* Chat button with explicit background color */}
      <Button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 rounded-full w-14 h-14 p-0 shadow-lg bg-blue-600 hover:bg-blue-800 text-white"
        size="icon"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </Button>

      {/* Chat interface */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50">
          <ChatInterface />
        </div>
      )}
    </>
  );
}
