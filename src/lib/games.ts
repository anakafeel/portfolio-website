export type GameStatus = "playing" | "favorite" | "completed" | "backlog";

export interface GameDetails {
  /** e.g. "1,200+ HRS" — shown as a stat row in the detail popup. */
  hours: string;
  /** Mains / role / class — whatever fits the game. */
  mains: string;
  /** Longer story for the popup; the card blurb stays short. */
  memory: string;
}

export interface GameEntry {
  title: string;
  genre: string;
  status: GameStatus;
  /**
   * DRAFT COPY — placeholder blurbs, hours, and mains written for layout.
   * Replace each one with Saim's real history with the game before
   * publishing.
   */
  blurb: string;
  /**
   * Public path to self-hosted cover art. The SVGs in public/games/ are
   * original pixel-art placeholders — drop in real art and update the path.
   */
  cover?: string;
  details: GameDetails;
}

export const GAMES: GameEntry[] = [
  {
    title: "Rainbow Six Siege",
    genre: "TACTICAL FPS",
    status: "favorite",
    blurb:
      "The long-time main. Droning, angles, and one-speed brain — thousands of hours of destructible walls.",
    cover: "/games/siege.svg",
    details: {
      hours: "2,000+ HRS",
      mains: "ASH / JÄGER",
      memory:
        "The game that taught map knowledge as a skill. Every wall is a door if you believe hard enough — and every ranked season starts with 'this is the one where the aim comes back.' Droning first, peeking second, blaming the spawn peek third.",
    },
  },
  {
    title: "Valorant",
    genre: "TACTICAL FPS",
    status: "playing",
    blurb:
      "The current competitive grind. Crosshair placement carried over from Siege; the aim training never ends.",
    cover: "/games/valorant.svg",
    details: {
      hours: "600+ HRS",
      mains: "JETT / KILLJOY",
      memory:
        "Where the Siege habits went to get re-trained. Utility lineups live rent-free in memory that should be holding course material. The rank climbs in the summer and mysteriously decays every exam season.",
    },
  },
  {
    title: "Apex Legends",
    genre: "BATTLE ROYALE",
    status: "favorite",
    blurb:
      "Movement tech and third parties. The FPS comfort food between ranked sessions elsewhere.",
    cover: "/games/apex.svg",
    details: {
      hours: "800+ HRS",
      mains: "WRAITH / PATHFINDER",
      memory:
        "The movement game. Tap-strafing around a corner that nobody was watching remains one of gaming's purest joys. Wins come in threes; so do the squads that arrive mid-fight.",
    },
  },
  {
    title: "Overwatch",
    genre: "HERO SHOOTER",
    status: "favorite",
    blurb:
      "Where the hero-shooter itch started. Still convinced the tank diff was never my fault.",
    cover: "/games/overwatch.svg",
    details: {
      hours: "1,000+ HRS",
      mains: "GENJI / LÚCIO",
      memory:
        "The origin story for caring about team comps in pubs. 'I need healing' was a lifestyle, not a voice line. The tank diff was — and this is important — never my fault.",
    },
  },
  {
    title: "Mortal Kombat 1",
    genre: "FIGHTING",
    status: "completed",
    blurb:
      "Story mode cleared. Kombos half-remembered, fatalities fully remembered.",
    cover: "/games/mk1.svg",
    details: {
      hours: "80+ HRS",
      mains: "SCORPION",
      memory:
        "The couch game. Story mode cleared start to finish, then straight into teaching friends the hard way that 'button mashing' is a legitimate mid-tier strategy. Fatality inputs are stored more reliably than most passwords.",
    },
  },
  {
    title: "Steam Summer Sale Haul",
    genre: "MYSTERY LOOT",
    status: "backlog",
    blurb:
      "Fresh from the sale, still shrink-wrapped. Titles to be revealed once they leave the download queue.",
    cover: "/games/backlog.svg",
    details: {
      hours: "0 HRS",
      mains: "TBD",
      memory:
        "Acquired at 80% off, which everyone knows makes them free. Currently seasoning in the library. The plan is to play them 'after this semester,' a phrase that has now survived four semesters.",
    },
  },
];
