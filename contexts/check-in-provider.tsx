// contexts/check-in-context.tsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type { CheckInDataType } from "@/schema/checkInSchema";
import { getTodaysCheckIn } from "@/server/actions/checkIns/getTodaysCheckIn";
import { setCookie } from "cookies-next";

interface CheckInContextType {
  checkIn: CheckInDataType | undefined;
  refreshCheckIn: () => Promise<void>;
}

const CheckInContext = createContext<CheckInContextType | undefined>(undefined);

export function CheckInProvider({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId: string;
}) {
  const [checkIn, setCheckIn] = useState<CheckInDataType>();

  const refreshCheckIn = async () => {
    const timezoneOffset = new Date().getTimezoneOffset();
    setCookie("userTimezoneOffset", timezoneOffset.toString(), {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
    const todayCheckIn = await getTodaysCheckIn(userId, timezoneOffset);
    if (todayCheckIn) {
      setCheckIn({ ...todayCheckIn, date: new Date(todayCheckIn.date) });
    } else {
      setCheckIn(undefined);
    }
  };

  useEffect(() => {
    refreshCheckIn();
  }, [userId]);

  return (
    <CheckInContext.Provider value={{ checkIn, refreshCheckIn }}>
      {children}
    </CheckInContext.Provider>
  );
}

export function useCheckIn() {
  const context = useContext(CheckInContext);
  if (context === undefined) {
    throw new Error("useCheckIn must be used within a CheckInProvider");
  }
  return context;
}
