import type { VideoHTMLAttributes } from "react";

import MDXVideo from "./MDXVideo";

/**
 * Markdown `![alt](src "title")` is emitted inside a `<p>`, so this must stay
 * phrasing content: a `<figure>` here is invalid HTML, the browser re-parents
 * it, and React throws hydration error #418. Block-styled spans keep the
 * figure layout without breaking the paragraph.
 */
function MDXImage({ src, alt, title }: { src: string; alt: string; title?: string }) {
  return (
    <span className="my-6 block">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="block w-full pixelated border-2 border-border pixel-border"
      />
      {title && (
        <span className="mt-2 block text-center font-pixel text-[10px] text-muted">
          {title}
        </span>
      )}
    </span>
  );
}

/**
 * Custom components passed to MDXRemote on project and blog pages.
 * Each element is styled to match the 8-bit arcade theme:
 * images get pixel borders, headings use Press Start 2P, etc.
 */
export const MDXComponents = {
  img: MDXImage,
  video: (props: VideoHTMLAttributes<HTMLVideoElement>) => <MDXVideo {...props} />,
};
