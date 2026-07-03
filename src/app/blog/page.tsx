import type { Metadata } from "next";
import Link from "next/link";

import { getBlogPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog — Saim Hashmi",
  description: "Field notes and dev logs by Saim Hashmi.",
};

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="font-pixel text-xl text-highlight">DEV LOG</h1>
      {posts.length === 0 ? (
        <p className="mt-6 max-w-2xl text-2xl text-muted">
          No entries yet. New log entries will appear here.
        </p>
      ) : (
        <ul className="mt-10 flex flex-col gap-6">
          {posts.map((post) => (
            <li key={post.slug} className="pixel-border bg-surface p-4">
              <Link href={`/blog/${post.slug}`} className="group block">
                <p className="font-pixel text-[10px] text-muted">
                  {post.frontmatter.date}
                </p>
                <h2 className="mt-2 font-pixel text-sm text-foreground transition-colors group-hover:text-accent">
                  {post.frontmatter.title}
                </h2>
                <p className="mt-2 text-lg text-muted">
                  {post.frontmatter.summary}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
