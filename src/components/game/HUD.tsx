"use client";

import clsx from "clsx";
import { Volume2, VolumeX } from "lucide-react";

import { ACHIEVEMENT_IDS } from "@/lib/game/achievements";
import { THEMES, levelProgress } from "@/lib/game/state";
import { TERMINAL_TOGGLE_EVENT } from "@/lib/terminal/events";
import { useGame } from "./GameProvider";
import { useSound } from "./useSound";

/*
 * HUD controls: 44px tall on touch screens, 28px from sm up (both clear the
 * 24px WCAG 2.5.8 minimum). The border uses the higher-contrast control
 * token so each button's edge meets 3:1 against the header surface.
 */
const CONTROL =
  "inline-flex min-h-11 items-center justify-center gap-1.5 border px-2 font-pixel text-[10px] transition-colors sm:min-h-7";
const CONTROL_IDLE =
  "border-[color:var(--color-control)] text-muted hover:border-accent hover:text-foreground focus-visible:border-accent focus-visible:text-foreground";

/** Palette swatches. Rendered in the HUD from sm up and in the mobile menu. */
export function ThemeButtons({ className }: { className?: string }) {
  const { state, setTheme } = useGame();

  return (
    <div
      className={clsx("flex items-center gap-1", className)}
      role="group"
      aria-label="Theme"
    >
      {THEMES.map((theme) => (
        <button
          key={theme}
          type="button"
          onClick={() => setTheme(theme)}
          aria-pressed={state.theme === theme}
          aria-label={`${theme[0].toUpperCase()}${theme.slice(1)} theme`}
          title={`${theme} theme`}
          className={clsx(
            CONTROL,
            "min-w-11 uppercase sm:min-w-7",
            state.theme === theme
              ? "border-accent bg-accent text-background"
              : CONTROL_IDLE,
          )}
        >
          {theme[0]}
        </button>
      ))}
    </div>
  );
}

/**
 * Slim game status bar rendered inside the sticky header — LV/XP/★ on the
 * left, theme swatches, sound and terminal controls on the right. Lives in
 * the document flow so it can never overlap page content. Stays on one row
 * at phone width (themes move into the mobile menu) to keep the sticky
 * header short.
 */
export default function HUD() {
  const { state, hydrated, toggleMuted } = useGame();
  const play = useSound();

  const progress = levelProgress(state.xp);

  return (
    // Until the save file loads, render the same row invisibly so the
    // header keeps its final height (no layout shift on hydration) without
    // flashing default values.
    <div
      aria-label="Player HUD"
      aria-hidden={hydrated ? undefined : true}
      inert={hydrated ? undefined : true}
      className={clsx("border-t-2 border-border", !hydrated && "invisible")}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-x-4 px-4 py-1 sm:py-1.5">
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
            className="hidden h-2 w-24 border border-border bg-background sm:block"
          >
            <div
              className="h-full bg-accent motion-safe:transition-[width] motion-safe:duration-500"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <span className="hidden font-pixel text-[10px] text-muted sm:inline">
            ★ {state.achievements.length}/{ACHIEVEMENT_IDS.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ThemeButtons className="hidden sm:flex" />
          {/*
           * Name stays "Sound" while aria-pressed carries the state; the
           * visible ON/OFF word is for sighted users only.
           */}
          <button
            type="button"
            onClick={toggleMuted}
            aria-pressed={!state.muted}
            title={state.muted ? "Turn sound effects on" : "Turn sound effects off"}
            className={clsx(CONTROL, CONTROL_IDLE)}
          >
            {state.muted ? (
              <VolumeX aria-hidden className="h-3.5 w-3.5" />
            ) : (
              <Volume2 aria-hidden className="h-3.5 w-3.5" />
            )}
            <span>SOUND</span>
            <span aria-hidden>{state.muted ? "OFF" : "ON"}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              play("click");
              window.dispatchEvent(new CustomEvent(TERMINAL_TOGGLE_EVENT));
            }}
            title="Open terminal (Ctrl+`)"
            aria-label="Open terminal"
            aria-keyshortcuts="Control+`"
            className={clsx(
              CONTROL,
              "border-[color:var(--color-control)] text-muted hover:border-accent hover:text-accent focus-visible:border-accent focus-visible:text-accent",
            )}
          >
            <span aria-hidden>&gt;_</span>
            {/* Visible label so the terminal is findable without hovering. */}
            <span aria-hidden className="sm:hidden">
              TERM
            </span>
            <span aria-hidden className="hidden sm:inline">
              TERMINAL
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
