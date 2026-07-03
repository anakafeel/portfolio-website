"use client";

import { useEffect } from "react";

import { useGame } from "@/components/game/GameProvider";

/** Awards the rice-zone achievement once the persisted state has hydrated. */
export default function RiceAchievement() {
  const { hydrated, award } = useGame();

  useEffect(() => {
    if (hydrated) {
      award("rice_inspector");
    }
  }, [hydrated, award]);

  return null;
}
