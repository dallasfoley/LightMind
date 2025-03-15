import type { UserType } from "@/schema/userSchema";

import JournalIcon from "./journal-icon";

export default async function JournalCard({
  user,
  journalStreak,
}: {
  user: UserType;
  journalStreak: number;
}) {
  if (!user) {
    return <p>User not found. Please log in.</p>;
  }

  return (
    <div className="flex flex-col justify-center items-center h-full w-full text-lg font-semibold text-black">
      <div className="flex-shrink-0 w-24 h-24 scale-125">
        <JournalIcon />
      </div>
      <div className="flex items-center mt-1">
        <h1 className="text-2xl md:text-3xl m-1 mr-2 text-zinc-900 dark:text-zinc-200">
          {journalStreak}
        </h1>
        <span className="text-sm md:text-base text-slate-500 dark:text-slate-400">
          day streak
        </span>
      </div>
    </div>
  );
}
