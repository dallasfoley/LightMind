"use server";

import { db } from "@/lib/db";
import { RemindersTable } from "@/drizzle/schema";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const CreateReminderSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  dateString: z.string(),
  completed: z.boolean().default(false),
  notificationTime: z.number().min(0).optional(),
  userId: z.string(),
});

export async function createReminderWithDateString(
  formData: z.infer<typeof CreateReminderSchema>
) {
  try {
    if (!formData.userId) {
      return { success: false, error: "Unauthorized" };
    }

    const { success, data, error } = CreateReminderSchema.safeParse(formData);
    if (!success) {
      return { success: false, error: error.errors };
    }

    console.log("Creating reminder with date string:", data.dateString);

    // Create a Date object from the provided string
    // Note: This will parse the date in the UTC timezone
    const datetime = new Date(data.dateString + "Z");

    console.log("Parsed date in UTC:", datetime.toISOString());

    // Insert the reminder
    await db.insert(RemindersTable).values({
      title: data.title,
      description: data.description || null,
      datetime,
      completed: data.completed,
      notificationTime: data.notificationTime || null,
      userId: data.userId,
    });

    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Database error" };
  } finally {
    revalidatePath("/dashboard/reminders");
    redirect("/dashboard/reminders");
  }
}
