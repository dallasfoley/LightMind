"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReminderFormSchema } from "@/schema/reminderSchema";
import { submitReminder } from "@/server/actions/reminders/submitReminder";

interface ReminderFormProps {
  userId: string;
}

export default function ReminderForm({ userId }: ReminderFormProps) {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        const response = await fetch("/api/user/settings");
        if (response.ok) {
          const data = await response.json();
          setNotificationsEnabled(data.enableNotifications || false);
        }
      } catch (error) {
        console.error("Failed to fetch user settings:", error);
      }
    };

    fetchUserSettings();
  }, []);

  const form = useForm<z.infer<typeof ReminderFormSchema>>({
    resolver: zodResolver(ReminderFormSchema),
    defaultValues: {
      title: "",
      description: "",
      datetime: new Date(),
      completed: false,
      notificationTime: 30,
    },
  });

  const handleSubmit = async (formData: z.infer<typeof ReminderFormSchema>) => {
    try {
      // Get the local date from the form
      const localDate = new Date(formData.datetime);

      // Store the local time components
      const year = localDate.getFullYear();
      const month = localDate.getMonth();
      const day = localDate.getDate();
      const hours = localDate.getHours();
      const minutes = localDate.getMinutes();
      const seconds = localDate.getSeconds();

      // Create a new date object with the local time components
      // but in UTC (this effectively preserves the local time)
      const utcDate = new Date();
      utcDate.setUTCFullYear(year);
      utcDate.setUTCMonth(month);
      utcDate.setUTCDate(day);
      utcDate.setUTCHours(hours);
      utcDate.setUTCMinutes(minutes);
      utcDate.setUTCSeconds(seconds);
      utcDate.setUTCMilliseconds(0);

      console.log("Local date (user selected):", localDate.toString());
      console.log("UTC date (to be stored):", utcDate.toISOString());

      // Submit the reminder with the UTC date
      await submitReminder(
        {
          ...formData,
          datetime: utcDate,
        },
        userId
      );

      router.replace("/dashboard/reminders");
    } catch (e) {
      console.error(e);
    }
  };

  // Generate time options in 30-minute intervals
  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? "00" : "30";
    const period = hour < 12 ? "AM" : "PM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return {
      value: `${hour.toString().padStart(2, "0")}:${minute}`,
      label: `${displayHour}:${minute} ${period}`,
    };
  });

  // Notification time options
  const notificationTimeOptions = [
    { value: "5", label: "5 minutes before" },
    { value: "15", label: "15 minutes before" },
    { value: "30", label: "30 minutes before" },
    { value: "60", label: "1 hour before" },
    { value: "120", label: "2 hours before" },
    { value: "1440", label: "1 day before" },
  ];

  return (
    <Card className="max-w-2xl mx-auto p-4 text-black">
      <CardHeader>
        <CardTitle className="text-xl text-center">New Reminder</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="h-32 resize-none"
                      placeholder="Enter a description (optional)"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col md:flex-row gap-4">
              <FormField
                control={form.control}
                name="datetime"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-lg font-semibold">
                      Date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={`w-full pl-3 text-left font-normal ${
                              !field.value && "text-muted-foreground"
                            }`}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            if (date) {
                              const currentTime = field.value || new Date();
                              // Create a new date to avoid timezone issues
                              const newDate = new Date(date);
                              newDate.setHours(
                                currentTime.getHours(),
                                currentTime.getMinutes(),
                                0,
                                0
                              );
                              field.onChange(newDate);
                            }
                          }}
                          disabled={(date) => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            const calendarDate = new Date(date);
                            calendarDate.setHours(0, 0, 0, 0);
                            return calendarDate < today;
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="datetime"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-lg font-semibold">
                      Time
                    </FormLabel>
                    <Select
                      onValueChange={(time) => {
                        const [hours, minutes] = time.split(":").map(Number);
                        // Create a new date to avoid timezone issues
                        const newDate = new Date(field.value || new Date());
                        newDate.setHours(hours);
                        newDate.setMinutes(minutes);
                        newDate.setSeconds(0);
                        newDate.setMilliseconds(0);
                        field.onChange(newDate);
                      }}
                      value={
                        field.value
                          ? format(new Date(field.value), "HH:mm")
                          : undefined
                      }
                    >
                      <FormControl>
                        <SelectTrigger className="text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                          <SelectValue placeholder="Select time">
                            {field.value ? (
                              format(new Date(field.value), "h:mm a")
                            ) : (
                              <span className="text-muted-foreground">
                                Select time
                              </span>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={time.value} value={time.value}>
                            {time.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {notificationsEnabled && (
              <FormField
                control={form.control}
                name="notificationTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Notification Timing
                    </FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(Number.parseInt(value))
                      }
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="When to send notification" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {notificationTimeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Create Reminder
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
