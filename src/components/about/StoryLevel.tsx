"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";

import SfxAnchor from "@/components/sfx/SfxAnchor";
import { STORY_BEATS } from "@/lib/about";
import { RESUME_URL } from "@/lib/site";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function StoryLevel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackTraceRef = useRef<SVGPathElement>(null);
  const trackPlayerRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const lenis = new Lenis({ autoRaf: false });
        const tick = (time: number) => lenis.raf(time * 1000);
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);

        // Trace-line progress: draws itself as the player scrolls through
        // the level, same stroke-dashoffset technique as the desktop
        // circuit-scroll sequence.
        const trace = trackTraceRef.current;
        const traceLength = trace?.getTotalLength() ?? 0;
        if (trace && traceLength > 0) {
          trace.style.strokeDasharray = `${traceLength}`;
          trace.style.strokeDashoffset = `${traceLength}`;
        }

        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top 60%",
          end: "bottom 75%",
          scrub: true,
          onUpdate: (self) => {
            if (trace && traceLength > 0) {
              trace.style.strokeDashoffset = `${traceLength * (1 - self.progress)}`;
            }
            if (trackPlayerRef.current) {
              trackPlayerRef.current.style.top = `${self.progress * 100}%`;
            }
          },
        });

        gsap.utils.toArray<HTMLElement>(".story-beat").forEach((beat) => {
          gsap.from(beat, {
            autoAlpha: 0,
            y: 48,
            duration: 0.5,
            ease: "steps(6)",
            scrollTrigger: {
              trigger: beat,
              start: "top 78%",
              toggleActions: "play none none reverse",
            },
          });
        });

        gsap.from(".story-clear", {
          autoAlpha: 0,
          scale: 0.6,
          duration: 0.6,
          ease: "steps(5)",
          scrollTrigger: {
            trigger: ".story-clear",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });

        return () => {
          gsap.ticker.remove(tick);
          lenis.destroy();
        };
      });
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className="relative mt-16">
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
          ref={trackTraceRef}
          d="M20,0 L20,120 L8,140 L8,260 L20,280 L20,400"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={2}
        />
      </svg>
      <span
        ref={trackPlayerRef}
        aria-hidden
        className="story-player absolute left-[6px] top-4 hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 bg-highlight sm:block [image-rendering:pixelated]"
      />

      <ol className="flex flex-col gap-24 sm:pl-14">
        {STORY_BEATS.map((beat) => (
          <li key={beat.world} className="story-beat">
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

      <div className="story-clear mt-24 text-center sm:pl-14">
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
