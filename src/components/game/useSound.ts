"use client";

import { useCallback } from "react";

import { playSfx, type SfxName } from "@/lib/audio/sfx";
import { hasUserGesture } from "@/lib/game/gesture";
import { useGame } from "./GameProvider";

/**
 * Plays an effect only once the visitor has interacted with the page, so no
 * AudioContext is created (or notes scheduled on a suspended one) on load.
 * Callers still check `muted` themselves.
 */
export function playAfterGesture(name: SfxName, volume: number): void {
  if (!hasUserGesture()) {
    return;
  }
  playSfx(name, volume);
}

/**
 * The one way interactive components play sound. Reads mute/volume from the
 * game state so the global toggle is always respected.
 */
export function useSound() {
  const { state } = useGame();

  return useCallback(
    (name: SfxName, scale = 1) => {
      if (state.muted) {
        return;
      }
      playAfterGesture(name, state.volume * scale);
    },
    [state.muted, state.volume],
  );
}
