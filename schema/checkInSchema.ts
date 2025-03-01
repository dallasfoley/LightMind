import { z } from "zod";

export const CheckInFormSchema = z.object({
  date: z.date(),
  mood: z.number().min(1).max(5),
  energy: z.number().min(1).max(5),
  sleepQuality: z.number().min(1).max(5),
  sleepHours: z.number().min(0).max(24),
  stress: z.number().min(1).max(5),
  notes: z.string().optional().nullable(),
});

export type CheckInFormDataType = z.infer<typeof CheckInFormSchema>;

export const CheckInSchema = CheckInFormSchema.extend({
  id: z.string(),
  userId: z.string(),
});

export type CheckInDataType = z.infer<typeof CheckInSchema>;
