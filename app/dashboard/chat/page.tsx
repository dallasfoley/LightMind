import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ChatInterfaceFull from "@/components/chat/chat-interface-full";
import { ChevronDown } from "lucide-react";

export default function ChatPage() {
  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 text-zinc-900 dark:text-zinc-200">
        Mental Health Assistant
      </h1>

      {/* Mobile-only collapsible info card */}
      <details className="md:hidden mb-4 bg-card rounded-lg shadow-sm text-black">
        <summary className="flex items-center justify-between p-4 cursor-pointer">
          <h3 className="font-medium">How can I help you?</h3>
          <ChevronDown className="h-5 w-5 summary-icon text-black" />
        </summary>
        <div className="px-4 pb-4">
          <p className="mb-2 text-sm">Your assistant can help with:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Understanding your mood patterns and trends</li>
            <li>Suggesting coping strategies for stress and anxiety</li>
            <li>Providing journaling prompts based on your needs</li>
            <li>Offering sleep improvement tips</li>
            <li>Setting and tracking mental health goals</li>
            <li>Finding resources for additional support</li>
          </ul>
        </div>
      </details>

      {/* Desktop grid layout */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="hidden md:block">
          <CardHeader>
            <CardTitle>How can I help you?</CardTitle>
            <CardDescription>
              Chat with your mental health assistant for support, insights, and
              guidance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Your assistant can help with:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Understanding your mood patterns and trends</li>
              <li>Suggesting coping strategies for stress and anxiety</li>
              <li>Providing journaling prompts based on your needs</li>
              <li>Offering sleep improvement tips</li>
              <li>Setting and tracking mental health goals</li>
              <li>Finding resources for additional support</li>
            </ul>
          </CardContent>
        </Card>

        {/* Chat interface - full width on mobile */}
        <Card className="h-[500px] md:h-[500px] flex flex-col md:col-span-1 col-span-2">
          <CardContent className="flex-1 p-0">
            <ChatInterfaceFull />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
