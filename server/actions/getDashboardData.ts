"use server";

import { db } from "@/lib/db";
import {
  CheckInTable,
  JournalTable,
  RemindersTable,
  UserTable,
} from "@/drizzle/schema";
import { eq, and, gte, asc } from "drizzle-orm";
import { format, startOfDay, endOfDay, subDays } from "date-fns";
import type { UserType } from "@/schema/userSchema";

// Consolidated function to get all dashboard data in a single request
export async function getDashboardData(user: UserType) {
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
    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);
    const sevenDaysAgo = subDays(now, 7);

    // For journal streak calculation
    const yesterday = subDays(now, 1);
    const yesterdayString = format(yesterday, "yyyy-MM-dd");
    const todayString = format(now, "yyyy-MM-dd");

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
            gte(CheckInTable.date, format(sevenDaysAgo, "yyyy-MM-dd"))
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

      // Today's and upcoming reminders
      db
        .select()
        .from(RemindersTable)
        .where(
          and(
            eq(RemindersTable.userId, user.id),
            gte(RemindersTable.datetime, todayStart)
          )
        )
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

    // Process reminders to separate today's from upcoming
    const todaysReminders = remindersResult.filter((reminder) => {
      const reminderDate = new Date(reminder.datetime);
      return (
        reminderDate >= todayStart &&
        reminderDate <= todayEnd &&
        !reminder.completed
      );
    });

    const upcomingReminders = remindersResult
      .filter(
        (reminder) =>
          new Date(reminder.datetime) > todayEnd && !reminder.completed
      )
      .slice(0, 5); // Limit to 5 upcoming reminders

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
      todaysRemindersCount: todaysReminders.length,
      recentCheckInsCount: processedCheckIns.length,
    });

    return {
      todaysCheckIn: todaysCheckInResult[0] || null,
      recentCheckIns: processedCheckIns,
      todaysJournal: todaysJournalResult[0] || null,
      todaysReminders,
      upcomingReminders,
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
