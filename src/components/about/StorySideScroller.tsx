"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import PlayerSprite from "@/components/about/PlayerSprite";
import SfxAnchor from "@/components/sfx/SfxAnchor";
import { STORY_BEATS } from "@/lib/about";
import { RESUME_URL } from "@/lib/site";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** How long the sprite keeps walking after the last scroll tick. */
const IDLE_DELAY_MS = 150;

/**
 * The level has its own fixed daytime-platformer palette on purpose: it
 * reads as a bright stage inside the dark site, whatever the active theme.
 */
const LEVEL = {
  skyTop: "#5c94fc",
  skyBottom: "#9cd0ff",
  hillFar: "#6fc25a",
  hillMid: "#3fa04a",
  grass: "#48b04c",
  dirt: "#a0622d",
  dirtSeam: "#7c4a1e",
  pole: "#7c4a1e",
  flag: "#e23b3b",
  ink: "#16327c",
  outline: "#1a2a5a",
};

/**
 * Pinned side-scrolling level: vertical scroll drives the track horizontally
 * while the player sprite walks in place. Mount only on desktop with motion
 * allowed — StoryStage handles that gate and the vertical fallback.
 */
export default function StorySideScroller() {
  const stageRef = useRef<HTMLDivElement>(null);
  const spriteRef = useRef<HTMLDivElement>(null);
  const idleTimer = useRef<number>(0);

  useGSAP(
    () => {
      const stage = stageRef.current;
      const track = stage?.querySelector<HTMLElement>(".level-track");
      if (!stage || !track) return;

      const distance = () => track.scrollWidth - window.innerWidth;

      const setWalking = (walking: boolean) => {
        spriteRef.current?.classList.toggle("is-walking", walking);
      };

      // One scrubbed timeline owns the whole level so track + parallax +
      // checkpoint reveals stay in lockstep with scroll.
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setWalking(Math.abs(self.getVelocity()) > 20);
            window.clearTimeout(idleTimer.current);
            idleTimer.current = window.setTimeout(
              () => setWalking(false),
              IDLE_DELAY_MS,
            );
          },
        },
      });

      // duration: 1 so the track moves across the entire pin range and the
      // reveals below can address positions as fractions of it.
      tl.to(track, { x: () => -distance(), duration: 1 }, 0)
        .to(".parallax-far", { x: () => -distance() * 0.15, duration: 1 }, 0)
        .to(".parallax-mid", { x: () => -distance() * 0.4, duration: 1 }, 0);

      // Reveal each checkpoint card when its left edge crosses ~80% of the
      // viewport, then dismiss it once its right edge nears the left screen
      // edge — both derived from the card's real offset along the track.
      const trackLeft = track.getBoundingClientRect().left;
      gsap.utils.toArray<HTMLElement>(".scroller-beat").forEach((beat) => {
        const rect = beat.getBoundingClientRect();
        const beatLeft = rect.left - trackLeft;
        const at = gsap.utils.clamp(
          0,
          0.92,
          (beatLeft - window.innerWidth * 0.8) / distance(),
        );
        tl.from(
          beat,
          { autoAlpha: 0, y: 40, duration: 0.08, ease: "steps(4)" },
          at,
        );
        const out = gsap.utils.clamp(
          at + 0.1,
          0.96,
          (beatLeft + rect.width - window.innerWidth * 0.12) / distance(),
        );
        tl.to(
          beat,
          { autoAlpha: 0, y: -32, duration: 0.05, ease: "steps(3)" },
          out,
        );
      });

      const clear = stage.querySelector<HTMLElement>(".scroller-clear");
      if (clear) {
        const clearAt = gsap.utils.clamp(
          0,
          0.94,
          (clear.getBoundingClientRect().left -
            trackLeft -
            window.innerWidth * 0.85) /
            distance(),
        );
        tl.from(
          clear,
          { autoAlpha: 0, scale: 0.5, duration: 0.06, ease: "steps(4)" },
          clearAt,
        );
      }

      return () => window.clearTimeout(idleTimer.current);
    },
    { scope: stageRef },
  );

  return (
    <div className="ml-[calc(50%-50vw)] mt-16 w-screen">
      <div
        ref={stageRef}
        className="relative h-[85vh] overflow-hidden border-y-4"
        style={{
          borderColor: LEVEL.outline,
          background: `linear-gradient(to bottom, ${LEVEL.skyTop} 0%, ${LEVEL.skyBottom} 100%)`,
        }}
      >
        {/* Pixel sun, fixed in the sky. */}
        <span
          aria-hidden
          className="absolute right-[8%] top-[10%] h-12 w-12"
          style={{
            background: "#ffd400",
            boxShadow: "0 0 0 6px #ffdf4d, 0 0 0 12px rgba(255, 223, 77, 0.35)",
          }}
        />

        {/* Parallax backdrop: far hill range + mid clouds and bushes. */}
        <div
          aria-hidden
          className="parallax-far absolute bottom-16 left-0 h-[45%] w-[220vw]"
          style={{
            background: LEVEL.hillFar,
            clipPath:
              "polygon(0 100%, 0 60%, 6% 45%, 12% 45%, 18% 62%, 25% 30%, 31% 30%, 38% 58%, 46% 42%, 52% 42%, 58% 65%, 66% 25%, 72% 25%, 80% 55%, 87% 40%, 93% 40%, 100% 62%, 100% 100%)",
          }}
        />
        <div aria-hidden className="parallax-mid absolute inset-x-0 bottom-16 left-0 top-0 w-[260vw]">
          {[10, 32, 55, 78].map((left) => (
            <span
              key={`cloud-${left}`}
              className="absolute top-[14%] h-6 w-24 bg-white"
              style={{
                left: `${left}%`,
                boxShadow: "14px -10px 0 0 #fff, -14px 8px 0 0 #fff",
                opacity: 0.95,
              }}
            />
          ))}
          {[18, 44, 68, 90].map((left) => (
            <span
              key={`bush-${left}`}
              className="absolute bottom-0 h-8 w-28"
              style={{
                left: `${left}%`,
                background: LEVEL.hillMid,
                boxShadow: `18px 8px 0 0 ${LEVEL.hillMid}, -16px 10px 0 0 ${LEVEL.hillMid}`,
              }}
            />
          ))}
        </div>

        {/* The level track: panels slide left as the user scrolls down. */}
        <div className="level-track relative flex h-full w-max items-end">
          {/* Ground: grass lip over brick dirt, spanning the whole track. */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-16"
            style={{
              background: `repeating-linear-gradient(90deg, ${LEVEL.dirt} 0px, ${LEVEL.dirt} 30px, ${LEVEL.dirtSeam} 30px, ${LEVEL.dirtSeam} 32px)`,
              borderTop: `10px solid ${LEVEL.grass}`,
              boxShadow: `inset 0 4px 0 0 ${LEVEL.outline}`,
            }}
          />

          <div className="flex w-[70vw] shrink-0 items-center self-stretch pl-[10vw]">
            <div>
              <p
                className="font-pixel text-[10px]"
                style={{ color: LEVEL.ink }}
              >
                WORLD 1 — SAIM&apos;S STORY
              </p>
              <h2
                className="mt-3 font-pixel text-lg text-white"
                style={{ textShadow: `3px 3px 0 ${LEVEL.outline}` }}
              >
                CHARACTER SELECT
              </h2>
              <p
                className="mt-4 max-w-md text-xl"
                style={{ color: LEVEL.ink }}
              >
                Keep scrolling — the level scrolls sideways from here. ►
              </p>
            </div>
          </div>

          {STORY_BEATS.map((beat) => (
            <div
              key={beat.world}
              className="flex w-[65vw] shrink-0 items-end gap-6 self-stretch pb-24"
            >
              {/* Checkpoint signpost */}
              <div
                aria-hidden
                className="relative ml-[6vw] h-32 w-4 shrink-0"
                style={{ background: LEVEL.pole }}
              >
                <span
                  className="absolute -top-1 left-4 h-10 w-14"
                  style={{
                    background: LEVEL.flag,
                    clipPath: "polygon(0 0, 100% 50%, 0 100%)",
                  }}
                />
              </div>
              <article className="scroller-beat pixel-border max-w-md bg-surface p-6">
                <div className="flex items-center gap-4">
                  <Image
                    src={beat.logo.src}
                    alt={beat.logo.alt}
                    width={48}
                    height={48}
                    unoptimized
                    className="pixelated shrink-0 border-2 border-border"
                  />
                  <div>
                    <p className="font-pixel text-[10px] text-accent-alt">
                      {beat.world}
                    </p>
                    <h3 className="mt-2 font-pixel text-sm text-highlight">
                      {beat.title}
                    </h3>
                  </div>
                </div>
                <p className="mt-4 text-lg leading-snug text-muted">
                  {beat.body}
                </p>
              </article>
            </div>
          ))}

          <div className="flex w-[60vw] shrink-0 items-center justify-center self-stretch">
            <div className="scroller-clear pb-24 text-center">
              <p
                className="font-pixel text-lg text-white"
                style={{ textShadow: `3px 3px 0 ${LEVEL.outline}` }}
              >
                ★ LEVEL CLEAR ★
              </p>
              <p
                className="mt-4 font-pixel text-[10px]"
                style={{ color: LEVEL.ink }}
              >
                THE FULL SAVE FILE FITS ON ONE PAGE
              </p>
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
        </div>

        {/* Player sprite: stays put while the world moves past. */}
        <div
          ref={spriteRef}
          aria-hidden
          className="story-sprite absolute bottom-[60px] left-[16vw]"
        >
          <PlayerSprite />
        </div>
      </div>
    </div>
  );
}
