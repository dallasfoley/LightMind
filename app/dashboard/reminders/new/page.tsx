import { getUser } from "@/server/actions/users/getUser";
import ReminderForm from "@/components/forms/reminder-form";

export default async function NewReminderPage() {
  const user = await getUser();

  if (!user) {
    return null; // Or redirect to login
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-zinc-900 dark:text-zinc-100">
        Create New Reminder
      </h1>
      <ReminderForm userId={user.id} />
    </div>
  );
}
