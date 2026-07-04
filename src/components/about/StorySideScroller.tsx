"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { STORY_BEATS } from "@/lib/about";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** PROTOTYPE: only the first checkpoints ride the track until the feel is approved. */
const BEATS = STORY_BEATS.slice(0, 2);

/** How long the sprite keeps walking after the last scroll tick. */
const IDLE_DELAY_MS = 150;

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
      // beat reveals below can address positions as fractions of it.
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

      tl.from(
        ".scroller-clear",
        { autoAlpha: 0, scale: 0.5, duration: 0.06, ease: "steps(4)" },
        0.9,
      );

      return () => window.clearTimeout(idleTimer.current);
    },
    { scope: stageRef },
  );

  return (
    <div className="mt-16 w-screen ml-[calc(50%-50vw)]">
      <div
        ref={stageRef}
        className="relative h-[85vh] overflow-hidden border-y-2 border-border bg-background"
      >
        {/* Parallax backdrop: far skyline + mid clouds, pure CSS shapes. */}
        <div
          aria-hidden
          className="parallax-far absolute bottom-16 left-0 h-2/5 w-[220vw] bg-[linear-gradient(to_top,var(--color-surface)_0%,transparent_100%)] [clip-path:polygon(0_100%,0_55%,8%_55%,8%_30%,16%_30%,16%_60%,26%_60%,26%_20%,34%_20%,34%_50%,45%_50%,45%_35%,53%_35%,53%_65%,64%_65%,64%_25%,72%_25%,72%_55%,82%_55%,82%_40%,90%_40%,90%_60%,100%_60%,100%_100%)]"
        />
        <div aria-hidden className="parallax-mid absolute left-0 top-[12%] w-[260vw]">
          {[12, 38, 61, 84].map((left) => (
            <span
              key={left}
              className="absolute h-6 w-24 bg-surface opacity-80 [box-shadow:12px_-12px_0_0_var(--color-surface),-12px_6px_0_0_var(--color-surface)]"
              style={{ left: `${left}%` }}
            />
          ))}
        </div>

        {/* The level track: panels slide left as the user scrolls down. */}
        <div className="level-track relative flex h-full w-max items-end">
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-16 border-t-4 border-border bg-[repeating-linear-gradient(90deg,var(--color-surface)_0px,var(--color-surface)_30px,var(--color-background)_30px,var(--color-background)_32px)]"
          />

          <div className="flex w-[70vw] shrink-0 items-center self-stretch pl-[10vw]">
            <div>
              <p className="font-pixel text-[10px] text-accent-alt">STAGE 1</p>
              <h2 className="mt-3 font-pixel text-lg text-highlight">
                CHARACTER SELECT
              </h2>
              <p className="mt-4 max-w-md text-xl text-muted">
                Keep scrolling — the level scrolls sideways from here. ►
              </p>
            </div>
          </div>

          {BEATS.map((beat) => (
            <div
              key={beat.world}
              className="flex w-[75vw] shrink-0 items-end gap-6 self-stretch pb-24"
            >
              {/* Checkpoint signpost */}
              <div aria-hidden className="relative ml-[6vw] h-32 w-4 bg-border">
                <span className="absolute -top-1 left-4 h-10 w-14 bg-accent [clip-path:polygon(0_0,100%_50%,0_100%)]" />
              </div>
              <article className="scroller-beat pixel-border max-w-md bg-surface p-6">
                <p className="font-pixel text-[10px] text-accent-alt">
                  {beat.world}
                </p>
                <h3 className="mt-3 font-pixel text-sm text-highlight">
                  {beat.title}
                </h3>
                <p className="mt-3 text-lg leading-snug text-muted">
                  {beat.body}
                </p>
              </article>
            </div>
          ))}

          <div className="flex w-[55vw] shrink-0 items-end justify-center self-stretch pb-32">
            <p className="scroller-clear text-center font-pixel text-sm text-accent">
              ★ CHECKPOINT REACHED ★
              <span className="mt-4 block font-pixel text-[10px] text-muted">
                (prototype ends here — worlds 1-3 and 1-4 ship next)
              </span>
            </p>
          </div>
        </div>

        {/* Player sprite: stays put while the world moves past. Placeholder
            blocky character — swap for a real sprite sheet once approved. */}
        <div
          ref={spriteRef}
          aria-hidden
          className="story-sprite absolute bottom-16 left-[16vw]"
        >
          <div className="sprite-head mx-auto h-5 w-5 bg-highlight" />
          <div className="relative mx-auto h-6 w-7 bg-accent">
            {/* laptop prop */}
            <span className="absolute -right-2 top-1 h-3 w-3 bg-accent-alt" />
          </div>
          <div className="flex justify-center gap-1">
            <span className="sprite-leg-a h-3 w-2 bg-foreground" />
            <span className="sprite-leg-b h-3 w-2 bg-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
}
