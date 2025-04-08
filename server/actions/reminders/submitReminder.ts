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

    // Log the incoming date for debugging
    console.log("Server received datetime:", data.datetime.toISOString());

    // Store the date exactly as received - the client has already adjusted it
    await db.insert(RemindersTable).values({
      ...data,
      userId,
    });

    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Database error" };
  }
}
