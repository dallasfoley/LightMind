"use client";

import { useState } from "react";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatInterface from "@/components/chat/chat-interface";

export default function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <>
      {!isOpen && (
        <Button
          onClick={toggleChat}
          className="fixed bottom-4 right-4 rounded-full w-14 h-14 p-0 shadow-lg bg-blue-600 hover:bg-blue-800 text-white"
          size="icon"
          aria-label="Open chat"
        >
          <Bot className="h-6 w-6" />
        </Button>
      )}

      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50">
          <ChatInterface
            defaultOpen={true}
            onToggle={(newState) => setIsOpen(newState)}
            hideButtons={false}
          />
        </div>
      )}
    </>
  );
}
