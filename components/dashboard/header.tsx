"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignOutButton } from "@clerk/nextjs";
import { Bell, User, Settings } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function Header() {
  const { user, isSignedIn } = useUser();
  return (
    <header className="flex h-14 lg:h-[60px] justify-end items-center gap-4 border-b px-6">
      <div className="flex items-center">
        <Link href="/" className="inline-block mr-6">
          <Bell className="h-5 w-5 text-zinc-900 dark:text-white hover:text-red-500 dark:hover:text-red-500 transition-colors" />
          <span className="sr-only">Notifications</span>
        </Link>

        <Link href="/dashboard/settings" className="inline-block mr-6">
          <Settings className="h-5 w-5 text-zinc-900 dark:text-white hover:text-red-500 dark:hover:text-red-500 transition-colors" />
          <span className="sr-only">Settings</span>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full bg-zinc-900 text-white hover:text-zinc-900 dark:bg-zinc-200 dark:text-zinc-900 dark:hover:bg-zinc-950 dark:hover:text-white"
            >
              <User className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {isSignedIn && user?.firstName}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <SignOutButton>
              <DropdownMenuItem>Sign-Out</DropdownMenuItem>
            </SignOutButton>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
