"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bell, Phone } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateNotificationSettings } from "@/server/actions/users/updateNotificationSettings";
import { useToast } from "@/hooks/use-toast";

export default function NotificationsTab() {
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({
    enableNotifications: false,
    phoneNumber: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user/settings");
        if (response.ok) {
          const data = await response.json();
          setUserData({
            enableNotifications: data.enableNotifications || false,
            phoneNumber: data.phoneNumber || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateNotificationSettings({
        enableNotifications: userData.enableNotifications,
        phoneNumber: userData.phoneNumber,
      });

      toast({
        title: "Settings updated",
        description: "Your notification preferences have been saved.",
      });
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "Failed to update notification settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="notifications" className="text-base">
                Enable SMS Reminders
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive text message reminders for your scheduled events
              </p>
            </div>
            <Switch
              id="notifications"
              checked={userData.enableNotifications}
              onCheckedChange={(checked: boolean) =>
                setUserData({ ...userData, enableNotifications: checked })
              }
            />
          </div>

          {userData.enableNotifications && (
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-base">
                Phone Number
              </Label>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={userData.phoneNumber}
                  onChange={(e) =>
                    setUserData({ ...userData, phoneNumber: e.target.value })
                  }
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Enter your phone number in international format (e.g., +1 for
                US)
              </p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full text-black"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Settings"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
