import type { Metadata } from "next";
import SfxLink from "@/components/sfx/SfxLink";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

import { MDXComponents } from "@/components/mdx/MDXComponents";
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
      <SfxLink
        href="/blog"
        className="font-pixel text-[10px] text-muted transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-none"
      >
        ◄ BACK TO DEV LOG
      </SfxLink>
      <h1 className="mt-6 font-pixel text-xl text-highlight">
        {post.frontmatter.title}
      </h1>
      <p className="mt-3 font-pixel text-[10px] text-muted">
        {post.frontmatter.date}
      </p>
      {post.frontmatter.image && (
        <div className="mt-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.frontmatter.image}
            alt={`${post.frontmatter.title} cover`}
            className="w-full pixelated border-2 border-border pixel-border"
            width={720}
            height={405}
          />
        </div>
      )}
      <div className="mdx-content mt-10">
        <MDXRemote source={post.body} components={MDXComponents} />
      </div>
    </article>
  );
}
