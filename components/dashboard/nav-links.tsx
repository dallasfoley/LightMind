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

export default function NavLinks({ user }: { user: UserType }) {
  const links = [
    {
      title: "Check-In",
      link: "check-in",
      color: "bg-blue-100 dark:bg-blue-900",
      content: <CheckInCard user={user} />,
    },
    {
      title: "Journal",
      link: "journal",
      color: "bg-green-100 dark:bg-green-900",
      content: <JournalCard user={user} />,
    },
    {
      title: "Reminders",
      link: "reminders",
      color: "bg-yellow-100 dark:bg-yellow-900",
      content: <RemindersCard user={user} />,
    },
    {
      title: "Resources",
      link: "resources",
      color: "bg-purple-100 dark:bg-purple-900",
      content: <LightBulbIcon />,
    },
    {
      title: "Customization",
      link: "customization",
      color: "bg-pink-100 dark:bg-pink-900",
      content: <CustomizationIcon />,
    },
    {
      title: "AI Chatbot",
      link: "chatbot",
      color: "bg-red-100 dark:bg-red-900",
      content: (
        <div className="flex items-center justify-center w-full h-full">
          <ArrowRight className="w-12 h-12" />
        </div>
      ),
    },
  ];

  return (
    <nav className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
      {links.map((link, id) => (
        <Suspense key={id} fallback={<FadeLoader color="white" />}>
          <Link href={`/dashboard/${link.link}`}>
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
