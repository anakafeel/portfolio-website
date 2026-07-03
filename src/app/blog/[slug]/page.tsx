import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

import { getBlogPost, getBlogPosts } from "@/lib/content";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) {
    return {};
  }
  return {
    title: `${post.frontmatter.title} — Saim Hashmi`,
    description: post.frontmatter.summary,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <Link
        href="/blog"
        className="font-pixel text-[10px] text-muted transition-colors hover:text-accent"
      >
        ◄ BACK TO DEV LOG
      </Link>
      <h1 className="mt-6 font-pixel text-xl text-highlight">
        {post.frontmatter.title}
      </h1>
      <p className="mt-3 font-pixel text-[10px] text-muted">
        {post.frontmatter.date}
      </p>
      <div className="mdx-content mt-10">
        <MDXRemote source={post.body} />
      </div>
    </article>
  );
}
