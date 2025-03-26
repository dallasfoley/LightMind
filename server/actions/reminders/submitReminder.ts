"use server";

import { ReminderFormSchema, ReminderFormType } from "@/schema/reminderSchema";
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

    await db.insert(RemindersTable).values({ ...data, userId });
  } catch (e) {
    console.error(e);
    return { success: false, error: "Database error" };
  }
}
