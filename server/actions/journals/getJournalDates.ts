"use server";

import { JournalTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function getJournalDates(userId: string) {
  if (!userId) return [];
  try {
    const dates = await db
      .select({ date: JournalTable.date })
      .from(JournalTable)
      .where(eq(JournalTable.userId, userId));
    return dates.map((entry) => {
      const dateStr = entry.date;
      if (typeof dateStr === "string") {
        // Add time component to avoid timezone shifts
        return { date: `${dateStr}T12:00:00.000Z` };
      }
      return entry;
    });
  } catch (e) {
    console.error(e);
    return [];
  }
}
