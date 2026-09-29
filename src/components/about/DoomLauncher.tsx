"use client";

import { useEffect, useRef, useState } from "react";

import { useDoomControls } from "@/components/about/AboutClientWrapper";
import { useSound } from "@/components/game/useSound";
import { usePrefersReducedMotion } from "@/lib/three/sceneHooks";

type Support = "pending" | "ok" | "unsupported";

/**
 * "▶ PLAY THE BACKSTORY": opt-in entry to the DOOM corridor. The corridor
 * needs CSS scroll-driven animations and a lot of motion, so browsers
 * without `animation-timeline` (Firefox, older Safari) and reduced-motion
 * users get a one-line explanation instead of the button. Desktop only.
 */
export default function DoomLauncher() {
  const { phase, open } = useDoomControls();
  const reducedMotion = usePrefersReducedMotion();
  const [support, setSupport] = useState<Support>("pending");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const play = useSound();

  useEffect(() => {
    setSupport(
      typeof CSS !== "undefined" && CSS.supports("animation-timeline: scroll()")
        ? "ok"
        : "unsupported",
    );
  }, []);

  let note: string | null = null;
  if (reducedMotion) {
    note = "Backstory mini-game is off: your system asks for reduced motion.";
  } else if (support === "unsupported") {
    note =
      "Backstory mini-game needs CSS scroll-driven animations (Chrome or Edge).";
  }

  return (
    <div className="hidden min-h-[44px] items-center sm:flex">
      {note ? (
        <p className="max-w-xs font-pixel text-[10px] leading-relaxed text-muted">
          {note} Everything it shows is on this page.
        </p>
      ) : (
        <button
          ref={buttonRef}
          type="button"
          disabled={support === "pending" || phase !== "closed"}
          aria-haspopup="dialog"
          onClick={() => {
            play("click");
            open(buttonRef.current);
          }}
          className="pixel-border pixel-border-interactive bg-background px-5 py-3 font-pixel text-xs text-muted transition-colors hover:text-accent disabled:opacity-60"
        >
          ▶ PLAY THE BACKSTORY
        </button>
      )}
    </div>
  );
}
