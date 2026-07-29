import SfxAnchor from "@/components/sfx/SfxAnchor";
import type { ProjectFrontmatter, RarityTier } from "@/lib/content";

const RARITY_COLOR: Record<RarityTier, string> = {
  common: "text-muted",
  rare: "text-accent-alt",
  epic: "text-accent",
  legendary: "text-highlight",
};

export default function MissionBriefing({
  frontmatter,
}: {
  frontmatter: ProjectFrontmatter;
}) {
  const hasLinks =
    frontmatter.links.github ||
    frontmatter.links.demo ||
    frontmatter.links.writeup;

  return (
    <div className="pixel-border mt-8 bg-surface p-5">
      {/* Header */}
      <p className="font-pixel text-[10px] text-accent">◆ MISSION BRIEFING</p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {/* Left column: Rarity + Date */}
        <div className="space-y-3">
          <div>
            <p className="font-pixel text-[8px] text-muted">RARITY</p>
            <p
              className={`mt-0.5 font-pixel text-[10px] uppercase ${RARITY_COLOR[frontmatter.rarityTier]}`}
            >
              ◆ {frontmatter.rarityTier}
            </p>
          </div>
          <div>
            <p className="font-pixel text-[8px] text-muted">DATE</p>
            <p className="mt-0.5 text-lg text-foreground">
              {frontmatter.date}
            </p>
          </div>
        </div>

        {/* Right column: Stack + Links */}
        <div className="space-y-3">
          {frontmatter.techStack.length > 0 && (
            <div>
              <p className="font-pixel text-[8px] text-muted">STACK</p>
              <ul className="mt-1 flex flex-wrap gap-2">
                {frontmatter.techStack.map((tech) => (
                  <li
                    key={tech}
                    className="border border-border px-1.5 py-0.5 font-pixel text-[10px] text-muted"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {hasLinks && (
            <div>
              <p className="font-pixel text-[8px] text-muted">LINKS</p>
              <div className="mt-1 flex flex-wrap gap-3">
                {frontmatter.links.github && (
                  <SfxAnchor
                    href={frontmatter.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-pixel text-[10px] text-accent-alt underline hover:text-accent focus-visible:text-accent focus-visible:outline-none"
                  >
                    GITHUB
                  </SfxAnchor>
                )}
                {frontmatter.links.demo && (
                  <SfxAnchor
                    href={frontmatter.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-pixel text-[10px] text-accent-alt underline hover:text-accent focus-visible:text-accent focus-visible:outline-none"
                  >
                    DEMO
                  </SfxAnchor>
                )}
                {frontmatter.links.writeup && (
                  <SfxAnchor
                    href={frontmatter.links.writeup}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-pixel text-[10px] text-accent-alt underline hover:text-accent focus-visible:text-accent focus-visible:outline-none"
                  >
                    WRITE-UP
                  </SfxAnchor>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
