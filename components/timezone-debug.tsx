"use client";

import { useEffect, useState } from "react";

export default function TimezoneDebug() {
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    // Create a test date at 2:00 PM today
    const today = new Date();
    today.setHours(14, 0, 0, 0);

    // Get timezone information
    const timezoneOffset = today.getTimezoneOffset();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Create various date representations
    const isoString = today.toISOString();
    const utcString = today.toUTCString();
    const localString = today.toString();

    // Create a date string without timezone info
    const dateWithoutTZ = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")} ${String(
      today.getHours()
    ).padStart(2, "0")}:${String(today.getMinutes()).padStart(2, "0")}:${String(
      today.getSeconds()
    ).padStart(2, "0")}`;

    setDebugInfo({
      browserTimezone: timezone,
      timezoneOffsetMinutes: timezoneOffset,
      timezoneOffsetHours: timezoneOffset / 60,
      testDate: {
        localString,
        isoString,
        utcString,
        dateWithoutTZ,
      },
    });
  }, []);

  if (!debugInfo) return null;

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs overflow-auto max-h-60">
      <h3 className="font-bold mb-2">Timezone Debug Info</h3>
      <pre className="whitespace-pre-wrap">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </div>
  );
}
