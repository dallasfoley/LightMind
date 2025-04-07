import { cookies } from "next/headers";

export async function getUserTimezoneOffset() {
  try {
    const cookieStore = await cookies();
    const offset = cookieStore.get("timezone-offset");
    return offset ? parseInt(offset.value) : 0;
  } catch (error) {
    console.error("Error getting timezone offset:", error);
    return 0;
  }
}

/**
 * Converts a UTC date to the user's local timezone
 */
export async function toLocalTime(date: Date | string | null) {
  if (!date) return null;

  const utcDate = typeof date === "string" ? new Date(date) : new Date(date);
  const timezoneOffset = await getUserTimezoneOffset();

  // Create a new date adjusted for the user's timezone
  const localDate = new Date(utcDate.getTime() - timezoneOffset * 60000);

  return localDate;
}

/**
 * Gets today's date as a YYYY-MM-DD string in the user's local timezone
 */
export async function getLocalDateString() {
  const now = new Date();
  const localNow = await toLocalTime(now);

  if (!localNow) return "";

  return localNow.toISOString().split("T")[0];
}

/**
 * Gets yesterday's date as a YYYY-MM-DD string in the user's local timezone
 */
export async function getLocalYesterdayString() {
  const now = new Date();
  now.setDate(now.getDate() - 1);
  const localYesterday = await toLocalTime(now);

  if (!localYesterday) return "";

  return localYesterday.toISOString().split("T")[0];
}

/**
 * Gets a date N days ago as a YYYY-MM-DD string in the user's local timezone
 */
export async function getLocalDaysAgoString(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  const localDate = await toLocalTime(date);

  if (!localDate) return "";

  return localDate.toISOString().split("T")[0];
}

/**
 * Gets the start of today in the user's local timezone
 */
export async function getLocalStartOfDay() {
  const now = new Date();
  const localNow = await toLocalTime(now);

  if (!localNow) return new Date();

  // Set to start of day in local time
  const startOfDay = new Date(localNow);
  startOfDay.setHours(0, 0, 0, 0);

  return startOfDay;
}

/**
 * Gets the end of today in the user's local timezone
 */
export async function getLocalEndOfDay() {
  const now = new Date();
  const localNow = await toLocalTime(now);

  if (!localNow) return new Date();

  // Set to end of day in local time
  const endOfDay = new Date(localNow);
  endOfDay.setHours(23, 59, 59, 999);

  return endOfDay;
}

/**
 * Checks if a date is today in the user's local timezone
 */
export async function isLocalToday(date: Date | string | null) {
  if (!date) return false;

  const checkDate = typeof date === "string" ? new Date(date) : new Date(date);
  const localCheckDate = await toLocalTime(checkDate);

  if (!localCheckDate) return false;

  const localToday = await getLocalDateString();
  const localCheckDateString = localCheckDate.toISOString().split("T")[0];

  return localCheckDateString === localToday;
}

/**
 * Formats a date for display in the user's local timezone
 */
export async function formatLocalDate(
  date: Date | string | null,
  format = "short"
) {
  if (!date) return "";

  const localDate = await toLocalTime(date);

  if (!localDate) return "";

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
export async function logTimezoneInfo() {
  const now = new Date();
  const timezoneOffset = getUserTimezoneOffset();
  const localNow = await toLocalTime(now);

  console.log("Timezone Debug Info:", {
    serverTime: now.toISOString(),
    userTimezoneOffset: timezoneOffset,
    localTime: localNow?.toISOString(),
    localDateString: getLocalDateString(),
    localYesterdayString: getLocalYesterdayString(),
    localStartOfDay: (await getLocalStartOfDay()).toISOString(),
    localEndOfDay: (await getLocalEndOfDay()).toISOString(),
  });
}
