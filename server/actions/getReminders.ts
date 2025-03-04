"use server";
import { db } from "@/lib/db";
import { RemindersTable } from "@/drizzle/schema";
import { and, eq, sql } from "drizzle-orm";
import { UserType } from "@/schema/userSchema";

export async function getReminders(user: UserType, today: boolean = false) {
  try {
    if (today) {
      const todayDate = new Date().toISOString().split("T")[0];
      console.log(todayDate);
      const reminders = user
        ? await db
            .select()
            .from(RemindersTable)
            .where(
              and(
                eq(RemindersTable.userId, user.id),
                sql`DATE(${RemindersTable.datetime}) = ${todayDate}`
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
