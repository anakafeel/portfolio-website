"use client";

import { useState, useCallback } from "react";

import DoomScrollEffect from "@/components/about/DoomScrollEffect";
import ExperienceLog from "@/components/about/ExperienceLog";
import LoadoutCard from "@/components/about/LoadoutCard";
import StoryLevel from "@/components/about/StoryLevel";
import { useMediaQuery } from "@/hooks/useMediaQuery";

type Phase = "doom" | "exiting" | "ready";

export default function AboutClientWrapper() {
  const isMobile = useMediaQuery("(max-width: 639px)");

  const [phase, setPhase] = useState<Phase>("doom");

  const handleCleared = useCallback(() => {
    setPhase("exiting");
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
      requestAnimationFrame(() => setPhase("ready"));
    }, 1400);
  }, []);

  if (isMobile) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-16">
        <StoryLevel />
        <div className="mt-16">
          <ExperienceLog />
          <LoadoutCard />
        </div>
      </section>
    );
  }

  return (
    <>
      {phase !== "ready" && (
        <DoomScrollEffect
          onCleared={handleCleared}
          cleared={phase === "exiting"}
        />
      )}
      {phase === "ready" && (
        <section className="mx-auto max-w-5xl px-4 py-16">
          <ExperienceLog />
          <LoadoutCard />
        </section>
      )}
    </>
  );
}
