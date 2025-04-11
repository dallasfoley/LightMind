"use client";

import { useEffect, useState } from "react";
import { refreshDashboardData } from "@/server/actions/refreshDashboardData";

export default function TimezoneAdjuster() {
  const [isAdjusted, setIsAdjusted] = useState(false);

  useEffect(() => {
    const adjustTimezone = async () => {
      if (!isAdjusted) {
        const timezoneOffset = new Date().getTimezoneOffset();
        await refreshDashboardData(timezoneOffset);
        setIsAdjusted(true);
      }
    };

    adjustTimezone();
  }, [isAdjusted]);

  return null;
}
