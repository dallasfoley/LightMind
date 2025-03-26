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
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ date: string }>;
}): Promise<Metadata> {
  const { date } = await params;

  return {
    title: `Journal Entry - ${date} | LightMind`,
    description: "View your journal entry and reflect on your thoughts",
  };
}

export async function generateStaticParams() {
  const today = new Date();
  const dates = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push({
      date: format(date, "yyyy-MM-dd"),
    });
  }

  return dates;
}

export const revalidate = 3600;

export default async function PreviousEntryPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const user = await getUser();

  if (!user) {
    return <div>Please log in to view journal entries.</div>;
  }

  const { date } = await params;

  const entries = await db
    .select()
    .from(JournalTable)
    .where(and(eq(JournalTable.userId, user.id), eq(JournalTable.date, date)));

  if (entries.length === 0) {
    notFound();
  }

  const entry = entries[0];
  const entryDate = new Date(`${entry.date}T12:00:00.000Z`);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="outline"
          className="text-black hover:dark:text-white"
          asChild
        >
          <Link href="/dashboard/journal" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Journal
          </Link>
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-zinc-900 dark:text-zinc-200">
        Journal Entry
      </h1>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">{entry.title}</CardTitle>
            <div className="text-sm text-muted-foreground">
              {format(entryDate, "MMMM d, yyyy")}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="whitespace-pre-wrap">{entry.content}</div>
        </CardContent>
      </Card>
    </div>
  );
}
