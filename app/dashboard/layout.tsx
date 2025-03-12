import type React from "react";
import Header from "@/components/dashboard/header";
import Sidebar from "@/components/dashboard/sidebar";
import { getUser } from "@/server/actions/users/getUser";
import {
  CustomThemeProvider,
  ThemeProvider,
} from "@/components/theme-provider";
import ChatButton from "@/components/chat/chat-button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <CustomThemeProvider>
        <div className="flex h-screen overflow-hidden">
          {user && <Sidebar user={user} />}
          <div className="flex flex-col flex-1 overflow-hidden bg-zinc-100 dark:bg-zinc-900">
            <Header />
            <main className="flex-1 overflow-x-hidden overflow-y-auto">
              <div className="container mx-auto px-6 py-8">{children}</div>
            </main>
            <ChatButton />
          </div>
        </div>
      </CustomThemeProvider>
    </ThemeProvider>
  );
}
