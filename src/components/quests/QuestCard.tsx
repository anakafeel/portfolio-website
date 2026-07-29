import SfxLink from "@/components/sfx/SfxLink";
import TechStackPills from "@/components/ui/TechStackPills";
import type { Project } from "@/lib/content";
import { RARITY_CLASS } from "@/lib/content";

export default function QuestCard({ project }: { project: Project }) {
  const { slug, frontmatter } = project;
  const rarityClass = RARITY_CLASS[frontmatter.rarityTier];

  return (
    <article className="pixel-border pixel-border-interactive group bg-surface motion-safe:transition-transform motion-safe:hover:-translate-x-0.5 motion-safe:hover:-translate-y-0.5">
      <SfxLink href={`/projects/${slug}`} className="block">
        {frontmatter.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={frontmatter.image}
            alt={`${frontmatter.title} pixel art`}
            width={640}
            height={360}
            loading="lazy"
            className="pixelated w-full border-b-2 border-border"
          />
        )}
        <div className="flex flex-col gap-3 p-4">
          <p className={`font-pixel text-[10px] uppercase ${rarityClass}`}>
            ◆ {frontmatter.rarityTier}
          </p>
          <h2 className="font-pixel text-sm text-foreground transition-colors group-hover:text-accent">
            {frontmatter.title}
          </h2>
          <p className="text-lg leading-snug text-muted">
            {frontmatter.summary}
          </p>
          <TechStackPills items={frontmatter.techStack} />
        </div>
      </SfxLink>
    </article>
  );
}
