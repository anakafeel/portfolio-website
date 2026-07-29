import type { Metadata } from "next";
import SfxLink from "@/components/sfx/SfxLink";

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
      <p className="mt-4 text-xl text-muted">
        Field notes from the dev cycle — shipped features, hard-won lessons, and the occasional digression.
      </p>
      {posts.length === 0 ? (
        <p className="mt-10 text-2xl text-muted">
          No entries yet. New log entries will appear here.
        </p>
      ) : (
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {posts.map((post, index) => (
            <article
              key={post.slug}
              className="pixel-border pixel-border-interactive group bg-surface motion-safe:transition-transform motion-safe:hover:-translate-x-0.5 motion-safe:hover:-translate-y-0.5 animate-fade-up"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <SfxLink href={`/blog/${post.slug}`} className="block">
                {post.frontmatter.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.frontmatter.image}
                    alt={`${post.frontmatter.title} cover`}
                    width={640}
                    height={360}
                    loading="lazy"
                    className="pixelated w-full border-b-2 border-border"
                  />
                ) : null}
                <div className="flex flex-col gap-3 p-4">
                  <p className="font-pixel text-[10px] text-muted">
                    LOG #{String(index + 1).padStart(3, "0")} — {post.frontmatter.date}
                  </p>
                  <h2 className="font-pixel text-sm text-foreground transition-colors group-hover:text-accent">
                    {post.frontmatter.title}
                  </h2>
                  <p className="text-lg leading-snug text-muted">
                    {post.frontmatter.summary}
                  </p>
                  {post.frontmatter.techStack.length > 0 && (
                    <ul className="flex flex-wrap gap-2">
                      {post.frontmatter.techStack.map((tech) => (
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
              </SfxLink>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
