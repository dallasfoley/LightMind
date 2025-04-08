import { getUser } from "@/server/actions/users/getUser";
import ReminderFormNew from "@/components/forms/reminder-form-new";
import { redirect } from "next/navigation";

export default async function NewReminderPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return <ReminderFormNew userId={user.id} />;
}
