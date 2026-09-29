"use client";

import { useEffect, useRef } from "react";

import type { GameState } from "@/lib/game/state";
import { useGame } from "./GameProvider";
import { playAfterGesture } from "./useSound";

/**
 * Plays chiptune feedback on game-state transitions (level up, achievement
 * unlock, palette swap). Renders nothing. Mirrors AchievementToast's
 * hydration handling: the first pass only records the restored save.
 * Nothing plays before the first user gesture, so an achievement awarded on
 * page load (AwardOnVisit) unlocks silently instead of hitting a suspended
 * AudioContext.
 */
export default function SoundEffects() {
  const { state, hydrated } = useGame();
  const prevRef = useRef<GameState | null>(null);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    const prev = prevRef.current;
    prevRef.current = state;
    if (prev === null || state.muted) {
      return;
    }

    // One sound per transition, most celebratory wins.
    if (state.level > prev.level) {
      playAfterGesture("level_up", state.volume);
    } else if (state.achievements.length > prev.achievements.length) {
      playAfterGesture("achievement", state.volume);
    } else if (state.theme !== prev.theme) {
      playAfterGesture("theme", state.volume);
    } else if (prev.muted) {
      // Just unmuted — confirm that audio is live.
      playAfterGesture("blip", state.volume);
    }
  }, [state, hydrated]);

  return null;
}
