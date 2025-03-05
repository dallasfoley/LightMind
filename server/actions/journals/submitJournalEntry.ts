"use server";

import {
  JournalEntryFormType,
  JournalEntryFormSchema,
} from "@/schema/journalEntrySchema";
import { db } from "@/lib/db";
import { JournalTable, UserTable } from "@/drizzle/schema";
import { format } from "date-fns";
import { and, eq } from "drizzle-orm";
import { UserType } from "@/schema/userSchema";

export async function submitJournalEntry(
  formData: JournalEntryFormType,
  user: UserType
) {
  try {
    const { success, data, error } = JournalEntryFormSchema.safeParse(formData);

    if (!success) {
      return { success: false, error: error.errors };
    }

    if (!user?.id) {
      return { success: false, error: "Unauthorized" };
    }
    const userId = user.id;
    const formattedDate = format(data.date, "yyyy-MM-dd");
    await db
      .insert(JournalTable)
      .values({ content: data.content, date: formattedDate, userId });
    const todaysJournals = await db
      .select()
      .from(JournalTable)
      .where(
        and(
          eq(JournalTable.userId, userId),
          eq(JournalTable.date, formattedDate)
        )
      );
    if (todaysJournals.length === 0) {
      await db
        .update(UserTable)
        .set({ journalStreak: (user.journalStreak || 0) + 1 })
        .where(eq(UserTable.id, user.id));
    }
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
}
