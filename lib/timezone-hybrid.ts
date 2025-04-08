"use client";

// This file contains timezone utilities that work in client components

/**
 * Converts a UTC date from the database to local time for display
 * This function now simply returns the date as is, to avoid double conversion
 */
export function clientToLocalTime(date: Date | string | null): Date | null {
  if (!date) return null;
  return typeof date === "string" ? new Date(date) : new Date(date);
}

/**
 * Checks if a date is today in the client's local timezone
 */
export function isClientLocalToday(date: Date | string | null): boolean {
  if (!date) return false;

  // Parse the date if it's a string
  const checkDate = typeof date === "string" ? new Date(date) : new Date(date);

  // Get today's date in local timezone
  const today = new Date();

  // Compare only the date parts (year, month, day)
  return (
    checkDate.getFullYear() === today.getFullYear() &&
    checkDate.getMonth() === today.getMonth() &&
    checkDate.getDate() === today.getDate()
  );
}

/**
 * Formats a date for display in the client's local timezone
 */
export function formatClientLocalDate(
  date: Date | string | null,
  format = "short"
): string {
  if (!date) return "";

  const localDate = typeof date === "string" ? new Date(date) : new Date(date);

  switch (format) {
    case "time":
      return localDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    case "date":
      return localDate.toLocaleDateString();
    case "full":
      return localDate.toLocaleString();
    case "short":
    default:
      return localDate.toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
  }
}

/**
 * Debug function to log timezone information
 */
export function logClientTimezoneInfo(date: Date | string | null = null): void {
  const now = new Date();
  const testDate = date
    ? typeof date === "string"
      ? new Date(date)
      : date
    : now;
  const localDate = clientToLocalTime(testDate);

  console.log("Client Timezone Debug Info:", {
    browserTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timezoneOffset: now.getTimezoneOffset(),
    originalDate: testDate.toString(),
    originalISOString: testDate.toISOString(),
    localDate: localDate?.toString(),
    isToday: isClientLocalToday(testDate),
    formattedTime: formatClientLocalDate(testDate, "time"),
    formattedDate: formatClientLocalDate(testDate, "date"),
  });
}
