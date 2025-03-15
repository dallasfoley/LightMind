import Link from "next/link";
import ChatbotIcon from "@/components/dashboard/card-content/chatbot-icon";

export function ChatbotLink() {
  return (
    <Link
      href="/dashboard/chat"
      className="flex justify-center items-center p-0 bg-transparent hover:bg-transparent"
      prefetch
    >
      <ChatbotIcon />
    </Link>
  );
}
