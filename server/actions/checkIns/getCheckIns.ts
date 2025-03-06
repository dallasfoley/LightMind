"use server";

import { CheckInTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { CheckInDataType } from "@/schema/checkInSchema";
import { eq } from "drizzle-orm";
import { UserType } from "@/schema/userSchema";

export async function getCheckIns(user: UserType, limit: number | null = null) {
  let checkIns: CheckInDataType[] = [];

  if (!user) return checkIns;

  try {
    if (limit) {
      checkIns = (
        await db
          .select()
          .from(CheckInTable)
          .where(eq(CheckInTable.userId, user.id))
          .orderBy(CheckInTable.date)
          .limit(limit)
      ).map((checkIn) => ({ ...checkIn, date: new Date(checkIn.date) }));
    } else {
      checkIns = (
        await db
          .select()
          .from(CheckInTable)
          .where(eq(CheckInTable.userId, user.id))
          .orderBy(CheckInTable.date)
      ).map((checkIn) => ({ ...checkIn, date: new Date(checkIn.date) }));
    }
  } catch (error) {
    console.error("Error fetching check-ins:", error);
  }

  return checkIns.map((checkIn) => ({
    ...checkIn,
    date: `${checkIn.date}T12:00:00.000Z`,
  }));
}
