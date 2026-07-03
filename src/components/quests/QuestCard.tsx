import Link from "next/link";

import type { Project, RarityTier } from "@/lib/content";

/*
 * Rarity maps onto theme tokens so cards recolor with the active theme:
 * common → muted, rare → accent-alt, epic → accent, legendary → highlight.
 */
const RARITY_TEXT: Record<RarityTier, string> = {
  common: "text-muted",
  rare: "text-accent-alt",
  epic: "text-accent",
  legendary: "text-highlight",
};

export default function QuestCard({ project }: { project: Project }) {
  const { slug, frontmatter } = project;
  const rarityClass = RARITY_TEXT[frontmatter.rarityTier];

  return (
    <article className="pixel-border group bg-surface transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5">
      <Link href={`/projects/${slug}`} className="block">
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
          {frontmatter.techStack.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {frontmatter.techStack.map((tech) => (
                <li
                  key={tech}
                  className="border border-border px-1.5 py-0.5 font-pixel text-[10px] text-muted"
                >
                  {tech}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Link>
    </article>
  );
}
