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
      <div>
        <Button size="icon" variant="ghost" className="mr-4" asChild>
          <Link href="/">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
          </Link>
        </Button>

        <Button size="icon" variant="ghost" className="mr-6" asChild>
          <Link href="/dashboard/settings">
            <Settings className="h-12 w-12" />
            <span className="sr-only">Settings</span>
          </Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
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
