import { JournalTable } from "@/drizzle/schema";
import { db } from "@/lib/db"; // Your Drizzle database instance
import { sql } from "drizzle-orm";

export async function getStreak(userId: string) {
  const result = await db.execute(sql`
    WITH RankedEntries AS (
      SELECT
        date,
        ROW_NUMBER() OVER (ORDER BY date) as rn
      FROM ${JournalTable}
      WHERE id = ${userId}
    ),
    GroupedStreaks AS (
      SELECT
        date - rn * interval '1 day' as grp,  -- The grouping magic
        date
      FROM RankedEntries
    ),
    StreakLengths AS (
      SELECT
        grp,
        COUNT(*) as streak_length
      FROM GroupedStreaks
      GROUP BY grp
    )
    SELECT
        MAX(streak_length) as longest_streak
    FROM StreakLengths;
  `);

  const streaks: { longest_streak: number }[] = result.rows as {
    longest_streak: number;
  }[];

  // streaks[0].longest_streak will contain the longest streak (or null if no entries)
  return streaks[0]?.longest_streak || 0; // Return 0 if no streak
}
