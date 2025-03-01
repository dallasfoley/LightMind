"use server";

import {
  CheckInFormSchema,
  type CheckInFormDataType,
} from "@/schema/checkInSchema";
import { db } from "@/lib/db";
import { CheckInTable } from "@/drizzle/schema";
import { format } from "date-fns";

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

    const formattedDate = format(data.date, "yyyy-MM-dd");
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
