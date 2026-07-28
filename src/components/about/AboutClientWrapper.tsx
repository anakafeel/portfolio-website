"use client";

import { useState, useCallback } from "react";

import DoomScrollEffect from "@/components/about/DoomScrollEffect";
import ExperienceLog from "@/components/about/ExperienceLog";
import LoadoutCard from "@/components/about/LoadoutCard";

export default function AboutClientWrapper() {
  const [cleared, setCleared] = useState(false);
  const [hidden, setHidden] = useState(false);

  const handleCleared = useCallback(() => {
    setCleared(true);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
      setHidden(true);
    }, 1600);
  }, []);

  return (
    <>
      {!hidden && (
        <DoomScrollEffect onCleared={handleCleared} cleared={cleared} />
      )}
      <section
        className="mx-auto max-w-5xl px-4 py-16"
        style={{
          opacity: cleared ? 1 : 0,
          transition: cleared ? "opacity 0.9s ease 0.4s" : "none",
          pointerEvents: cleared ? "auto" : "none",
          userSelect: cleared ? "auto" : "none",
          position: cleared ? "static" : "absolute",
          top: cleared ? undefined : "-9999px",
        }}
      >
        <ExperienceLog />
        <LoadoutCard />
      </section>
    </>
  );
}
