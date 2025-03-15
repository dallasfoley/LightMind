import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import RemindersCard from "./card-content/reminders-card";
import CheckInCard from "./card-content/check-in-card";
import type { UserType } from "@/schema/userSchema";
import JournalCard from "./card-content/journal-card";
import { Suspense } from "react";
import LightBulbIcon from "./card-content/lightbulb-icon";
import { FadeLoader } from "react-spinners";
import CustomizationIcon from "./card-content/customization-icon";
import type { ReminderType } from "@/schema/reminderSchema";
import type { JournalEntryType } from "@/schema/journalEntrySchema";

// Replace the DashboardDataType definition with this more specific one
type CheckInWithDateString = {
  date: string;
  id: string;
  mood: number;
  energy: number;
  sleepHours: number;
  sleepQuality: number;
  stress: number;
  notes: string | null;
  userId: string;
};

type CheckInWithDateObject = Omit<CheckInWithDateString, "date"> & {
  date: Date;
};

type DashboardDataType = {
  todaysCheckIn: CheckInWithDateString | null;
  recentCheckIns: CheckInWithDateObject[]; // Specifically typed for transformed dates
  todaysJournal: JournalEntryType | null;
  todaysReminders: ReminderType[];
  upcomingReminders: ReminderType[];
  checkedInToday: boolean;
  journalStreak: number;
  hasJournaledRecently?: boolean;
} | null;

export default function NavLinks({
  user,
  dashboardData,
}: {
  user: UserType;
  dashboardData: DashboardDataType;
}) {
  const checkedInToday = dashboardData?.checkedInToday || false;

  const links = [
    {
      title: "Check-In",
      link: !checkedInToday ? "check-in" : "check-in/update",
      color: "bg-blue-100 dark:bg-blue-900",
      content: (
        <CheckInCard
          user={user}
          checkIns={dashboardData?.recentCheckIns || []}
        />
      ),
    },
    {
      title: "Journal",
      link: "journal",
      color: "bg-green-100 dark:bg-green-900",
      content: (
        <JournalCard
          user={user}
          journalStreak={dashboardData?.journalStreak || 0}
        />
      ),
    },
    {
      title: "Reminders",
      link: "reminders",
      color: "bg-yellow-100 dark:bg-yellow-900",
      content: (
        <RemindersCard
          user={user}
          reminders={dashboardData?.todaysReminders || []}
        />
      ),
    },
    {
      title: "Resources",
      link: "resources",
      color: "bg-purple-100 dark:bg-purple-900",
      content: <LightBulbIcon />,
    },
    {
      title: "Settings",
      link: "settings",
      color: "bg-pink-100 dark:bg-pink-900",
      content: <CustomizationIcon />,
    },
  ];

  return (
    <nav className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {links.map((link, id) => (
        <Suspense
          key={id}
          fallback={
            <div className="flex items-center justify-center h-full w-full">
              <FadeLoader color="white" />
            </div>
          }
        >
          <Link href={`/dashboard/${link.link}`} prefetch>
            <Card
              className={`${link.color} aspect-square hover:shadow-md transition-shadow duration-200 ease-in-out p-2`}
            >
              <CardHeader className="flex flex-row items-center justify-between p-1 font-medium text-lg">
                <CardTitle className="text-gray-900 dark:text-gray-100">
                  {link.title}
                </CardTitle>
                <ArrowRight className="text-lg text-gray-600 dark:text-gray-400 -translate-y-1" />
              </CardHeader>
              <CardContent className="flex items-center justify-center p-0 h-[calc(100%-2.5rem)] ">
                {link.content}
              </CardContent>
            </Card>
          </Link>
        </Suspense>
      ))}
    </nav>
  );
}
