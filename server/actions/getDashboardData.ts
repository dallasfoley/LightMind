"use server";

import { db } from "@/lib/db";
import { CheckInTable, JournalTable, RemindersTable } from "@/drizzle/schema";
import { eq, and, gte, lt, desc } from "drizzle-orm";
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
    };
  }

  try {
    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);
    const sevenDaysAgo = subDays(now, 7);

    // Execute all queries in parallel
    const [
      todaysCheckInResult,
      recentCheckInsResult,
      todaysJournalResult,
      remindersResult,
    ] = await Promise.all([
      // Today's check-in
      db
        .select()
        .from(CheckInTable)
        .where(
          and(
            eq(CheckInTable.userId, user.id),
            gte(CheckInTable.date, format(todayStart, "yyyy-MM-dd")),
            lt(CheckInTable.date, format(todayEnd, "yyyy-MM-dd"))
          )
        )
        .limit(1),

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
        .orderBy(desc(CheckInTable.date))
        .limit(7),

      // Today's journal entry
      db
        .select()
        .from(JournalTable)
        .where(
          and(
            eq(JournalTable.userId, user.id),
            eq(JournalTable.date, format(now, "yyyy-MM-dd"))
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
    ]);

    // Process reminders to separate today's from upcoming
    const todaysReminders = remindersResult.filter(
      (reminder) => new Date(reminder.datetime) < todayEnd
    );

    const upcomingReminders = remindersResult
      .filter((reminder) => new Date(reminder.datetime) >= todayEnd)
      .slice(0, 5); // Limit to 5 upcoming reminders

    return {
      todaysCheckIn: todaysCheckInResult[0] || null,
      recentCheckIns: recentCheckInsResult,
      todaysJournal: todaysJournalResult[0] || null,
      todaysReminders,
      upcomingReminders,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return {
      todaysCheckIn: null,
      recentCheckIns: [],
      todaysJournal: null,
      todaysReminders: [],
      upcomingReminders: [],
    };
  }
}
