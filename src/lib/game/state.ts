import {
  ACHIEVEMENTS,
  isAchievementId,
  type AchievementId,
} from "./achievements";

export const THEMES = ["arcade", "phosphor", "synthwave", "gameboy"] as const;
export type ThemeName = (typeof THEMES)[number];

export function isThemeName(value: string): value is ThemeName {
  return (THEMES as readonly string[]).includes(value);
}

export const XP_PER_LEVEL = 100;

export function levelForXp(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

/** Progress within the current level, 0..1 — drives the HUD XP bar. */
export function levelProgress(xp: number): number {
  return (xp % XP_PER_LEVEL) / XP_PER_LEVEL;
}

export interface GameState {
  xp: number;
  level: number;
  achievements: AchievementId[];
  theme: ThemeName;
  muted: boolean;
  volume: number;
}

export const INITIAL_STATE: GameState = {
  xp: 0,
  level: 1,
  achievements: [],
  theme: "arcade",
  muted: false,
  volume: 0.5,
};

export type GameAction =
  | { type: "hydrate"; state: GameState }
  | { type: "award"; id: AchievementId }
  | { type: "gainXp"; amount: number }
  | { type: "setTheme"; theme: ThemeName }
  | { type: "toggleMuted" }
  | { type: "setVolume"; volume: number };

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "hydrate":
      return action.state;

    case "award": {
      // Idempotent: awarding an unlocked achievement is a no-op.
      if (state.achievements.includes(action.id)) {
        return state;
      }
      const xp = state.xp + ACHIEVEMENTS[action.id].xp;
      return {
        ...state,
        xp,
        level: levelForXp(xp),
        achievements: [...state.achievements, action.id],
      };
    }

    case "gainXp": {
      const xp = state.xp + Math.max(0, action.amount);
      return { ...state, xp, level: levelForXp(xp) };
    }

    case "setTheme": {
      if (action.theme === state.theme) {
        return state;
      }
      const next = { ...state, theme: action.theme };
      // Any theme switch unlocks PALETTE SWAP; award path keeps it idempotent.
      return gameReducer(next, { type: "award", id: "theme_shifter" });
    }

    case "toggleMuted":
      return { ...state, muted: !state.muted };

    case "setVolume":
      return { ...state, volume: Math.min(1, Math.max(0, action.volume)) };

    default:
      return state;
  }
}

/** Rebuild a valid GameState from untrusted (localStorage) data. */
export function sanitizeGameState(data: unknown): GameState | null {
  if (typeof data !== "object" || data === null) {
    return null;
  }
  const raw = data as Record<string, unknown>;

  const xp =
    typeof raw.xp === "number" && Number.isFinite(raw.xp) && raw.xp >= 0
      ? Math.floor(raw.xp)
      : 0;

  const achievements = Array.isArray(raw.achievements)
    ? raw.achievements.filter(
        (id): id is AchievementId =>
          typeof id === "string" && isAchievementId(id),
      )
    : [];

  const theme =
    typeof raw.theme === "string" && isThemeName(raw.theme)
      ? raw.theme
      : INITIAL_STATE.theme;

  const volume =
    typeof raw.volume === "number" && Number.isFinite(raw.volume)
      ? Math.min(1, Math.max(0, raw.volume))
      : INITIAL_STATE.volume;

  return {
    xp,
    level: levelForXp(xp),
    achievements: [...new Set(achievements)],
    theme,
    muted: typeof raw.muted === "boolean" ? raw.muted : INITIAL_STATE.muted,
    volume,
  };
}
