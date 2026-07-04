"use client";

import dynamic from "next/dynamic";

const VoxelScene = dynamic(() => import("./VoxelScene"), { ssr: false });

export default function HeroBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 opacity-60 [mask-image:linear-gradient(to_bottom,transparent_0%,black_22%,black_78%,transparent_100%)]"
    >
      <VoxelScene />
    </div>
  );
}
