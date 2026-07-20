"use client";

import clsx from "clsx";

import { ACHIEVEMENT_IDS } from "@/lib/game/achievements";
import { THEMES, levelProgress } from "@/lib/game/state";
import { TERMINAL_TOGGLE_EVENT } from "@/lib/terminal/events";
import { useGame } from "./GameProvider";
import { useSound } from "./useSound";

/**
 * Slim game status bar rendered inside the sticky header — LV/XP/★ on the
 * left, theme swatches, sound and terminal controls on the right. Lives in
 * the document flow so it can never overlap page content.
 */
export default function HUD() {
  const { state, hydrated, setTheme, toggleMuted } = useGame();
  const play = useSound();

  // Render nothing until the save file is loaded so the HUD never flashes
  // default values before jumping to the real ones.
  if (!hydrated) {
    return null;
  }

  const progress = levelProgress(state.xp);

  return (
    <div aria-label="Player HUD" className="border-t-2 border-border">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-2">
        <div className="flex items-center gap-3">
          <span className="font-pixel text-[10px] text-highlight">
            LV {state.level}
          </span>
          <div
            role="progressbar"
            aria-label="XP progress"
            aria-valuenow={Math.round(progress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-2 w-24 border border-border bg-background"
          >
            <div
              className="h-full bg-accent motion-safe:transition-[width] motion-safe:duration-500"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <span className="font-pixel text-[10px] text-muted">
            ★ {state.achievements.length}/{ACHIEVEMENT_IDS.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1" role="group" aria-label="Theme">
            {THEMES.map((theme) => (
              <button
                key={theme}
                type="button"
                onClick={() => setTheme(theme)}
                aria-pressed={state.theme === theme}
                title={theme}
                className={clsx(
                  "border px-1.5 py-1 font-pixel text-[10px] uppercase transition-colors focus-visible:border-accent focus-visible:text-foreground focus-visible:outline-none",
                  state.theme === theme
                    ? "border-accent bg-accent text-background"
                    : "border-border text-muted hover:border-accent hover:text-foreground",
                )}
              >
                {theme[0]}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={toggleMuted}
            aria-pressed={!state.muted}
            title={state.muted ? "Unmute" : "Mute"}
            className="border border-border px-1.5 py-1 font-pixel text-[10px] text-muted transition-colors hover:border-accent hover:text-foreground focus-visible:border-accent focus-visible:text-foreground focus-visible:outline-none"
          >
            {state.muted ? "MUTE" : "SND"}
          </button>
          <button
            type="button"
            onClick={() => {
              play("click");
              window.dispatchEvent(new CustomEvent(TERMINAL_TOGGLE_EVENT));
            }}
            title="Open terminal (Ctrl+`)"
            aria-label="Open terminal"
            className="border border-border px-1.5 py-1 font-pixel text-[10px] text-muted transition-colors hover:border-accent hover:text-accent focus-visible:border-accent focus-visible:text-accent focus-visible:outline-none"
          >
            &gt;_
          </button>
        </div>
      </div>
    </div>
  );
}
