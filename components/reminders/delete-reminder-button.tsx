"use client";

import { Button } from "../ui/button";
import { deleteReminder } from "@/server/actions/reminders/deleteReminder";

export default function DeleteReminderButton({
  reminderId,
}: {
  reminderId: string;
}) {
  const onSubmit = async () => {
    try {
      await deleteReminder(reminderId);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <Button type="submit" variant="destructive">
        Delete
      </Button>
    </form>
  );
}
