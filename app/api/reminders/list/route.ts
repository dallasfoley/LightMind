import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RemindersTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { getUser } from "@/server/actions/users/getUser";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all reminders for the user
    const reminders = await db
      .select()
      .from(RemindersTable)
      .where(eq(RemindersTable.userId, user.id));

    // Sort reminders by completion status and date
    const sortedReminders = [...reminders].sort((a, b) => {
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;

      const dateA = new Date(a.datetime).getTime();
      const dateB = new Date(b.datetime).getTime();
      return dateA - dateB;
    });

    return NextResponse.json({ reminders: sortedReminders });
  } catch (error) {
    console.error("Error fetching reminders:", error);
    return NextResponse.json(
      { error: "Failed to fetch reminders" },
      { status: 500 }
    );
  }
}
