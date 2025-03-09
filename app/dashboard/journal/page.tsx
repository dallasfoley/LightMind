import { JournalPageForm } from "@/components/forms/journal-page-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getTodaysJournals } from "@/server/actions/journals/getTodaysJournals";
import { getUser } from "@/server/actions/users/getUser";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function JournalPage() {
  const user = await getUser();
  const todaysEntries = user ? await getTodaysJournals(user) : null;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-zinc-900 dark:text-slate-300">
              My Journal
            </h1>
            <p className="text-slate-500 dark:text-slate-400 italic">
              Capture your thoughts and memories
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 md:p-10">
              {user && (
                <>
                  <div className="flex items-center mb-8">
                    <div className="w-full flex justify-between items-center">
                      <h3 className="text-slate-500 dark:text-slate-400 text-sm">
                        {new Date().toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </h3>

                      <Button
                        variant="outline"
                        className="text-black hover:bg-zinc-300"
                        asChild
                      >
                        <Link href="/dashboard" className="flex items-center">
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Back to Dashboard
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <JournalPageForm user={user} />
                </>
              )}
            </div>
          </div>
          {todaysEntries && (
            <div className="bg-white mt-8 text-black dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-8 md:p-10">
                <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">
                  Today&apos;s Journal Entries
                </h2>

                {todaysEntries.map((entry, key) => (
                  <Card className="mb-8 p-4" key={key}>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-xl md:text-2xl">
                          {entry.title}
                        </CardTitle>
                        <div className="md:text-lg text-muted-foreground">
                          {new Date().toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="whitespace-pre-wrap">{entry.content}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Your journal entries are private and secure
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
