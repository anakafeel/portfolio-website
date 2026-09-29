"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

const STAGGER = 0.035;

/**
 * Letter-by-letter roll on hover. The label is announced once through an
 * sr-only copy; both animated copies are aria-hidden so screen readers never
 * hear "HOMEHOME". With reduced motion the letters stay put.
 */
export default function TextRoll({
  children,
  className,
  center = false,
}: {
  children: string;
  className?: string;
  center?: boolean;
}) {
  // Same markup either way (so SSR and hydration always match); reduced
  // motion just never triggers the hover variant.
  const reducedMotion = useReducedMotion();

  const letters = children.split("");
  const delayFor = (i: number) =>
    center
      ? STAGGER * Math.abs(i - (children.length - 1) / 2)
      : STAGGER * i;

  return (
    <motion.span
      initial="initial"
      whileHover={reducedMotion ? undefined : "hovered"}
      className={cn("relative inline-block overflow-hidden", className)}
    >
      <span className="sr-only">{children}</span>

      {/* Top text — slides up on hover */}
      <span aria-hidden className="block">
        {letters.map((l, i) => (
          <motion.span
            variants={{
              initial: { y: 0 },
              hovered: { y: "-100%" },
            }}
            transition={{ ease: "easeInOut", delay: delayFor(i) }}
            className="inline-block"
            key={i}
          >
            {l === " " ? " " : l}
          </motion.span>
        ))}
      </span>

      {/* Bottom text — slides in from below on hover */}
      <span aria-hidden className="absolute inset-0 block">
        {letters.map((l, i) => (
          <motion.span
            variants={{
              initial: { y: "100%" },
              hovered: { y: 0 },
            }}
            transition={{ ease: "easeInOut", delay: delayFor(i) }}
            className="inline-block"
            key={i}
          >
            {l === " " ? " " : l}
          </motion.span>
        ))}
      </span>
    </motion.span>
  );
}
