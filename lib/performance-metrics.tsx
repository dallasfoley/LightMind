"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function PerformanceMetrics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Report performance metrics when route changes
    const reportWebVitals = async () => {
      const metrics = await getWebVitals();
      console.log("Performance metrics:", metrics);

      // You could send these metrics to an analytics service
      // await fetch('/api/analytics/performance', {
      //   method: 'POST',
      //   body: JSON.stringify(metrics),
      // });
    };

    reportWebVitals();
  }, [pathname, searchParams]);

  return null;
}

async function getWebVitals() {
  if (typeof window === "undefined") return {};

  // Wait for the browser to paint
  await new Promise((resolve) => setTimeout(resolve, 0));

  const navigationEntry = performance.getEntriesByType(
    "navigation"
  )[0] as PerformanceNavigationTiming;
  const paintEntries = performance.getEntriesByType("paint");
  const firstPaint = paintEntries.find((entry) => entry.name === "first-paint");
  const firstContentfulPaint = paintEntries.find(
    (entry) => entry.name === "first-contentful-paint"
  );

  return {
    // Navigation timing
    dnsLookup:
      navigationEntry.domainLookupEnd - navigationEntry.domainLookupStart,
    tcpConnection: navigationEntry.connectEnd - navigationEntry.connectStart,
    timeToFirstByte:
      navigationEntry.responseStart - navigationEntry.requestStart,
    domLoad:
      navigationEntry.domContentLoadedEventEnd - navigationEntry.domInteractive,
    windowLoad: navigationEntry.loadEventEnd - navigationEntry.loadEventStart,

    // Paint timing
    firstPaint: firstPaint ? firstPaint.startTime : null,
    firstContentfulPaint: firstContentfulPaint
      ? firstContentfulPaint.startTime
      : null,

    // Navigation total
    totalLoadTime: navigationEntry.loadEventEnd - navigationEntry.startTime,
  };
}
