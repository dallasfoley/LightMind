"use client";

import type { ReminderType } from "@/schema/reminderSchema";
import type { UserType } from "@/schema/userSchema";
import { useEffect, useState } from "react";

export default function RemindersCardClient({
  user,
  reminders,
}: {
  user: UserType;
  reminders: ReminderType[];
}) {
  const [todaysReminders, setTodaysReminders] = useState<ReminderType[]>([]);
  const [upcomingReminders, setUpcomingReminders] = useState<ReminderType[]>(
    []
  );

  useEffect(() => {
    // Get today's date in the client's timezone
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDay = today.getDate();

    // Create start and end of today in client's timezone
    const todayStart = new Date(todayYear, todayMonth, todayDay, 0, 0, 0);
    const todayEnd = new Date(todayYear, todayMonth, todayDay, 23, 59, 59, 999);

    // Filter reminders on the client side to ensure correct timezone
    const todayFiltered = reminders.filter((reminder) => {
      // Convert to Date object if it's a string
      const reminderDate =
        typeof reminder.datetime === "string"
          ? new Date(reminder.datetime)
          : new Date(reminder.datetime);

      // Check if the reminder is for today in client's timezone
      const reminderYear = reminderDate.getFullYear();
      const reminderMonth = reminderDate.getMonth();
      const reminderDay = reminderDate.getDate();

      const isForToday =
        reminderYear === todayYear &&
        reminderMonth === todayMonth &&
        reminderDay === todayDay;

      return isForToday && !reminder.completed;
    });

    // Filter upcoming reminders (after today)
    const upcomingFiltered = reminders
      .filter((reminder) => {
        // Convert to Date object if it's a string
        const reminderDate =
          typeof reminder.datetime === "string"
            ? new Date(reminder.datetime)
            : new Date(reminder.datetime);

        return reminderDate > todayEnd && !reminder.completed;
      })
      .slice(0, 5); // Limit to 5 upcoming reminders

    // Sort reminders by time
    const sortedTodayReminders = [...todayFiltered].sort((a, b) => {
      const dateA = new Date(a.datetime).getTime();
      const dateB = new Date(b.datetime).getTime();
      return dateA - dateB;
    });

    const sortedUpcomingReminders = [...upcomingFiltered].sort((a, b) => {
      const dateA = new Date(a.datetime).getTime();
      const dateB = new Date(b.datetime).getTime();
      return dateA - dateB;
    });

    setTodaysReminders(sortedTodayReminders);
    setUpcomingReminders(sortedUpcomingReminders);

    console.log("Client-side today's reminders:", sortedTodayReminders.length);
    console.log(
      "Client-side upcoming reminders:",
      sortedUpcomingReminders.length
    );
  }, [reminders]);

  if (!user)
    return <p className="text-red-500 text-center">Error loading reminders</p>;

  return (
    <div className="w-full h-full flex flex-col">
      {todaysReminders.length > 0 ? (
        <>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Today&apos;s Reminders
          </h2>
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
            <ul className="space-y-1 pr-1">
              {todaysReminders.map((reminder, index) => (
                <li
                  key={index}
                  className="p-2 flex flex-col rounded-md bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between w-full">
                    <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                      {reminder.title}
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">
                      {new Date(reminder.datetime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No reminders for today
          </p>
        </div>
      )}
    </div>
  );
}
