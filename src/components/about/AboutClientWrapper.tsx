"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";

// Only fetched when someone actually presses play: keeps the Doom CSS and
// sprites off a normal /about visit.
const DoomScrollEffect = dynamic(
  () => import("@/components/about/DoomScrollEffect"),
  { ssr: false },
);

type Phase = "closed" | "playing" | "exiting";

interface DoomControls {
  phase: Phase;
  open: (trigger: HTMLElement | null) => void;
}

const DoomContext = createContext<DoomControls | null>(null);

export function useDoomControls(): DoomControls {
  const ctx = useContext(DoomContext);
  if (!ctx) throw new Error("useDoomControls must be used inside AboutClientWrapper");
  return ctx;
}

/** Slide-up duration of `.doom-cleared` in DoomScrollEffect's CSS. */
const EXIT_MS = 1400;

/**
 * /about shell. The page content (server-rendered `children`) is always in
 * the HTML; the DOOM corridor is an opt-in overlay that hides the content
 * only while it is being played, and hands focus back to its launcher.
 */
export default function AboutClientWrapper({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>("closed");
  const triggerRef = useRef<HTMLElement | null>(null);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const open = useCallback((trigger: HTMLElement | null) => {
    triggerRef.current = trigger;
    // The corridor is driven by document scroll, so it starts at the top.
    window.scrollTo({ top: 0, behavior: "instant" });
    setPhase("playing");
  }, []);

  const close = useCallback(() => {
    clearTimeout(exitTimer.current);
    setPhase("closed");
  }, []);

  const handleCleared = useCallback(() => {
    // Victory overlay still covers everything: jump to the top, reveal the
    // content behind the overlay, then let the overlay slide away.
    window.scrollTo({ top: 0, behavior: "instant" });
    setPhase("exiting");
    exitTimer.current = setTimeout(() => setPhase("closed"), EXIT_MS);
  }, []);

  // Restore scroll + focus to the launcher once the overlay is gone.
  const wasOpen = useRef(false);
  useEffect(() => {
    if (phase !== "closed") {
      wasOpen.current = true;
      return;
    }
    if (!wasOpen.current) return;
    wasOpen.current = false;
    window.scrollTo({ top: 0, behavior: "instant" });
    triggerRef.current?.focus({ preventScroll: true });
  }, [phase]);

  useEffect(() => () => clearTimeout(exitTimer.current), []);

  return (
    <DoomContext.Provider value={{ phase, open }}>
      <div hidden={phase === "playing"}>{children}</div>
      {phase !== "closed" && (
        <DoomScrollEffect
          onCleared={handleCleared}
          onClose={close}
          cleared={phase === "exiting"}
        />
      )}
    </DoomContext.Provider>
  );
}
