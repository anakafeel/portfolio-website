import SfxLink from "@/components/sfx/SfxLink";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-6 px-4 py-24 text-center">
      <p className="font-pixel text-xs text-accent">GAME OVER</p>
      <h1 className="font-pixel text-xl text-highlight sm:text-2xl">
        404 — LEVEL NOT FOUND
      </h1>
      <p className="max-w-md text-2xl text-muted">
        This route doesn&apos;t exist in this save file. The link may be
        broken, or the level got renamed.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <SfxLink
          href="/"
          className="pixel-border pixel-border-interactive bg-surface px-6 py-3 font-pixel text-xs text-foreground transition-colors hover:text-accent"
        >
          ◄ RETURN TO HUB
        </SfxLink>
        <p className="font-pixel text-[10px] text-muted">
          or open the terminal and try <span className="text-accent-alt">ls</span>
        </p>
      </div>
    </section>
  );
}
