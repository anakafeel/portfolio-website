import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects — Saim Hashmi",
  description: "Quest log — projects built by Saim Hashmi.",
};

export default function ProjectsPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="font-pixel text-xl text-highlight">QUEST LOG</h1>
      <p className="mt-6 max-w-2xl text-2xl text-muted">
        Quest board is empty… quests unlock when the content layer ships.
      </p>
    </section>
  );
}
