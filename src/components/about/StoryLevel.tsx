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

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const lenis = new Lenis({ autoRaf: false });
        const tick = (time: number) => lenis.raf(time * 1000);
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);

        // Progress track fills as the player scrolls through the level.
        gsap.from(".story-track-fill", {
          scaleY: 0,
          transformOrigin: "top",
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
            end: "bottom 75%",
            scrub: true,
          },
        });

        // The player sprite rides the track in chunky steps.
        gsap.to(".story-player", {
          top: "100%",
          ease: "steps(24)",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
            end: "bottom 75%",
            scrub: true,
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
      {/* Level progress track */}
      <div
        aria-hidden
        className="absolute bottom-4 left-[7px] top-4 hidden w-1 bg-border sm:block"
      >
        <div className="story-track-fill h-full w-full bg-accent" />
        <span className="story-player absolute -left-[6px] top-0 block h-4 w-4 -translate-y-1/2 bg-highlight [image-rendering:pixelated]" />
      </div>

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
