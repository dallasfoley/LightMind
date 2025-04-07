import { format as dateFnsFormat } from "date-fns";

/**
 * Converts a UTC date from the database to local time for display
 */
export function utcToLocal(date: Date | string): Date {
  const utcDate = typeof date === "string" ? new Date(date) : new Date(date);

  // Get the UTC time values
  const utcYear = utcDate.getUTCFullYear();
  const utcMonth = utcDate.getUTCMonth();
  const utcDay = utcDate.getUTCDate();
  const utcHours = utcDate.getUTCHours();
  const utcMinutes = utcDate.getUTCMinutes();
  const utcSeconds = utcDate.getUTCSeconds();

  // Create a new date using local timezone with the UTC values
  return new Date(utcYear, utcMonth, utcDay, utcHours, utcMinutes, utcSeconds);
}

/**
 * Formats a date for display, ensuring correct timezone handling
 */
export function formatDate(date: Date | string, formatStr: string): string {
  const localDate = utcToLocal(date);
  return dateFnsFormat(localDate, formatStr);
}

/**
 * Gets the current date in the user's timezone as a YYYY-MM-DD string
 */
export function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Gets yesterday's date in the user's timezone as a YYYY-MM-DD string
 */
export function getYesterdayString(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, "0");
  const day = String(yesterday.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Gets the start of today in the user's timezone
 */
export function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
}

/**
 * Gets the end of today in the user's timezone
 */
export function endOfToday(): Date {
  const now = new Date();
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999
  );
}

/**
 * Gets a date N days ago from today in the user's timezone
 */
export function daysAgo(days: number): Date {
  const result = new Date();
  result.setDate(result.getDate() - days);
  return result;
}

/**
 * Formats a date N days ago as a YYYY-MM-DD string
 */
export function daysAgoString(days: number): string {
  const daysAgoDate = daysAgo(days);
  const year = daysAgoDate.getFullYear();
  const month = String(daysAgoDate.getMonth() + 1).padStart(2, "0");
  const day = String(daysAgoDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
