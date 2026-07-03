"use client";

import { useEffect } from "react";

import { useGame } from "@/components/game/GameProvider";

/** Awards the quest_accepted achievement when a project page is opened. */
export default function QuestTracker() {
  const { hydrated, award } = useGame();

  useEffect(() => {
    if (hydrated) {
      award("quest_accepted");
    }
  }, [hydrated, award]);

  return null;
}
