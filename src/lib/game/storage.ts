import { sanitizeGameState, type GameState } from "./state";

export const STORAGE_KEY = "saim:v1";
const STORAGE_VERSION = 1;

interface StoredEnvelope {
  v: number;
  state: GameState;
}

export function loadGameState(): GameState | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as Partial<StoredEnvelope>;
    if (parsed.v !== STORAGE_VERSION) {
      return null;
    }
    return sanitizeGameState(parsed.state);
  } catch {
    // Corrupt or inaccessible storage — start a fresh save file.
    return null;
  }
}

export function saveGameState(state: GameState): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    const envelope: StoredEnvelope = { v: STORAGE_VERSION, state };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(envelope));
  } catch {
    // Storage full or blocked (private mode) — the game still works in-memory.
  }
}
