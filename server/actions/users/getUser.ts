"use server";

import { cache } from "react";
import { UserTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { UserType } from "@/schema/userSchema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export const getUser = cache(async (): Promise<UserType | null> => {
  try {
    const { userId } = await auth();

    if (userId) {
      const users = await db
        .select()
        .from(UserTable)
        .where(eq(UserTable.clerkUserId, userId))
        .limit(1);

      console.log("users: ", users);

      if (users.length > 0) {
        const user = users[0];
        return {
          ...user,
          journalStreak: user.journalStreak ?? 0,
        };
      } else {
        return null;
      }
    }
    return null;
  } catch (e) {
    console.error(e);
    return null;
  }
});
