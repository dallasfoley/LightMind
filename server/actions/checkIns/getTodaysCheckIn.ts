"use server";

import { CheckInTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { format } from "date-fns";
import { and, eq } from "drizzle-orm";

export async function getTodaysCheckIn(
  userId: string,
  timezoneOffset?: number
) {
  if (!userId) return undefined;
  try {
    const userDate =
      timezoneOffset !== undefined
        ? new Date(new Date().getTime() - timezoneOffset * 60 * 1000)
        : new Date();

    // Format to yyyy-MM-dd for database query
    const today = format(userDate, "yyyy-MM-dd");
    console.log("today: ", today);
    console.log("today: ", today);
    console.log("today: ", today);
    console.log("today: ", today);
    console.log("today: ", today);
    const checkIn = await db
      .select()
      .from(CheckInTable)
      .where(and(eq(CheckInTable.userId, userId), eq(CheckInTable.date, today)))
      .limit(1);
    return checkIn[0];
  } catch (error) {
    console.error("Error fetching check-ins:", error);
  }
}
