"use client";

import { useEffect } from "react";
import { setCookie } from "cookies-next";

export default function TimezoneDetector() {
  useEffect(() => {
    // Set the timezone offset cookie as soon as the app loads
    const timezoneOffset = new Date().getTimezoneOffset();
    setCookie("userTimezoneOffset", timezoneOffset.toString(), {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    console.log("Set timezone offset cookie:", timezoneOffset);
  }, []);

  // This component doesn't render anything
  return null;
}
