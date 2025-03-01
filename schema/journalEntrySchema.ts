import { z } from "zod";

export const JournalEntryFormSchema = z.object({
  title: z.string().optional(),
  date: z.date().refine((date) => date <= new Date(), {
    message: "Date must not be in the future",
  }),
  content: z.string(),
});

export type JournalEntryFormType = z.infer<typeof JournalEntryFormSchema>;

export const JournalEntrySchema = JournalEntryFormSchema.extend({
  id: z.string(),
  userId: z.string(),
});

export type JournalEntryType = z.infer<typeof JournalEntrySchema>;
