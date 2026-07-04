import type { Metadata } from "next";
import Image from "next/image";

import AwardOnVisit from "@/components/game/AwardOnVisit";
import SfxAnchor from "@/components/sfx/SfxAnchor";
import { DOTFILES_URL, RICE_SHOTS, RICE_SPECS } from "@/lib/rice";

export const metadata: Metadata = {
  title: "Rice — Saim Hashmi",
  description:
    "The rice zone — Saim Hashmi's Fedora + Niri desktop customization setup.",
};

export default function RicePage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <AwardOnVisit id="rice_inspector" />
      <p className="font-pixel text-xs text-accent-alt">SECRET LEVEL</p>
      <h1 className="mt-3 font-pixel text-xl text-highlight">THE RICE ZONE</h1>
      <p className="mt-4 max-w-2xl text-xl text-muted">
        &ldquo;Ricing&rdquo; is the art of tuning a Linux desktop until every
        pixel earns its place. This is my daily driver — a scrollable-tiling
        Wayland setup where the wallpaper drives the color scheme of every
        app on screen.
      </p>

      <div className="pixel-border mt-10 bg-surface p-6">
        <h2 className="font-pixel text-xs text-accent">SYSTEM FETCH</h2>
        <dl className="mt-4 grid gap-x-10 gap-y-2 text-lg sm:grid-cols-2">
          {RICE_SPECS.map(([key, value]) => (
            <div key={key} className="flex justify-between gap-4">
              <dt className="text-accent-alt">{key}</dt>
              <dd className="text-right text-foreground">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2">
        {RICE_SHOTS.map((shot) => (
          <figure key={shot.src} className="pixel-border bg-surface">
            <figcaption className="flex items-baseline justify-between gap-2 border-b-2 border-border px-4 py-3">
              <span className="font-pixel text-[10px] text-highlight">
                {shot.label}
              </span>
              <span aria-hidden className="text-sm text-muted">
                *.webp
              </span>
            </figcaption>
            <div className="relative aspect-video">
              <Image
                src={shot.src}
                alt={shot.detail}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover object-top"
              />
            </div>
            <p className="px-4 py-3 text-lg text-muted">{shot.detail}</p>
          </figure>
        ))}
      </div>

      <div className="mt-12 text-center">
        <SfxAnchor
          href={DOTFILES_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="pixel-border pixel-border-interactive inline-block bg-surface px-6 py-3 font-pixel text-xs text-foreground transition-colors hover:text-accent"
        >
          CLONE THE SAVE FILE — DOTFILES ►
        </SfxAnchor>
      </div>
    </section>
  );
}
