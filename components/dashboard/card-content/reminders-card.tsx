"use client";

import type { ReminderType } from "@/schema/reminderSchema";
import type { UserType } from "@/schema/userSchema";
import { useEffect, useState } from "react";

export default function RemindersCard({
  user,
  reminders,
}: {
  user: UserType;
  reminders: ReminderType[];
}) {
  const [todaysReminders, setTodaysReminders] = useState<ReminderType[]>([]);

  useEffect(() => {
    // Get today's date in the client's timezone
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDay = today.getDate();

    // Create start and end of today in client's timezone
    const todayStart = new Date(todayYear, todayMonth, todayDay, 0, 0, 0, 0);
    const todayEnd = new Date(todayYear, todayMonth, todayDay, 23, 59, 59, 999);

    console.log("Client timezone today:", {
      start: todayStart.toISOString(),
      end: todayEnd.toISOString(),
      now: new Date().toISOString(),
    });

    // Apply timezone correction to reminders
    const correctedReminders = reminders.map((reminder) => {
      // Create a new reminder object with corrected datetime
      return {
        ...reminder,
        // Create a new Date object with the same UTC time values but in local timezone
        datetime: new Date(
          // Get the UTC values (which might be offset)
          reminder.datetime.getUTCFullYear(),
          reminder.datetime.getUTCMonth(),
          reminder.datetime.getUTCDate(),
          reminder.datetime.getUTCHours(),
          reminder.datetime.getUTCMinutes(),
          reminder.datetime.getUTCSeconds(),
          reminder.datetime.getUTCMilliseconds()
        ),
      };
    });

    // Filter reminders on the client side to ensure correct timezone
    const todayFiltered = correctedReminders.filter((reminder) => {
      // Compare only the date parts (year, month, day)
      return (
        reminder.datetime.getFullYear() === todayYear &&
        reminder.datetime.getMonth() === todayMonth &&
        reminder.datetime.getDate() === todayDay &&
        !reminder.completed
      );
    });

    // Sort reminders by time
    const sortedTodayReminders = [...todayFiltered].sort((a, b) => {
      return a.datetime.getTime() - b.datetime.getTime();
    });

    setTodaysReminders(sortedTodayReminders);

    console.log("Client-side today's reminders:", sortedTodayReminders.length);
    console.log(
      "Filtered reminders for today:",
      sortedTodayReminders.map((r) => ({
        title: r.title,
        time: r.datetime.toLocaleTimeString(),
        date: r.datetime.toLocaleDateString(),
        original: r.datetime.toISOString(),
      }))
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
                      {reminder.datetime.toLocaleTimeString([], {
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
