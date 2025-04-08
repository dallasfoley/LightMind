import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RemindersTable } from "@/drizzle/schema";
import { getUser } from "@/server/actions/users/getUser";

export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      title,
      description,
      dateString,
      completed,
      notificationTime,
      userId,
    } = await request.json();

    // Validate the user ID
    if (userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate required fields
    if (!title || !dateString) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("Creating reminder with date string:", dateString);

    // Parse the date string to create a JavaScript Date object
    // This will be interpreted as UTC by JavaScript
    const datetime = new Date(dateString);

    console.log("Parsed date:", datetime.toISOString());

    // Insert the reminder
    await db.insert(RemindersTable).values({
      title,
      description,
      datetime,
      completed: completed || false,
      notificationTime,
      userId,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating reminder:", error);
    return NextResponse.json(
      { error: "Failed to create reminder" },
      { status: 500 }
    );
  }
}
