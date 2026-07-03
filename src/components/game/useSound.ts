"use client";

import { useCallback } from "react";

import { playSfx, type SfxName } from "@/lib/audio/sfx";
import { useGame } from "./GameProvider";

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
      playSfx(name, state.volume * scale);
    },
    [state.muted, state.volume],
  );
}
