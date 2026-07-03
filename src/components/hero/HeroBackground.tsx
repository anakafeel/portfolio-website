"use client";

import dynamic from "next/dynamic";

const VoxelScene = dynamic(() => import("./VoxelScene"), { ssr: false });

export default function HeroBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(ellipse_75%_65%_at_50%_45%,black_35%,transparent_78%)]"
    >
      <VoxelScene />
    </div>
  );
}
