"use client";

import { useEffect, useRef } from "react";

import { playSfx } from "@/lib/audio/sfx";
import type { GameState } from "@/lib/game/state";
import { useGame } from "./GameProvider";

/**
 * Plays chiptune feedback on game-state transitions (level up, achievement
 * unlock, palette swap). Renders nothing. Mirrors AchievementToast's
 * hydration handling: the first pass only records the restored save.
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
      playSfx("level_up", state.volume);
    } else if (state.achievements.length > prev.achievements.length) {
      playSfx("achievement", state.volume);
    } else if (state.theme !== prev.theme) {
      playSfx("theme", state.volume);
    } else if (prev.muted) {
      // Just unmuted — confirm that audio is live.
      playSfx("blip", state.volume);
    }
  }, [state, hydrated]);

  return null;
}
