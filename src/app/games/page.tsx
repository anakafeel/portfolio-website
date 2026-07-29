import type { Metadata } from "next";
import SfxAnchor from "@/components/sfx/SfxAnchor";

import { CONTACT } from "@/lib/site";
import AwardOnVisit from "@/components/game/AwardOnVisit";
import GameGrid from "@/components/games/GameGrid";

export const metadata: Metadata = {
  title: "Games — Saim Hashmi",
  description:
    "Saim Hashmi's game library — competitive FPS mains, all-time favorites, and the backlog.",
};

export default function GamesPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <AwardOnVisit id="game_library" />
      <p className="font-pixel text-xs text-accent-alt">BONUS STAGE</p>
      <h1 className="mt-3 font-pixel text-xl text-highlight">GAME LIBRARY</h1>
      <p className="mt-4 max-w-2xl text-xl text-muted">
        Competitive FPS main with a soft spot for a good story mode. The save
        files below are the ones that shaped the playstyle — plus whatever the
        last Steam sale added to the pile. Click a cartridge to load its save
        file.
      </p>

      <GameGrid />

      <footer className="mt-16 border-t-2 border-border pt-8">
        <div className="flex flex-wrap gap-6">
          <SfxAnchor
            href="https://steamcommunity.com/profiles/76561198965205887/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-pixel text-[10px] text-muted transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-none"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 fill-current"
              aria-hidden="true"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12c0 1.87.52 3.63 1.42 5.13l3.67-1.52c.52.34 1.15.54 1.83.54.34 0 .66-.05.97-.13l2.83-4.3v-.28c0-1.78 1.44-3.22 3.22-3.22s3.22 1.44 3.22 3.22-1.44 3.22-3.22 3.22c-.54 0-1.05-.13-1.5-.37l-2.83 4.29c.35.63.55 1.36.55 2.13 0 2.33-1.9 4.23-4.23 4.23-1.9 0-3.5-1.25-4.04-2.97L2.6 18.42C4.98 21.56 8.68 23.58 12 23.58c6.2 0 11.42-4.7 11.42-11.58S18.2 2 12 2zM7.7 16.32c.12.14.2.32.2.52 0 .44-.36.8-.8.8a.8.8 0 01-.8-.8c0-.38.26-.7.62-.78.04-.17.14-.32.28-.42l.5.68zm6.92-4.88c0-.98-.8-1.78-1.78-1.78s-1.78.8-1.78 1.78.8 1.78 1.78 1.78 1.78-.8 1.78-1.78z" />
            </svg>
            STEAM PROFILE
          </SfxAnchor>
          <SfxAnchor
            href={CONTACT.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-pixel text-[10px] text-muted transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-none"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 fill-current"
              aria-hidden="true"
            >
              <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 00-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 00-4.8 0c-.14-.34-.35-.76-.54-1.09-.01-.02-.04-.03-.07-.03-1.5.26-2.93.71-4.27 1.33-.01 0-.02.01-.03.02-2.72 4.07-3.47 8.03-3.1 11.95 0 .02.01.04.03.05 1.8 1.32 3.53 2.12 5.24 2.65.03.01.06 0 .07-.02.4-.55.76-1.13 1.07-1.74.02-.04 0-.08-.04-.09-.57-.22-1.11-.48-1.64-.78-.04-.02-.04-.08-.01-.11.11-.08.22-.17.33-.25.02-.02.05-.02.07-.01 3.44 1.57 7.15 1.57 10.55 0 .02-.01.05-.01.07.01.11.08.22.17.33.25.04.03.04.09-.01.11-.52.31-1.07.56-1.64.78-.04.01-.05.06-.04.09.32.61.68 1.19 1.07 1.74.03.01.06.02.09.01 1.72-.53 3.45-1.33 5.25-2.65.02-.01.03-.03.03-.05.44-4.53-.73-8.46-3.1-11.95-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.83 2.12-1.89 2.12z" />
            </svg>
            LFG — DISCORD
          </SfxAnchor>
        </div>
      </footer>
    </section>
  );
}
