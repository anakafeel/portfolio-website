"use client";

import { useEffect, useState } from "react";

export interface ThemeColors {
  accent: string;
  accentAlt: string;
  background: string;
}

const FALLBACK_COLORS: ThemeColors = {
  accent: "#ff2d78",
  accentAlt: "#00e5ff",
  background: "#0a0a12",
};

/**
 * Reads theme CSS custom properties live, re-reading whenever the
 * `data-theme` attribute on <html> changes. Shared by every
 * react-three-fiber scene so theme-reactive lighting stays consistent.
 */
export function useThemeColors(): ThemeColors {
  const [colors, setColors] = useState<ThemeColors>(FALLBACK_COLORS);

  useEffect(() => {
    const read = () => {
      const style = getComputedStyle(document.documentElement);
      const get = (name: string, fallback: string) =>
        style.getPropertyValue(name).trim() || fallback;
      setColors({
        accent: get("--color-accent", FALLBACK_COLORS.accent),
        accentAlt: get("--color-accent-alt", FALLBACK_COLORS.accentAlt),
        background: get("--color-background", FALLBACK_COLORS.background),
      });
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  return colors;
}

/** Tracks `prefers-reduced-motion`, live-updating on change. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
