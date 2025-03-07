"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { RiStarSmileFill } from "react-icons/ri";
import { BsJournals } from "react-icons/bs";
import { FaBell } from "react-icons/fa";
import { BiCustomize } from "react-icons/bi";
import { FaFolder } from "react-icons/fa";
import { useEffect, useState } from "react";
import { UserType } from "@/schema/userSchema";
import { getTodaysCheckIn } from "@/server/actions/checkIns/getTodaysCheckIn";
import { CheckInDataType } from "@/schema/checkInSchema";

export default function Sidebar({ user }: { user: UserType }) {
  const pathname = usePathname();
  const [checkIn, setCheckIn] = useState<CheckInDataType>();

  useEffect(() => {
    const fetchCheckIn = async () => {
      const todayCheckIn = await getTodaysCheckIn(user.id);
      if (todayCheckIn) {
        setCheckIn({ ...todayCheckIn, date: new Date(todayCheckIn.date) });
      }
    };
    fetchCheckIn();
  }, [user.id]);

  const sidebarItems = [
    {
      title: "Daily check in",
      href: checkIn ? "/dashboard/check-in/update" : "/dashboard/check-in",
      icon: <RiStarSmileFill />,
    },
    { title: "Journal", href: "/dashboard/journal", icon: <BsJournals /> },
    { title: "Reminders", href: "/dashboard/reminders", icon: <FaBell /> },

    { title: " Resources", href: "/dashboard/resources", icon: <FaFolder /> },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: <BiCustomize />,
    },
  ];

  return (
    <div className="hidden md:w-[300px] bg-slate-800 text-white lg:block dark:bg-gray-800/40">
      <div className="flex h-full flex-col gap-2">
        <div className="flex h-[60px] items-center border-b px-6">
          <Link href={"/dashboard"} className="flex items-center">
            <h1 className="text-lg md:text-2xl font-semibold">LightMind</h1>
            <Image
              src={"/brain-logo.png"}
              alt=""
              height={36}
              width={36}
              className="mx-4 -translate-y-1"
            />
          </Link>
        </div>
        <ScrollArea className="flex-1 px-3">
          <div className="space-y-1 py-2">
            {sidebarItems.map((item) => (
              <Button
                key={item.title}
                asChild
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  pathname === item.href
                    ? "bg-gray-200 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
                )}
              >
                <Link href={item.href}>
                  <span className="flex gap-4">
                    {item.icon} {item.title}
                  </span>
                </Link>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
