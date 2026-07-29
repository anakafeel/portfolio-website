import SfxAnchor from "@/components/sfx/SfxAnchor";
import TechStackPills from "@/components/ui/TechStackPills";
import type { ProjectFrontmatter } from "@/lib/content";
import { RARITY_CLASS } from "@/lib/content";

const LINK_CONFIG: { key: keyof ProjectFrontmatter["links"]; label: string }[] =
  [
    { key: "github", label: "GITHUB" },
    { key: "demo", label: "DEMO" },
    { key: "writeup", label: "WRITE-UP" },
  ];

const LINK_CLASS =
  "font-pixel text-[10px] text-accent-alt underline hover:text-accent focus-visible:text-accent focus-visible:outline-none";

export default function MissionBriefing({
  frontmatter,
}: {
  frontmatter: ProjectFrontmatter;
}) {
  const hasLinks = LINK_CONFIG.some(({ key }) => frontmatter.links[key]);

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
              className={`mt-0.5 font-pixel text-[10px] uppercase ${RARITY_CLASS[frontmatter.rarityTier]}`}
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
              <div className="mt-1">
                <TechStackPills items={frontmatter.techStack} />
              </div>
            </div>
          )}
          {hasLinks && (
            <div>
              <p className="font-pixel text-[8px] text-muted">LINKS</p>
              <div className="mt-1 flex flex-wrap gap-3">
                {LINK_CONFIG.map(({ key, label }) => {
                  const href = frontmatter.links[key];
                  return href ? (
                    <SfxAnchor
                      key={key}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={LINK_CLASS}
                    >
                      {label}
                    </SfxAnchor>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
