import type { Metadata } from "next";
import SfxLink from "@/components/sfx/SfxLink";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

import { MDXComponents } from "@/components/mdx/MDXComponents";
import MissionBriefing from "@/components/quests/MissionBriefing";
import ProjectNavigation from "@/components/quests/ProjectNavigation";
import QuestTracker from "@/components/quests/QuestTracker";
import { getAdjacentProjects, getProject, getProjects } from "@/lib/content";

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
  const { prev, next } = getAdjacentProjects(slug);

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <QuestTracker />
      <nav className="flex items-center gap-2 font-pixel text-[10px]">
        <SfxLink
          href="/projects"
          className="text-muted transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-none"
        >
          QUEST LOG
        </SfxLink>
        <span className="text-muted">►</span>
        <span className="text-highlight">{frontmatter.title}</span>
      </nav>
      <h1 className="mt-6 font-pixel text-xl text-highlight">
        {frontmatter.title}
      </h1>
      <MissionBriefing frontmatter={frontmatter} />
      <div className="mdx-content mt-10">
        <MDXRemote source={body} components={MDXComponents} />
      </div>
      <ProjectNavigation prev={prev} next={next} />
    </article>
  );
}
