"use client";

import { useEffect, useState } from "react";

import StoryLevel from "@/components/about/StoryLevel";
import StorySideScroller from "@/components/about/StorySideScroller";

/**
 * The pinned circuit-scroll sequence is a desktop, motion-allowed,
 * WebGL-capable experience; everyone else keeps the vertical story level.
 * SSR renders the vertical version so content is always present before
 * hydration.
 */
const SIDE_SCROLL_QUERY =
  "(min-width: 768px) and (prefers-reduced-motion: no-preference)";

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl"),
    );
  } catch {
    return false;
  }
}

export default function StoryStage() {
  const [sideScroll, setSideScroll] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(SIDE_SCROLL_QUERY);
    const evaluate = () => setSideScroll(query.matches && supportsWebGL());
    evaluate();
    const onChange = () => evaluate();
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return sideScroll ? <StorySideScroller /> : <StoryLevel />;
}
