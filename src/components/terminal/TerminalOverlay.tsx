"use client";

import { useCallback, useEffect, useState } from "react";

import { useGame } from "@/components/game/GameProvider";
import { playSfx } from "@/lib/audio/sfx";
import type { TerminalData } from "@/lib/terminal/commands";
import { TERMINAL_TOGGLE_EVENT } from "@/lib/terminal/events";
import Terminal from "./Terminal";

/**
 * Owns the terminal's open/closed state. Opens via the HUD button (custom
 * window event) or Ctrl+`, closes on Escape, and awards SECRET CONSOLE on
 * first open.
 */
export default function TerminalOverlay({ data }: { data: TerminalData }) {
  const [open, setOpen] = useState(false);
  const { state, award, hydrated } = useGame();

  const openTerminal = useCallback(() => {
    setOpen(true);
    // First discovery triggers the achievement fanfare instead; only play
    // the open jingle once SECRET CONSOLE is already unlocked.
    if (!state.muted && state.achievements.includes("found_terminal")) {
      playSfx("terminal", state.volume);
    }
    award("found_terminal");
  }, [award, state.muted, state.volume, state.achievements]);

  useEffect(() => {
    const toggle = () => {
      if (open) {
        setOpen(false);
      } else {
        openTerminal();
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.code === "Backquote") {
        e.preventDefault();
        toggle();
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener(TERMINAL_TOGGLE_EVENT, toggle);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener(TERMINAL_TOGGLE_EVENT, toggle);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, openTerminal]);

  if (!hydrated || !open) {
    return null;
  }

  return (
    <>
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className="fixed inset-0 z-[80] bg-background/70"
      />
      <Terminal data={data} onClose={() => setOpen(false)} />
    </>
  );
}
