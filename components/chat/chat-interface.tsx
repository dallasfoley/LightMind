"use client";

import type React from "react";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import ChatbotIcon from "../dashboard/card-content/chatbot-icon";

// Accept props for external control
export default function ChatInterface({
  defaultOpen = false,
  onToggle,
  hideButtons = false,
}: {
  defaultOpen: boolean;
  onToggle: (newState: boolean) => void;
  hideButtons: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const { messages, input, handleInputChange, handleSubmit, status, error } =
    useChat({
      api: "/api/chat",
      onError: (err) => {
        toast({
          title: "Error",
          description: err.message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
        console.error("Chat error:", err);
      },
      experimental_throttle: 50,
    });

  const isLoading = status === "submitted";

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  const toggleChat = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  // If not open and buttons are hidden, don't render anything
  if (!isOpen && hideButtons) {
    return null;
  }

  // If not open and showing buttons, show just the open button
  if (!isOpen) {
    return (
      <Button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 rounded-full w-14 h-14 p-0 shadow-lg bg-blue-600 hover:bg-blue-800 text-white"
        size="icon"
      >
        <Bot className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <>
      {/* Chat button - only show if not hiding buttons */}
      {!hideButtons && (
        <Button
          onClick={toggleChat}
          className="fixed bottom-4 right-4 rounded-full w-14 h-14 p-0 shadow-lg bg-blue-600 hover:bg-blue-800 text-white"
          size="icon"
        >
          <X className="h-6 w-6" />
        </Button>
      )}

      {/* Chat interface */}
      <Card className="fixed bottom-20 right-4 w-72 md:w-96 h-[500px] shadow-xl flex flex-col">
        <CardHeader className="bg-primary text-primary-foreground py-3">
          <CardTitle className="text-lg flex items-center">
            <Bot className="mr-2 h-5 w-5" />
            Mental Health Assistant
          </CardTitle>
        </CardHeader>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <div className="my-6">
                  <ChatbotIcon />
                </div>

                <p className="text-muted-foreground">
                  Hi! I&apos;m your mental health assistant. How can I help you
                  today?
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div className="flex items-start gap-2 max-w-[80%]">
                    {message.role !== "user" && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          AI
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        "rounded-lg px-3 py-2 text-sm text-black",
                        message.role === "user" ? "bg-primary" : "bg-muted"
                      )}
                    >
                      {message.content}
                    </div>
                    {message.role === "user" && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-zinc-800 text-zinc-50">
                          U
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <CardFooter className="border-t p-3">
          <form
            onSubmit={handleSubmit}
            className="flex w-full items-center space-x-2"
          >
            <Textarea
              placeholder="Type your message..."
              className="min-h-10 flex-1 resize-none"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />

            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim()}
              className="text-black hover:bg-red-500"
            >
              <Send className="h-4 w-4 " />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </>
  );
}
