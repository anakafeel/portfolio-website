# About Section PC-Build Scroll Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-skin the already-shipped 3D "circuit board inspection" scroll sequence on the About page to visit recognizable PC parts (CPU, RAM, GPU, motherboard, PSU) instead of a generic electronics board, reusing the existing camera-dolly/probe/ScrollTrigger machinery unchanged.

**Architecture:** `src/components/about/CircuitScene.tsx` is replaced by `src/components/about/PCBuildScene.tsx`, which renders 5 procedurally-built PC parts (Three.js primitives, no external assets) instead of loading a GLB. `StorySideScroller.tsx` swaps its dynamic import to the new component and gains a small per-waypoint "TARGET: ..." part-readout label, reusing its existing reveal-window mechanism. Nothing else in the scroll/animation stack changes.

**Tech Stack:** React Three Fiber (`@react-three/fiber`), `three`, GSAP `ScrollTrigger`, Next.js App Router. No new dependencies.

## Global Constraints

- **No new npm dependencies.** The entire scene is built from `three` primitives (`boxGeometry`, `cylinderGeometry`) already used elsewhere in this codebase.
- **This project has no test runner** (per `CLAUDE.md`). Every task's verification is: (1) `pnpm build` succeeds with no new TypeScript/ESLint errors, (2) a manual browser check with a specific, stated expected visual outcome (headless Chromium screenshot, or the dev server directly).
- **No hardcoded hex colors in new UI DOM chrome** outside the theme-color hooks — reuse `useThemeColors`/CSS custom properties, per `DESIGN.md`'s "One Cartridge Rule". **Exception, carried over from the previous circuit-board plan:** the PC parts' own base material colors (motherboard PCB green, chip grey, fan grey, etc.) are static 3D scene geometry, not UI chrome — same exception the previous CC0 board's baked-in GLB materials had. Only RGB accent details (RAM light bar, PSU fan glow, probe tip) must track `colors.accent` via `useThemeColors`.
- **`border-radius` stays `0px` everywhere** for any new HTML chrome (the part-readout label uses plain text, no bordered box, so this doesn't add a new surface needing the check — but if a future change adds one, it must use the existing `pixel-border` utility, never a rounded corner).
- **Every animation must respect `prefers-reduced-motion`** — already handled by `usePrefersReducedMotion` (freezing `frameloop` to `"demand"`) and `StoryStage`'s vertical-fallback gate. Neither is touched by this plan.
- **No asset licensing to track.** Confirmed during planning: an itch.io FBX pack was investigated and rejected (every part was a plain unsculpted box), so the scene has zero external assets and zero license surface.

---

### Task 1: Create `PCBuildScene.tsx`

**Files:**
- Create: `src/components/about/PCBuildScene.tsx`
- Create (temporary, deleted at the end of this task): `src/app/about/pc-build-preview/page.tsx`

**Interfaces:**
- Consumes: `useThemeColors`, `usePrefersReducedMotion` from `src/lib/three/sceneHooks.ts` (unchanged, already exists — exports `ThemeColors { accent: string; accentAlt: string; background: string }`).
- Produces: `export default function PCBuildScene({ progressRef }: { progressRef: React.RefObject<number> })` — a client component rendering a `<Canvas>`. Identical prop shape to the current `CircuitScene`, so Task 2 only needs an import-path change, no prop changes. `progressRef.current` is a plain number in `[0, 1]`; `PCBuildScene` never writes to it, only reads it every frame.

- [ ] **Step 1: Write `PCBuildScene.tsx`**

The 4 waypoint targets and the part positions below were verified together via a headless Three.js render during planning (not guessed) — the camera framing at each waypoint was screenshotted and confirmed to correctly frame CPU, then RAM, then GPU, then the full build, before these numbers were finalized.

```tsx
// src/components/about/PCBuildScene.tsx
"use client";

import { useMemo, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { useThemeColors, usePrefersReducedMotion } from "@/lib/three/sceneHooks";

/**
 * Board-space target positions the camera visits, one per STORY_BEATS
 * entry, in order: SPAWN POINT (CPU), SKILL TREE (RAM), SIDE QUESTS (GPU),
 * CURRENT QUEST (full-build overview). Matches the part positions in
 * <Parts> below exactly — verified via a headless Three.js render before
 * committing these numbers (see
 * docs/superpowers/specs/2026-07-22-about-pc-build-scroll-redesign-design.md).
 */
const WAYPOINTS: THREE.Vector3[] = [
  new THREE.Vector3(0, 0.85, 0), // CPU
  new THREE.Vector3(2.55, 2.0, 0), // RAM (midpoint of both sticks)
  new THREE.Vector3(-2, 0.95, -5), // GPU
  new THREE.Vector3(1, 1.5, -1), // full-build overview
];

/**
 * Camera offset per waypoint (added to the matching WAYPOINTS entry
 * before building the dolly curve). The first 3 keep a tight, consistent
 * "inspection" framing; the last pulls back further so the whole build
 * is visible at once for the final beat.
 */
const CAMERA_OFFSET = new THREE.Vector3(-4, 6, 8);
const OVERVIEW_OFFSET = new THREE.Vector3(-9, 13, 16);
const CAMERA_OFFSETS: THREE.Vector3[] = [
  CAMERA_OFFSET,
  CAMERA_OFFSET,
  CAMERA_OFFSET,
  OVERVIEW_OFFSET,
];

function buildCameraCurve(): THREE.CatmullRomCurve3 {
  const points = WAYPOINTS.map((p, i) => p.clone().add(CAMERA_OFFSETS[i]));
  return new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.2);
}

function buildLookCurve(): THREE.CatmullRomCurve3 {
  const points = WAYPOINTS.map((p) => p.clone());
  return new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.2);
}

interface RigProps {
  progressRef: RefObject<number>;
  accentColor: string;
}

/**
 * Camera rig: moves along a hand-authored path driven by `progressRef`.
 * The diagnostic probe is a child of this group, so it rides along for
 * free — no separate tween needed for the probe itself. Identical to the
 * previous CircuitScene's rig; only the curve-building functions above
 * changed to use per-waypoint camera offsets.
 */
function Rig({ progressRef, accentColor }: RigProps) {
  const { camera } = useThree();
  const cameraCurve = useMemo(buildCameraCurve, []);
  const lookCurve = useMemo(buildLookCurve, []);

  useFrame(() => {
    const t = THREE.MathUtils.clamp(progressRef.current ?? 0, 0, 1);
    camera.position.copy(cameraCurve.getPointAt(t));
    camera.lookAt(lookCurve.getPointAt(t));
  });

  return (
    // `<primitive object={camera}>` makes the group a real Three.js child of
    // the camera (not just a React sibling), so it inherits the camera's
    // world matrix every frame and rides along with zero extra tweening —
    // a plain JSX sibling here would sit at a fixed world-space position
    // and never move as the rig dollies through the scene.
    <primitive object={camera}>
      <group position={[0, -0.6, -1.4]}>
        {/* Diagnostic probe body (neutral shell, not theme-reactive) */}
        <mesh>
          <boxGeometry args={[0.35, 0.2, 0.5]} />
          <meshStandardMaterial color="#16162a" />
        </mesh>
        {/* Glowing tip: tracks the active theme's accent color */}
        <mesh position={[0, -0.05, 0.35]}>
          <coneGeometry args={[0.08, 0.3, 8]} />
          <meshStandardMaterial
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={2}
          />
        </mesh>
        <pointLight
          color={accentColor}
          intensity={1.5}
          distance={3}
          position={[0, -0.05, 0.5]}
        />
      </group>
    </primitive>
  );
}

const MOTHERBOARD_COLOR = "#123321";
const CHIP_COLOR = "#2a2a2a";
const HEATSINK_COLOR = "#888888";
const RAM_BODY_COLOR = "#1a1a2e";
const GPU_BODY_COLOR = "#1c1c1c";
const FAN_COLOR = "#333333";
const PSU_COLOR = "#222222";
const HEATSINK_FIN_HEIGHTS = [1.4, 1.6, 1.8];
const RAM_STICK_X = [2.2, 2.9];
const GPU_FAN_X = [-4, 0];

interface PartsProps {
  accentColor: string;
}

/**
 * The PC build itself: motherboard, CPU + heatsink, 2 RAM sticks, GPU with
 * dual fans, and a PSU with a glowing rear fan. Base colors are fixed
 * neutrals — this is static scene geometry, not UI chrome (same exception
 * the previous CC0 board's baked-in materials had, see Global
 * Constraints). Only the RGB accents (RAM light bar, PSU fan) track the
 * live theme's accent color, matching the probe tip.
 */
function Parts({ accentColor }: PartsProps) {
  return (
    <group>
      {/* Motherboard */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[12, 0.6, 13]} />
        <meshStandardMaterial color={MOTHERBOARD_COLOR} />
      </mesh>

      {/* CPU */}
      <mesh position={[0, 0.85, 0]}>
        <boxGeometry args={[3, 0.5, 3]} />
        <meshStandardMaterial color={CHIP_COLOR} />
      </mesh>

      {/* Heatsink fins */}
      {HEATSINK_FIN_HEIGHTS.map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <boxGeometry args={[2.2, 0.15, 2.2]} />
          <meshStandardMaterial color={HEATSINK_COLOR} />
        </mesh>
      ))}

      {/* RAM sticks + RGB light bars */}
      {RAM_STICK_X.map((x) => (
        <group key={x}>
          <mesh position={[x, 2.0, 0]}>
            <boxGeometry args={[0.5, 2.8, 1.1]} />
            <meshStandardMaterial color={RAM_BODY_COLOR} />
          </mesh>
          <mesh position={[x, 3.48, 0]}>
            <boxGeometry args={[0.55, 0.15, 1.15]} />
            <meshStandardMaterial
              color={accentColor}
              emissive={accentColor}
              emissiveIntensity={1.5}
            />
          </mesh>
        </group>
      ))}

      {/* GPU + dual fans */}
      <mesh position={[-2, 0.95, -5]}>
        <boxGeometry args={[7, 0.7, 3]} />
        <meshStandardMaterial color={GPU_BODY_COLOR} />
      </mesh>
      {GPU_FAN_X.map((x) => (
        <mesh key={x} position={[x, 1.38, -5]}>
          <cylinderGeometry args={[1.1, 1.1, 0.15, 16]} />
          <meshStandardMaterial color={FAN_COLOR} />
        </mesh>
      ))}

      {/* PSU + glowing rear fan */}
      <mesh position={[7, 1.5, 3]}>
        <boxGeometry args={[3, 3, 4]} />
        <meshStandardMaterial color={PSU_COLOR} />
      </mesh>
      <mesh position={[7, 1.5, 5.05]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 0.1, 16]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={1}
        />
      </mesh>
    </group>
  );
}

interface PCBuildSceneProps {
  progressRef: RefObject<number>;
}

/**
 * Scroll-driven PC-build inspection sequence: vertical scroll drives a
 * camera dolly past a procedurally-built CPU/RAM/GPU/motherboard/PSU
 * while a diagnostic probe rides along, parented to the camera. Mount
 * only on desktop with motion + WebGL available — StoryStage handles
 * that gate and the vertical fallback.
 */
export default function PCBuildScene({ progressRef }: PCBuildSceneProps) {
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
      <Parts accentColor={colors.accent} />
      <Rig progressRef={progressRef} accentColor={colors.accent} />
    </Canvas>
  );
}
```

Unlike the previous `CircuitScene`, there's no `useGLTF`/`Suspense`/loading indicator — every part renders synchronously since nothing is fetched.

- [ ] **Step 2: Verify types and build**

Run: `pnpm build`
Expected: build succeeds with no new TypeScript errors. `PCBuildScene.tsx` is not imported anywhere yet, so it won't appear in any route's bundle — this step only confirms it type-checks in isolation. `CircuitScene.tsx` still exists and `StorySideScroller.tsx` still imports it, so the `/about` route is unaffected.

- [ ] **Step 3: Manual smoke test in isolation**

Temporarily render it from a scratch page to confirm the scene looks right before wiring it into the real scroll flow: create `src/app/about/pc-build-preview/page.tsx` with:

```tsx
"use client";

import { useRef } from "react";
import PCBuildScene from "@/components/about/PCBuildScene";

export default function PCBuildPreviewPage() {
  const progressRef = useRef(0.5);
  return (
    <div style={{ height: "100vh" }}>
      <PCBuildScene progressRef={progressRef} />
    </div>
  );
}
```

Run `pnpm dev`, open `http://localhost:3000/about/pc-build-preview`, confirm: the motherboard (dark green flat slab) is visible with the CPU + stacked heatsink fins in the center, 2 RAM sticks with glowing accent-colored tops beside it, the GPU card with 2 fan discs is visible off to one side, and the PSU with its glowing fan is visible further off (since `progressRef.current = 0.5` sits between the RAM and GPU waypoints along the dolly curve, expect a view roughly between those two, with the probe's glowing accent-colored tip visible in the lower-center of frame). Confirm no console errors. Then **delete `src/app/about/pc-build-preview/`** — it was scaffolding for this check only, not a real route.

- [ ] **Step 4: Commit**

```bash
git add src/components/about/PCBuildScene.tsx
git commit -m "feat: add procedural PC-build 3D scene (CPU, RAM, GPU, motherboard, PSU)"
```

---

### Task 2: Wire `PCBuildScene` into `StorySideScroller` and retire the old scene/assets

**Files:**
- Modify: `src/components/about/StorySideScroller.tsx`
- Delete: `src/components/about/CircuitScene.tsx`
- Delete: `public/models/circuit/electronic-components.glb`
- Delete: `public/models/circuit/CREDITS.md`

**Interfaces:**
- Consumes: `PCBuildScene` from Task 1 (`export default function PCBuildScene({ progressRef }: { progressRef: RefObject<number> })`).
- Produces: no new exports — `StorySideScroller` keeps its existing `export default function StorySideScroller()` signature, consumed by `StoryStage.tsx` (unchanged).

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

const PCBuildScene = dynamic(() => import("@/components/about/PCBuildScene"), {
  ssr: false,
});

/**
 * One reveal fraction per STORY_BEATS entry (0-1 along the pinned scroll
 * range), hand-authored to roughly match each camera waypoint in
 * PCBuildScene's WAYPOINTS array. Decoupled from the 3D curve's own
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
 * Part-readout label per STORY_BEATS entry, naming what the camera is
 * currently framing in PCBuildScene — CPU, RAM, GPU, then the full build.
 */
const PART_LABELS = ["CPU_CORE", "MEMORY_BANK", "GPU", "FULL_BUILD"];

/**
 * Pinned PC-build inspection sequence: vertical scroll drives a camera
 * dolly through a procedurally-built CPU/RAM/GPU/motherboard/PSU
 * (PCBuildScene) while a diagnostic probe rides along, parented to the
 * camera. Mount only on desktop with motion + WebGL available —
 * StoryStage handles that gate and the vertical fallback.
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

      // Reveal each story-beat card + scan line + part-readout label
      // inside its fraction window, and the final "LEVEL CLEAR" card near
      // the end. Each ScrollTrigger only starts a new tween when
      // `inWindow` actually flips, not on every scrub tick, to avoid
      // spawning redundant tweens continuously while the user scrolls.
      const partLabels = gsap.utils.toArray<HTMLElement>(".scroller-part-label");
      gsap.utils.toArray<HTMLElement>(".scroller-beat").forEach((beat, i) => {
        const at = BEAT_FRACTIONS[i];
        const label = partLabels[i];
        gsap.set(beat, { autoAlpha: 0, y: 24 });
        if (label) gsap.set(label, { autoAlpha: 0 });
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
            if (label) {
              gsap.to(label, {
                autoAlpha: inWindow ? 1 : 0,
                duration: 0.08,
                ease: "steps(4)",
                overwrite: "auto",
              });
            }
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
      <PCBuildScene progressRef={progressRef} />

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

      {/* Part-readout: names whichever PC part the camera is framing. */}
      {PART_LABELS.map((label) => (
        <p
          key={label}
          className="scroller-part-label pointer-events-none invisible absolute right-6 top-32 font-pixel text-[9px] uppercase tracking-[0.15em] text-accent-alt"
        >
          {"> "}TARGET: {label}
        </p>
      ))}

      {STORY_BEATS.map((beat) => (
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

- [ ] **Step 2: Delete the retired scene and its assets**

```bash
rm src/components/about/CircuitScene.tsx
rm -rf public/models/circuit
```

- [ ] **Step 3: Verify types and build**

Run: `pnpm build`
Expected: build succeeds with no new TypeScript/ESLint errors and no "module not found" errors (confirms nothing else still imports `CircuitScene` or references `public/models/circuit/`). Check the `/about` route's First Load JS in the build output — compare against the previous circuit-board version's recorded 165 kB baseline (documented in `.superpowers/sdd/task-4-report.md` from the prior plan); it should be similar or smaller, since there's no GLB fetch anymore.

- [ ] **Step 4: Manual scroll-through verification**

Run `pnpm build && pnpm start`, open `http://localhost:3000/about` in a real desktop browser (or via the project's existing Playwright headless-Chromium screenshot approach at scroll depths `0, 0.1, 0.4, 0.65, 0.9, 0.98` through the pinned section — the same depths and technique used to verify the previous circuit-board version). Confirm at each stop:

| depth | expected visible beat | expected part label | clear visible |
|---|---|---|---|
| 0 | none | none | false |
| 0.1 | WORLD 1-1 — SPAWN POINT | TARGET: CPU_CORE | false |
| 0.4 | WORLD 1-2 — SKILL TREE | TARGET: MEMORY_BANK | false |
| 0.65 | WORLD 1-3 — SIDE QUESTS | TARGET: GPU | false |
| 0.9 | WORLD 1-4 — CURRENT QUEST | TARGET: FULL_BUILD | false |
| 0.98 | WORLD 1-4 — CURRENT QUEST | TARGET: FULL_BUILD | true |

Also confirm: the trace-line's `stroke-dashoffset` still decreases monotonically toward 0 as scroll advances, the camera visibly reframes a different PC part at each of the 4 stops (CPU → RAM → GPU → full build), the probe's glowing accent-colored tip is visible near-camera in every frame, the "★ SCAN COMPLETE ★" / résumé CTA appears at depth 0.98 alongside the still-visible final beat card and part label, and there are zero console/page errors. Confirm the page still respects `prefers-reduced-motion` (falls back to `StoryLevel`, unaffected by this file).

- [ ] **Step 5: Commit**

```bash
git add src/components/about/StorySideScroller.tsx
git rm src/components/about/CircuitScene.tsx
git rm -r public/models/circuit
git commit -m "feat: replace circuit-board scene with PC-build scene in StorySideScroller"
```

---

### Task 3: Final verification pass

**Files:** none modified — this task only verifies and, if the impeccable critique surfaces fixable issues, may produce a small follow-up commit.

- [ ] **Step 1: Reduced-motion fallback check**

With the production server still running (or `pnpm build && pnpm start` again if stopped), load `/about` with a reduced-motion browser context (the project's existing Playwright approach: launch with `reducedMotion: "reduce"`, or your OS/browser's reduce-motion setting). Confirm: no `<canvas>` element is present, `StoryLevel`'s own `.story-player` marker is present instead, and there are no console errors. This path is untouched by this plan, so it should behave exactly as before.

- [ ] **Step 2: Stop the production server**

```bash
# Ctrl+C the `pnpm start` process, or:
pkill -f "next start" || true
```

- [ ] **Step 3: Run `/impeccable critique` against the About page**

Follow the user's request to use the impeccable skill for a design pass on the redesigned section. Address any CRITICAL/HIGH findings that are in-scope for this plan (the PC-build scene, the part-readout label, the trace-line overlay) — do not fix unrelated pre-existing issues elsewhere on the page.

- [ ] **Step 4: Final commit (only if Step 3 produced fixes)**

```bash
git add -A
git commit -m "fix: address impeccable critique findings on PC-build About section"
```

(Skip this commit entirely if Step 3 found nothing to fix.)
