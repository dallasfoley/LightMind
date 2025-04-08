import { Button } from "@/components/ui/button";
import { getUser } from "@/server/actions/users/getUser";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RemindersDisplay from "@/components/reminders/reminders-display";
import { redirect } from "next/navigation";

export default async function RemindersPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-200 dark:zinc-200">
          Reminders
        </h1>
        <Button
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium mt-2 md:mt-0 py-3 rounded-lg transition-colors focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
          <RemindersDisplay userId={user.id} />
        </CardContent>
      </Card>
    </div>
  );
}
