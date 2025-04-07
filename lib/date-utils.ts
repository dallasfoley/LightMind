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
