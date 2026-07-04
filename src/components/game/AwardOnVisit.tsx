"use client";

import { useEffect } from "react";

import { useGame } from "@/components/game/GameProvider";
import type { AchievementId } from "@/lib/game/achievements";

interface AwardOnVisitProps {
  id: AchievementId;
}

/** Awards an achievement once the persisted game state has hydrated. */
export default function AwardOnVisit({ id }: AwardOnVisitProps) {
  const { hydrated, award } = useGame();

  useEffect(() => {
    if (hydrated) {
      award(id);
    }
  }, [hydrated, award, id]);

  return null;
}
