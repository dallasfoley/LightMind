"use client";

import { Button } from "@/components/ui/button";

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

export default function SuggestedPrompts({
  onSelectPrompt,
}: SuggestedPromptsProps) {
  const prompts = [
    "I'm feeling anxious today",
    "Help me understand my mood patterns",
    "I need some journaling prompts",
    "What are some good sleep habits?",
    "How can I reduce my stress levels?",
    "I'm having trouble focusing",
  ];

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {prompts.map((prompt) => (
        <Button
          key={prompt}
          variant="outline"
          size="sm"
          onClick={() => onSelectPrompt(prompt)}
          className="text-xs"
        >
          {prompt}
        </Button>
      ))}
    </div>
  );
}
