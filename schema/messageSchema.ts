import { z } from "zod";

export const MessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant", "system", "data"]),
  content: z.string(),
  createdAt: z.date().optional(),
});

export type MessageType = z.infer<typeof MessageSchema>;
