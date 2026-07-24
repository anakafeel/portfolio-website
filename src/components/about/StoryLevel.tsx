"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { animate, createDrawable } from "animejs";

import SfxAnchor from "@/components/sfx/SfxAnchor";
import { STORY_BEATS } from "@/lib/about";
import { RESUME_URL } from "@/lib/site";

/**
 * Mobile-friendly vertical story level. SVG PCB trace draws itself
 * as the user scrolls; beat cards and the final "LEVEL CLEAR" overlay
 * animate in via IntersectionObserver + anime.js.
 */
export default function StoryLevel() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const tracePath = root.querySelector<SVGPathElement>(".level-trace");
    const playerDot = root.querySelector<HTMLElement>(".level-player");
    const beatEls = root.querySelectorAll<HTMLElement>(".level-beat");
    const clearEl = root.querySelector<HTMLElement>(".level-clear");

    if (prefersReducedMotion) {
      beatEls.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      if (clearEl) {
        clearEl.style.opacity = "1";
        clearEl.style.transform = "none";
      }
      return;
    }

    // Create SVG drawing via anime.js createDrawable
    const traceAnim = tracePath
      ? animate(createDrawable(".level-trace"), {
          draw: ["0 0", "1 1"],
          ease: "inOut(3)",
          duration: 1000,
          autoplay: false,
        })
      : null;

    // Initialize beats as hidden
    beatEls.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(24px)";
    });
    if (clearEl) {
      clearEl.style.opacity = "0";
      clearEl.style.transform = "scale(0.9)";
    }

    // Scroll-driven trace + player position
    const onScroll = () => {
      const rect = root.getBoundingClientRect();
      const scrollRange = root.offsetHeight - window.innerHeight;
      if (scrollRange <= 0) return;
      const progress = Math.max(0, Math.min(1, -rect.top / scrollRange));

      if (traceAnim) {
        traceAnim.currentTime = progress * 1000;
      }
      if (playerDot) {
        playerDot.style.top = `${progress * 100}%`;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Intersection Observer for beat reveals
    const beatObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          animate(el, {
            opacity: entry.isIntersecting ? [0, 1] : [1, 0],
            translateY: entry.isIntersecting ? ["24px", "0px"] : ["0px", "24px"],
            duration: 350,
            ease: "outQuad",
          });
        });
      },
      { threshold: 0.2 },
    );

    beatEls.forEach((beat) => beatObserver.observe(beat));

    // Intersection Observer for clear section
    if (clearEl) {
      const clearObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            animate(clearEl, {
              opacity: entry.isIntersecting ? [0, 1] : [1, 0],
              scale: entry.isIntersecting ? [0.9, 1] : [1, 0.9],
              duration: 400,
              ease: "outBack",
            });
          });
        },
        { threshold: 0.3 },
      );
      clearObserver.observe(clearEl);

      return () => {
        window.removeEventListener("scroll", onScroll);
        traceAnim?.cancel();
        beatObserver.disconnect();
        clearObserver.disconnect();
      };
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      traceAnim?.cancel();
      beatObserver.disconnect();
    };
  }, []);

  return (
    <div ref={rootRef} className="relative mt-16">
      {/* Level progress track: a PCB-trace path draws itself as you scroll. */}
      <svg
        aria-hidden
        viewBox="0 0 40 400"
        preserveAspectRatio="none"
        className="absolute bottom-4 left-0 top-4 hidden w-4 sm:block"
      >
        <path
          d="M20,0 L20,120 L8,140 L8,260 L20,280 L20,400"
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={2}
        />
        <path
          className="level-trace"
          d="M20,0 L20,120 L8,140 L8,260 L20,280 L20,400"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={2}
        />
      </svg>
      <span className="level-player absolute left-[6px] top-4 hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 bg-highlight sm:block [image-rendering:pixelated]" />

      <ol className="flex flex-col gap-24 sm:pl-14">
        {STORY_BEATS.map((beat) => (
          <li key={beat.world} className="level-beat">
            <div className="flex items-center gap-4">
              <Image
                src={beat.logo.src}
                alt={beat.logo.alt}
                width={48}
                height={48}
                unoptimized
                className="shrink-0 border-2 border-border bg-background object-contain p-1"
              />
              <div>
                <p className="font-pixel text-[10px] text-accent-alt">
                  {beat.world}
                </p>
                <h2 className="mt-2 font-pixel text-lg text-highlight">
                  {beat.title}
                </h2>
              </div>
            </div>
            <p className="mt-4 max-w-2xl text-xl leading-relaxed text-muted">
              {beat.body}
            </p>
          </li>
        ))}
      </ol>

      <div className="level-clear mt-24 text-center sm:pl-14">
        <p className="font-pixel text-sm text-accent">★ LEVEL CLEAR ★</p>
        <SfxAnchor
          href={RESUME_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="pixel-border pixel-border-interactive mt-6 inline-block bg-surface px-6 py-3 font-pixel text-xs text-foreground transition-colors hover:text-accent"
        >
          VIEW RESUME ►
        </SfxAnchor>
      </div>
    </div>
  );
}
