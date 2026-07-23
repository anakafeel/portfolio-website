# About Section Redesign: PC Build Scroll Sequence — Design Spec

Date: 2026-07-22
Status: Approved (pending spec review)
Supersedes: `docs/superpowers/specs/2026-07-21-about-circuit-scroll-redesign-design.md` (the "generic circuit board" version — already implemented and committed on `8bitrevamp`, being re-skinned by this spec, not rebuilt from scratch)

## Why

The just-shipped 3D "circuit board inspection" scroll sequence uses a generic CC0 "lowpoly electronic components" pack (a `Cube`, a `pci-e card`, two anonymous `microchip` nodes). It works mechanically but has no personality — nothing in the scene reads as an actual computer. The user is genuinely into PC building and wants that to come through: a scroll-driven tour of recognizable PC parts (CPU, GPU, motherboard, RAM, PSU) instead of an anonymous board.

This is a re-skin, not a re-architecture. The camera-dolly rig, the diagnostic probe (parented to the camera), the `progressRef`-driven `ScrollTrigger`, the self-drawing SVG trace-line overlay, the per-beat reveal windows, the desktop/mobile fallback gate — all of that is already built, reviewed, and verified working. Only the 3D subject matter and waypoint layout change.

## What changes vs. what doesn't

**Changes:**
- `src/components/about/CircuitScene.tsx` → renamed `src/components/about/PCBuildScene.tsx`, rewritten to compose 5 individual PC parts instead of loading one generic board GLB.
- `WAYPOINTS` repositioned to visit CPU → RAM → GPU → Motherboard (one per existing story beat, in beat order).
- New asset directory `public/models/pc/` (4 FBX files + `CREDITS.md`), replacing `public/models/circuit/` (deleted).
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

Source: **NullSys, "Simple PC parts (Low Poly)"** (itch.io: `nullsys.itch.io/simple-pc-parts-low-polly`). FBX format, made in Blender for Unity — loads fine via `@react-three/drei`'s `useFBX` (already a dependency; no new npm package). Files used: `Motherboard.fbx`, `CPU.fbx`, `RAM.fbx`, `NovaForce-GX-670.fbx` (used as the GPU).

**License note (read before implementing):** the author's stated terms are informal — "You are free to use them like you want, tell me if u use them for a cool game!" — not a formal CC0/MIT/CC-BY grant like the previous circuit-board asset. Acceptable for a personal, non-commercial portfolio with clear credit, but `public/models/pc/CREDITS.md` must state the source URL, author, and quote the actual terms verbatim (not paraphrase them as "CC0") so provenance is honest if this is ever revisited.

**PSU:** not in the pack. Built procedurally in `PCBuildScene.tsx` from primitives — a `BoxGeometry` body, a recessed `CylinderGeometry` fan with a handful of thin blade meshes, a few `BoxGeometry` vents on one face. No new asset, no new dependency.

## Scene composition

Rough desk-level layout (board-space units, same scale conventions as the previous scene):
- **Motherboard**: flat on a base plane, the visual anchor of the scene, other parts arranged on/around it.
- **CPU**: seated in its socket position on the motherboard, small cooler block implied by the model's own geometry.
- **RAM**: 2 sticks in slots beside the CPU socket.
- **GPU**: mounted in a PCIe slot, angled slightly toward camera for silhouette read.
- **PSU**: off to one side, procedural box.

`WAYPOINTS` (4 entries, matching `STORY_BEATS` order) point at CPU → RAM → GPU → Motherboard. `CAMERA_OFFSET` and the `CatmullRomCurve3` dolly/look-curve construction are reused unchanged — only the waypoint positions themselves are new, authored against the actual part positions (verified via the same headless preview/dimension-inspection approach used for the original circuit board GLB, adapted for FBX).

## Visual treatment

Override each part's material to the site's flat palette instead of trusting whatever the FBX ships with — no gradients, no photoreal textures, `MeshStandardMaterial` with flat colors pulled from the existing theme tokens (dark PCB green/near-black for the motherboard, neutral metal grey for heatsink/shroud geometry). RGB accents (RAM light bar, GPU fan ring, PSU fan glow) use the live theme's `--color-accent` via `useThemeColors`, exactly like the existing probe tip — this is also a legitimately PC-building-authentic detail (RGB is a real thing on real parts), not just a design-system nicety.

No hardcoded hex outside the existing theme-color hook, per the project's global constraint carried over from the original plan.

## Part readout label

A small `font-pixel` corner readout (visually consistent with the existing "SCANNING: ..." line style) shows which part is currently in view, e.g. `TARGET: CPU_CORE`, `TARGET: MEMORY`, `TARGET: GPU`, `TARGET: MOTHERBOARD`. Driven by the same per-waypoint reveal-window / `wasInWindow` guard pattern already used for `.scroller-beat` cards in `StorySideScroller.tsx` — same `BEAT_FRACTIONS` timing, just a second small element revealed/hidden in sync, not a new animation system.

## File changes

- **New:** `public/models/pc/Motherboard.fbx`, `CPU.fbx`, `RAM.fbx`, `GPU.fbx` (renamed from `NovaForce-GX-670.fbx` for clarity), `public/models/pc/CREDITS.md`.
- **Deleted:** `public/models/circuit/electronic-components.glb`, `public/models/circuit/CREDITS.md`.
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

- No new npm dependencies (confirmed: `useFBX` already exists in the installed `@react-three/drei`).
- `border-radius: 0` everywhere; no hardcoded hex outside theme-color hooks.
- Respect `prefers-reduced-motion` (already handled by `StoryStage`'s existing gate — untouched).
- No test runner in this project — verification is `pnpm build` + manual/headless-browser checks, as above.

## Out of scope

- Changing `STORY_BEATS` copy content.
- Changing the mobile/reduced-motion fallback (`StoryLevel.tsx`) beyond what's already shipped.
- Physically-accurate PC part modeling — these are stylized, low-poly, flat-shaded props in service of the arcade aesthetic, not a hardware-accuracy showcase.
