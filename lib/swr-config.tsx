"use client";

import type React from "react";

import { SWRConfig } from "swr";

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) => fetch(url).then((res) => res.json()),
        revalidateOnFocus: false,
        revalidateIfStale: false,
        dedupingInterval: 10000,
      }}
    >
      {children}
    </SWRConfig>
  );
}
