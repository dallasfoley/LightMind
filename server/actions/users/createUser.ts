"use server";

import { UserTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { ClerkUserType } from "@/schema/userSchema";

export async function createUser(userData: ClerkUserType) {
  try {
    console.log("userData received:", userData);
    const result = await db
      .insert(UserTable)
      .values({
        clerkUserId: userData.id,
      })
      .returning({
        id: UserTable.id,
        clerkUserId: UserTable.clerkUserId,
      });

    if (result.length === 0) {
      throw new Error("Failed to create user. No rows inserted.");
    }

    return result;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}
