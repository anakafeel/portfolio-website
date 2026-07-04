export type GameStatus = "playing" | "favorite" | "completed" | "backlog";

export interface GameEntry {
  title: string;
  genre: string;
  status: GameStatus;
  /**
   * DRAFT COPY — placeholder blurbs written for layout. Replace each one
   * with Saim's real history with the game before publishing.
   */
  blurb: string;
  /** Public path to self-hosted cover art. Card renders a placeholder until set. */
  cover?: string;
}

export const GAMES: GameEntry[] = [
  {
    title: "Rainbow Six Siege",
    genre: "TACTICAL FPS",
    status: "favorite",
    blurb:
      "The long-time main. Droning, angles, and one-speed brain — thousands of hours of destructible walls.",
  },
  {
    title: "Valorant",
    genre: "TACTICAL FPS",
    status: "playing",
    blurb:
      "The current competitive grind. Crosshair placement carried over from Siege; the aim training never ends.",
  },
  {
    title: "Apex Legends",
    genre: "BATTLE ROYALE",
    status: "favorite",
    blurb:
      "Movement tech and third parties. The FPS comfort food between ranked sessions elsewhere.",
  },
  {
    title: "Overwatch",
    genre: "HERO SHOOTER",
    status: "favorite",
    blurb:
      "Where the hero-shooter itch started. Still convinced the tank diff was never my fault.",
  },
  {
    title: "Mortal Kombat 1",
    genre: "FIGHTING",
    status: "completed",
    blurb:
      "Story mode cleared. Kombos half-remembered, fatalities fully remembered.",
  },
  {
    title: "Steam Summer Sale Haul",
    genre: "MYSTERY LOOT",
    status: "backlog",
    blurb:
      "Fresh from the sale, still shrink-wrapped. Titles to be revealed once they leave the download queue.",
  },
];
