"use client";

import clsx from "clsx";

import { ACHIEVEMENT_IDS } from "@/lib/game/achievements";
import { THEMES, levelProgress } from "@/lib/game/state";
import { useGame } from "./GameProvider";

export default function HUD() {
  const { state, hydrated, setTheme, toggleMuted } = useGame();

  // Render nothing until the save file is loaded so the HUD never flashes
  // default values before jumping to the real ones.
  if (!hydrated) {
    return null;
  }

  const progress = levelProgress(state.xp);

  return (
    <aside
      aria-label="Player HUD"
      className="pixel-border fixed bottom-4 right-4 z-[60] flex flex-col gap-2 bg-surface p-3"
    >
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
            className="h-full bg-accent"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <span className="font-pixel text-[10px] text-muted">
          ★ {state.achievements.length}/{ACHIEVEMENT_IDS.length}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1" role="group" aria-label="Theme">
          {THEMES.map((theme) => (
            <button
              key={theme}
              type="button"
              onClick={() => setTheme(theme)}
              aria-pressed={state.theme === theme}
              title={theme}
              className={clsx(
                "border px-1.5 py-0.5 font-pixel text-[10px] uppercase transition-colors",
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
          className="border border-border px-1.5 py-0.5 font-pixel text-[10px] text-muted transition-colors hover:border-accent hover:text-foreground"
        >
          {state.muted ? "MUTE" : "SND"}
        </button>
      </div>
    </aside>
  );
}
