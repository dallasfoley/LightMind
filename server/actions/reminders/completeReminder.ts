"use server";

import { RemindersTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function completeReminder(
  reminderId: string,
  completed: boolean,
  userId: string
) {
  try {
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    if (!reminderId) {
      return { success: false, error: "Reminder ID is required" };
    }

    // Update the specific reminder by ID
    await db
      .update(RemindersTable)
      .set({ completed })
      .where(eq(RemindersTable.id, reminderId));

    return { success: true };
  } catch (dbError) {
    console.error("Database error:", dbError);
    return { success: false, error: "Database error" };
  }
}
