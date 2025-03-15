"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bell } from "lucide-react";

export default function NotificationsTab() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <CardTitle>Notification Settings</CardTitle>
        </div>
        <CardDescription>
          Manage how you receive notifications and alerts.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-10">
        <div className="text-center space-y-3">
          <Bell className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="text-xl font-semibold">Coming Soon</h3>
          <p className="text-muted-foreground max-w-md">
            We&apos;re working on notification settings to give you more control
            over your alerts. Check back soon for updates!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
