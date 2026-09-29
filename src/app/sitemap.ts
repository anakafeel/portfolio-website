import type { MetadataRoute } from "next";

import { getBlogPosts, getProjects } from "@/lib/content";
import { SITE } from "@/lib/site";

const STATIC_ROUTES = ["/", "/about", "/projects", "/blog", "/rice", "/games"];

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (pathname: string) => new URL(pathname, SITE.url).toString();
  return [
    ...STATIC_ROUTES.map((pathname) => ({ url: url(pathname) })),
    ...getProjects().map((project) => ({
      url: url(`/projects/${project.slug}`),
      lastModified: project.frontmatter.date,
    })),
    ...getBlogPosts().map((post) => ({
      url: url(`/blog/${post.slug}`),
      lastModified: post.frontmatter.date,
    })),
  ];
}
