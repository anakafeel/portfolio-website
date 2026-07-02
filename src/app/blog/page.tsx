import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Saim Hashmi",
  description: "Field notes and dev logs by Saim Hashmi.",
};

export default function BlogPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="font-pixel text-xl text-highlight">DEV LOG</h1>
      <p className="mt-6 max-w-2xl text-2xl text-muted">
        No entries yet. New log entries will appear here.
      </p>
    </section>
  );
}
