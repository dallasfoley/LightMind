import type React from "react";
import { getUser } from "@/server/actions/users/getUser";
import {
  CustomThemeProvider,
  ThemeProvider,
} from "@/components/theme-provider";
import ChatButton from "@/components/chat/chat-button";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarProvider } from "@/components/dashboard/sidebar-provider";

const DynamicHeader = dynamic(() => import("@/components/dashboard/header"), {
  loading: () => <Skeleton style={{ height: 60 }} />,
});

const DynamicSidebar = dynamic(() => import("@/components/dashboard/sidebar"), {
  loading: () => <Skeleton style={{ width: 240 }} />,
});

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
        <SidebarProvider>
          <div className="flex h-screen overflow-hidden">
            {user && <DynamicSidebar user={user} />}
            <div className="flex flex-col flex-1 overflow-hidden bg-zinc-100 dark:bg-zinc-900">
              <DynamicHeader />
              <main className="flex-1 overflow-x-hidden overflow-y-auto">
                <div className="container mx-auto px-6 py-8">{children}</div>
              </main>
              <ChatButton />
            </div>
          </div>
        </SidebarProvider>
      </CustomThemeProvider>
    </ThemeProvider>
  );
}
