import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ChatInterfaceFull from "@/components/chat/chat-interface-full";

export default function ChatPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Mental Health Assistant</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
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

        <Card className="h-[500px] flex flex-col">
          <CardContent className="flex-1 p-0 overflow-hidden">
            <ChatInterfaceFull />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
