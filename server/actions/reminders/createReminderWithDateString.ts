"use server";

import { db } from "@/lib/db";
import { RemindersTable } from "@/drizzle/schema";
import { getUser } from "@/server/actions/users/getUser";
import { z } from "zod";

const CreateReminderSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  dateString: z.string(),
  completed: z.boolean().default(false),
  notificationTime: z.number().min(0).optional(),
});

export async function createReminderWithDateString(
  formData: z.infer<typeof CreateReminderSchema>
) {
  try {
    const user = await getUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const { success, data, error } = CreateReminderSchema.safeParse(formData);
    if (!success) {
      return { success: false, error: error.errors };
    }

    console.log("Creating reminder with date string:", data.dateString);

    // Parse the date string to create a JavaScript Date object
    const datetime = new Date(data.dateString);

    console.log("Parsed date:", datetime.toISOString());

    // Insert the reminder
    await db.insert(RemindersTable).values({
      title: data.title,
      description: data.description || null,
      datetime,
      completed: data.completed,
      notificationTime: data.notificationTime || null,
      userId: user.id,
    });

    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Database error" };
  }
}
