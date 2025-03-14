import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NavLinks from "@/components/dashboard/nav-links";
import { getUser } from "@/server/actions/users/getUser";
import { ChatbotLink } from "@/components/dashboard/chatbot-link";
import Graph from "@/components/dashboard/field-selector-graph";

export default async function DashboardPage() {
  const user = await getUser();

  return (
    <div className="space-y-4">
      {user && <NavLinks user={user} />}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-2 dark:bg-zinc-800">
          <CardContent>{user && <Graph user={user} />}</CardContent>
        </Card>
        <Card className="h-full w-full flex flex-col dark:bg-zinc-800">
          <CardHeader className="text-left">
            <CardTitle className="dark:text-zinc-200">AI Chatbot</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-grow justify-center items-center -translate-y-8">
            <ChatbotLink />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
