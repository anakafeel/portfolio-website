/**
 * Chiptune sound effects synthesized with the Web Audio API — square-wave
 * notes with a fast decay, no audio files. The AudioContext is created
 * lazily on first play so it always follows a user gesture.
 */

interface Note {
  /** Frequency in Hz. */
  freq: number;
  /** Offset from the effect start, in seconds. */
  at: number;
  /** Note length in seconds. */
  dur: number;
}

export type SfxName =
  | "blip"
  | "click"
  | "tick"
  | "achievement"
  | "level_up"
  | "theme"
  | "terminal"
  | "terminal_off";

const SFX: Record<SfxName, Note[]> = {
  blip: [{ freq: 660, at: 0, dur: 0.06 }],
  /* UI click — short and bright so rapid clicks never smear. */
  click: [{ freq: 880, at: 0, dur: 0.04 }],
  /* Keystroke tick — quiet, near-percussive. */
  tick: [{ freq: 1320, at: 0, dur: 0.02 }],
  theme: [
    { freq: 523, at: 0, dur: 0.07 },
    { freq: 784, at: 0.08, dur: 0.09 },
  ],
  terminal: [
    { freq: 392, at: 0, dur: 0.06 },
    { freq: 523, at: 0.07, dur: 0.06 },
    { freq: 659, at: 0.14, dur: 0.09 },
  ],
  /* Mirror of "terminal": the same jingle descending for power-off. */
  terminal_off: [
    { freq: 659, at: 0, dur: 0.06 },
    { freq: 523, at: 0.07, dur: 0.06 },
    { freq: 392, at: 0.14, dur: 0.09 },
  ],
  achievement: [
    { freq: 523, at: 0, dur: 0.09 },
    { freq: 659, at: 0.1, dur: 0.09 },
    { freq: 784, at: 0.2, dur: 0.09 },
    { freq: 1047, at: 0.3, dur: 0.22 },
  ],
  level_up: [
    { freq: 392, at: 0, dur: 0.08 },
    { freq: 523, at: 0.09, dur: 0.08 },
    { freq: 659, at: 0.18, dur: 0.08 },
    { freq: 784, at: 0.27, dur: 0.08 },
    { freq: 1047, at: 0.36, dur: 0.3 },
  ],
};

const PEAK_GAIN = 0.16;

let context: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") {
    return null;
  }
  if (!context) {
    try {
      context = new AudioContext();
    } catch {
      return null;
    }
  }
  if (context.state === "suspended") {
    void context.resume();
  }
  return context;
}

/** Play a named effect. Volume is 0..1 from the game state. */
export function playSfx(name: SfxName, volume: number): void {
  const ctx = getContext();
  if (!ctx || volume <= 0) {
    return;
  }
  const start = ctx.currentTime;
  const peak = PEAK_GAIN * Math.min(1, Math.max(0, volume));

  for (const note of SFX[name]) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.value = note.freq;

    const noteStart = start + note.at;
    gain.gain.setValueAtTime(peak, noteStart);
    gain.gain.exponentialRampToValueAtTime(0.001, noteStart + note.dur);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(noteStart);
    osc.stop(noteStart + note.dur + 0.02);
  }
}
