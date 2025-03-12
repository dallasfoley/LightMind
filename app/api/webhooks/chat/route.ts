import { OpenAIStream, StreamingTextResponse } from "ai"; //
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextResponse } from "next/server";
import { getUser } from "@/server/actions/users/getUser";
import { db } from "@/lib/db";
import { CheckInTable, JournalTable, RemindersTable } from "@/drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { format } from "date-fns";
import { MessageType } from "@/schema/messageSchema";

// Define the system prompt for the mental health assistant
const SYSTEM_PROMPT = `
You are a compassionate and supportive mental health assistant for a mental health tracking application. Your role is to provide empathetic support, guidance, and resources to users who are tracking their mental health.

IMPORTANT GUIDELINES:
- Always prioritize user safety. If a user expresses thoughts of self-harm or suicide, immediately provide crisis resources.
- Be warm, empathetic, and non-judgmental in all interactions.
- Avoid giving specific medical advice or diagnosing conditions.
- Encourage users to seek professional help when appropriate.
- Respect privacy and confidentiality.
- Use evidence-based approaches when suggesting coping strategies.
- Tailor your responses based on the user's data and history when available.
- Keep responses concise and conversational.

You have access to the following user data:
- Mood tracking data
- Sleep quality and duration
- Energy levels
- Stress levels
- Journal entries
- Reminders

Use this information to provide personalized support, but don't overwhelm the user with data.
`;

export async function POST(req: Request) {
  try {
    // Get the user
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request
    const { messages } = await req.json();

    // Fetch user data to provide context to the AI
    const userData = await getUserData(user.id);

    // Add user data context to the system prompt
    const enhancedSystemPrompt = `
${SYSTEM_PROMPT}

USER CONTEXT:
${userData}
`;

    // Generate the response using the AI SDK
    const response = await generateText({
      model: openai("gpt-4o"),
      system: enhancedSystemPrompt,
      prompt: messages
        .map((message: MessageType) => message.content)
        .join("\n"),
      temperature: 0.7,
      maxTokens: 1000,
    });

    // Create a stream from the response
    const stream = OpenAIStream(response);

    // Return the streaming response
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}

// Helper function to fetch user data for context
async function getUserData(userId: string) {
  try {
    // Fetch recent check-ins
    const checkIns = await db
      .select()
      .from(CheckInTable)
      .where(eq(CheckInTable.userId, userId))
      .orderBy(desc(CheckInTable.date))
      .limit(5);

    // Fetch recent journal entries
    const journals = await db
      .select()
      .from(JournalTable)
      .where(eq(JournalTable.userId, userId))
      .orderBy(desc(JournalTable.date))
      .limit(3);

    // Fetch upcoming reminders
    const reminders = await db
      .select()
      .from(RemindersTable)
      .where(eq(RemindersTable.userId, userId))
      .orderBy(RemindersTable.datetime)
      .limit(5);

    // Format the data for the AI
    let contextString = "";

    if (checkIns.length > 0) {
      contextString += "RECENT MOOD DATA:\n";
      checkIns.forEach((checkIn) => {
        contextString += `Date: ${format(new Date(checkIn.date), "PPP")}\n`;
        contextString += `Mood: ${checkIn.mood}/5\n`;
        contextString += `Energy: ${checkIn.energy}/5\n`;
        contextString += `Sleep Quality: ${checkIn.sleepQuality}/5\n`;
        contextString += `Sleep Hours: ${checkIn.sleepHours}\n`;
        contextString += `Stress: ${checkIn.stress}/5\n`;
        if (checkIn.notes) contextString += `Notes: ${checkIn.notes}\n`;
        contextString += "\n";
      });
    }

    if (journals.length > 0) {
      contextString += "RECENT JOURNAL ENTRIES:\n";
      journals.forEach((journal) => {
        contextString += `Date: ${format(new Date(journal.date), "PPP")}\n`;
        contextString += `Title: ${journal.title || "Untitled"}\n`;
        contextString += `Content: ${journal.content.substring(0, 200)}${
          journal.content.length > 200 ? "..." : ""
        }\n\n`;
      });
    }

    if (reminders.length > 0) {
      contextString += "UPCOMING REMINDERS:\n";
      reminders.forEach((reminder) => {
        contextString += `Title: ${reminder.title}\n`;
        contextString += `Date: ${format(
          new Date(reminder.datetime),
          "PPP p"
        )}\n`;
        if (reminder.description)
          contextString += `Description: ${reminder.description}\n`;
        contextString += `Completed: ${reminder.completed ? "Yes" : "No"}\n\n`;
      });
    }

    return contextString || "No user data available yet.";
  } catch (error) {
    console.error("Error fetching user data:", error);
    return "Error fetching user data.";
  }
}
