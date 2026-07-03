"use client";

import { useCallback, useEffect, useState } from "react";

import { useGame } from "@/components/game/GameProvider";
import { playSfx } from "@/lib/audio/sfx";
import type { TerminalData } from "@/lib/terminal/commands";
import Terminal from "./Terminal";

/**
 * Owns the terminal's open/closed state: renders the launcher button,
 * listens for Ctrl+` / Escape, and awards SECRET CONSOLE on first open.
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
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.code === "Backquote") {
        e.preventDefault();
        if (open) {
          setOpen(false);
        } else {
          openTerminal();
        }
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, openTerminal]);

  if (!hydrated) {
    return null;
  }

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={openTerminal}
          title="Open terminal (Ctrl+`)"
          aria-label="Open terminal"
          className="pixel-border fixed bottom-4 left-4 z-[60] bg-surface px-2.5 py-2 font-pixel text-[10px] text-muted transition-colors hover:text-accent"
        >
          &gt;_
        </button>
      )}
      {open && (
        <>
          <div
            aria-hidden
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[80] bg-background/70"
          />
          <Terminal data={data} onClose={() => setOpen(false)} />
        </>
      )}
    </>
  );
}
