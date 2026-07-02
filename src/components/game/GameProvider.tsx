"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

import type { AchievementId } from "@/lib/game/achievements";
import {
  INITIAL_STATE,
  gameReducer,
  type GameState,
  type ThemeName,
} from "@/lib/game/state";
import { loadGameState, saveGameState } from "@/lib/game/storage";

interface GameContextValue {
  state: GameState;
  /** False until the localStorage save has been loaded on the client. */
  hydrated: boolean;
  award: (id: AchievementId) => void;
  gainXp: (amount: number) => void;
  setTheme: (theme: ThemeName) => void;
  toggleMuted: () => void;
  setVolume: (volume: number) => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = loadGameState();
    if (saved) {
      dispatch({ type: "hydrate", state: saved });
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      saveGameState(state);
    }
  }, [state, hydrated]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", state.theme);
  }, [state.theme]);

  const award = useCallback(
    (id: AchievementId) => dispatch({ type: "award", id }),
    [],
  );
  const gainXp = useCallback(
    (amount: number) => dispatch({ type: "gainXp", amount }),
    [],
  );
  const setTheme = useCallback(
    (theme: ThemeName) => dispatch({ type: "setTheme", theme }),
    [],
  );
  const toggleMuted = useCallback(() => dispatch({ type: "toggleMuted" }), []);
  const setVolume = useCallback(
    (volume: number) => dispatch({ type: "setVolume", volume }),
    [],
  );

  return (
    <GameContext.Provider
      value={{ state, hydrated, award, gainXp, setTheme, toggleMuted, setVolume }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextValue {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used inside <GameProvider>");
  }
  return context;
}
