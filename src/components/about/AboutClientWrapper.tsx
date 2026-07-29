"use client";

import { useState, useCallback } from "react";

import DoomScrollEffect from "@/components/about/DoomScrollEffect";
import ExperienceLog from "@/components/about/ExperienceLog";
import PersonalPicsCarousel from "@/components/about/PersonalPicsCarousel";
import StoryLevel from "@/components/about/StoryLevel";
import GitHubContributions from "@/components/ui/github-contributions";
import { PERSONAL_PICS } from "@/lib/gallery";
import { useMediaQuery } from "@/hooks/useMediaQuery";

type Phase = "doom" | "exiting" | "ready";

export default function AboutClientWrapper() {
  const isMobile = useMediaQuery("(max-width: 639px)");

  const [phase, setPhase] = useState<Phase>("doom");

  const handleCleared = useCallback(() => {
    // Phase 1: scroll to top while victory overlay still covers everything
    window.scrollTo({ top: 0, behavior: "instant" });

    // Phase 2: switch doom to fixed — content section renders behind it at y=0
    setPhase("exiting");

    // Phase 3: during the slide-up, scroll behind the overlay to the gallery
    setTimeout(() => {
      const el = document.getElementById("gallery");
      el?.scrollIntoView({ block: "start", behavior: "smooth" });
    }, 100);

    // Phase 4: after the slide-up fully completes, remove the doom overlay
    setTimeout(() => {
      setPhase("ready");
    }, 1700);
  }, []);

  if (isMobile) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-16">
        <StoryLevel />
        <div className="mt-16">
          <PersonalPicsCarousel images={PERSONAL_PICS} />
        </div>
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
        <>
          <section id="gallery" className="mx-auto max-w-5xl px-4 py-16 scroll-mt-16">
            <PersonalPicsCarousel images={PERSONAL_PICS} />
          </section>
          <section className="mx-auto max-w-5xl px-4 py-16">
            <div className="space-y-8" id="main-quests">
              <ExperienceLog />
              <GitHubContributions username="anakafeel" />
              {/* <LoadoutCard /> */}
            </div>
          </section>
        </>
      )}
    </>
  );
}
