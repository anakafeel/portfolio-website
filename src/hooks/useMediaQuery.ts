"use client";

import { useEffect, useState } from "react";

/**
 * SSR-safe media query hook. Returns false during SSR, then updates on mount.
 * For immediate SSR rendering without flash, use CSS @media queries instead.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);

  return matches;
}
