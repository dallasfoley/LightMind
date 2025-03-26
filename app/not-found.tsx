"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
          <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
          <p className="text-lg mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
          <Button asChild>
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      }
    >
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-lg mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </Suspense>
  );
}
