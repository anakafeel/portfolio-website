"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { animate, createDrawable, stagger } from "animejs";

import SfxAnchor from "@/components/sfx/SfxAnchor";
import { STORY_BEATS } from "@/lib/about";
import { RESUME_URL } from "@/lib/site";
import { usePrefersReducedMotion } from "@/lib/three/sceneHooks";

/**
 * Each beat gets a unique SVG circuit-trace pattern that draws itself
 * as the user scrolls into that section. The traces are decorative —
 * they evoke PCB routing / signal paths without needing to be literal.
 */
const CIRCUIT_PATHS = [
  // Beat 0 — SPAWN POINT: branching traces from a central node (CPU socket)
  "M20,100 L80,100 L80,60 L140,60 M80,100 L80,140 L140,140 M140,60 L200,60 L200,40 M140,140 L200,140 L200,160 M200,60 L260,60 M200,140 L260,140 M260,60 L320,60 L320,100 M260,140 L320,140 L320,100",
  // Beat 1 — SKILL TREE: parallel bus lines with branches (RAM slots)
  "M40,80 L120,80 L120,50 L200,50 M40,100 L120,100 L200,100 M40,120 L120,120 L120,150 L200,150 M200,50 L280,50 L280,80 L360,80 M200,100 L280,100 L360,100 M200,150 L280,150 L280,120 L360,120",
  // Beat 2 — SIDE QUESTS: complex routing with vias (GPU card)
  "M30,100 L60,100 L60,60 L120,60 L120,40 L180,40 M60,100 L60,140 L120,140 L120,160 L180,160 M120,60 L120,100 M120,140 L120,100 M180,40 L240,40 L240,70 L300,70 M180,160 L240,160 L240,130 L300,130 M240,70 L240,130 M300,70 L370,70 L370,100 M300,130 L370,130 L370,100",
  // Beat 3 — CURRENT QUEST: full system interconnect (complete build)
  "M20,50 L60,50 L60,30 L120,30 L120,50 L160,50 M20,100 L60,100 L120,100 L160,100 M20,150 L60,150 L60,170 L120,170 L120,150 L160,150 M160,50 L200,50 L200,30 L260,30 L260,50 L300,50 M160,100 L200,100 L260,100 L300,100 M160,150 L200,150 L200,170 L260,170 L260,150 L300,150 M300,50 L350,50 L350,100 M300,150 L350,150 L350,100",
];

/** Scroll fraction where each beat becomes fully visible */
const BEAT_THRESHOLD = [0.05, 0.3, 0.55, 0.8];
const CLEAR_THRESHOLD = 0.92;

const TRACE_DURATION = 800;
const TRACE_STAGGER = 200;
const TOTAL_TRACE_DURATION =
  TRACE_DURATION + (CIRCUIT_PATHS.length - 1) * TRACE_STAGGER;

/**
 * Scroll-driven storytelling sequence. A tall scrollable container with a
 * sticky viewport. SVG circuit traces draw themselves via anime.js
 * createDrawable (scrubbed manually via tick), story beats reveal with
 * staggered text, company logos pop up alongside each card, and a final
 * "SCAN COMPLETE" overlay appears at the end.
 */
