export interface AchievementDef {
  title: string;
  description: string;
  xp: number;
}

/**
 * Registry of every achievement in the game. IDs are stable — they are
 * persisted in localStorage, so never rename one once shipped.
 * Later phases wire the triggers (terminal, quest cards, contact section).
 */
export const ACHIEVEMENTS = {
  theme_shifter: {
    title: "PALETTE SWAP",
    description: "Switched the color theme",
    xp: 25,
  },
  found_terminal: {
    title: "SECRET CONSOLE",
    description: "Discovered the terminal",
    xp: 50,
  },
  quest_accepted: {
    title: "QUEST ACCEPTED",
    description: "Opened a project quest",
    xp: 25,
  },
  signal_sent: {
    title: "SIGNAL SENT",
    description: "Copied the contact email",
    xp: 25,
  },
} as const satisfies Record<string, AchievementDef>;

export type AchievementId = keyof typeof ACHIEVEMENTS;

export const ACHIEVEMENT_IDS = Object.keys(ACHIEVEMENTS) as AchievementId[];

export function isAchievementId(value: string): value is AchievementId {
  return value in ACHIEVEMENTS;
}
