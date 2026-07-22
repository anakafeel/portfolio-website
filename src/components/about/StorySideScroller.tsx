// src/components/about/StorySideScroller.tsx
"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import SfxAnchor from "@/components/sfx/SfxAnchor";
import { STORY_BEATS } from "@/lib/about";
import { RESUME_URL } from "@/lib/site";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CircuitScene = dynamic(() => import("@/components/about/CircuitScene"), {
  ssr: false,
});

/**
 * One reveal fraction per STORY_BEATS entry (0-1 along the pinned scroll
 * range), hand-authored to roughly match each camera waypoint in
 * CircuitScene's WAYPOINTS array. Decoupled from the 3D curve's own
 * arc-length parameterization on purpose — exact frame-perfect sync isn't
 * needed, just a close visual match.
 */
const BEAT_FRACTIONS = [0.08, 0.36, 0.64, 0.86];
const CLEAR_FRACTION = 0.95;
/** How long each beat + its scan line stays visible before the next one takes over. */
const REVEAL_WINDOW = 0.16;
/**
 * SVG-space [x, y] for each trace marker — must match the trace path's own
 * `d` coordinates below exactly: (20,100), (140,40), (260,160), (380,100).
 */
const TRACE_MARKER_POINTS: [number, number][] = [
  [20, 100],
  [140, 40],
  [260, 160],
  [380, 100],
];

/**
 * Pinned circuit-board inspection sequence: vertical scroll drives a
 * camera dolly through a CC0 low-poly circuit board (CircuitScene) while a
 * diagnostic probe rides along, parented to the camera. Mount only on
 * desktop with motion + WebGL available — StoryStage handles that gate
 * and the vertical fallback.
 */
export default function StorySideScroller() {
  const stageRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const traceRef = useRef<SVGPathElement>(null);

  useGSAP(
    () => {
      const stage = stageRef.current;
      const trace = traceRef.current;
      if (!stage) return;

      const traceLength = trace?.getTotalLength() ?? 0;
      if (trace && traceLength > 0) {
        trace.style.strokeDasharray = `${traceLength}`;
        trace.style.strokeDashoffset = `${traceLength}`;
      }

      ScrollTrigger.create({
        trigger: stage,
        start: "top top",
        end: "+=400%",
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          progressRef.current = self.progress;
          if (trace && traceLength > 0) {
            trace.style.strokeDashoffset = `${traceLength * (1 - self.progress)}`;
          }
        },
      });

      // Reveal each story-beat card + scan line inside its fraction window,
      // and the final "LEVEL CLEAR" card near the end. Each ScrollTrigger
      // only starts a new tween when `inWindow` actually flips, not on
      // every scrub tick, to avoid spawning redundant tweens continuously
      // while the user scrolls.
      gsap.utils.toArray<HTMLElement>(".scroller-beat").forEach((beat, i) => {
        const at = BEAT_FRACTIONS[i];
        gsap.set(beat, { autoAlpha: 0, y: 24 });
        let wasInWindow = false;
        ScrollTrigger.create({
          trigger: stage,
          start: "top top",
          end: "+=400%",
          scrub: true,
          onUpdate: (self) => {
            const inWindow =
              self.progress >= at && self.progress < at + REVEAL_WINDOW;
            if (inWindow === wasInWindow) return;
            wasInWindow = inWindow;
            gsap.to(beat, {
              autoAlpha: inWindow ? 1 : 0,
              y: inWindow ? 0 : 24,
              duration: 0.08,
              ease: "steps(4)",
              overwrite: "auto",
            });
          },
        });
      });

      const clear = stage.querySelector<HTMLElement>(".scroller-clear");
      if (clear) {
        gsap.set(clear, { autoAlpha: 0, scale: 0.5 });
        let clearWasVisible = false;
        ScrollTrigger.create({
          trigger: stage,
          start: "top top",
          end: "+=400%",
          scrub: true,
          onUpdate: (self) => {
            const inWindow = self.progress >= CLEAR_FRACTION;
            if (inWindow === clearWasVisible) return;
            clearWasVisible = inWindow;
            gsap.to(clear, {
              autoAlpha: inWindow ? 1 : 0,
              scale: inWindow ? 1 : 0.5,
              duration: 0.06,
              ease: "steps(4)",
              overwrite: "auto",
            });
          },
        });
      }
    },
    { scope: stageRef },
  );

  return (
    <div
      ref={stageRef}
      className="relative mt-16 h-[85vh] overflow-hidden border-y-2 border-border bg-background"
    >
      <CircuitScene progressRef={progressRef} />

      {/* Trace-line overlay: draws itself as the probe advances. */}
      <svg
        aria-hidden
        viewBox="0 0 400 200"
        className="pointer-events-none absolute inset-x-6 top-6 h-24 w-[calc(100%-3rem)] opacity-80"
      >
        <path
          ref={traceRef}
          d="M20,100 L140,40 L260,160 L380,100"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={2}
        />
        {/* One marker per STORY_BEATS entry — coordinates match the path's own points above exactly (20,100), (140,40), (260,160), (380,100). */}
        {TRACE_MARKER_POINTS.map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={5} fill="var(--color-highlight)" />
        ))}
      </svg>

      {STORY_BEATS.map((beat) => (
        <article
          key={beat.world}
          className="scroller-beat pixel-border invisible absolute bottom-6 left-6 max-w-md bg-surface p-6"
        >
          <p className="font-pixel text-[8px] uppercase tracking-[0.15em] text-accent-alt motion-safe:animate-blink">
            {"> "}SCANNING: {beat.title.replace(/\s+/g, "_")}...
          </p>
          <h3 className="mt-3 font-pixel text-sm text-highlight">
            {beat.world} — {beat.title}
          </h3>
          <p className="mt-4 text-lg leading-snug text-muted">{beat.body}</p>
        </article>
      ))}

      <div className="scroller-clear invisible absolute inset-0 flex flex-col items-center justify-center gap-6 text-center">
        <p className="font-pixel text-lg text-white">★ SCAN COMPLETE ★</p>
        <p className="font-pixel text-[10px] text-muted">
          THE FULL SAVE FILE FITS ON ONE PAGE
        </p>
        <SfxAnchor
          href={RESUME_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="pixel-border pixel-border-interactive bg-surface px-6 py-3 font-pixel text-xs text-foreground transition-colors hover:text-accent"
        >
          VIEW RESUME ►
        </SfxAnchor>
      </div>
    </div>
  );
}
