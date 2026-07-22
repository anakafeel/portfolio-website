# About Page Story Section Redesign: "Inspection Probe" Circuit Scroll

## Problem

The About page's desktop scroll-storytelling section (`StorySideScroller.tsx`, shown to ~most desktop visitors via `StoryStage`'s media-query gate) is a bright Mario-style platformer: blue sky, clouds, bushes, a pixel-art kid sprite walking across a horizontal level. It's technically well-built (a proven GSAP `ScrollTrigger` pin+scrub timeline drives a horizontal track, parallax layers, and fraction-based card reveals) but reads as childish rather than senior-systems-engineer-credible, undercutting the portfolio's actual goal (recruiters/hiring managers judging technical credibility).

The vertical fallback (`StoryLevel.tsx`, shown on mobile / `prefers-reduced-motion`) is already fairly restrained (dark theme, plain accent progress bar) and isn't part of the complaint, but should get a light re-skin for consistency.

## Goal

Replace the visual world with something that reads as technical and intentional, inspired by GSAP's own showcased scroll techniques (pinned sections, scrubbed timelines, self-drawing SVG paths), while staying inside the site's established 8-bit/CRT/terminal identity (see `DESIGN.md`). Reuse proven mechanics wherever possible instead of rebuilding from scratch.

## Concept: "Inspection Probe"

A low-poly circuit board floats in dark space (matches the site's void-black background, not Mario's blue sky). As the user scrolls, the camera dollies/pans along a hand-authored path with 4 stops — one per existing `STORY_BEATS` entry (SPAWN POINT, SKILL TREE, SIDE QUESTS, CURRENT QUEST). A diagnostic probe (a small hand-built shape with a glowing accent-colored tip — not a drone; a drone doesn't fit the site's 8-bit/terminal register) is parented to the camera rig, so it rides along "for free" without needing its own separate tween — it reads as a first-person inspection tool, like a technician's test lead scanning a board.

At each stop: the camera settles on a CC0 low-poly component (a board segment, an IC, a processor, a transistor cluster), a terminal-style scan line types on in the same monospace/blink-cursor language as the site's real terminal easter egg (e.g. `> SCANNING: SPAWN_POINT...` → `> OK`), and the existing story-beat card fades in as a HUD callout near the component. A thin glowing SVG line traces the camera's path progressively behind the probe (`stroke-dashoffset`, the exact technique GSAP's own showcase uses for "circuit diagrams that draw themselves") — this is an added at-a-glance progress indicator alongside the existing `WORLD 1-2`-style labels, which stay as part of the story-beat card content unchanged.

## Why this approach (vs. alternatives considered)

- **Asset sourcing**: mixing hand-built primitives (probe, trace line, lighting) with a real CC0 asset (circuit board + components) rather than 100% hand-built or 100% downloaded. Verified source: OpenGameArt.org "Lowpoly Electronic Components" by iPoly3D, explicit CC0 license, glTF format available, 1.5MB for all 20 models (only using 3–4).
- **Camera mechanic**: considered (1) fixed camera + traveling probe along a path, (2) fixed probe (HUD-centered) + camera dolly [chosen], (3) fixed camera+probe + rotating board turntable. Chose (2): the user found it the most visually appealing ("cooler"), and it's simpler than (1) because the probe is parented to the camera (one tweened value drives both), rather than needing independent path tweening for the probe.
- **Probe identity**: considered a generic sci-fi "drone" but rejected it as thematically generic — it doesn't reuse any of the site's existing visual vocabulary (terminal `λ` prompt, CRT scanlines, blink-cursor animation). A "diagnostic probe" with a terminal-style scan readout is a more literal fit for "systems engineer inspecting a circuit board" and lets the sequence reuse the terminal's established language instead of inventing a new one.
- **Trace line**: a 2D SVG overlay (`stroke-dashoffset`) rather than a 3D Three.js line — avoids WebGL line-width rendering limitations and is simpler to get crisp, while being the literal technique cited in GSAP's own showcase research.

## Architecture

New/changed files:

- `src/components/about/CircuitScene.tsx` *(new, client component, `dynamic(() => import(...), { ssr: false })`)* — the `<Canvas>`. Loads the CC0 models via `useGLTF` + `Suspense`, sets up ambient + directional lighting (directional light recolors per active theme, same `getComputedStyle` + `MutationObserver` pattern already used in `VoxelScene.tsx` — extracted into one small shared hooks file so both scenes consume identical logic instead of a second copy drifting from the first), renders the camera rig, and includes the diagnostic probe mesh (kept in this same file per user preference — no separate component file for now). Exposes one prop: `progressRef: RefObject<number>` — a ref, not React state, so scroll updates never trigger a re-render; `CircuitScene` reads `progressRef.current` inside `useFrame` every frame, driving camera position/lookAt along a hand-authored 4-stop path.
- `src/components/about/StorySideScroller.tsx` *(rewritten in place, same filename)* — still owns the GSAP `ScrollTrigger` pin+scrub timeline (`pin: true, scrub: true`, same structure as today). Instead of tweening a horizontal DOM track's `x`, it tweens a single `{ value: 0 }` progress object and passes `value` down to `CircuitScene`. Reuses the existing fraction-based reveal logic (`.scroller-beat` autoAlpha show/hide keyed to scroll fraction) to fade in/out: the HTML story-beat card, the terminal-style scan line, and the SVG trace overlay's `stroke-dashoffset`, at each of the 4 stops.
- `src/components/about/StoryLevel.tsx` *(re-skinned, not rebuilt)* — swap the plain accent progress bar (`.story-track-fill`) for a simple right-angle PCB-trace SVG path with the same `stroke-dashoffset` scroll-scrubbed fill. No 3D, no new dependency. Everything else (Lenis smooth scroll, card reveal timing) stays as-is.
- `src/components/about/StoryStage.tsx` *(small addition)* — alongside the existing `matchMedia(SIDE_SCROLL_QUERY)` check, add a one-time WebGL capability check (attempt to get a `webgl`/`experimental-webgl` context from a throwaway canvas). If WebGL is unavailable, fall back to `StoryLevel` exactly like the reduced-motion/mobile path already does.
- `public/models/circuit/*.glb` *(new static assets)* — 3–4 models selected from the CC0 pack: a board/PCB base, an IC/chip, a processor, a transistor cluster.
- `src/lib/about.ts` — **no structural changes**; `STORY_BEATS` keeps its existing `{ world, title, body, logo }` shape.

## Data flow

Scroll position → GSAP `ScrollTrigger` (pinned, `scrub: true`) → one tweened `progress` value (0–1) → three consumers, all keyed off the same fractions already used for the 4 beats:
1. `CircuitScene`'s camera rig position/lookAt (and the probe along with it, since it's camera-parented).
2. The SVG trace overlay's `stroke-dashoffset`.
3. The existing `.scroller-beat` HTML card + new terminal-style scan line, shown/hidden via the same fraction-clamp math already in the current `StorySideScroller.tsx`.

