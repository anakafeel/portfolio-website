export interface GalleryImage {
  src: string;
  alt: string;
}

/**
 * Personal photo gallery — images live in /public/images/personal/.
 *
 * To reorder, just move the entries around in this array.
 * To add new pics, drop them in /public/images/personal/ and add
 * a new entry here.
 *
 * ⚠ Filenames must be URL-safe (no spaces, no special chars).
 */
export const PERSONAL_PICS: GalleryImage[] = [
  { src: "/images/personal/pic-01.jpeg", alt: "Personal pic 01" },
  { src: "/images/personal/pic-02.jpeg", alt: "Personal pic 02" },
  { src: "/images/personal/pic-03.jpeg", alt: "Personal pic 03" },
  { src: "/images/personal/pic-04.jpeg", alt: "Personal pic 04" },
  { src: "/images/personal/pic-05.jpeg", alt: "Personal pic 05" },
  { src: "/images/personal/pic-06.jpeg", alt: "Personal pic 06" },
  { src: "/images/personal/pic-07.jpeg", alt: "Personal pic 07" },
  { src: "/images/personal/pic-08.jpeg", alt: "Personal pic 08" },
  { src: "/images/personal/pic-09.jpeg", alt: "Personal pic 09" },
  { src: "/images/personal/pic-10.jpeg", alt: "Personal pic 10" },
  { src: "/images/personal/pic-11.jpeg", alt: "Personal pic 11" },
  { src: "/images/personal/pic-12.jpeg", alt: "Personal pic 12" },
  { src: "/images/personal/pic-13.jpeg", alt: "Personal pic 13" },
  { src: "/images/personal/pic-14.jpeg", alt: "Personal pic 14" },
  { src: "/images/personal/pic-15.jpeg", alt: "Personal pic 15" },
  { src: "/images/personal/pic-16.jpeg", alt: "Personal pic 16" },
];
