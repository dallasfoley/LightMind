"use client";

import { useRouter } from "next/navigation";
import type { ReminderType } from "@/schema/reminderSchema";
import { Switch } from "@/components/ui/switch";
import { completeReminder } from "@/server/actions/reminders/completeReminder";
import { useState } from "react";

export default function ReminderSwitch({
  reminder,
  userId,
}: {
  reminder: ReminderType;
  userId: string;
}) {
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(reminder.completed);
  const [isLoading, setIsLoading] = useState(false);

  const onSwitch = async () => {
    try {
      setIsLoading(true);
      if (userId) {
        // Toggle the state optimistically
        setIsChecked(!isChecked);

        const result = await completeReminder(reminder.id, !isChecked, userId);

        if (!result.success) {
          // Revert if there was an error
          setIsChecked(isChecked);
          console.error("Failed to update reminder:", result.error);
        }

        // Refresh the page to show updated data
        router.refresh();
      } else {
        router.replace("/");
      }
    } catch (error) {
      console.error("Error updating reminder:", error);
      // Revert on error
      setIsChecked(isChecked);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Switch
      checked={isChecked}
      onCheckedChange={onSwitch}
      disabled={isLoading}
      aria-label={`Mark reminder as ${isChecked ? "incomplete" : "complete"}`}
    />
  );
}
