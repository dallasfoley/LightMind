"use server";

import { CheckInTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { CheckInDataType } from "@/schema/checkInSchema";
import { eq } from "drizzle-orm";
import { UserType } from "@/schema/userSchema";

export async function getCheckIns(user: UserType) {
  let checkIns: CheckInDataType[] = [];

  if (user) {
    checkIns = (
      await db
        .select()
        .from(CheckInTable)
        .where(eq(CheckInTable.userId, user.id))
    ).map((checkIn) => ({ ...checkIn, date: new Date(checkIn.date) }));
  }

  return checkIns;
}
