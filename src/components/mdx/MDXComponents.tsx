function MDXImage({ src, alt, title }: { src: string; alt: string; title?: string }) {
  return (
    <figure className="my-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="w-full pixelated border-2 border-border pixel-border"
      />
      {title && (
        <figcaption className="mt-2 text-center font-pixel text-[10px] text-muted">
          {title}
        </figcaption>
      )}
    </figure>
  );
}

/**
 * Custom components passed to MDXRemote on project and blog pages.
 * Each element is styled to match the 8-bit arcade theme:
 * images get pixel borders, headings use Press Start 2P, etc.
 */
export const MDXComponents = {
  img: MDXImage,
};
