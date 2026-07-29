export type GameStatus = "playing" | "favorite" | "completed";

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
  blurb: string;
  cover?: string;
  details: GameDetails;
}

export const GAMES: GameEntry[] = [
  {
    title: "Rainbow Six Siege",
    genre: "TACTICAL FPS",
    status: "favorite",
    blurb: "I hate droning in this game",
    cover: "/games/siege.svg",
    details: {
      hours: "400+ HRS",
      mains: "ACE / JÄGER",
      memory:
        "The game that taught map knowledge as a skill. Every wall is a door if you believe hard enough and every ranked season starts with 'this is the one where the aim comes back.' Droning first, peeking second, blaming the spawn peek third.",
    },
  },
  {
    title: "Marvel Rivals",
    genre: "HERO SHOOTER",
    status: "playing",
    blurb: "US AGAINST THE WORLD !!!!",
    cover: "/games/marvel-rivals.svg",
    details: {
      hours: "300+ HRS",
      mains: "MOONKNIGHT / CLOAK AND DAGGER",
      memory: "10/10 will recommend if you got friends who can carry you ",
    },
  },
  {
    title: "CS:GO",
    genre: "TACTICAL FPS",
    status: "favorite",
    blurb:
      "The competitive shooter that defined a genre. Plant, defuse, eco, rush B — the callouts never leave you.",
    cover: "/games/csgo.svg",
    details: {
      hours: "300+ HRS",
      mains: "AK-47 / AWP",
      memory:
        "Before Siege, there was Dust 2. The fundamentals crosshair placement, spray control, map awareness — all came from hours of deathmatch and competitive matchmaking. The inventory of sticker-covered skins is worth more than the ranked medals, and 'one more game' has been a lie since 2015.",
    },
  },
  {
    title: "Rocket League",
    genre: "VEHICLE SOCCER",
    status: "playing",
    blurb:
      "Car soccer with a ranked grind that never quits. Aerial mechanics, flip resets, and the best 5-minute rounds in gaming.",
    cover: "/games/rocket-league.svg",
    details: {
      hours: "400+ HRS",
      mains: "OCTANE / DOMINUS",
      memory:
        "The only game where 'git gud' means learning to fly your car upside down. Rotations from ranked 3s translate well the hard part is telling your brain that the ball is the objective, not the enemy. Ceiling shots and air dribbles are the flex, but a solid powershot on target is the real skill.",
    },
  },
  {
    title: "Valorant",
    genre: "TACTICAL FPS",
    status: "favorite",
    blurb: "Its been a while and im glad it has",
    cover: "/games/valorant.svg",
    details: {
      hours: "600+ HRS",
      mains: "JETT / KILLJOY",
      memory: "stop playing this if you love your family",
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
];
