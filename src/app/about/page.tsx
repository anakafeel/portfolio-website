import type { Metadata } from "next";

import ExperienceLog from "@/components/about/ExperienceLog";
import LoadoutCard from "@/components/about/LoadoutCard";
import StoryStage from "@/components/about/StoryStage";

export const metadata: Metadata = {
  title: "About — Saim Hashmi",
  description: "About Saim Hashmi — character stats and backstory.",
};

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="font-pixel text-xl text-highlight">CHARACTER SELECT</h1>
      <p className="mt-6 max-w-2xl text-2xl text-muted">
        Every save file has a backstory. Scroll to play through this one.
      </p>
      <StoryStage />
      <ExperienceLog />
      <LoadoutCard />
    </section>
  );
}
