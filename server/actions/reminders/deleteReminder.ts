"use server";

import { RemindersTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deleteReminder(id: string) {
  try {
    await db.delete(RemindersTable).where(eq(RemindersTable.id, id));
  } catch (e) {
    console.error(e);
  } finally {
    revalidatePath("/dashboard/reminders");
  }
}
