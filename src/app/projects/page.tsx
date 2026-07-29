import type { Metadata } from "next";

import QuestCard from "@/components/quests/QuestCard";
import { getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects — Saim Hashmi",
  description: "Quest log — projects built by Saim Hashmi.",
};

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="font-pixel text-xl text-highlight">QUEST LOG</h1>
      <p className="mt-4 text-xl text-muted">
        Select a quest to view its briefing.
      </p>
      {projects.length === 0 ? (
        <p className="mt-10 text-2xl text-muted">
          Quest board is empty… check back soon.
        </p>
      ) : (
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {projects.map((project, index) => (
            <div
              key={project.slug}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <QuestCard project={project} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
