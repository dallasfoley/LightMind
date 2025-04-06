"use server";

import { db } from "@/lib/db";
import { UserTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { getUser } from "@/server/actions/users/getUser";
import { z } from "zod";

const NotificationSettingsSchema = z.object({
  enableNotifications: z.boolean(),
  phoneNumber: z.string().optional(),
});

export async function updateNotificationSettings(
  data: z.infer<typeof NotificationSettingsSchema>
) {
  const user = await getUser();

  if (!user) {
    throw new Error("User not found");
  }

  // Validate the data
  const validatedData = NotificationSettingsSchema.parse(data);

  // Update the user's notification settings
  await db
    .update(UserTable)
    .set({
      enableNotifications: validatedData.enableNotifications,
      phoneNumber: validatedData.phoneNumber,
    })
    .where(eq(UserTable.id, user.id));

  return { success: true };
}
