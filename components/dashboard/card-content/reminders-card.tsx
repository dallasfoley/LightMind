import type { UserType } from "@/schema/userSchema";
import { getReminders } from "@/server/actions/getReminders";

export default async function RemindersCard({ user }: { user: UserType }) {
  const reminders = await getReminders(user, true);
  if (!reminders)
    return <p className="text-red-500 text-center">Error loading reminders</p>;

  return (
    <div className="w-full h-full flex flex-col">
      {reminders.length > 0 ? (
        <>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Today&apos;s Reminders
          </h2>
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
            <ul className="space-y-1 pr-1">
              {reminders.map((reminder, index) => (
                <li
                  key={index}
                  className="p-2 rounded-md bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
                >
                  <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                    {reminder.title}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">
                    {new Date(reminder.datetime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No reminders for today
          </p>
        </div>
      )}
    </div>
  );
}
