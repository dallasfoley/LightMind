"use server";

import { UserTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function resetJournalStreak(id: string) {
  try {
    await db
      .update(UserTable)
      .set({ journalStreak: 0 })
      .where(eq(UserTable.id, id));
  } catch (e) {
    console.error(e);
  }
}
