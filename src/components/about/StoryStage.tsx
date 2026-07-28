"use client";

import StoryLevel from "@/components/about/StoryLevel";
import StorySideScroller from "@/components/about/StorySideScroller";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/**
 * Desktop gets the pinned circuit-scroll sequence; everyone else
 * gets the vertical story level. SSR renders the vertical version
 * so content is always present before hydration.
 */
const SIDE_SCROLL_QUERY =
  "(min-width: 768px) and (prefers-reduced-motion: no-preference)";

export default function StoryStage() {
  const sideScroll = useMediaQuery(SIDE_SCROLL_QUERY);

  return sideScroll ? <StorySideScroller /> : <StoryLevel />;
}
