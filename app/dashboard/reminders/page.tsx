import { Button } from "@/components/ui/button";
import { RemindersTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { getUser } from "@/server/actions/users/getUser";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import ReminderSwitch from "@/components/reminders/reminder-switch";
import DeleteReminderButton from "@/components/reminders/delete-reminder-button";

export default async function RemindersPage() {
  const user = await getUser();
  const reminders = user
    ? await db
        .select()
        .from(RemindersTable)
        .where(eq(RemindersTable.userId, user?.id))
    : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Reminders</h1>
        <Button
          className="transform transition-transform duration-300 bg-white text-black hover:scale-105 hover:bg-white"
          asChild
        >
          <Link href="/dashboard/reminders/new">Create New Reminder</Link>
        </Button>
      </div>
      <Card className="text-black p-4">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl m-4">
            Your Reminders
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reminders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Due Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Completed?</TableHead>
                  <TableHead>Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reminders.map((reminder) => (
                  <TableRow key={reminder.id}>
                    <TableCell>{reminder.title}</TableCell>
                    <TableCell>{reminder.description}</TableCell>
                    <TableCell>
                      {format(new Date(reminder.datetime), "PPP")}
                    </TableCell>
                    <TableCell>
                      {format(new Date(reminder.datetime), "p")}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`font-medium ${
                          reminder.completed
                            ? "text-green-600"
                            : "text-amber-600"
                        }`}
                      >
                        {reminder.completed ? "Completed" : "Pending"}
                      </span>
                    </TableCell>
                    {user && (
                      <TableCell>
                        <ReminderSwitch
                          reminder={{
                            ...reminder,
                            completed: reminder.completed ?? false,
                          }}
                          userId={user?.id}
                        />
                      </TableCell>
                    )}
                    <TableCell>
                      <DeleteReminderButton reminderId={reminder.id} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-4">
              No reminders found. Create a new one to get started!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
