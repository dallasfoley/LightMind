import { format, parseISO } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useJournalEntries } from "@/hooks/useJournalEntries";

export function PastEntries() {
  const { entries } = useJournalEntries();

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Past Entries</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {entries
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .map((entry) => (
              <Card key={entry.date}>
                <CardHeader>
                  <CardTitle>
                    {format(parseISO(entry.date), "MMMM d, yyyy")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{entry.content}</p>
                </CardContent>
              </Card>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
