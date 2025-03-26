"use server";

import { JournalTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { format } from "date-fns";
import type { UserType } from "@/schema/userSchema";

export async function getTodaysJournals(user: UserType) {
  if (!user) return null;

  try {
    // Get today's date in YYYY-MM-DD format
    const today = format(new Date(), "yyyy-MM-dd");

    // Query for today's journal entry
    const entries = await db
      .select()
      .from(JournalTable)
      .where(
        and(eq(JournalTable.userId, user.id), eq(JournalTable.date, today))
      );

    return entries.length > 0 ? entries : null;
  } catch (error) {
    console.error("Error fetching today's journal:", error);
    return null;
  }
}
