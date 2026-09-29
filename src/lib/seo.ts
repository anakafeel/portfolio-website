import type { Metadata } from "next";

import { SITE } from "@/lib/site";

/**
 * The root `app/opengraph-image.tsx` card. Next only attaches file-based OG
 * images to the segment that owns the file, and a page that sets its own
 * `openGraph` replaces the parent's object wholesale, so per-page metadata
 * has to point back at the image explicitly.
 */
export const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${SITE.name} — Software Engineer`,
};

type PageMetadataInput = {
  /** Route path, e.g. "/projects/nightwatch". Used for canonical + og:url. */
  path: string;
  /** Short page title; the root layout template appends " — Saim Hashmi". */
  title: string;
  description: string;
  type?: "website" | "article";
  publishedTime?: string;
};

/** Canonical URL, Open Graph and Twitter card for a single page. */
export function pageMetadata({
  path,
  title,
  description,
  type = "website",
  publishedTime,
}: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      siteName: SITE.name,
      locale: "en_CA",
      title,
      description,
      images: [OG_IMAGE],
      ...(publishedTime && { publishedTime }),
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
