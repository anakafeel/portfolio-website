import SfxLink from "@/components/sfx/SfxLink";
import type { Project } from "@/lib/content";
import { RARITY_CLASS } from "@/lib/content";

function NavCard({
  project,
  direction,
}: {
  project: Project;
  direction: "prev" | "next";
}) {
  const isNext = direction === "next";

  return (
    <SfxLink
      href={`/projects/${project.slug}`}
      className={`group flex flex-1 flex-col pixel-border pixel-border-interactive bg-surface p-4 transition-colors${isNext ? " items-end text-right" : ""}`}
    >
      <span className="font-pixel text-[10px] text-muted transition-colors group-hover:text-accent">
        {isNext ? "NEXT QUEST ►" : "◄ PREV QUEST"}
      </span>
      <span className="mt-2 font-pixel text-sm text-foreground transition-colors group-hover:text-accent">
        {project.frontmatter.title}
      </span>
      <span
        className={`mt-1 font-pixel text-[10px] uppercase ${RARITY_CLASS[project.frontmatter.rarityTier]}`}
      >
        ◆ {project.frontmatter.rarityTier}
      </span>
    </SfxLink>
  );
}

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
          <NavCard project={prev} direction="prev" />
        ) : (
          <div className="flex-1" />
        )}
        {next ? (
          <NavCard project={next} direction="next" />
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </nav>
  );
}
