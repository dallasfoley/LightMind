import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RemindersTable, UserTable } from "@/drizzle/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { addMinutes } from "date-fns";
import twilio from "twilio";

export async function GET() {
  try {
    const now = new Date();
    const fiveMinutesFromNow = addMinutes(now, 5);

    const remindersToNotify = await db
      .select({
        reminder: {
          id: RemindersTable.id,
          title: RemindersTable.title,
          datetime: RemindersTable.datetime,
          notificationTime: RemindersTable.notificationTime,
        },
        user: {
          phoneNumber: UserTable.phoneNumber,
        },
      })
      .from(RemindersTable)
      .innerJoin(UserTable, eq(RemindersTable.userId, UserTable.id))
      .where(
        and(
          eq(RemindersTable.completed, false),
          eq(UserTable.enableNotifications, true),
          gte(UserTable.phoneNumber, ""),
          gte(RemindersTable.datetime, now),
          lte(RemindersTable.datetime, fiveMinutesFromNow)
        )
      );

    // Send notifications for each reminder
    for (const { reminder, user } of remindersToNotify) {
      if (!user.phoneNumber || !reminder.notificationTime) continue;

      await sendSmsNotification(
        user.phoneNumber,
        `Reminder: ${
          reminder.title
        } at ${reminder.datetime.toLocaleTimeString()}`
      );

      console.log(
        `Sent notification for reminder ${reminder.id} to ${user.phoneNumber}`
      );
    }

    return NextResponse.json({
      success: true,
      count: remindersToNotify.length,
    });
  } catch (error) {
    console.error("Error sending notifications:", error);
    return NextResponse.json(
      { error: "Failed to send notifications" },
      { status: 500 }
    );
  }
}

async function sendSmsNotification(phoneNumber: string, message: string) {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !twilioPhone) {
      throw new Error("Missing Twilio credentials");
    }
    const client = twilio(accountSid, authToken);

    await client.messages.create({
      body: message,
      from: twilioPhone,
      to: phoneNumber,
    });

    return true;
  } catch (error) {
    console.error("Error sending SMS:", error);
    return false;
  }
}
