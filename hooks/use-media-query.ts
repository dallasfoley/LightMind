"use client";

import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Initialize with the current state on mount
    const media = window.matchMedia(query);
    setMatches(media.matches);

    // Set up the listener
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);

    // Clean up
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}
