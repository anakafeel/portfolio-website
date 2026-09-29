/**
 * Tracks whether the visitor has interacted with the page yet. Browsers
 * refuse to start an AudioContext before a user gesture (and log a console
 * warning when you try), so every sound path checks this first.
 */

/** Mirrors the browser's own activation-triggering events. */
const GESTURE_EVENTS = ["pointerdown", "keydown", "touchend"] as const;

let activated = false;

function markActivated() {
  activated = true;
  for (const type of GESTURE_EVENTS) {
    window.removeEventListener(type, markActivated, true);
  }
}

if (typeof window !== "undefined") {
  for (const type of GESTURE_EVENTS) {
    window.addEventListener(type, markActivated, { capture: true, passive: true });
  }
}

interface UserActivationLike {
  hasBeenActive: boolean;
}

/** True once the page has received a click, tap or key press. */
export function hasUserGesture(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  if (activated) {
    return true;
  }
  const ua = (navigator as Navigator & { userActivation?: UserActivationLike })
    .userActivation;
  if (ua?.hasBeenActive) {
    activated = true;
  }
  return activated;
}
