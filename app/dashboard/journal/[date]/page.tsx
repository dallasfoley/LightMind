import { JournalTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { getUser } from "@/server/actions/users/getUser";
import { eq, and } from "drizzle-orm";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  // This function is called at build time
  // In a real app, you might want to limit this to recent entries or popular dates
  // For demo purposes, we'll return an empty array and rely on dynamic generation
  return [];
}

export default async function PreviousEntryPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const user = await getUser();
  const { date } = await params;

  if (!user) {
    return <div>Please log in to view journal entries.</div>;
  }

  const entries = await db
    .select()
    .from(JournalTable)
    .where(and(eq(JournalTable.userId, user.id), eq(JournalTable.date, date)));

  // If no entry is found, return 404
  if (entries.length === 0) {
    notFound();
  }

  const entryDate = new Date(`${entries[0].date}T12:00:00.000Z`);

  return (
    <div className="container mx-auto px-4 py-8 text-black">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/dashboard/journal" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Journal
          </Link>
        </Button>
      </div>

      <h1 className="text-3xl text-white font-bold mb-6">Journal Entries</h1>
      {entries.map((entry, key) => (
        <Card className="max-w-3xl mb-8 mx-auto p-4" key={key}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl md:text-2xl">
                {entry.title}
              </CardTitle>
              <div className="md:text-lg text-muted-foreground">
                {format(entryDate, "MMMM d, yyyy")}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap">{entry.content}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
