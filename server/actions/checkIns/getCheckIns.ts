"use server";

import { CheckInTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import type { CheckInDataType } from "@/schema/checkInSchema";
import { eq, desc } from "drizzle-orm";
import type { UserType } from "@/schema/userSchema";

export async function getCheckIns(
  user: UserType,
  limitCount: number | null = null,
  getNewest = false
) {
  let checkIns: CheckInDataType[] = [];

  if (!user) return checkIns;

  try {
    // Execute the query with the appropriate ordering
    let results;

    if (getNewest) {
      // Get newest entries first
      results = await db
        .select()
        .from(CheckInTable)
        .where(eq(CheckInTable.userId, user.id))
        .orderBy(desc(CheckInTable.date))
        // Apply limit if provided
        .then((data) => (limitCount ? data.slice(0, limitCount) : data));
    } else {
      // Get oldest entries first (default)
      results = await db
        .select()
        .from(CheckInTable)
        .where(eq(CheckInTable.userId, user.id))
        .orderBy(CheckInTable.date)
        // Apply limit if provided
        .then((data) => (limitCount ? data.slice(0, limitCount) : data));
    }

    // Convert date strings to Date objects
    checkIns = results.map((checkIn) => {
      // Ensure date is a proper Date object
      const dateStr =
        typeof checkIn.date === "string" ? checkIn.date : String(checkIn.date);

      // Create a Date object at noon to avoid timezone issues
      const dateParts = dateStr.split("-").map(Number);
      const dateObj = new Date(
        dateParts[0],
        dateParts[1] - 1,
        dateParts[2],
        12,
        0,
        0
      );

      return {
        ...checkIn,
        date: dateObj,
      };
    });

    // If we got the newest first but need to display in chronological order, reverse the array
    if (getNewest) {
      checkIns = checkIns.reverse();
    }

    console.log(
      "Check-ins fetched:",
      checkIns.map((c) => ({
        id: c.id,
        date: c.date,
        dateStr: c.date.toISOString().split("T")[0],
        mood: c.mood,
      }))
    );
  } catch (error) {
    console.error("Error fetching check-ins:", error);
  }

  return checkIns;
}
