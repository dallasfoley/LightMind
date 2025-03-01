import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JournalEntryType } from "@/schema/journalEntrySchema";

export default async function PastEntries({
  entries,
}: {
  entries: JournalEntryType[];
}) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Past Entries</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {entries.map((entry, id) => (
            <Card key={id}>
              <CardHeader>
                <CardTitle>{format(entry.date, "MMMM d, yyyy")}</CardTitle>
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
