"use server";
import { db } from "@/lib/db";
import { RemindersTable } from "@/drizzle/schema";
import { and, eq, gte, lte } from "drizzle-orm";
import { UserType } from "@/schema/userSchema";
import { endOfDay, startOfDay } from "date-fns";

export async function getReminders(user: UserType, today: boolean = false) {
  try {
    if (today) {
      const today = new Date();
      const todayStart = startOfDay(today);
      const todayEnd = endOfDay(today);
      const reminders = user
        ? await db
            .select()
            .from(RemindersTable)
            .where(
              and(
                eq(RemindersTable.userId, user.id),
                gte(RemindersTable.datetime, todayStart),
                lte(RemindersTable.datetime, todayEnd),
                eq(RemindersTable.completed, false)
              )
            )
        : [];
      return reminders;
    } else {
      const reminders = user
        ? await db
            .select()
            .from(RemindersTable)
            .where(eq(RemindersTable.userId, user.id))
        : [];
      return reminders;
    }
  } catch (e) {
    console.error(e);
  }
}
