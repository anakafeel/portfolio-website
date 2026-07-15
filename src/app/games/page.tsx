import type { Metadata } from "next";

import AwardOnVisit from "@/components/game/AwardOnVisit";
import GameGrid from "@/components/games/GameGrid";

export const metadata: Metadata = {
  title: "Games — Saim Hashmi",
  description:
    "Saim Hashmi's game library — competitive FPS mains, all-time favorites, and the backlog.",
};

export default function GamesPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <AwardOnVisit id="game_library" />
      <p className="font-pixel text-xs text-accent-alt">BONUS STAGE</p>
      <h1 className="mt-3 font-pixel text-xl text-highlight">GAME LIBRARY</h1>
      <p className="mt-4 max-w-2xl text-xl text-muted">
        Competitive FPS main with a soft spot for a good story mode. The save
        files below are the ones that shaped the playstyle — plus whatever the
        last Steam sale added to the pile. Click a cartridge to load its save
        file.
      </p>

      <GameGrid />
    </section>
  );
}
