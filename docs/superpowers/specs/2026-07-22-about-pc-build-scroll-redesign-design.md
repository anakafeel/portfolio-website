# About Section Redesign: PC Build Scroll Sequence — Design Spec

Date: 2026-07-22
Status: Approved (pending spec review)
Supersedes: `docs/superpowers/specs/2026-07-21-about-circuit-scroll-redesign-design.md` (the "generic circuit board" version — already implemented and committed on `8bitrevamp`, being re-skinned by this spec, not rebuilt from scratch)

## Why

The just-shipped 3D "circuit board inspection" scroll sequence uses a generic CC0 "lowpoly electronic components" pack (a `Cube`, a `pci-e card`, two anonymous `microchip` nodes). It works mechanically but has no personality — nothing in the scene reads as an actual computer. The user is genuinely into PC building and wants that to come through: a scroll-driven tour of recognizable PC parts (CPU, GPU, motherboard, RAM, PSU) instead of an anonymous board.

This is a re-skin, not a re-architecture. The camera-dolly rig, the diagnostic probe (parented to the camera), the `progressRef`-driven `ScrollTrigger`, the self-drawing SVG trace-line overlay, the per-beat reveal windows, the desktop/mobile fallback gate — all of that is already built, reviewed, and verified working. Only the 3D subject matter and waypoint layout change.

## What changes vs. what doesn't

**Changes:**
- `src/components/about/CircuitScene.tsx` → renamed `src/components/about/PCBuildScene.tsx`, rewritten to compose 5 procedurally-built PC parts instead of loading one generic board GLB.
- `WAYPOINTS` repositioned to visit CPU → RAM → GPU → Motherboard (one per existing story beat, in beat order).
- `public/models/circuit/` (the old GLB + its CREDITS.md) deleted — no replacement asset directory; the new scene has no external asset dependency at all.
- A new small "part readout" label per waypoint (e.g. "TARGET: CPU_CORE"), using the same reveal-window mechanism the beat cards already use.
- Import path update in `StorySideScroller.tsx` (`CircuitScene` → `PCBuildScene`).

**Does not change:**
- `STORY_BEATS` content in `src/lib/about.ts` (SPAWN POINT / SKILL TREE / SIDE QUESTS / CURRENT QUEST bios stay exactly as written).
- The `ScrollTrigger` pin/scrub setup, `BEAT_FRACTIONS`, `REVEAL_WINDOW`, `CLEAR_FRACTION`, the SVG trace path and its `stroke-dashoffset` self-draw, the "SCAN COMPLETE" / résumé CTA card.
- `StoryLevel.tsx` (the mobile/reduced-motion fallback) — it never renders the 3D scene, so it's untouched.
- `StoryStage.tsx`'s WebGL/motion capability gate.
- The camera-parented diagnostic probe geometry and its theme-accent-colored tip.
- `useThemeColors` / `usePrefersReducedMotion` shared hooks.

## Assets

**None.** All 5 parts (motherboard, CPU, RAM ×2, GPU, PSU) are built from Three.js primitives (`BoxGeometry`, `CylinderGeometry`) directly in `PCBuildScene.tsx` — no GLB, no FBX, no external asset pipeline, no license to track.

This was a deliberate reversal from an earlier draft of this spec, which planned to load a free itch.io FBX pack ("Simple PC parts (Low Poly)" by NullSys). Investigation during planning downloaded and inspected the actual files via a headless Three.js/FBXLoader harness: every part in that pack is a single mesh literally named `"Cube"` — a plain rectangular block with no sculpted detail (no fan blades, no chip pins, no board traces). Real measured dimensions were extracted before discarding the pack, and are reused below as the authoritative proportions for the procedural boxes, so shape accuracy isn't lost:

| Part | Size (width × height × depth, board-space units) |
|---|---|
| Motherboard | 114.8 × 14.0 × 127.4 |
| CPU | 30.6 × 5.0 × 33.5 |
| RAM (each stick) | 59.8 × 27.9 × 4.9 |
| GPU | 150.0 × 66.7 × 30.7 |

Since the pack offered no shape detail beyond these proportions, building plain boxes at the same proportions costs nothing extra while removing the informal license, the new asset directory, and the `useFBX`/Suspense loading path entirely.

**PSU:** no reference dimensions exist for it (not in the pack), so it's authored freehand — a `3 × 3 × 4` `BoxGeometry` body sized to look proportionate next to the rest of the build, with a recessed `CylinderGeometry` fan glowing the theme accent color, mounted on its rear face.

## Scene composition

