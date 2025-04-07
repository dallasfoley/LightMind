/**
 * Date utility functions that handle timezone correctly
 */

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

  // Simple format implementation for common patterns
  if (formatStr === "PPP") {
    // Full date: e.g., April 1, 2023
    return localDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  if (formatStr === "p") {
    // Time: e.g., 12:00 PM
    return localDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  // Default to ISO string if format not recognized
  return localDate.toISOString();
}

/**
 * Gets the current date in the user's timezone as a YYYY-MM-DD string
 */
export function getTodayString(): string {
  const now = new Date();
  return formatDateToYYYYMMDD(now);
}

/**
 * Gets yesterday's date in the user's timezone as a YYYY-MM-DD string
 */
export function getYesterdayString(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return formatDateToYYYYMMDD(yesterday);
}

/**
 * Gets the start of today in the user's timezone
 */
export function startOfToday(): Date {
  const now = new Date();
  const result = new Date(now);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Gets the end of today in the user's timezone
 */
export function endOfToday(): Date {
  const now = new Date();
  const result = new Date(now);
  result.setHours(23, 59, 59, 999);
  return result;
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
  return formatDateToYYYYMMDD(daysAgo(days));
}

/**
 * Helper function to format a date as YYYY-MM-DD
 */
function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Determines if a date is today in the user's timezone
 */
export function isToday(date: Date | string): boolean {
  const checkDate = typeof date === "string" ? new Date(date) : new Date(date);
  const today = new Date();

  return (
    checkDate.getDate() === today.getDate() &&
    checkDate.getMonth() === today.getMonth() &&
    checkDate.getFullYear() === today.getFullYear()
  );
}
