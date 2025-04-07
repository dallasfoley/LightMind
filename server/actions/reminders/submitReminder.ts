"use server";

import {
  ReminderFormSchema,
  type ReminderFormType,
} from "@/schema/reminderSchema";
import { db } from "@/lib/db";
import { RemindersTable } from "@/drizzle/schema";

export async function submitReminder(
  formData: ReminderFormType,
  userId: string
) {
  try {
    const { success, data, error } = ReminderFormSchema.safeParse(formData);

    if (!success) {
      return { success: false, error: error.errors };
    }
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Create a new date object with the UTC time
    // This ensures the time is stored correctly regardless of the server's timezone
    const utcDatetime = new Date(data.datetime);

    // Store the date in ISO format to preserve the exact time
    await db.insert(RemindersTable).values({
      ...data,
      datetime: utcDatetime,
      userId,
    });

    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Database error" };
  }
}
