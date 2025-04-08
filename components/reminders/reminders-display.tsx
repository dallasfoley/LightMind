"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ReminderSwitch from "@/components/reminders/reminder-switch";
import DeleteReminderButton from "@/components/reminders/delete-reminder-button";
import TimezoneDebug from "@/components/timezone-debug";

type Reminder = {
  id: string;
  title: string;
  description: string | null;
  datetime: string;
  userId: string;
  completed: boolean;
  notificationTime: number | null;
};

export default function RemindersDisplay({ userId }: { userId: string }) {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/reminders/list");

        if (!response.ok) {
          throw new Error(
            `Failed to fetch reminders: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("Fetched reminders:", data);

        if (Array.isArray(data.reminders)) {
          setReminders(data.reminders);
        } else {
          console.error("Unexpected response format:", data);
          setError("Received invalid data format from server");
          setReminders([]);
        }
      } catch (error) {
        console.error("Failed to fetch reminders:", error);
        setError(error instanceof Error ? error.message : "Unknown error");
        setReminders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
  }, []);

  // Function to format date string for display
  const formatDate = (dateString: string) => {
    try {
      // Parse the date string
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      return "Invalid date";
    }
  };

  // Function to format time string for display
  const formatTime = (dateString: string) => {
    try {
      // Parse the date string
      const date = new Date(dateString);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid time";
    }
  };

  if (loading) {
    return <p className="text-center py-4">Loading reminders...</p>;
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-500">Error: {error}</p>
        <TimezoneDebug />
      </div>
    );
  }

  if (reminders.length === 0) {
    return (
      <div className="space-y-4">
        <p className="text-center py-4">
          No reminders found. Create a new one to get started!
        </p>
        <TimezoneDebug />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <TimezoneDebug />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Due Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Completed?</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reminders.map((reminder) => (
            <TableRow key={reminder.id}>
              <TableCell>{reminder.title}</TableCell>
              <TableCell>{reminder.description}</TableCell>
              <TableCell>{formatDate(reminder.datetime)}</TableCell>
              <TableCell>{formatTime(reminder.datetime)}</TableCell>
              <TableCell>
                <span
                  className={`font-medium ${
                    reminder.completed ? "text-green-600" : "text-amber-600"
                  }`}
                >
                  {reminder.completed ? "Completed" : "Pending"}
                </span>
              </TableCell>
              <TableCell>
                <ReminderSwitch
                  reminder={{
                    ...reminder,
                    datetime: new Date(reminder.datetime),
                    completed: reminder.completed,
                    notificationTime: reminder.notificationTime ?? undefined,
                  }}
                  userId={userId}
                />
              </TableCell>
              <TableCell>
                <DeleteReminderButton reminderId={reminder.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
