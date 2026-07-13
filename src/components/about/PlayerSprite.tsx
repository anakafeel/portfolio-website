/**
 * Original pixel-art player character (no licensed sprites — Nintendo IP is
 * off the table). Two hand-drawn frames; CSS in globals.css alternates them
 * in hard steps while the parent .story-sprite has .is-walking.
 */

const PALETTE: Record<string, string> = {
  H: "#4a2f1b", // hair
  K: "#22223a", // headphones / outline details
  S: "#f2c79a", // skin
  E: "#22223a", // eyes
  R: "#e23b3b", // hoodie
  J: "#2b50c8", // jeans
  B: "#5a3a1a", // shoes
};

/** Standing / contact frame. */
const FRAME_A = [
  "....HHHH....",
  "..KHHHHHHK..",
  "..KHHHHHHK..",
  "..KSSSSSSK..",
  "..SSESSESS..",
  "..SSSSSSSS..",
  "...SSSSSS...",
  "..RRRRRRRR..",
  ".RRRRRRRRRR.",
  ".RRSRRRRSRR.",
  ".RRRRRRRRRR.",
  "..RRRRRRRR..",
  "..JJJJJJJJ..",
  "..JJJ..JJJ..",
  "..JJ....JJ..",
  ".BBB....BBB.",
  ".BBB....BBB.",
];

/** Mid-stride frame: legs gathered, feet offset. */
const FRAME_B = [
  "....HHHH....",
  "..KHHHHHHK..",
  "..KHHHHHHK..",
  "..KSSSSSSK..",
  "..SSESSESS..",
  "..SSSSSSSS..",
  "...SSSSSS...",
  "..RRRRRRRR..",
  ".RRRRRRRRRR.",
  ".RRSRRRRSRR.",
  ".RRRRRRRRRR.",
  "..RRRRRRRR..",
  "..JJJJJJJJ..",
  "...JJJJJJ...",
  "....JJJJ....",
  "....BBBB....",
  "...BBBB.....",
];

const COLS = 12;
const ROWS = 17;

interface FrameProps {
  map: string[];
  className: string;
}

function Frame({ map, className }: FrameProps) {
  return (
    <svg
      viewBox={`0 0 ${COLS} ${ROWS}`}
      width={COLS * 4}
      height={ROWS * 4}
      shapeRendering="crispEdges"
      className={className}
      aria-hidden
    >
      {map.flatMap((row, y) =>
        [...row].map((cell, x) =>
          cell === "." ? null : (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width={1}
              height={1}
              fill={PALETTE[cell]}
            />
          ),
        ),
      )}
    </svg>
  );
}

export default function PlayerSprite() {
  return (
    <span className="relative block">
      <Frame map={FRAME_A} className="sprite-frame-a block" />
      <Frame map={FRAME_B} className="sprite-frame-b absolute inset-0" />
    </span>
  );
}
