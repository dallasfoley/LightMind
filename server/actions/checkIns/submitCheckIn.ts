"use server";

import {
  CheckInFormSchema,
  type CheckInFormDataType,
} from "@/schema/checkInSchema";
import { db } from "@/lib/db";
import { CheckInTable } from "@/drizzle/schema";
import { revalidatePath } from "next/cache";

export async function submitCheckIn(
  formData: CheckInFormDataType & { timezoneOffset: number },
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

    // Adjust date based on timezone offset
    const dateObj = new Date(data.date);
    const adjustedDate = new Date(
      dateObj.getTime() - formData.timezoneOffset * 60 * 1000
    );

    const year = adjustedDate.getFullYear();
    const month = String(adjustedDate.getMonth() + 1).padStart(2, "0");
    const day = String(adjustedDate.getDate()).padStart(2, "0");
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
    revalidatePath("/dashboard", "page");
    revalidatePath("/dashboard", "layout");

    return { success: true };
  } catch (dbError) {
    // Catch database errors
    console.error("Database error:", dbError);
    return { success: false, error: "Database error" };
  }
}
