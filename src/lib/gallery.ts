export interface GalleryImage {
  src: string;
  alt: string;
}

/**
 * Personal photo gallery — images live in /public/images/personal/.
 * Add new entries here when new pics are dropped into that folder.
 *
 * ⚠ Filenames must be URL-safe (no spaces, no special chars).
 */
export const PERSONAL_PICS: GalleryImage[] = Array.from(
  { length: 16 },
  (_, i) => {
    const n = String(i + 1).padStart(2, "0");
    return {
      src: `/images/personal/pic-${n}.jpeg`,
      alt: `Personal pic ${n}`,
    };
  },
);
