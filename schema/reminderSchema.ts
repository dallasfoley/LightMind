import { z } from "zod";

export const ReminderFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  datetime: z.string().datetime({ offset: false }),
  completed: z.boolean().default(false),
});

export type ReminderFormType = z.infer<typeof ReminderFormSchema>;

export const ReminderSchema = ReminderFormSchema.extend({
  id: z.string(),
  userId: z.string(),
}).refine(
  (data) => {
    const dateTime = new Date(data.datetime);
    return dateTime > new Date();
  },
  {
    message: "Reminder must be set for a future date and time",
  }
);

export type ReminderType = z.infer<typeof ReminderSchema>;
