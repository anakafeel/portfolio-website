"use client";

import type { ComponentProps } from "react";

import { useSound } from "@/components/game/useSound";

/** Plain anchor that plays the UI click blip — for external/mailto links. */
export default function SfxAnchor({
  onClick,
  ...props
}: ComponentProps<"a">) {
  const play = useSound();

  return (
    <a
      {...props}
      onClick={(e) => {
        play("click");
        onClick?.(e);
      }}
    />
  );
}
