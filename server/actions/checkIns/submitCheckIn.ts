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

    // Fix: Use local date methods instead of UTC to prevent date shifting
    const dateObj = new Date(data.date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    console.log(
      "Storing check-in with date:",
      formattedDate,
      "Original date:",
      data.date
    );

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
