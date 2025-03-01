import { z } from "zod";

export const ClerkUserSchema = z.object({
  id: z.string(),
});

export type ClerkUserType = z.infer<typeof ClerkUserSchema>;

export const UserSchema = z.object({
  id: z.string(),
  clerkUserId: z.string(),
  journalStreak: z.number().default(0),
});

export type UserType = z.infer<typeof UserSchema>;