The FBX pack's measured proportions above were a useful *starting point*, but since the parts turned out to be inconsistently scaled relative to each other (its GPU is nominally larger than its motherboard — a plausible detail on a real oversized card, but not usable as a literal cross-part scale reference), the final layout was hand-composed and verified with an actual headless Three.js render during planning (screenshotting the camera's view at all 4 waypoints) rather than computed mechanically from the table. Final board-space layout:

- **Motherboard**: `12 × 0.6 × 13` flat slab at the origin — the visual anchor, other parts arranged on top of it.
- **CPU**: `3 × 0.5 × 3`, centered on the motherboard, with 3 stacked `2.2 × 0.15 × 2.2` heatsink-fin plates above it so it doesn't read as an unlabeled slab.
- **RAM**: 2 `0.5 × 2.8 × 1.1` sticks standing upright beside the CPU, each with a thin `0.55 × 0.15 × 1.15` accent-colored strip along the top edge (the "RGB light bar").
- **GPU**: `7 × 0.7 × 3` card mounted flat beside the motherboard at one edge, with 2 `1.1`-radius `CylinderGeometry` fans on its top face for silhouette read.
- **PSU**: `3 × 3 × 4` box off to one side, with a glowing rear fan.

`WAYPOINTS` (4 entries, matching `STORY_BEATS` order) target CPU → RAM → GPU → a pulled-back full-build overview, using each part's actual authored center position. Unlike the previous scene (one constant `CAMERA_OFFSET` for every waypoint), the final waypoint uses a larger, more elevated offset so the whole build is visible at once for the closing beat — verified via the headless render to read clearly as a "full picture" finale rather than looking near-identical to the CPU waypoint's tight framing.

## Visual treatment

Every part's material is authored directly (there's no imported material to override) — flat `MeshStandardMaterial`, no gradients, no textures, colors pulled from the existing theme tokens (dark PCB green/near-black for the motherboard, neutral metal grey for heatsink/shroud/fan geometry). RGB accents (RAM light bar, GPU fan ring, PSU fan glow) use the live theme's `--color-accent` via `useThemeColors`, exactly like the existing probe tip — this is also a legitimately PC-building-authentic detail (RGB is a real thing on real parts), not just a design-system nicety.

No hardcoded hex outside the existing theme-color hook, per the project's global constraint carried over from the original plan.

## Part readout label

A small `font-pixel` corner readout (visually consistent with the existing "SCANNING: ..." line style) shows which part is currently in view: `TARGET: CPU_CORE`, `TARGET: MEMORY_BANK`, `TARGET: GPU`, `TARGET: FULL_BUILD` (the last matching the final waypoint's pulled-back overview framing, not a single part). Driven by the same per-waypoint reveal-window / `wasInWindow` guard pattern already used for `.scroller-beat` cards in `StorySideScroller.tsx` — same `BEAT_FRACTIONS` timing, just a second small element revealed/hidden in sync, not a new animation system.

## File changes

- **Deleted:** `public/models/circuit/electronic-components.glb`, `public/models/circuit/CREDITS.md` — no replacement asset directory.
- **New:** `src/components/about/PCBuildScene.tsx` (replaces `CircuitScene.tsx`, which is deleted).
- **Modified:** `src/components/about/StorySideScroller.tsx` (import path + the new part-readout element; `ScrollTrigger`/reveal logic otherwise unchanged).
- **Unchanged:** everything else, per "What changes vs. what doesn't" above.

## Testing / verification

Same approach already established and proven across Tasks 1–5 of the prior plan:
1. `pnpm build` — clean TypeScript/ESLint, no new warnings.
2. Headless-Chromium scroll-through (the existing `pw-core` + cached Chromium harness) at several scroll depths, screenshotting each, confirming: the correct part is framed at each waypoint, the part-readout label matches, the trace-line `stroke-dashoffset` still self-draws, the probe tip still tracks the camera and glows the theme accent color, no console/page errors.
3. Reduced-motion check confirms `StoryLevel.tsx` fallback (unaffected) still renders correctly with no `<canvas>`.
4. `/impeccable critique` pass against the redesigned About page once implemented, per the user's request to use the impeccable skill for a frontend design check.

## Global constraints (carried over from the original plan)

- No new npm dependencies (confirmed unnecessary: the scene is built entirely from primitives already available in the installed `three`).
- `border-radius: 0` everywhere; no hardcoded hex outside theme-color hooks.
- Respect `prefers-reduced-motion` (already handled by `StoryStage`'s existing gate — untouched).
- No test runner in this project — verification is `pnpm build` + manual/headless-browser checks, as above.

## Out of scope

- Changing `STORY_BEATS` copy content.
- Changing the mobile/reduced-motion fallback (`StoryLevel.tsx`) beyond what's already shipped.
- Physically-accurate PC part modeling — these are stylized, low-poly, flat-shaded props in service of the arcade aesthetic, not a hardware-accuracy showcase.
