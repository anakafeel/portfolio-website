"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useGame } from "@/components/game/GameProvider";
import { playSfx } from "@/lib/audio/sfx";
import type { TerminalData } from "@/lib/terminal/commands";
import { TERMINAL_TOGGLE_EVENT } from "@/lib/terminal/events";
import Terminal from "./Terminal";

/** Matches the crt-off animation duration in globals.css. */
const CRT_OFF_MS = 240;

/**
 * Owns the terminal's open/closed state. Opens via the HUD button (custom
 * window event) or Ctrl+`, closes on Escape, and awards SECRET CONSOLE on
 * first open. Closing plays the power-on sequence in reverse (crt-off +
 * descending jingle) before unmounting.
 */
export default function TerminalOverlay({ data }: { data: TerminalData }) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const closeTimer = useRef(0);
  const { state, award, hydrated } = useGame();

  const openTerminal = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    setClosing(false);
    setOpen(true);
    // First discovery triggers the achievement fanfare instead; only play
    // the open jingle once SECRET CONSOLE is already unlocked.
    if (!state.muted && state.achievements.includes("found_terminal")) {
      playSfx("terminal", state.volume);
    }
    award("found_terminal");
  }, [award, state.muted, state.volume, state.achievements]);

  const closeTerminal = useCallback(() => {
    if (!open || closing) {
      return;
    }
    if (!state.muted) {
      playSfx("terminal_off", state.volume);
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOpen(false);
      return;
    }
    setClosing(true);
    closeTimer.current = window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, CRT_OFF_MS);
  }, [open, closing, state.muted, state.volume]);

  useEffect(() => {
    const toggle = () => {
      if (open) {
        closeTerminal();
      } else {
        openTerminal();
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.code === "Backquote") {
        e.preventDefault();
        toggle();
      } else if (e.key === "Escape") {
        closeTerminal();
      }
    };
    window.addEventListener(TERMINAL_TOGGLE_EVENT, toggle);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener(TERMINAL_TOGGLE_EVENT, toggle);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, openTerminal, closeTerminal]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  if (!hydrated || !open) {
    return null;
  }

  return (
    <>
      <div
        aria-hidden
        onClick={closeTerminal}
        className={`fixed inset-0 z-[80] bg-background/70 transition-opacity duration-200 ${
          closing ? "opacity-0" : "opacity-100"
        }`}
      />
      <Terminal data={data} onClose={closeTerminal} closing={closing} />
    </>
  );
}
