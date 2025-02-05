import { z } from "zod";

export const checkInSchema = z.object({
  date: z.date(),
  mood: z.number().min(1).max(5),
  energy: z.number().min(1).max(5),
  sleep: z.number().min(1).max(5),
  notes: z.string().max(500).optional(),
});

export type CheckInFormData = z.infer<typeof checkInSchema>;
