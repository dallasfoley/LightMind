"use client";

import type React from "react";

import { useChat } from "@ai-sdk/react";
import { useRef, useEffect } from "react";
import { Send, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import SuggestedPrompts from "@/components/chat/suggested-prompts";
import ChatbotIcon from "../dashboard/card-content/chatbot-icon";

export default function ChatInterfaceFull() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    error,
    setInput,
  } = useChat({
    api: "/api/chat",
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      console.error("Chat error:", err);
    },
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

  const handleSelectPrompt = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="bg-primary text-primary-foreground py-2 md:py-3">
        <CardTitle className="text-base md:text-lg flex items-center">
          <Bot className="mr-2 h-4 w-4 md:h-5 md:w-5" />
          Mental Health Assistant
        </CardTitle>
      </CardHeader>

      <ScrollArea className="flex-1 p-3 md:p-4 overflow-visible">
        <div className="space-y-3 md:space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-4 md:py-8 overflow-visible">
              <div className="my-4 md:my-6">
                <ChatbotIcon />
              </div>
              <p className="text-muted-foreground my-2 md:my-4 text-sm md:text-base">
                Hi! I&apos;m your mental health assistant. How can I help you
                today?
              </p>
              <SuggestedPrompts onSelectPrompt={handleSelectPrompt} />
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
                <div className="flex items-start gap-2 max-w-[85%] md:max-w-[80%]">
                  {message.role !== "user" && (
                    <Avatar className="h-7 w-7 md:h-8 md:w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs md:text-sm">
                        AI
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "rounded-lg px-2 py-1.5 md:px-3 md:py-2 text-xs md:text-sm",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    {message.content}
                  </div>
                  {message.role === "user" && (
                    <Avatar className="h-7 w-7 md:h-8 md:w-8">
                      <AvatarFallback className="bg-zinc-800 text-zinc-50 text-xs md:text-sm">
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

      <CardFooter className="border-t p-2 md:p-3">
        <form
          onSubmit={handleSubmit}
          className="flex w-full items-center space-x-2"
        >
          <Textarea
            placeholder="Type your message..."
            className="min-h-8 md:min-h-10 flex-1 resize-none text-sm md:text-base py-1.5 md:py-2"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />

          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            className="hover:bg-red-500 h-8 w-8 md:h-10 md:w-10"
          >
            <Send className="h-3.5 w-3.5 md:h-4 md:w-4 text-black" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
