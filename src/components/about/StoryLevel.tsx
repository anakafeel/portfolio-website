"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { animate, createDrawable } from "animejs";

import SfxAnchor from "@/components/sfx/SfxAnchor";
import { STORY_BEATS, type StoryBeat } from "@/lib/about";
import { RESUME_URL } from "@/lib/site";
import { usePrefersReducedMotion } from "@/lib/three/sceneHooks";

/**
 * Vertical story level. SVG PCB trace draws itself as the user scrolls;
 * beat cards and the final "LEVEL CLEAR" block animate in once via
 * IntersectionObserver + anime.js. The server HTML has every beat visible,
 * and a revealed beat never hides again, so no facts depend on motion.
 */
export default function StoryLevel({
  beats = STORY_BEATS,
}: {
  beats?: StoryBeat[];
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

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

    // Hide only what is still below the fold; anything already on screen
    // stays put instead of flashing out and back in.
    const belowFold = (el: HTMLElement) =>
      el.getBoundingClientRect().top > window.innerHeight;
    beatEls.forEach((el) => {
      if (!belowFold(el)) return;
      el.style.opacity = "0";
      el.style.transform = "translateY(24px)";
    });
    if (clearEl && belowFold(clearEl)) {
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

    // Intersection Observer for beat reveals (one-way: reveal, then stop)
    const beatObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          beatObserver.unobserve(el);
          if (el.style.opacity !== "0") return;
          animate(el, {
            opacity: [0, 1],
            translateY: ["24px", "0px"],
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
            if (!entry.isIntersecting) return;
            clearObserver.unobserve(clearEl);
            if (clearEl.style.opacity !== "0") return;
            animate(clearEl, {
              opacity: [0, 1],
              scale: [0.9, 1],
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
  }, [prefersReducedMotion]);

  return (
    <div ref={rootRef} className="relative">
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
        {beats.map((beat) => (
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
            <ul className="mt-4 flex max-w-2xl flex-col gap-2">
              {beat.body.map((point) => (
                <li
                  key={point}
                  className="text-xl leading-relaxed text-muted"
                >
                  ▸ {point}
                </li>
              ))}
            </ul>
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
