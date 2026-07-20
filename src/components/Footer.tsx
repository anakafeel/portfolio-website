import CopyEmailButton from "@/components/game/CopyEmailButton";
import SfxAnchor from "@/components/sfx/SfxAnchor";
import SfxLink from "@/components/sfx/SfxLink";
import { CONTACT, EXTRA_LINKS, SITE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t-2 border-border bg-surface">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-6">
        <p className="font-pixel text-[10px] text-muted">
          © {new Date().getFullYear()} {SITE.name} — GAME OVER? INSERT COIN
        </p>
        <ul className="flex flex-wrap items-center gap-6">
          <li className="flex items-center gap-2">
            <SfxAnchor
              href={`mailto:${CONTACT.email}`}
              className="font-pixel text-[10px] text-foreground transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-none"
            >
              EMAIL
            </SfxAnchor>
            <CopyEmailButton />
          </li>
          <li>
            <SfxAnchor
              href={CONTACT.github}
              target="_blank"
              rel="noopener noreferrer"
              className="font-pixel text-[10px] text-foreground transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-none"
            >
              GITHUB
            </SfxAnchor>
          </li>
          <li>
            <SfxAnchor
              href={CONTACT.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="font-pixel text-[10px] text-foreground transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-none"
            >
              LINKEDIN
            </SfxAnchor>
          </li>
        </ul>
      </div>
      <div className="border-t-2 border-border/40">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-4 px-4 py-4">
          <span className="font-pixel text-[8px] uppercase tracking-[0.15em] text-muted">
            Extras
          </span>
          <ul className="flex flex-wrap items-center gap-6">
            {EXTRA_LINKS.map((link) => (
              <li key={link.href}>
                <SfxLink
                  href={link.href}
                  className="font-pixel text-[10px] text-muted transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-none"
                >
                  {link.label}
                </SfxLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
