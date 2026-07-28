"use client";

import { useState, useCallback } from "react";

import DoomScrollEffect from "@/components/about/DoomScrollEffect";
import ExperienceLog from "@/components/about/ExperienceLog";
import LoadoutCard from "@/components/about/LoadoutCard";

export default function AboutClientWrapper() {
  const [cleared, setCleared] = useState(false);
  const [doomGone, setDoomGone] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  const handleCleared = useCallback(() => {
    setCleared(true);
    // Wait for slide-out animation (1.2s) + small buffer, then remove Doom
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
      setDoomGone(true);
      // Double RAF: let browser paint the section at opacity:0 before transitioning
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setContentVisible(true);
        });
      });
    }, 1400);
  }, []);

  return (
    <>
      {!doomGone && (
        <DoomScrollEffect onCleared={handleCleared} cleared={cleared} />
      )}
      {doomGone && (
        <section
          className="mx-auto max-w-5xl px-4 py-16"
          style={{
            opacity: contentVisible ? 1 : 0,
            transition: "opacity 0.9s ease",
          }}
        >
          <ExperienceLog />
          <LoadoutCard />
        </section>
      )}
    </>
  );
}
