import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { PerformanceMetrics } from "@/lib/performance-metrics";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LightMind - Mental Health Tracking",
  description: "Track, visualize, and improve your mental health",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          {/* Preload critical assets */}
          <link rel="preload" href="/brain-logo.png" as="image" />

          {/* Web Vitals measurement */}
          <Script
            src="https://unpkg.com/web-vitals@3/dist/web-vitals.iife.js"
            strategy="afterInteractive"
          />
          <Script id="web-vitals-init" strategy="afterInteractive">
            {`
            (function() {
              try {
                window.webVitals = window.webVitals || {};
                if (typeof window.__WEB_VITALS_POLYFILL__ !== 'undefined') {
                  window.webVitals = window.__WEB_VITALS_POLYFILL__;
                }
              } catch (e) {
                console.error('Web Vitals initialization failed:', e);
              }
            })();
          `}
          </Script>
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} text-white antialiased`}
        >
          {children}
          <PerformanceMetrics />
        </body>
      </html>
    </ClerkProvider>
  );
}
