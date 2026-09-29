"use client";

import { useEffect } from "react";

import { useGame } from "@/components/game/GameProvider";
import type { AchievementId } from "@/lib/game/achievements";

interface AwardOnVisitProps {
  id: AchievementId;
}

/**
 * Awards an achievement once the persisted game state has hydrated. The
 * toast still shows on a fresh page load, but SoundEffects stays silent
 * until the visitor's first click or key press (see lib/game/gesture.ts).
 */
export default function AwardOnVisit({ id }: AwardOnVisitProps) {
  const { hydrated, award } = useGame();

  useEffect(() => {
    if (hydrated) {
      award(id);
    }
  }, [hydrated, award, id]);

  return null;
}
