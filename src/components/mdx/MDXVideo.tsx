"use client";

import { useEffect, useRef, type VideoHTMLAttributes } from "react";

import { usePrefersReducedMotion } from "@/lib/three/sceneHooks";

/**
 * MDX `<video>`: always shows native controls (WCAG 2.2.2 pause/stop), and
 * only honours `autoPlay` when the visitor hasn't asked for reduced motion.
 * Autoplay is started from an effect rather than the attribute, so the
 * browser never begins playback before we know the motion preference.
 */
export default function MDXVideo({
  autoPlay,
  muted,
  className,
  ...props
}: VideoHTMLAttributes<HTMLVideoElement>) {
  const ref = useRef<HTMLVideoElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const video = ref.current;
    if (!video || !autoPlay) return;
    if (reducedMotion) {
      video.pause();
      return;
    }
    // React doesn't reliably reflect `muted` on hydration, and browsers only
    // allow unprompted playback of muted media, so set it before play().
    if (muted) video.muted = true;
    video.play().catch(() => {
      // Autoplay blocked: the controls are there, so the visitor can start it.
    });
  }, [autoPlay, muted, reducedMotion]);

  return (
    <video
      ref={ref}
      {...props}
      muted={muted}
      controls
      preload={props.preload ?? "metadata"}
      className={`w-full pixelated border-2 border-border pixel-border ${className ?? ""}`}
    />
  );
}
