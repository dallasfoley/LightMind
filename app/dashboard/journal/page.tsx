import { JournalPageForm } from "@/components/forms/journal-page-form";
import PastEntries from "./past-entries";
import { JournalTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { getUser } from "@/server/actions/getUser";
import { eq } from "drizzle-orm";
import { JournalEntryType } from "@/schema/journalEntrySchema";

export default async function JournalPage() {
  const user = await getUser();

  const entries = user
    ? await db
        .select()
        .from(JournalTable)
        .where(eq(JournalTable.userId, user.id))
    : [];

  const formattedEntries: JournalEntryType[] = entries.map((entry) => ({
    id: entry.id,
    date: new Date(entry.date), // Convert string to Date object
    content: entry.content,
    userId: entry.userId,
    title: undefined, // Or provide a default value if needed
  }));

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">Journal Entry</h1>
      {user ? <JournalPageForm user={user} /> : <p>User not found.</p>}
      {entries && <PastEntries entries={formattedEntries} />}
    </div>
  );
}
