"use server";

import { CheckInTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { CheckInFormDataType, CheckInFormSchema } from "@/schema/checkInSchema";
import { and, eq } from "drizzle-orm";

export async function updateCheckIn(
  formData: CheckInFormDataType,
  userId: string
) {
  try {
    const { success, data, error } = CheckInFormSchema.safeParse(formData);

    if (!success) {
      return { success: false, error: error.errors };
    }
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Always use today's date in UTC format regardless of what was passed in
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, "0");
    const day = String(now.getUTCDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    await db
      .update(CheckInTable)
      .set({
        mood: data.mood,
        energy: data.energy,
        sleepHours: data.sleepHours,
        sleepQuality: data.sleepQuality,
        stress: data.stress,
        notes: data.notes,
      })
      .where(
        and(
          eq(CheckInTable.userId, userId),
          eq(CheckInTable.date, formattedDate)
        )
      );

    return { success: true };
  } catch (dbError) {
    // Catch database errors
    console.error("Database error:", dbError);
    return { success: false, error: "Database error" };
  }
}
