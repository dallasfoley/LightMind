"use client";

import { useEffect } from "react";

export default function TimezoneScript() {
  useEffect(() => {
    // Get the user's timezone offset in minutes
    const offset = new Date().getTimezoneOffset();

    // Store it in a cookie so server components can access it
    document.cookie = `timezone-offset=${offset};path=/;max-age=${
      60 * 60 * 24 * 30
    }`;
  }, []);

  // This component doesn't render anything
  return null;
}
