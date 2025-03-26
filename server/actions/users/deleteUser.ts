"use server";

import { db } from "@/lib/db";
import { getUser } from "./getUser";
import { UserTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function deleteUser() {
  try {
    const user = await getUser();
    if (user) await db.delete(UserTable).where(eq(UserTable.id, user.id));
  } catch (e) {
    console.error(e);
  }
  redirect("/");
}
