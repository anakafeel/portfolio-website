"use client";

import { useEffect } from "react";

import SfxLink from "@/components/sfx/SfxLink";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-6 px-4 py-24 text-center">
      <p className="font-pixel text-xs text-accent">SYSTEM ERROR</p>
      <h1 className="font-pixel text-xl text-highlight sm:text-2xl">
        SOMETHING CRASHED LEVEL-SIDE
      </h1>
      <p className="max-w-md text-2xl text-muted">
        An unexpected error interrupted this run. Your save data is safe.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="pixel-border pixel-border-interactive bg-surface px-6 py-3 font-pixel text-xs text-foreground transition-colors hover:text-accent"
        >
          ↻ RETRY
        </button>
        <SfxLink
          href="/"
          className="font-pixel text-[10px] text-muted transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-none"
        >
          ◄ RETURN TO HUB
        </SfxLink>
      </div>
    </section>
  );
}
