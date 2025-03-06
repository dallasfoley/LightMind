"use server";

import {
  CheckInFormSchema,
  type CheckInFormDataType,
} from "@/schema/checkInSchema";
import { db } from "@/lib/db";
import { CheckInTable } from "@/drizzle/schema";

export async function submitCheckIn(
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

    const dateObj = new Date(data.date);
    const year = dateObj.getUTCFullYear();
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getUTCDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    await db
      .insert(CheckInTable)
      .values({ ...data, date: formattedDate, userId });

    return { success: true };
  } catch (dbError) {
    // Catch database errors
    console.error("Database error:", dbError);
    return { success: false, error: "Database error" };
  }
}
