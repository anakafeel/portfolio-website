import SfxLink from "@/components/sfx/SfxLink";
import type { Project, RarityTier } from "@/lib/content";

const RARITY_TEXT: Record<RarityTier, string> = {
  common: "text-muted",
  rare: "text-accent-alt",
  epic: "text-accent",
  legendary: "text-highlight",
};

export default function ProjectNavigation({
  prev,
  next,
}: {
  prev: Project | null;
  next: Project | null;
}) {
  // Nothing to show if there's only one project
  if (!prev && !next) {
    return null;
  }

  return (
    <nav className="mt-16 border-t-2 border-border pt-8">
      <div className="flex items-stretch gap-4">
        {prev ? (
          <SfxLink
            href={`/projects/${prev.slug}`}
            className="group flex flex-1 flex-col pixel-border bg-surface p-4 transition-colors hover:border-accent hover:shadow-pixel-accent"
          >
            <span className="font-pixel text-[10px] text-muted transition-colors group-hover:text-accent">
              ◄ PREV QUEST
            </span>
            <span className="mt-2 font-pixel text-sm text-foreground transition-colors group-hover:text-accent">
              {prev.frontmatter.title}
            </span>
            <span
              className={`mt-1 font-pixel text-[10px] uppercase ${RARITY_TEXT[prev.frontmatter.rarityTier]}`}
            >
              ◆ {prev.frontmatter.rarityTier}
            </span>
          </SfxLink>
        ) : (
          <div className="flex-1" />
        )}
        {next ? (
          <SfxLink
            href={`/projects/${next.slug}`}
            className="group flex flex-1 flex-col items-end pixel-border bg-surface p-4 text-right transition-colors hover:border-accent hover:shadow-pixel-accent"
          >
            <span className="font-pixel text-[10px] text-muted transition-colors group-hover:text-accent">
              NEXT QUEST ►
            </span>
            <span className="mt-2 font-pixel text-sm text-foreground transition-colors group-hover:text-accent">
              {next.frontmatter.title}
            </span>
            <span
              className={`mt-1 font-pixel text-[10px] uppercase ${RARITY_TEXT[next.frontmatter.rarityTier]}`}
            >
              ◆ {next.frontmatter.rarityTier}
            </span>
          </SfxLink>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </nav>
  );
}
