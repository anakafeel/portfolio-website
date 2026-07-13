import HeroBackground from "@/components/hero/HeroBackground";
import SfxLink from "@/components/sfx/SfxLink";

export default function Home() {
  return (
    <section className="relative isolate overflow-hidden">
      <HeroBackground />
      <div className="mx-auto flex min-h-[70vh] max-w-5xl flex-col items-center justify-center gap-8 px-4 py-24 text-center">
        <p className="font-pixel text-xs text-accent-alt">PLAYER 1</p>
        <h1 className="font-pixel text-2xl text-highlight sm:text-4xl">
          SAIM HASHMI
        </h1>
        <p className="max-w-xl text-2xl text-muted">
          Computer Systems Engineering @ Carleton. SWE intern @ Synopsys.
          Building systems, tooling, and web experiences that feel like games.
        </p>
        <SfxLink
          href="/projects"
          className="pixel-border pixel-border-interactive bg-surface px-6 py-3 font-pixel text-xs text-foreground transition-colors hover:text-accent"
        >
          <span className="motion-safe:animate-blink">PRESS START</span>
        </SfxLink>
      </div>
    </section>
  );
}
