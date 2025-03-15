import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NavLinks from "@/components/dashboard/nav-links";
import { getUser } from "@/server/actions/users/getUser";
import FieldSelectorGraph from "@/components/dashboard/field-selector-graph";
import { getDashboardData } from "@/server/actions/getDashboardData";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatbotLink } from "@/components/dashboard/chatbot-link";

// Add metadata for better SEO
export const metadata = {
  title: "Dashboard | LightMind",
  description: "View your mental health data and insights",
};

export default async function DashboardPage() {
  const user = await getUser();

  // Use the consolidated data fetching function
  const dashboardData = user ? await getDashboardData(user) : null;

  const transformedCheckIns = dashboardData?.recentCheckIns?.map((checkIn) => ({
    ...checkIn,
    date: new Date(checkIn.date),
  }));

  return (
    <div className="space-y-4">
      {user && <NavLinks user={user} />}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className=" dark:bg-zinc-800">
          <CardHeader>
            <CardTitle className="text-zinc-900 dark:text-zinc-200">
              Wellness Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
              {user && (
                <FieldSelectorGraph
                  userId={user.id}
                  initialData={transformedCheckIns}
                />
              )}
            </Suspense>
          </CardContent>
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
