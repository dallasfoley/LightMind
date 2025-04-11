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
import { IoIosHome } from "react-icons/io";
import { FaFolder } from "react-icons/fa";
import { useEffect } from "react";
import { TbMessageChatbot } from "react-icons/tb";
import { X } from "lucide-react";
import { useSidebar } from "../../contexts/sidebar-provider";
import { useCheckIn } from "@/contexts/check-in-provider";

export default function Sidebar() {
  const pathname = usePathname();
  const { checkIn } = useCheckIn();
  const { isSidebarOpen, closeSidebar } = useSidebar();

  // Close sidebar on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isSidebarOpen) {
        closeSidebar();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isSidebarOpen, closeSidebar]);

  const sidebarItems = [
    {
      title: "Home",
      href: "/dashboard",
      icon: <IoIosHome />,
    },
    {
      title: "Daily check in",
      href: checkIn ? "/dashboard/check-in/update" : "/dashboard/check-in",
      icon: <RiStarSmileFill />,
    },
    { title: "Journal", href: "/dashboard/journal", icon: <BsJournals /> },
    { title: "Reminders", href: "/dashboard/reminders", icon: <FaBell /> },
    { title: "Resources", href: "/dashboard/resources", icon: <FaFolder /> },
    { title: "Chat", href: "/dashboard/chat", icon: <TbMessageChatbot /> },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: <BiCustomize />,
    },
  ];

  // Mobile sidebar with overlay
  const mobileSidebar = (
    <div
      className={`md:hidden fixed inset-0 z-50 ${
        isSidebarOpen ? "block" : "hidden"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={closeSidebar}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div className="absolute left-0 top-0 h-full w-[280px] bg-zinc-300 dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xl transform transition-transform duration-200 ease-in-out">
        <div className="flex h-full flex-col gap-2">
          <div className="flex h-[60px] items-center justify-between border-b px-6">
            <Link
              href={"/dashboard"}
              className="flex items-center"
              prefetch
              onClick={closeSidebar}
            >
              <h1 className="text-lg md:text-2xl font-semibold">LightMind</h1>
              <Image
                src={"/brain-logo.png"}
                alt=""
                height={36}
                width={36}
                className="mx-4 -translate-y-1"
              />
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeSidebar}
              className="text-zinc-700 dark:text-zinc-200"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close sidebar</span>
            </Button>
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
                      ? "bg-zinc-200 hover:bg-zinc-200 text-zinc-700 dark:text-zinc-200 dark:bg-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
                      : "text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  )}
                  onClick={closeSidebar}
                >
                  <Link href={item.href} prefetch>
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
    </div>
  );

  return (
    <>
      {mobileSidebar}
      <div className="hidden md:block md:w-[300px] bg-zinc-300 dark:bg-zinc-800 text-zinc-900 dark:text-white">
        <div className="flex h-full flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link href={"/dashboard"} className="flex items-center" prefetch>
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
                      ? "bg-zinc-200 hover:bg-zinc-200 text-zinc-700 dark:text-zinc-200 dark:bg-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
                      : "text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  )}
                >
                  <Link href={item.href} prefetch>
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
    </>
  );
}
