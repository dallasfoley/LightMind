import type { ReminderType } from "@/schema/reminderSchema";
import type { UserType } from "@/schema/userSchema";
import RemindersCardClient from "./reminders-card-client";

export default function RemindersCard({
  user,
  reminders,
}: {
  user: UserType;
  reminders: ReminderType[];
}) {
  // Pass all reminders to the client component
  // Let the client component handle timezone conversion and filtering
  return <RemindersCardClient user={user} reminders={reminders} />;
}
