"use client";

import { useState, useCallback, useEffect } from "react";

import DoomScrollEffect from "@/components/about/DoomScrollEffect";
import ExperienceLog from "@/components/about/ExperienceLog";
import LoadoutCard from "@/components/about/LoadoutCard";
import StoryLevel from "@/components/about/StoryLevel";
import GitHubContributions from "@/components/ui/github-contributions";
import { useMediaQuery } from "@/hooks/useMediaQuery";

type Phase = "doom" | "exiting" | "ready";

export default function AboutClientWrapper() {
  const isMobile = useMediaQuery("(max-width: 639px)");

  const [phase, setPhase] = useState<Phase>("doom");

  const handleCleared = useCallback(() => {
    setPhase("exiting");
    setTimeout(() => {
      setPhase("ready");
    }, 1800);
  }, []);

  useEffect(() => {
    if (phase !== "ready") return;
    const el = document.getElementById("main-quests");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [phase]);

  if (isMobile) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-16">
        <StoryLevel />
        <div className="mt-16 space-y-8">
          <ExperienceLog />
          <GitHubContributions username="anakafeel" />
          {/* <LoadoutCard /> */}
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
      {phase !== "doom" && (
        <section className="mx-auto max-w-5xl px-4 py-16 animate-fade-up">
          <div className="space-y-8">
            <ExperienceLog />
            <GitHubContributions username="anakafeel" />
            {/* <LoadoutCard /> */}
          </div>
        </section>
      )}
    </>
  );
}
