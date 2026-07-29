import fs from "fs";
import path from "path";

import matter from "gray-matter";
import { z } from "zod";

export const RARITY_TIERS = ["common", "rare", "epic", "legendary"] as const;
export type RarityTier = (typeof RARITY_TIERS)[number];

const linksSchema = z
  .object({
    github: z.string().url().optional(),
    demo: z.string().url().optional(),
    writeup: z.string().url().optional(),
  })
  .default({});

const projectFrontmatterSchema = z.object({
  title: z.string().min(1),
  rarityTier: z.enum(RARITY_TIERS),
  techStack: z.array(z.string()).default([]),
  links: linksSchema,
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
  summary: z.string().min(1),
  image: z.string().optional(),
});

const blogFrontmatterSchema = z.object({
  title: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
  summary: z.string().min(1),
  techStack: z.array(z.string()).default([]),
});

export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;
export type BlogFrontmatter = z.infer<typeof blogFrontmatterSchema>;

export interface ContentEntry<T> {
  slug: string;
  frontmatter: T;
  body: string;
}

export type Project = ContentEntry<ProjectFrontmatter>;
export type BlogPost = ContentEntry<BlogFrontmatter>;

const CONTENT_ROOT = path.join(process.cwd(), "content");

function readEntries<T>(
  dir: string,
  schema: z.ZodType<T>,
): ContentEntry<T>[] {
  const fullDir = path.join(CONTENT_ROOT, dir);
  if (!fs.existsSync(fullDir)) {
    return [];
  }
  return fs
    .readdirSync(fullDir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(fullDir, file), "utf8");
      const { data, content } = matter(raw);
      const parsed = schema.safeParse(data);
      if (!parsed.success) {
        throw new Error(
          `Invalid frontmatter in content/${dir}/${file}: ${parsed.error.message}`,
        );
      }
      return { slug, frontmatter: parsed.data, body: content };
    });
}

export function getProjects(): Project[] {
  return readEntries("projects", projectFrontmatterSchema).sort((a, b) =>
    b.frontmatter.date.localeCompare(a.frontmatter.date),
  );
}

export function getProject(slug: string): Project | null {
  return getProjects().find((project) => project.slug === slug) ?? null;
}

export function getBlogPosts(): BlogPost[] {
  return readEntries("blog", blogFrontmatterSchema).sort((a, b) =>
    b.frontmatter.date.localeCompare(a.frontmatter.date),
  );
}

export function getBlogPost(slug: string): BlogPost | null {
  return getBlogPosts().find((post) => post.slug === slug) ?? null;
}

export function getAdjacentProjects(slug: string): {
  prev: Project | null;
  next: Project | null;
} {
  const projects = getProjects();
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? projects[index - 1] : null,
    next: index < projects.length - 1 ? projects[index + 1] : null,
  };
}
