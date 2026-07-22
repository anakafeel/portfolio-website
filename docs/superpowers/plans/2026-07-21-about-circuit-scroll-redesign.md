# About Page Circuit-Scroll Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the About page's Mario-style side-scroller (`StorySideScroller.tsx`) with a scroll-driven 3D "Inspection Probe" sequence — a camera dolly through a CC0 low-poly circuit board, with a camera-parented diagnostic probe, terminal-style scan readouts, and an SVG trace-line progress overlay — per `docs/superpowers/specs/2026-07-21-about-circuit-scroll-redesign-design.md`.

**Architecture:** A new `CircuitScene.tsx` react-three-fiber Canvas (dynamically imported, `ssr: false`, mirroring the homepage hero's `VoxelScene` pattern) renders a static CC0 board model and a hand-built probe parented to the camera. `StorySideScroller.tsx` keeps its existing GSAP `ScrollTrigger` pin+scrub timeline but now drives a single `progress` ref (read from `self.progress`) instead of a horizontal DOM track — that ref feeds the 3D camera path, an SVG trace overlay's `stroke-dashoffset`, and the existing story-beat card reveal logic. `StoryLevel.tsx` (mobile/reduced-motion fallback) gets a matching but 3D-free trace-line re-skin. `StoryStage.tsx` gains a WebGL capability check alongside its existing media-query gate.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind, GSAP + `@gsap/react` + `ScrollTrigger` (already installed), `three` + `@react-three/fiber` + `@react-three/drei` (already installed, already used by `VoxelScene.tsx`), no new dependencies.

## Global Constraints

- **No new npm dependencies.** Everything needed (GSAP, three, r3f, drei) is already installed and already used elsewhere in this codebase.
- **This project has no test runner** (per `CLAUDE.md`: "pnpm build — production build; this is the main type/correctness check (there are no tests)"). Every task's verification is therefore: (1) `pnpm build` must succeed with no new type errors, (2) a manual browser check with a specific, stated expected visual outcome (using the project's existing Playwright-driven screenshot approach, or the dev server directly), in place of the unit-test steps this skill's template normally expects. This is a deliberate adaptation to the project's real toolchain, not a skipped step.
- **No hardcoded hex colors in new UI chrome** outside the theme-color hooks — reuse `useThemeColors`/CSS custom properties, per `DESIGN.md`'s "One Cartridge Rule". The 3D scene's own model materials (baked into the CC0 GLB) are the one exception, same as the hero's voxel field uses fixed geometry with theme-reactive *color*.
- **`border-radius` stays `0px` everywhere** (`DESIGN.md`'s "Square Corner Rule") — all new HTML chrome (cards, HUD callouts) uses the existing `pixel-border`/`border-2 border-border` utilities, never a rounded corner.
- **Every new animation must respect `prefers-reduced-motion`** — the existing `usePrefersReducedMotion` pattern (freezing `frameloop` to `"demand"`) and `StoryStage`'s vertical-fallback gate both already handle this; new code must not bypass either.
- **CC0 asset already sourced and in place**: `public/models/circuit/electronic-components.glb` (740,244 bytes, from OpenGameArt.org "Lowpoly Electronic Components" by iPoly3D, CC0, no compression extensions, no textures — plain `useGLTF()` works with no DRACO/KTX2 decoder setup needed). Credited in `public/models/circuit/CREDITS.md`. Verified node names/positions (in model space):
  - `"Cube"` at `(0, 1.71, 0)` — plain PCB segment, used for **SPAWN POINT**
  - `"pci-e card"` at `(20, 1.71, -5)` — expansion card, used for **SKILL TREE**
  - `"microchip 1"` at `(15, 1.71, -15)` — IC, used for **SIDE QUESTS**
  - `"microchip 1.001"` at `(20, 1.71, -15)` — IC, used for **CURRENT QUEST**

---

### Task 1: Extract shared react-three-fiber scene hooks (DRY prerequisite)

`VoxelScene.tsx` already defines `useThemeColors` and `usePrefersReducedMotion` locally. `CircuitScene.tsx` (Task 2) needs the exact same two hooks. Extract them into one shared file first so both scenes consume identical logic instead of a second copy drifting from the first.

**Files:**
- Create: `src/lib/three/sceneHooks.ts`
- Modify: `src/components/hero/VoxelScene.tsx:1-67` (remove the local definitions, import from the new file)

**Interfaces:**
- Produces: `useThemeColors(): ThemeColors` where `interface ThemeColors { accent: string; accentAlt: string; background: string }`, and `usePrefersReducedMotion(): boolean`. Both are exported from `src/lib/three/sceneHooks.ts` and consumed by `VoxelScene.tsx` (this task) and `CircuitScene.tsx` (Task 2).

- [ ] **Step 1: Create the shared hooks file**

```ts
// src/lib/three/sceneHooks.ts
"use client";

import { useEffect, useState } from "react";

export interface ThemeColors {
  accent: string;
  accentAlt: string;
  background: string;
}

const FALLBACK_COLORS: ThemeColors = {
  accent: "#ff2d78",
  accentAlt: "#00e5ff",
  background: "#0a0a12",
};

/**
 * Reads theme CSS custom properties live, re-reading whenever the
 * `data-theme` attribute on <html> changes. Shared by every
 * react-three-fiber scene so theme-reactive lighting stays consistent.
 */
export function useThemeColors(): ThemeColors {
  const [colors, setColors] = useState<ThemeColors>(FALLBACK_COLORS);

  useEffect(() => {
    const read = () => {
      const style = getComputedStyle(document.documentElement);
      const get = (name: string, fallback: string) =>
        style.getPropertyValue(name).trim() || fallback;
      setColors({
        accent: get("--color-accent", FALLBACK_COLORS.accent),
        accentAlt: get("--color-accent-alt", FALLBACK_COLORS.accentAlt),
        background: get("--color-background", FALLBACK_COLORS.background),
      });
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  return colors;
}

/** Tracks `prefers-reduced-motion`, live-updating on change. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
```

- [ ] **Step 2: Refactor `VoxelScene.tsx` to import the shared hooks**

Replace lines 1-67 of `src/components/hero/VoxelScene.tsx` (everything from the top through the end of the `usePrefersReducedMotion` function — i.e. up to but not including `interface VoxelFieldProps`) with:

```tsx
"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { useThemeColors, usePrefersReducedMotion } from "@/lib/three/sceneHooks";

/** Wider than deep so the floor spans the full viewport on wide screens. */
const GRID_X = 42;
const GRID_Z = 22;
const SPACING = 1.1;
const VOXEL_COUNT = GRID_X * GRID_Z;
/** Wave height snaps to this step so motion reads as blocky, not smooth. */
const VOXEL_STEP = 0.25;
/** Animation ticks at 8 fps for a deliberate low-frame-rate retro feel. */
const TICK_RATE = 8;
```

Leave everything from `interface VoxelFieldProps` onward (the `VoxelField` function and the default-exported `VoxelScene` function) exactly as it is today — they already only reference `colors`/`animate`/`reducedMotion` by name, not the removed local definitions, so no further edits are needed there.

- [ ] **Step 3: Verify types and build**

Run: `pnpm build`
Expected: build succeeds with no new TypeScript errors, `/` (homepage) still lists in the route output.

- [ ] **Step 4: Manual visual regression check**

Run `pnpm dev`, open `http://localhost:3000/`, confirm the hero voxel field still animates and still recolors when switching themes via the HUD's theme swatches (A/P/S/G buttons) — identical behavior to before this refactor, since the extracted hook code is byte-for-byte the same logic, just relocated.

- [ ] **Step 5: Commit**

```bash
git add src/lib/three/sceneHooks.ts src/components/hero/VoxelScene.tsx
git commit -m "refactor: extract shared r3f scene hooks from VoxelScene"
```

---

### Task 2: `CircuitScene.tsx` — static board render (no scroll wiring yet)

Build the new Canvas component in isolation first: load the CC0 model, light it, add the hand-built probe, and prove it renders correctly at a hardcoded progress value before wiring it to scroll in Task 3.

**Files:**
- Create: `src/components/about/CircuitScene.tsx`

**Interfaces:**
- Consumes: `useThemeColors`, `usePrefersReducedMotion` from `src/lib/three/sceneHooks.ts` (Task 1). The GLB at `/models/circuit/electronic-components.glb` with node names `"Cube"`, `"pci-e card"`, `"microchip 1"`, `"microchip 1.001"` (see Global Constraints).
- Produces: `export default function CircuitScene({ progressRef }: { progressRef: React.RefObject<number> })` — a client component rendering a `<Canvas>`. `progressRef.current` is a plain number in `[0, 1]`; `CircuitScene` never writes to it, only reads it every frame. This exact prop shape is what Task 4 (`StorySideScroller.tsx`) must produce.

- [ ] **Step 1: Write `CircuitScene.tsx`**

```tsx
// src/components/about/CircuitScene.tsx
"use client";

import { Suspense, useMemo, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, useGLTF, useProgress } from "@react-three/drei";
import * as THREE from "three";

import { useThemeColors, usePrefersReducedMotion } from "@/lib/three/sceneHooks";

const MODEL_URL = "/models/circuit/electronic-components.glb";

/**
 * Board-space positions of the 4 components the probe visits, one per
 * STORY_BEATS entry, in order: SPAWN POINT, SKILL TREE, SIDE QUESTS,
 * CURRENT QUEST. Verified against the real glTF node transforms in
 * public/models/circuit/electronic-components.glb.
 */
const WAYPOINTS: THREE.Vector3[] = [
  new THREE.Vector3(0, 1.71, 0), // "Cube"
  new THREE.Vector3(20, 1.71, -5), // "pci-e card"
  new THREE.Vector3(15, 1.71, -15), // "microchip 1"
  new THREE.Vector3(20, 1.71, -15), // "microchip 1.001"
];

/** Camera sits above/behind each waypoint, looking down at the component. */
const CAMERA_OFFSET = new THREE.Vector3(-4, 6, 8);

function buildCameraCurve(): THREE.CatmullRomCurve3 {
  const points = WAYPOINTS.map((p) => p.clone().add(CAMERA_OFFSET));
  return new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.2);
}

function buildLookCurve(): THREE.CatmullRomCurve3 {
  const points = WAYPOINTS.map((p) => p.clone());
  return new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.2);
}

interface RigProps {
  progressRef: RefObject<number>;
}

/**
 * Camera rig: moves along a hand-authored path driven by `progressRef`.
 * The diagnostic probe is a child of this group, so it rides along for
 * free — no separate tween needed for the probe itself.
 */
function Rig({ progressRef }: RigProps) {
  const { camera } = useThree();
  const cameraCurve = useMemo(buildCameraCurve, []);
  const lookCurve = useMemo(buildLookCurve, []);

  useFrame(() => {
    const t = THREE.MathUtils.clamp(progressRef.current ?? 0, 0, 1);
    camera.position.copy(cameraCurve.getPointAt(t));
    camera.lookAt(lookCurve.getPointAt(t));
  });

  return (
    <group position={[0, -0.6, -1.4]}>
      {/* Diagnostic probe body */}
      <mesh>
        <boxGeometry args={[0.35, 0.2, 0.5]} />
        <meshStandardMaterial color="#16162a" />
      </mesh>
      {/* Glowing tip */}
      <mesh position={[0, -0.05, 0.35]}>
        <coneGeometry args={[0.08, 0.3, 8]} />
        <meshStandardMaterial
          color="#ff2d78"
          emissive="#ff2d78"
          emissiveIntensity={2}
        />
      </mesh>
      <pointLight
        color="#ff2d78"
        intensity={1.5}
        distance={3}
        position={[0, -0.05, 0.5]}
      />
    </group>
  );
}

function Board() {
  const { scene } = useGLTF(MODEL_URL);
  return <primitive object={scene} />;
}

/** On-theme loading readout shown in place of the board while the GLB fetches. */
function BoardLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <p className="font-pixel text-[10px] text-accent-alt motion-safe:animate-blink">
        {"> "}CALIBRATING... {Math.round(progress)}%
      </p>
    </Html>
  );
}

interface CircuitSceneProps {
  progressRef: RefObject<number>;
}

export default function CircuitScene({ progressRef }: CircuitSceneProps) {
  const colors = useThemeColors();
  const reducedMotion = usePrefersReducedMotion();

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      frameloop={reducedMotion ? "demand" : "always"}
    >
      <color attach="background" args={[colors.background]} />
      <fog attach="fog" args={[colors.background, 15, 45]} />
      <ambientLight intensity={0.9} />
      <directionalLight
        position={[5, 20, 10]}
        intensity={1.6}
        color={colors.accentAlt}
      />
      <Suspense fallback={<BoardLoader />}>
        <Board />
      </Suspense>
      <Rig progressRef={progressRef} />
    </Canvas>
  );
}

useGLTF.preload(MODEL_URL);
```

- [ ] **Step 2: Verify types and build**

Run: `pnpm build`
Expected: build succeeds with no new TypeScript errors. `CircuitScene.tsx` is not imported anywhere yet, so it won't appear in any route's bundle — this step only confirms it type-checks in isolation.

- [ ] **Step 3: Manual smoke test in isolation**

Temporarily render it from a scratch page to confirm the model loads and looks right before wiring it into the real scroll flow: create `src/app/about/circuit-preview/page.tsx` with:

```tsx
"use client";

import { useRef } from "react";
import CircuitScene from "@/components/about/CircuitScene";

export default function CircuitPreviewPage() {
  const progressRef = useRef(0.5);
  return (
    <div style={{ height: "100vh" }}>
      <CircuitScene progressRef={progressRef} />
    </div>
  );
}
```

Run `pnpm dev`, open `http://localhost:3000/about/circuit-preview`, confirm: the board renders (green PCB components visible), the camera is framing the `"microchip 1"`/`"microchip 1.001"` area (since `progressRef.current = 0.5` sits mid-path), the probe's glowing pink tip is visible in the lower-center of frame, and no console errors. Then **delete `src/app/about/circuit-preview/`** — it was scaffolding for this check only, not a real route.

- [ ] **Step 4: Commit**

```bash
git add src/components/about/CircuitScene.tsx
git commit -m "feat: add static CircuitScene render for About page redesign"
```

---

### Task 3: Add WebGL capability fallback to `StoryStage.tsx`

Extend the existing device/motion gate so devices without WebGL also get the vertical `StoryLevel` fallback, before wiring the real scroll-driven `CircuitScene` into `StorySideScroller.tsx` in Task 4.

**Files:**
- Modify: `src/components/about/StoryStage.tsx` (full file, 29 lines)

**Interfaces:**
- No new exports; `StoryStage` keeps its existing `export default function StoryStage()` signature, still choosing between `<StorySideScroller />` and `<StoryLevel />`.

- [ ] **Step 1: Add the WebGL check**

Replace the full contents of `src/components/about/StoryStage.tsx` with:

```tsx
"use client";

import { useEffect, useState } from "react";

import StoryLevel from "@/components/about/StoryLevel";
import StorySideScroller from "@/components/about/StorySideScroller";

/**
 * The pinned circuit-scroll sequence is a desktop, motion-allowed,
 * WebGL-capable experience; everyone else keeps the vertical story level.
 * SSR renders the vertical version so content is always present before
 * hydration.
 */
const SIDE_SCROLL_QUERY =
  "(min-width: 768px) and (prefers-reduced-motion: no-preference)";

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl"),
    );
  } catch {
    return false;
  }
}

export default function StoryStage() {
  const [sideScroll, setSideScroll] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(SIDE_SCROLL_QUERY);
    const evaluate = () => setSideScroll(query.matches && supportsWebGL());
    evaluate();
    const onChange = () => evaluate();
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return sideScroll ? <StorySideScroller /> : <StoryLevel />;
}
```

- [ ] **Step 2: Verify types and build**

Run: `pnpm build`
Expected: build succeeds with no new TypeScript errors.

- [ ] **Step 3: Manual verification**

Run `pnpm dev`, open `http://localhost:3000/about` in a normal desktop browser window (≥768px, motion allowed) — should still resolve to whichever component `StorySideScroller` currently is (unchanged until Task 4). This step only confirms the added `supportsWebGL()` check doesn't break the existing gate (WebGL is available in any real browser, so behavior is unchanged today; it only matters once a WebGL-dependent scene exists after Task 4).

- [ ] **Step 4: Commit**

```bash
git add src/components/about/StoryStage.tsx
git commit -m "feat: add WebGL capability check to StoryStage's desktop gate"
```

---

### Task 4: Rewrite `StorySideScroller.tsx` — wire `CircuitScene` to scroll, replace the Mario world

This is the core task: replace the horizontal Mario-platformer JSX with the pinned 3D sequence, reusing the existing GSAP pin+scrub timeline structure.

**Files:**
- Modify (full rewrite): `src/components/about/StorySideScroller.tsx` (currently 311 lines)

**Interfaces:**
- Consumes: `CircuitScene` (Task 2) via `dynamic(() => import("@/components/about/CircuitScene"), { ssr: false })`. `STORY_BEATS` from `@/lib/about` (unchanged shape: `{ world, title, body, logo }`, 4 entries).
- Produces: `export default function StorySideScroller()` — same signature as today, so `StoryStage.tsx` (Task 3) requires no further changes.

- [ ] **Step 1: Replace the full file**

```tsx
// src/components/about/StorySideScroller.tsx
"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import SfxAnchor from "@/components/sfx/SfxAnchor";
import { STORY_BEATS } from "@/lib/about";
import { RESUME_URL } from "@/lib/site";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CircuitScene = dynamic(() => import("@/components/about/CircuitScene"), {
  ssr: false,
});

/**
 * One reveal fraction per STORY_BEATS entry (0-1 along the pinned scroll
 * range), hand-authored to roughly match each camera waypoint in
 * CircuitScene's WAYPOINTS array. Decoupled from the 3D curve's own
 * arc-length parameterization on purpose — exact frame-perfect sync isn't
 * needed, just a close visual match.
 */
const BEAT_FRACTIONS = [0.08, 0.36, 0.64, 0.86];
const CLEAR_FRACTION = 0.95;
/** How long each beat + its scan line stays visible before the next one takes over. */
const REVEAL_WINDOW = 0.16;
/**
 * SVG-space [x, y] for each trace marker — must match the trace path's own
 * `d` coordinates below exactly: (20,100), (140,40), (260,160), (380,100).
 */
const TRACE_MARKER_POINTS: [number, number][] = [
  [20, 100],
  [140, 40],
  [260, 160],
  [380, 100],
];

/**
 * Pinned circuit-board inspection sequence: vertical scroll drives a
 * camera dolly through a CC0 low-poly circuit board (CircuitScene) while a
 * diagnostic probe rides along, parented to the camera. Mount only on
 * desktop with motion + WebGL available — StoryStage handles that gate
 * and the vertical fallback.
 */
export default function StorySideScroller() {
  const stageRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const traceRef = useRef<SVGPathElement>(null);

  useGSAP(
    () => {
      const stage = stageRef.current;
      const trace = traceRef.current;
      if (!stage) return;

      const traceLength = trace?.getTotalLength() ?? 0;
      if (trace && traceLength > 0) {
        trace.style.strokeDasharray = `${traceLength}`;
        trace.style.strokeDashoffset = `${traceLength}`;
      }

      ScrollTrigger.create({
        trigger: stage,
        start: "top top",
        end: "+=400%",
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          progressRef.current = self.progress;
          if (trace && traceLength > 0) {
            trace.style.strokeDashoffset = `${traceLength * (1 - self.progress)}`;
          }
        },
      });

      // Reveal each story-beat card + scan line inside its fraction window,
      // and the final "LEVEL CLEAR" card near the end. Each ScrollTrigger
      // only starts a new tween when `inWindow` actually flips, not on
      // every scrub tick, to avoid spawning redundant tweens continuously
      // while the user scrolls.
      gsap.utils.toArray<HTMLElement>(".scroller-beat").forEach((beat, i) => {
        const at = BEAT_FRACTIONS[i];
        gsap.set(beat, { autoAlpha: 0, y: 24 });
        let wasInWindow = false;
        ScrollTrigger.create({
          trigger: stage,
          start: "top top",
          end: "+=400%",
          scrub: true,
          onUpdate: (self) => {
            const inWindow =
              self.progress >= at && self.progress < at + REVEAL_WINDOW;
            if (inWindow === wasInWindow) return;
            wasInWindow = inWindow;
            gsap.to(beat, {
              autoAlpha: inWindow ? 1 : 0,
              y: inWindow ? 0 : 24,
              duration: 0.08,
              ease: "steps(4)",
              overwrite: "auto",
            });
          },
        });
      });

      const clear = stage.querySelector<HTMLElement>(".scroller-clear");
      if (clear) {
        gsap.set(clear, { autoAlpha: 0, scale: 0.5 });
        let clearWasVisible = false;
        ScrollTrigger.create({
          trigger: stage,
          start: "top top",
          end: "+=400%",
          scrub: true,
          onUpdate: (self) => {
            const inWindow = self.progress >= CLEAR_FRACTION;
            if (inWindow === clearWasVisible) return;
            clearWasVisible = inWindow;
            gsap.to(clear, {
              autoAlpha: inWindow ? 1 : 0,
              scale: inWindow ? 1 : 0.5,
              duration: 0.06,
              ease: "steps(4)",
              overwrite: "auto",
            });
          },
        });
      }
    },
    { scope: stageRef },
  );

  return (
    <div
      ref={stageRef}
      className="relative mt-16 h-[85vh] overflow-hidden border-y-2 border-border bg-background"
    >
      <CircuitScene progressRef={progressRef} />

      {/* Trace-line overlay: draws itself as the probe advances. */}
      <svg
        aria-hidden
        viewBox="0 0 400 200"
        className="pointer-events-none absolute inset-x-6 top-6 h-24 w-[calc(100%-3rem)] opacity-80"
      >
        <path
          ref={traceRef}
          d="M20,100 L140,40 L260,160 L380,100"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={2}
        />
        {/* One marker per STORY_BEATS entry — coordinates match the path's own points above exactly (20,100), (140,40), (260,160), (380,100). */}
        {TRACE_MARKER_POINTS.map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={5} fill="var(--color-highlight)" />
        ))}
      </svg>

      {STORY_BEATS.map((beat, i) => (
        <article
          key={beat.world}
          className="scroller-beat pixel-border invisible absolute bottom-6 left-6 max-w-md bg-surface p-6"
        >
          <p className="font-pixel text-[8px] uppercase tracking-[0.15em] text-accent-alt motion-safe:animate-blink">
            {"> "}SCANNING: {beat.title.replace(/\s+/g, "_")}...
          </p>
          <h3 className="mt-3 font-pixel text-sm text-highlight">
            {beat.world} — {beat.title}
          </h3>
          <p className="mt-4 text-lg leading-snug text-muted">{beat.body}</p>
        </article>
      ))}

      <div className="scroller-clear invisible absolute inset-0 flex flex-col items-center justify-center gap-6 text-center">
        <p className="font-pixel text-lg text-white">★ SCAN COMPLETE ★</p>
        <p className="font-pixel text-[10px] text-muted">
          THE FULL SAVE FILE FITS ON ONE PAGE
        </p>
        <SfxAnchor
          href={RESUME_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="pixel-border pixel-border-interactive bg-surface px-6 py-3 font-pixel text-xs text-foreground transition-colors hover:text-accent"
        >
          VIEW RESUME ►
        </SfxAnchor>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify types and build**

Run: `pnpm build`
Expected: build succeeds with no new TypeScript errors. Check the `/about` route's First Load JS in the build output — note the number for comparison in Task 7's Lighthouse pass.

- [ ] **Step 3: Manual scroll-through verification**

Run `pnpm build && pnpm start`, open `http://localhost:3000/about` in a real desktop browser (or via the project's existing Playwright screenshot approach at 4-5 scroll depths through the pinned section). Confirm at each of the 4 stops: the camera has moved to frame a different board component, the corresponding story-beat card is visible with its `> SCANNING: ...` line, the SVG trace line has drawn further, and the previous beat's card has faded out. Confirm the "SCAN COMPLETE" / résumé CTA appears at the very end and the `VIEW RESUME` link opens the resume PDF in a new tab. Confirm the whole page still respects `prefers-reduced-motion` (falls back to `StoryLevel`, unaffected by this file).

- [ ] **Step 4: Commit**

```bash
git add src/components/about/StorySideScroller.tsx
git commit -m "feat: replace Mario-style side-scroller with 3D circuit inspection sequence"
```

---

### Task 5: Re-skin `StoryLevel.tsx`'s progress track (mobile/reduced-motion fallback)

Light visual refresh only, per the approved spec — swap the plain accent progress bar for a PCB-trace-style path using the same `stroke-dashoffset` technique as the desktop version, no 3D and no new dependency.

**Files:**
- Modify: `src/components/about/StoryLevel.tsx:90-99` (the "Level progress track" block) and its GSAP setup (`:29-41`)

**Interfaces:**
- No prop/export changes — `StoryLevel` keeps its existing `export default function StoryLevel()` signature.

- [ ] **Step 1: Replace the progress-track markup**

In `src/components/about/StoryLevel.tsx`, replace:

```tsx
      {/* Level progress track */}
      <div
        aria-hidden
        className="absolute bottom-4 left-[7px] top-4 hidden w-1 bg-border sm:block"
      >
        <div className="story-track-fill h-full w-full bg-accent" />
        <span className="story-player absolute -left-[6px] top-0 block h-4 w-4 -translate-y-1/2 bg-highlight [image-rendering:pixelated]" />
      </div>
```

with:

```tsx
      {/* Level progress track: a PCB-trace path draws itself as you scroll. */}
      <svg
        aria-hidden
        viewBox="0 0 40 400"
        preserveAspectRatio="none"
        className="absolute bottom-4 left-0 top-4 hidden w-4 sm:block"
      >
        <path
          d="M20,0 L20,120 L8,140 L8,260 L20,280 L20,400"
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={2}
        />
        <path
          ref={trackTraceRef}
          d="M20,0 L20,120 L8,140 L8,260 L20,280 L20,400"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={2}
        />
      </svg>
      <span
        ref={trackPlayerRef}
        aria-hidden
        className="story-player absolute left-[6px] top-4 hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 bg-highlight sm:block [image-rendering:pixelated]"
      />
```

- [ ] **Step 2: Wire the new refs and drive the trace's `stroke-dashoffset`**

Add two new refs near the top of the component (right after the existing `containerRef`):

```tsx
  const containerRef = useRef<HTMLDivElement>(null);
  const trackTraceRef = useRef<SVGPathElement>(null);
  const trackPlayerRef = useRef<HTMLSpanElement>(null);
```

Inside the existing `mm.add("(prefers-reduced-motion: no-preference)", () => { ... })` block, replace:

```tsx
        // Progress track fills as the player scrolls through the level.
        gsap.from(".story-track-fill", {
          scaleY: 0,
          transformOrigin: "top",
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
            end: "bottom 75%",
            scrub: true,
          },
        });

        // The player sprite rides the track in chunky steps.
        gsap.to(".story-player", {
          top: "100%",
          ease: "steps(24)",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
            end: "bottom 75%",
            scrub: true,
          },
        });
```

with:

```tsx
        // Trace-line progress: draws itself as the player scrolls through
        // the level, same stroke-dashoffset technique as the desktop
        // circuit-scroll sequence.
        const trace = trackTraceRef.current;
        const traceLength = trace?.getTotalLength() ?? 0;
        if (trace && traceLength > 0) {
          trace.style.strokeDasharray = `${traceLength}`;
          trace.style.strokeDashoffset = `${traceLength}`;
        }

        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top 60%",
          end: "bottom 75%",
          scrub: true,
          onUpdate: (self) => {
            if (trace && traceLength > 0) {
              trace.style.strokeDashoffset = `${traceLength * (1 - self.progress)}`;
            }
            if (trackPlayerRef.current) {
              trackPlayerRef.current.style.top = `${self.progress * 100}%`;
            }
          },
        });
```

- [ ] **Step 3: Verify types and build**

Run: `pnpm build`
Expected: build succeeds with no new TypeScript errors.

- [ ] **Step 4: Manual verification**

In a browser devtools device emulator (or an actual phone), open `http://localhost:3000/about` with a narrow viewport (< 768px) or with "Emulate CSS prefers-reduced-motion: reduce" turned on. Confirm the trace-line path draws progressively as you scroll through the 4 story beats, and the small highlight-colored marker travels down the trace in sync.

- [ ] **Step 5: Commit**

```bash
git add src/components/about/StoryLevel.tsx
git commit -m "style: re-skin StoryLevel's progress track as a PCB trace line"
```

---

### Task 6: Full verification pass (build, Lighthouse, impeccable audit/critique)

**Files:** none (verification only).

- [ ] **Step 1: Clean production build**

```bash
rm -rf .next
pnpm build
```

Expected: succeeds with no errors; note the `/about` route's First Load JS size in the output.

- [ ] **Step 2: Start the production server and re-run Lighthouse**

```bash
pnpm start
```

In a second terminal, run Lighthouse against `/about` (same harness used earlier in this project — a Playwright-managed Chromium + `npx lighthouse --preset=desktop`). Confirm the Performance score has not regressed in a way that fails Core Web Vitals targets (LCP < 2.5s, TBT reasonably low, CLS < 0.1) — some reduction from the 3D asset is expected and acceptable since it's lazy-loaded and post-paint; the check is for a *reasonable* budget, not zero change.

- [ ] **Step 3: Run `/impeccable audit` against the redesigned files**

Scope it to `src/components/about/CircuitScene.tsx`, `src/components/about/StorySideScroller.tsx`, `src/components/about/StoryLevel.tsx`, `src/components/about/StoryStage.tsx`. Address any P0/P1 findings before calling this done; use judgment on P2/P3 per the audit's own severity guidance.

- [ ] **Step 4: Run `/impeccable critique` against the About page**

Confirm the new sequence reads as intended (systems-engineer-credible, not childish) and doesn't introduce new heuristic issues.

- [ ] **Step 5: Stop the production server**

```bash
fuser -k 3000/tcp
```

- [ ] **Step 6: Final commit (if any audit/critique fixes were made)**

```bash
git add -A
git commit -m "fix: address impeccable audit/critique findings on circuit-scroll redesign"
```

(Skip this commit entirely if Steps 3-4 found nothing to fix.)
