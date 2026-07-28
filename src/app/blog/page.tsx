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
      {posts.length === 0 ? (
        <p className="mt-6 max-w-2xl text-2xl text-muted">
          No entries yet. New log entries will appear here.
        </p>
      ) : (
        <ul className="mt-10 flex flex-col gap-6">
          {posts.map((post, index) => (
            <li key={post.slug} className="relative pixel-border bg-surface p-4 transition-all hover:translate-x-2">
              <SfxLink href={`/blog/${post.slug}`} className="group block">
                <div className="absolute -left-[140px] top-1/2 z-50 w-[120px] -translate-y-1/2 scale-90 opacity-0 transition-all duration-300 ease-out pixel-border bg-surface p-3 pointer-events-none group-hover:scale-100 group-hover:opacity-100 group-hover:-left-[130px]">
                  <p className="font-pixel text-[8px] text-accent">
                    LOG #{String(index + 1).padStart(3, "0")}
                  </p>
                  <p className="mt-1 font-pixel text-[10px] text-highlight">
                    {post.frontmatter.title}
                  </p>
                  {post.frontmatter.techStack.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {post.frontmatter.techStack.slice(0, 2).map((tech) => (
                        <span
                          key={tech}
                          className="font-pixel text-[8px] text-muted"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <p className="font-pixel text-[10px] text-muted">
                  {post.frontmatter.date}
                </p>
                <h2 className="mt-2 font-pixel text-sm text-foreground transition-colors group-hover:text-accent">
                  {post.frontmatter.title}
                </h2>
                <p className="mt-2 text-lg text-muted">
                  {post.frontmatter.summary}
                </p>
              </SfxLink>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
