import { z } from "zod";

export const ReminderFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable(),
  datetime: z.date(),
  completed: z.boolean().default(false),
  notificationTime: z.number().min(0).optional(),
});

export type ReminderFormType = z.infer<typeof ReminderFormSchema>;

export const ReminderSchema = ReminderFormSchema.extend({
  id: z.string(),
  userId: z.string(),
}).refine((data) => data.datetime > new Date(), {
  message: "Reminder must be set for a future date and time",
});

export type ReminderType = z.infer<typeof ReminderSchema>;
