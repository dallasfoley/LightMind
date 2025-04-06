import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NavLinks from "@/components/dashboard/nav-links";
import { getUser } from "@/server/actions/users/getUser";
import FieldSelectorGraph from "@/components/dashboard/field-selector-graph";
import { getDashboardData } from "@/server/actions/getDashboardData";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatbotLink } from "@/components/dashboard/chatbot-link";

export const metadata = {
  title: "Dashboard | LightMind",
  description: "View your mental health data and insights",
};

export default async function DashboardPage() {
  const user = await getUser();

  const dashboardData = user ? await getDashboardData(user) : null;

  const transformedCheckIns =
    dashboardData?.recentCheckIns?.map((checkIn) => ({
      ...checkIn,
      date: new Date(checkIn.date),
    })) || [];

  const transformedTodayReminders =
    dashboardData?.todaysReminders?.map((reminder) => ({
      ...reminder,
      completed: reminder.completed ?? false,
      notificationTime: reminder.notificationTime ?? undefined,
    })) || [];

  const transformedUpcomingReminders =
    dashboardData?.upcomingReminders?.map((reminder) => ({
      ...reminder,
      completed: reminder.completed ?? false,
      notificationTime: reminder.notificationTime ?? undefined,
    })) || [];

  const transformedDashboardData = dashboardData
    ? {
        ...dashboardData,
        recentCheckIns: transformedCheckIns,
        todaysReminders: transformedTodayReminders,
        upcomingReminders: transformedUpcomingReminders,
        todaysJournal: dashboardData.todaysJournal
          ? {
              ...dashboardData.todaysJournal,
              date: new Date(dashboardData.todaysJournal.date),
              title: dashboardData.todaysJournal.title ?? undefined,
            }
          : null,
      }
    : null;

  return (
    <div className="space-y-4">
      {user && (
        <NavLinks user={user} dashboardData={transformedDashboardData} />
      )}
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
