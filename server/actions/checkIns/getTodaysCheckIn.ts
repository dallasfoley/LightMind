"use server";

import { CheckInTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { format } from "date-fns";
import { and, eq } from "drizzle-orm";

export async function getTodaysCheckIn(userId: string) {
  if (!userId) return undefined;
  try {
    const today = format(new Date(), "yyyy-MM-dd");
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
