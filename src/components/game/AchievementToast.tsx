"use client";

import { useEffect, useRef, useState } from "react";

import { ACHIEVEMENTS, type AchievementId } from "@/lib/game/achievements";
import { useGame } from "./GameProvider";

const TOAST_DURATION_MS = 3500;

export default function AchievementToast() {
  const { state, hydrated } = useGame();
  const seenRef = useRef<AchievementId[] | null>(null);
  const [current, setCurrent] = useState<AchievementId | null>(null);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    // First pass after hydration only records what was already unlocked —
    // no toasts for achievements restored from the save file.
    if (seenRef.current === null) {
      seenRef.current = state.achievements;
      return;
    }
    const previous = seenRef.current;
    const fresh = state.achievements.filter((id) => !previous.includes(id));
    seenRef.current = state.achievements;
    if (fresh.length === 0) {
      return;
    }
    setCurrent(fresh[fresh.length - 1]);
    const timer = setTimeout(() => setCurrent(null), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [state.achievements, hydrated]);

  if (!current) {
    return null;
  }

  const achievement = ACHIEVEMENTS[current];

  return (
    <div
      role="status"
      aria-live="polite"
      className="pixel-border fixed left-1/2 top-6 z-[70] -translate-x-1/2 bg-surface px-6 py-3 text-center motion-safe:animate-fade-up"
    >
      <p className="font-pixel text-[10px] text-highlight">
        ACHIEVEMENT UNLOCKED
      </p>
      <p className="mt-1 font-pixel text-xs text-foreground">
        {achievement.title}{" "}
        <span className="text-accent-alt">+{achievement.xp}XP</span>
      </p>
    </div>
  );
}
