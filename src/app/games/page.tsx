import type { Metadata } from "next";
import Image from "next/image";
import clsx from "clsx";

import AwardOnVisit from "@/components/game/AwardOnVisit";
import { GAMES, type GameStatus } from "@/lib/games";

export const metadata: Metadata = {
  title: "Games — Saim Hashmi",
  description:
    "Saim Hashmi's game library — competitive FPS mains, all-time favorites, and the backlog.",
};

const STATUS_STYLES: Record<GameStatus, { label: string; text: string }> = {
  playing: { label: "CURRENTLY PLAYING", text: "text-accent-alt" },
  favorite: { label: "ALL-TIME FAVORITE", text: "text-highlight" },
  completed: { label: "COMPLETED", text: "text-accent" },
  backlog: { label: "BACKLOG", text: "text-muted" },
};

/** First letters of up to three words, for the placeholder cover monogram. */
function monogram(title: string): string {
  return title
    .split(/\s+/)
    .slice(0, 3)
    .map((word) => word[0])
    .join("");
}

export default function GamesPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <AwardOnVisit id="game_library" />
      <p className="font-pixel text-xs text-accent-alt">BONUS STAGE</p>
      <h1 className="mt-3 font-pixel text-xl text-highlight">GAME LIBRARY</h1>
      <p className="mt-4 max-w-2xl text-xl text-muted">
        Competitive FPS main with a soft spot for a good story mode. The save
        files below are the ones that shaped the playstyle — plus whatever the
        last Steam sale added to the pile.
      </p>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {GAMES.map((game) => {
          const status = STATUS_STYLES[game.status];
          return (
            <article
              key={game.title}
              className="pixel-border group flex flex-col bg-surface transition-transform motion-safe:hover:-translate-y-1"
            >
              <div className="relative aspect-[3/4] overflow-hidden border-b-2 border-border">
                {game.cover ? (
                  <Image
                    src={game.cover}
                    alt={`${game.title} cover art`}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="pixelated object-cover"
                  />
                ) : (
                  <div
                    aria-hidden
                    className="flex h-full flex-col items-center justify-center gap-3 bg-[repeating-linear-gradient(135deg,transparent_0px,transparent_10px,var(--color-border)_10px,var(--color-border)_12px)] opacity-90"
                  >
                    <span className="font-pixel text-3xl text-border transition-colors group-hover:text-accent">
                      {monogram(game.title)}
                    </span>
                    <span className="bg-background px-2 py-1 font-pixel text-[8px] text-muted">
                      INSERT CARTRIDGE
                    </span>
                  </div>
                )}
                <span
                  className={clsx(
                    "absolute left-0 top-3 bg-background px-2 py-1 font-pixel text-[8px]",
                    status.text,
                  )}
                >
                  {status.label}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="font-pixel text-[10px] text-muted">
                  {game.genre}
                </p>
                <h2 className="mt-3 font-pixel text-sm leading-relaxed text-foreground">
                  {game.title}
                </h2>
                <p className="mt-3 text-lg leading-snug text-muted">
                  {game.blurb}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
