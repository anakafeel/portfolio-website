"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

import { useSound } from "@/components/game/useSound";

/** next/link that plays the UI click blip — for use from server components. */
export default function SfxLink({
  onClick,
  ...props
}: ComponentProps<typeof Link>) {
  const play = useSound();

  return (
    <Link
      {...props}
      onClick={(e) => {
        play("click");
        onClick?.(e);
      }}
    />
  );
}
