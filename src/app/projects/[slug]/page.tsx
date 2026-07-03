import type { Metadata } from "next";
import SfxAnchor from "@/components/sfx/SfxAnchor";
import SfxLink from "@/components/sfx/SfxLink";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

import QuestTracker from "@/components/quests/QuestTracker";
import { getProject, getProjects } from "@/lib/content";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) {
    return {};
  }
  return {
    title: `${project.frontmatter.title} — Saim Hashmi`,
    description: project.frontmatter.summary,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) {
    notFound();
  }
  const { frontmatter, body } = project;

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <QuestTracker />
      <SfxLink
        href="/projects"
        className="font-pixel text-[10px] text-muted transition-colors hover:text-accent"
      >
        ◄ BACK TO QUEST LOG
      </SfxLink>
      <h1 className="mt-6 font-pixel text-xl text-highlight">
        {frontmatter.title}
      </h1>
      <p className="mt-3 font-pixel text-[10px] uppercase text-accent">
        ◆ {frontmatter.rarityTier}
      </p>
      {frontmatter.techStack.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
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
      <div className="mt-6 flex flex-wrap gap-4">
        {frontmatter.links.github && (
          <SfxAnchor
            href={frontmatter.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="font-pixel text-[10px] text-accent-alt underline hover:text-accent"
          >
            GITHUB
          </SfxAnchor>
        )}
        {frontmatter.links.demo && (
          <SfxAnchor
            href={frontmatter.links.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="font-pixel text-[10px] text-accent-alt underline hover:text-accent"
          >
            DEMO
          </SfxAnchor>
        )}
        {frontmatter.links.writeup && (
          <SfxAnchor
            href={frontmatter.links.writeup}
            target="_blank"
            rel="noopener noreferrer"
            className="font-pixel text-[10px] text-accent-alt underline hover:text-accent"
          >
            WRITE-UP
          </SfxAnchor>
        )}
      </div>
      <div className="mdx-content mt-10">
        <MDXRemote source={body} />
      </div>
    </article>
  );
}