## Fallback behavior

- **Mobile / `prefers-reduced-motion`**: `StoryLevel.tsx` — no 3D, no CC0 assets loaded at all. Trace-line progress visual instead of a plain bar.
- **No WebGL**: same fallback path as above, gated in `StoryStage.tsx`.
- Both fallback paths were already proven in production before this redesign; this spec extends the existing gate rather than replacing it.

## Performance & loading

- `CircuitScene` is dynamically imported with `ssr: false`, same pattern as the homepage hero's `VoxelScene` (already proven to hit 99–100 Lighthouse performance in production).
- `Suspense` fallback: an on-theme "CALIBRATING..." terminal-style loading line (not a generic spinner), per the loading-indicator best practice surfaced during research.
- Target: total new asset weight (3–4 GLB models) well under 500KB; confirm actual number once models are picked and, if needed, compress with `gltf-transform`.
- Verification: rebuild production (`pnpm build` + `pnpm start`), re-run Lighthouse against `/about` (harness already exists from prior audit work in this project), confirm no regression from the current 99–100 baseline.

## Testing / review plan

1. Manual verification in-browser (both the 3D desktop path and the vertical/reduced-motion fallback), screenshot-checked the same way prior work in this project was verified.
2. `pnpm build` must stay clean.
3. Lighthouse re-run against `/about` in production build.
4. `/impeccable audit` and `/impeccable critique` run against the redesigned section once implemented, per the user's original request — any findings addressed before calling this done.

## Explicitly out of scope

- No changes to `STORY_BEATS` content/copy.
- No changes to `ExperienceLog.tsx` or `LoadoutCard.tsx` (untouched, below this section on the About page).
- No orbit/drag controls for the user — camera movement is entirely scroll-driven, no free camera.
- No behavior or visual changes to the homepage hero (`VoxelScene.tsx`) — its rendered output and animation are byte-for-byte identical after this work. The one exception: its two theme/motion hooks (`useThemeColors`, `usePrefersReducedMotion`) are extracted verbatim into a shared `src/lib/three/sceneHooks.ts` so `CircuitScene.tsx` doesn't duplicate them — a pure relocation, not a behavior change.
