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
    return dates;
  } catch (e) {
    console.error(e);
    return [];
  }
}
