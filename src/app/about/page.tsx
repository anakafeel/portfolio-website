import type { Metadata } from "next";

import AboutClientWrapper from "@/components/about/AboutClientWrapper";
import CharacterSheet from "@/components/about/CharacterSheet";
import DoomLauncher from "@/components/about/DoomLauncher";
import ExperienceLog from "@/components/about/ExperienceLog";
import PersonalPicsCarousel from "@/components/about/PersonalPicsCarousel";
import StoryLevel from "@/components/about/StoryLevel";
import SfxAnchor from "@/components/sfx/SfxAnchor";
import SfxLink from "@/components/sfx/SfxLink";
import GitHubContributions from "@/components/ui/github-contributions";
import { CURRENT_STATUS, STORY_BEATS } from "@/lib/about";
import { PERSONAL_PICS } from "@/lib/gallery";
import { pageMetadata } from "@/lib/seo";
import { CONTACT, RESUME_URL } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  path: "/about",
  title: "About",
  description:
    "Experience, education and skills of Saim Hashmi, Software Engineer (systems, DevOps & tooling).",
});

/** Beats already shown as plain sections by CharacterSheet. */
const PLAIN_BEATS = new Set(["SPAWN POINT", "SKILL TREE"]);

export default function AboutPage() {
  // The themed level keeps the beats that aren't covered elsewhere on the
  // page (side quests, current quest). Falls back to all of them if the
  // titles ever change.
  const levelBeats = STORY_BEATS.filter((b) => !PLAIN_BEATS.has(b.title));

  return (
    <AboutClientWrapper>
      <div className="mx-auto max-w-5xl px-4 py-16">
        <header>
          <p className="font-pixel text-[10px] text-accent-alt">
            PLAYER 1 · CHARACTER SELECT
          </p>
          <h1 className="mt-3 font-pixel text-xl text-highlight sm:text-2xl">
            ABOUT SAIM
          </h1>
          <div className="mt-6 max-w-2xl space-y-4 text-xl leading-relaxed">
            <p className="text-foreground">
              I&apos;m a fourth-year Computer Systems Engineering student at
              Carleton University (graduating May 2027) who likes the layer
              between code and production: build systems, CI/CD, developer
              tooling and the infrastructure it all runs on.
            </p>
            <p className="text-muted">
              This summer I was a Software Development Intern at Synopsys on
              Ansys Fluent. I&apos;ve had a command merged into Shopify&apos;s
              open-source CLI, and I led systems and tooling for Autonomous
              Robotics Carleton. Off the clock I run{" "}
              <SfxLink
                href="/projects/vaultpi"
                className="text-foreground underline underline-offset-4 hover:text-accent"
              >
                VaultPi
              </SfxLink>
              , the Raspberry Pi homelab this site is served from.
            </p>
            <p className="text-accent-alt">{CURRENT_STATUS}</p>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <SfxAnchor
              href={RESUME_URL}
              download="Saim_Hashmi_Resume.pdf"
              className="pixel-border pixel-border-interactive bg-surface px-5 py-3 font-pixel text-xs text-foreground transition-colors hover:text-accent focus-visible:text-accent"
            >
              ▼ DOWNLOAD RESUME (PDF)
            </SfxAnchor>
            <SfxAnchor
              href={CONTACT.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="pixel-border pixel-border-interactive bg-surface px-5 py-3 font-pixel text-xs text-foreground transition-colors hover:text-accent focus-visible:text-accent"
            >
              LINKEDIN ↗
            </SfxAnchor>
            <DoomLauncher />
          </div>
        </header>

        <section aria-labelledby="main-quests-heading" className="mt-16">
          <ExperienceLog />
        </section>

        <div className="mt-16">
          <CharacterSheet />
        </div>

        <section aria-label="Backstory" className="mt-16">
          <StoryLevel beats={levelBeats.length > 0 ? levelBeats : STORY_BEATS} />
        </section>

        <div id="gallery" className="mt-16 scroll-mt-16">
          <PersonalPicsCarousel images={PERSONAL_PICS} />
        </div>

        <section aria-label="GitHub activity" className="mt-16">
          <GitHubContributions username="anakafeel" />
        </section>
      </div>
    </AboutClientWrapper>
  );
}