export default function StorySideScroller() {
  const rootRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const beatEls = root.querySelectorAll<HTMLElement>(".story-beat");
    const logoEls = root.querySelectorAll<HTMLElement>(".story-logo");
    const partLabels = root.querySelectorAll<HTMLElement>(".part-label");
    const clearOverlay = root.querySelector<HTMLElement>(".clear-overlay");

    if (prefersReducedMotion) {
      beatEls.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      logoEls.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      partLabels.forEach((el) => {
        el.style.opacity = "1";
      });
      if (clearOverlay) {
        clearOverlay.style.opacity = "1";
        clearOverlay.style.transform = "none";
      }
      return;
    }

    // Create SVG drawing via anime.js createDrawable — no manual strokeDashoffset
    const traceAnim = animate(createDrawable(".circuit-path"), {
      draw: ["0 0", "1 1"],
      delay: stagger(TRACE_STAGGER),
      ease: "inOut(3)",
      duration: TRACE_DURATION,
      autoplay: false,
    });

    const beatVisible = new Array(STORY_BEATS.length).fill(false);
    let clearVisible = false;

    const onScroll = () => {
      const rect = root.getBoundingClientRect();
      const scrollRange = root.offsetHeight - window.innerHeight;
      if (scrollRange <= 0) return;
      const progress = Math.max(0, Math.min(1, -rect.top / scrollRange));

      // Scrub SVG drawing to scroll progress
      traceAnim.currentTime = progress * TOTAL_TRACE_DURATION;

      // Beat reveals
      BEAT_THRESHOLD.forEach((threshold, i) => {
        const visible = progress >= threshold;
        if (visible !== beatVisible[i]) {
          beatVisible[i] = visible;
          const beat = beatEls[i];
          const logo = logoEls[i];
          const label = partLabels[i];
          if (beat) {
            animate(beat, {
              opacity: visible ? [0, 1] : [1, 0],
              translateY: visible ? ["24px", "0px"] : ["0px", "24px"],
              duration: 350,
              ease: "outQuad",
            });
          }
          if (logo) {
            animate(logo, {
              opacity: visible ? [0, 1] : [1, 0],
              scale: visible ? [0.5, 1] : [1, 0.5],
              duration: 350,
              ease: "outBack",
            });
          }
          if (label) {
            animate(label, {
              opacity: visible ? [0, 1] : [1, 0],
              duration: 200,
              ease: "outQuad",
            });
          }
        }
      });

      // Clear overlay
      const shouldShowClear = progress >= CLEAR_THRESHOLD;
      if (shouldShowClear !== clearVisible) {
        clearVisible = shouldShowClear;
        if (clearOverlay) {
          animate(clearOverlay, {
            opacity: shouldShowClear ? [0, 1] : [1, 0],
            scale: shouldShowClear ? [0.9, 1] : [1, 0.9],
            duration: 400,
            ease: "outBack",
          });
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      traceAnim.cancel();
    };
  }, [prefersReducedMotion]);

  return (
    <div ref={rootRef} className="relative h-[500vh]">
      {/* Sticky viewport — stays fixed while user scrolls */}
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden border-y-2 border-border bg-background">
        {/* SVG circuit traces — one per beat, drawn on scroll */}
        <svg
          aria-hidden
          viewBox="0 0 400 200"
          preserveAspectRatio="xMidYMid meet"
          className="pointer-events-none absolute inset-0 h-full w-full opacity-30"
        >
          {CIRCUIT_PATHS.map((d, i) => (
            <path
              key={i}
              className="circuit-path"
              d={d}
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
          {/* Junction dots at path endpoints */}
          {[
            [20, 100],
            [140, 60],
            [140, 140],
            [260, 60],
            [260, 140],
            [370, 100],
          ].map(([cx, cy]) => (
            <circle
              key={`${cx}-${cy}`}
              cx={cx}
              cy={cy}
              r={3}
              fill="var(--color-highlight)"
            />
          ))}
        </svg>

        {/* Part-readout labels — appear at the top-right */}
        {STORY_BEATS.map((beat, i) => (
          <p
            key={`label-${i}`}
            className="part-label pointer-events-none absolute right-6 top-8 font-pixel text-[10px] uppercase tracking-[0.15em] text-accent-alt sm:right-12 sm:top-12"
            style={{ opacity: 0 }}
          >
            {"> "}TARGET: {beat.title.replace(/\s+/g, "_")}
          </p>
        ))}

        {/* Story beat cards — centered in viewport */}
        <div className="absolute bottom-12 left-1/2 z-10 w-full max-w-2xl -translate-x-1/2 px-6 sm:bottom-16 sm:px-12">
          {STORY_BEATS.map((beat) => (
            <article
              key={beat.world}
              className="story-beat pixel-border absolute bottom-0 left-0 w-full bg-surface px-6 py-5 sm:px-8 sm:py-6"
              style={{ opacity: 0, transform: "translateY(24px)" }}
            >
              {/* Company logo badge — pops up alongside card on scroll */}
              <div
                className="story-logo absolute -top-6 right-6 sm:-top-8 sm:right-8"
                style={{ opacity: 0, transform: "scale(0.5)" }}
              >
                <Image
                  src={beat.logo.src}
                  alt={beat.logo.alt}
                  width={48}
                  height={48}
                  unoptimized
                  className="border-2 border-border bg-background object-contain p-1 [image-rendering:pixelated]"
                />
              </div>
              <p className="font-pixel text-[10px] uppercase tracking-[0.15em] text-accent-alt motion-safe:animate-blink">
                {"> "}SCANNING: {beat.title.replace(/\s+/g, "_")}...
              </p>
              <h3 className="mt-3 font-pixel text-sm text-highlight sm:text-base">
                {beat.world} — {beat.title}
              </h3>
              <p className="mt-3 text-lg leading-relaxed text-muted sm:text-xl">
                {beat.body}
              </p>
            </article>
          ))}
        </div>

        {/* Clear overlay */}
        <div
          className="clear-overlay absolute inset-0 z-20 flex flex-col items-center justify-center gap-6 text-center"
          style={{ opacity: 0, transform: "scale(0.9)" }}
        >
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
    </div>
  );
}
