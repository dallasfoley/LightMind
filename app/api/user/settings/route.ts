import { getUser } from "@/server/actions/users/getUser";
import { db } from "@/lib/db";
import { UserTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = await db
      .select({
        enableNotifications: UserTable.enableNotifications,
        phoneNumber: UserTable.phoneNumber,
      })
      .from(UserTable)
      .where(eq(UserTable.id, user.id))
      .then((res) => res[0]);

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error fetching user settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch user settings" },
      { status: 500 }
    );
  }
}
