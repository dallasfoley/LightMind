"use server";

import { db } from "@/lib/db";
import {
  CheckInTable,
  JournalTable,
  RemindersTable,
  UserTable,
} from "@/drizzle/schema";
import { eq, and, gte, asc } from "drizzle-orm";
import type { UserType } from "@/schema/userSchema";
import type { ReminderType } from "@/schema/reminderSchema";
import { cookies } from "next/headers";
import { format, subDays } from "date-fns";

// Define the return type for the dashboard data
interface DashboardData {
  todaysCheckIn: any | null;
  recentCheckIns: any[];
  todaysJournal: any | null;
  todaysReminders: ReminderType[];
  upcomingReminders: ReminderType[];
  checkedInToday: boolean;
  journalStreak: number;
  hasJournaledRecently: boolean;
}

export async function getDashboardData(
  user: UserType
): Promise<DashboardData | null> {
  if (!user) {
    return {
      todaysCheckIn: null,
      recentCheckIns: [],
      todaysJournal: null,
      todaysReminders: [],
      upcomingReminders: [],
      checkedInToday: false,
      journalStreak: 0,
      hasJournaledRecently: false,
    };
  }

  try {
    // Use the user's local timezone for date calculations
    const cookieStore = await cookies();
    const timezoneOffset = parseInt(
      cookieStore.get("userTimezoneOffset")?.value || "0"
    );

    // Use the timezone offset to adjust the date
    const now = new Date();
    const userDate = new Date(now.getTime() - timezoneOffset * 60 * 1000);
    const today = format(userDate, "yyyy-MM-dd");
    const todayString = format(userDate, "yyyy-MM-dd");
    const yesterdayString = format(subDays(userDate, 1), "yyyy-MM-dd");
    const sevenDaysAgoString = format(subDays(userDate, 7), "yyyy-MM-dd");

    // Create adjusted date objects for time-based queries
    const todayStart = new Date(todayString + "T00:00:00");
    const todayEnd = new Date(todayString + "T23:59:59");

    console.log("Date debug:", {
      todayString,
      yesterdayString,
      sevenDaysAgoString,
      todayStart: todayStart.toISOString(),
      todayEnd: todayEnd.toISOString(),
      serverNow: new Date().toISOString(),
    });

    // Execute all queries in parallel
    const [
      todaysCheckInResult,
      recentCheckInsResult,
      todaysJournalResult,
      remindersResult,
      userResult,
      recentJournalResult,
    ] = await Promise.all([
      // Today's check-in
      db
        .select()
        .from(CheckInTable)
        .where(
          and(
            eq(CheckInTable.userId, user.id),
            eq(CheckInTable.date, todayString)
          )
        ),

      // Recent check-ins (last 7 days)
      db
        .select()
        .from(CheckInTable)
        .where(
          and(
            eq(CheckInTable.userId, user.id),
            gte(CheckInTable.date, sevenDaysAgoString)
          )
        )
        .orderBy(asc(CheckInTable.date))
        .limit(7),

      // Today's journal entry
      db
        .select()
        .from(JournalTable)
        .where(
          and(
            eq(JournalTable.userId, user.id),
            eq(JournalTable.date, todayString)
          )
        )
        .limit(1),

      // All reminders - we'll filter for today later
      db
        .select()
        .from(RemindersTable)
        .where(eq(RemindersTable.userId, user.id))
        .orderBy(RemindersTable.datetime),

      // Get user data for journal streak
      db
        .select({ journalStreak: UserTable.journalStreak })
        .from(UserTable)
        .where(eq(UserTable.id, user.id)),

      // Check if user has journaled recently (yesterday or today)
      db
        .select()
        .from(JournalTable)
        .where(
          and(
            eq(JournalTable.userId, user.id),
            gte(JournalTable.date, yesterdayString)
          )
        ),
    ]);

    // Log all reminders for debugging
    console.log(
      "All reminders:",
      remindersResult.map((r) => ({
        title: r.title,
        datetime: new Date(r.datetime).toISOString(),
        completed: r.completed,
      }))
    );

    // Process reminders - convert all datetime strings to Date objects
    // to match the ReminderType expected in the interface
    const allReminders = remindersResult.map((reminder) => {
      // Parse the datetime string to preserve timezone information
      const reminderDate = new Date(reminder.datetime);

      return {
        ...reminder,
        datetime: reminderDate,
        completed: reminder.completed === null ? false : reminder.completed,
        notificationTime: reminder.notificationTime ?? undefined,
      };
    });

    // Process check-ins to add proper Date objects
    const processedCheckIns = recentCheckInsResult.map((checkIn) => {
      const dateStr =
        typeof checkIn.date === "string" ? checkIn.date : String(checkIn.date);
      const dateParts = dateStr.split("-").map(Number);
      const dateObj = new Date(
        dateParts[0],
        dateParts[1] - 1,
        dateParts[2],
        12,
        0,
        0
      );

      return {
        ...checkIn,
        date: dateObj,
      };
    });

    // Check if we need to reset the journal streak
    const hasJournaledRecently = recentJournalResult.length > 0;
    const journalStreak = userResult[0]?.journalStreak || 0;

    // If streak should be reset but hasn't been yet
    if (!hasJournaledRecently && journalStreak > 0) {
      // Reset the streak in the database
      await db
        .update(UserTable)
        .set({ journalStreak: 0 })
        .where(eq(UserTable.id, user.id));
    }

    // For debugging
    console.log("Dashboard data fetched:", {
      checkedInToday: todaysCheckInResult.length > 0,
      journalStreak: hasJournaledRecently ? journalStreak : 0,
      remindersCount: allReminders.length,
      recentCheckInsCount: processedCheckIns.length,
    });

    return {
      todaysCheckIn: todaysCheckInResult[0] || null,
      recentCheckIns: processedCheckIns,
      todaysJournal: todaysJournalResult[0] || null,
      todaysReminders: allReminders, // Send all reminders as Date objects
      upcomingReminders: [], // Let client filter these
      checkedInToday: todaysCheckInResult.length > 0,
      journalStreak: hasJournaledRecently ? journalStreak : 0,
      hasJournaledRecently,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return {
      todaysCheckIn: null,
      recentCheckIns: [],
      todaysJournal: null,
      todaysReminders: [],
      upcomingReminders: [],
      checkedInToday: false,
      journalStreak: 0,
      hasJournaledRecently: false,
    };
  }
}
