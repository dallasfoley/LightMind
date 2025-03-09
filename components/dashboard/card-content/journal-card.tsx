import { JournalTable, UserTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import type { UserType } from "@/schema/userSchema";
import { and, eq, gte } from "drizzle-orm";
import JournalIcon from "./journal-icon";
import { resetJournalStreak } from "@/server/actions/users/resetJournalStreak";

export default async function JournalCard({ user }: { user: UserType }) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  const yesterdayString = yesterday.toISOString().split("T")[0];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const activeStreak = await db
    .select()
    .from(JournalTable)
    .where(
      and(
        eq(JournalTable.userId, user.id),
        gte(JournalTable.date, yesterdayString)
      )
    );

  if (activeStreak.length === 0 && user.journalStreak !== 0)
    await resetJournalStreak(user.id);

  const streakResult =
    activeStreak.length > 0
      ? await db
          .select({ journalStreak: UserTable.journalStreak })
          .from(UserTable)
          .where(eq(UserTable.id, user.id))
      : [{ journalStreak: 0 }];

  const streak = streakResult[0]?.journalStreak ?? 0;

  return (
    <div className="flex flex-col justify-center items-center h-full w-full text-lg font-semibold text-black">
      <div className="flex-shrink-0 w-24 h-24 scale-125">
        <JournalIcon />
      </div>
      <div className="flex items-center mt-1">
        <h1 className="text-2xl md:text-3xl m-1 mr-2 text-zinc-900 dark:text-zinc-200">
          {streak}
        </h1>
        <span className="text-sm md:text-base text-slate-500 dark:text-slate-400">
          day streak
        </span>
      </div>
    </div>
  );
}
