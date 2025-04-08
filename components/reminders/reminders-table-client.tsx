"use client";

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
import { useEffect, useState } from "react";
import type { ReminderType } from "@/schema/reminderSchema";

export default function RemindersTableClient({
  reminders,
  userId,
}: {
  reminders: ReminderType[];
  userId: string;
}) {
  const [sortedReminders, setSortedReminders] = useState<ReminderType[]>([]);

  useEffect(() => {
    // Transform reminders without timezone conversion
    const transformedReminders = reminders.map((reminder) => ({
      ...reminder,
      datetime: new Date(reminder.datetime),
    }));

    // Sort reminders on the client side
    const sorted = [...transformedReminders].sort((a, b) => {
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;

      const dateA = new Date(a.datetime).getTime();
      const dateB = new Date(b.datetime).getTime();
      return dateA - dateB;
    });

    setSortedReminders(sorted);
  }, [reminders]);

  if (sortedReminders.length === 0) {
    return (
      <p className="text-center py-4">
        No reminders found. Create a new one to get started!
      </p>
    );
  }

  return (
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
        {sortedReminders.map((reminder) => (
          <TableRow key={reminder.id}>
            <TableCell>{reminder.title}</TableCell>
            <TableCell>{reminder.description}</TableCell>
            <TableCell>
              {new Date(reminder.datetime).toLocaleDateString()}
            </TableCell>
            <TableCell>
              {new Date(reminder.datetime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </TableCell>
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
                  completed: reminder.completed ?? false,
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
  );
}
