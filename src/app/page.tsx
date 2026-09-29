import HeroBackground from "@/components/hero/HeroBackground";
import SfxAnchor from "@/components/sfx/SfxAnchor";
import SfxLink from "@/components/sfx/SfxLink";
import { CONTACT, RESUME_URL } from "@/lib/site";

const CTA_CLASS =
  "pixel-border pixel-border-interactive bg-surface px-5 py-3 font-pixel text-xs text-foreground transition-colors hover:text-accent focus-visible:text-accent";

export default function Home() {
  return (
    <section className="relative isolate overflow-hidden">
      <HeroBackground />
      <div className="mx-auto flex min-h-[70vh] max-w-5xl flex-col items-center justify-center gap-8 px-4 py-24 text-center">
        <p className="font-pixel text-xs text-accent-alt">PLAYER 1</p>
        <h1 className="font-pixel text-2xl text-highlight sm:text-4xl">
          SAIM HASHMI
        </h1>
        {/* Solid plate so the role/status copy stays readable over the voxel field. */}
        <div className="max-w-2xl border-2 border-border bg-background px-5 py-4 text-xl leading-snug sm:text-2xl">
          <p className="text-foreground">
            Software Engineer: systems, DevOps &amp; developer tooling
          </p>
          <p className="mt-2 text-muted">
            B.Eng. Computer Systems Engineering @ Carleton, graduating May
            2027. Previously SWE Intern @ Synopsys.
          </p>
          <p className="mt-2 text-accent-alt">
            Open to new-grad roles starting summer 2027 · Ottawa, ON · open
            to relocation
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <SfxLink href="/projects" className={CTA_CLASS}>
            {/* Blink the glyph only, and only a few cycles: the label never disappears. */}
            <span
              aria-hidden
              className="motion-safe:animate-blink"
              style={{ animationIterationCount: 4 }}
            >
              ▶
            </span>{" "}
            PRESS START<span className="sr-only">: view projects</span>
          </SfxLink>
          <SfxAnchor
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={CTA_CLASS}
          >
            RESUME<span className="sr-only"> (PDF, opens in a new tab)</span>
          </SfxAnchor>
          <SfxAnchor href={`mailto:${CONTACT.email}`} className={CTA_CLASS}>
            EMAIL
          </SfxAnchor>
        </div>
      </div>
    </section>
  );
}
