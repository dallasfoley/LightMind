"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppearanceTab from "@/components/settings/appearance-tab";
import AccountTab from "@/components/settings/account-tab";
import NotificationsTab from "@/components/settings/notifications-tab";

export default function SettingsForm() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("appearance");

  // Ensure we only render theme-dependent components after hydration
  useEffect(() => {
    setMounted(true);

    // Check for tab query parameter
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (
        tabParam &&
        ["appearance", "account", "notifications"].includes(tabParam)
      ) {
        setActiveTab(tabParam);
      }
    }
  }, []);

  if (!mounted) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <Tabs
        defaultValue="appearance"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <div className="flex justify-center mb-8">
          <TabsList className="w-auto max-w-md bg-zinc-500 text-white">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="appearance">
          <AppearanceTab />
        </TabsContent>

        <TabsContent value="account">
          <AccountTab />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
