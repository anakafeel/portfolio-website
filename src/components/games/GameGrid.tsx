"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import clsx from "clsx";

import { useSound } from "@/components/game/useSound";
import { GAMES, type GameEntry, type GameStatus } from "@/lib/games";

const STATUS_STYLES: Record<GameStatus, { label: string; text: string }> = {
  playing: { label: "CURRENTLY PLAYING", text: "text-accent-alt" },
  favorite: { label: "ALL-TIME FAVORITE", text: "text-highlight" },
  completed: { label: "COMPLETED", text: "text-accent" },
  backlog: { label: "BACKLOG", text: "text-muted" },
};

/** Matches the crt-off animation duration in globals.css. */
const CRT_OFF_MS = 240;

/** First letters of up to three words, for the placeholder cover monogram. */
function monogram(title: string): string {
  return title
    .split(/\s+/)
    .slice(0, 3)
    .map((word) => word[0])
    .join("");
}

/**
 * The game library grid. Each cartridge opens a "save file" popup with the
 * longer story and stats; the popup powers on/off like the terminal (CRT
 * animation + matching jingles).
 */
export default function GameGrid() {
  const play = useSound();
  const [selected, setSelected] = useState<GameEntry | null>(null);
  const [closing, setClosing] = useState(false);
  const closeTimer = useRef(0);

  const openCard = (game: GameEntry) => {
    window.clearTimeout(closeTimer.current);
    setClosing(false);
    setSelected(game);
    play("terminal");
  };

  const closeCard = useCallback(() => {
    if (!selected || closing) {
      return;
    }
    play("terminal_off");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSelected(null);
      return;
    }
    setClosing(true);
    closeTimer.current = window.setTimeout(() => {
      setSelected(null);
      setClosing(false);
    }, CRT_OFF_MS);
  }, [selected, closing, play]);

  useEffect(() => {
    if (!selected) {
      return;
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeCard();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected, closeCard]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const selectedStatus = selected ? STATUS_STYLES[selected.status] : null;

  return (
    <>
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {GAMES.map((game) => {
          const status = STATUS_STYLES[game.status];
          return (
            <button
              key={game.title}
              type="button"
              onClick={() => openCard(game)}
              aria-haspopup="dialog"
              className="pixel-border group flex flex-col bg-surface text-left transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent motion-safe:hover:-translate-y-1"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden border-b-2 border-border">
                {game.cover ? (
                  <Image
                    src={game.cover}
                    alt={`${game.title} cover art`}
                    fill
                    unoptimized
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
                <span className="mt-4 font-pixel text-[8px] text-muted opacity-70 transition-colors group-hover:text-accent group-hover:opacity-100">
                  ► LOAD SAVE FILE
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {selected && selectedStatus && (
        <>
          <div
            aria-hidden
            onClick={closeCard}
            className={clsx(
              "fixed inset-0 z-[80] bg-background/70 transition-opacity duration-200",
              closing ? "opacity-0" : "opacity-100",
            )}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${selected.title} details`}
            className={clsx(
              "pixel-border fixed left-1/2 top-1/2 z-[90] w-[min(560px,94vw)] -translate-x-1/2 -translate-y-1/2 bg-surface",
              closing
                ? "pointer-events-none motion-safe:animate-crt-off"
                : "motion-safe:animate-crt-on",
            )}
          >
            <div className="flex select-none items-center gap-2 border-b-2 border-border bg-background p-2">
              <span
                role="button"
                aria-label="Close details"
                tabIndex={0}
                onClick={closeCard}
                onKeyDown={(e) => e.key === "Enter" && closeCard()}
                className="h-3 w-3 cursor-pointer bg-accent transition-all hover:brightness-125"
              />
              <span className="h-3 w-3 bg-highlight" />
              <span className="h-3 w-3 bg-accent-alt" />
              <div className="flex-1 text-center font-pixel text-[8px] uppercase tracking-[0.15em] text-muted">
                save file — {selected.title}
              </div>
              <button
                type="button"
                onClick={closeCard}
                className="border border-border px-1.5 font-pixel text-[10px] text-muted transition-colors hover:border-accent hover:text-accent"
              >
                ×
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-6">
              <div className="flex items-start gap-5">
                {selected.cover && (
                  <Image
                    src={selected.cover}
                    alt={`${selected.title} cover art`}
                    width={96}
                    height={128}
                    unoptimized
                    className="pixelated shrink-0 border-2 border-border"
                  />
                )}
                <div>
                  <p
                    className={clsx(
                      "font-pixel text-[8px]",
                      selectedStatus.text,
                    )}
                  >
                    {selectedStatus.label}
                  </p>
                  <h2 className="mt-2 font-pixel text-base leading-relaxed text-highlight">
                    {selected.title}
                  </h2>
                  <p className="mt-2 font-pixel text-[10px] text-muted">
                    {selected.genre}
                  </p>
                </div>
              </div>

              <dl className="mt-6 grid grid-cols-2 gap-px border-2 border-border bg-border">
                <div className="bg-surface p-3">
                  <dt className="font-pixel text-[8px] text-muted">
                    HOURS LOGGED
                  </dt>
                  <dd className="mt-2 font-pixel text-xs text-accent">
                    {selected.details.hours}
                  </dd>
                </div>
                <div className="bg-surface p-3">
                  <dt className="font-pixel text-[8px] text-muted">MAINS</dt>
                  <dd className="mt-2 font-pixel text-xs text-accent-alt">
                    {selected.details.mains}
                  </dd>
                </div>
              </dl>

              <p className="mt-6 text-lg leading-snug text-muted">
                {selected.details.memory}
              </p>

              <p className="mt-6 text-right font-pixel text-[8px] text-muted opacity-60">
                ESC TO EJECT
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
