"use client";

import { useEffect, useState } from "react";

import StoryLevel from "@/components/about/StoryLevel";
import StorySideScroller from "@/components/about/StorySideScroller";

/**
 * The pinned side-scroller is a desktop, motion-allowed experience; everyone
 * else keeps the vertical story level. SSR renders the vertical version so
 * content is always present before hydration.
 */
const SIDE_SCROLL_QUERY =
  "(min-width: 768px) and (prefers-reduced-motion: no-preference)";

export default function StoryStage() {
  const [sideScroll, setSideScroll] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(SIDE_SCROLL_QUERY);
    setSideScroll(query.matches);
    const onChange = (event: MediaQueryListEvent) =>
      setSideScroll(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return sideScroll ? <StorySideScroller /> : <StoryLevel />;
}
