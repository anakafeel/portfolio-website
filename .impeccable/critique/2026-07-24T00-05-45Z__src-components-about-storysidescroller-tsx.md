---
target: About page PC-build scroll section (StorySideScroller/PCBuildScene)
total_score: 32
p0_count: 0
p1_count: 0
timestamp: 2026-07-24T00-05-45Z
slug: src-components-about-storysidescroller-tsx
---
Method: dual-agent (A: ac7f23d883c66a3e7 · B: a1391db3fec7937af)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | TARGET + beat card + trace triple-confirm state |
| 2 | Match System / Real World | 4 | CPU/RAM/GPU/PSU + "diagnostic probe" scanning language reads coherently |
| 3 | User Control and Freedom | 3 | Scrub is bidirectional, no trap |
| 4 | Consistency and Standards | 4 | Reuses pixel-border/HUD tokens; off-ramp text-[9px] fixed to 10px (micro) |
| 5 | Error Prevention | 3 | Finale/beat-4 overlap fixed (was 1 pre-fix) |
| 6 | Recognition Rather Than Recall | 4 | TARGET label removes any need to guess what a shape is |
| 7 | Flexibility and Efficiency | 2 | No way to skip ahead to the resume CTA short of scrolling ~400vh |
| 8 | Aesthetic and Minimalist Design | 3 | Restrained composition; trace-line now fills its container after fix |
| 9 | Error Recovery | 3 | No user input possible, low applicability |
| 10 | Help and Documentation | 3 | Self-explanatory framing, no instructions needed |
| **Total** | | **32/40** | **Good** |

(Pre-fix total was 29/40; camera-differentiation and overlap fixes raised #4/#5.)

## Anti-Patterns Verdict

**LLM assessment**: Not generic — the diagnostic-probe-riding-the-camera device, SCANNING/TARGET engineering-diagnostic vocabulary, and steps(4) hard-cut easing are specific to this brand's arcade-engineer fiction, not borrowed GSAP+R3F scrollytelling boilerplate.

**Deterministic scan**: `detect.mjs` on the 2 in-scope files found 1 finding — `design-system-font-size` on `StorySideScroller.tsx:183` (`text-[9px]` off the DESIGN.md ramp) — fixed to `text-[10px]` (micro). Browser-injected detector found 4 `ai-color-palette` hits on the TARGET/SCANNING labels, but these are false positives: `--color-accent-alt` is a pre-existing site-wide token already used throughout the rest of the About page, not a new palette choice from this feature.

## Overall Impression

The concept lands (a diagnostic-probe camera dolly through a procedurally-built PC), but shipped with two real bugs that undercut it: the 3 inspection stops looked nearly identical (camera offset dwarfed the deltas between waypoints) and the finale overlay stacked with the last story card. Both are fixed and verified.

## What's Working

1. Theme-reactive scene (RAM RGB bar, PSU fan glow, probe tip all track `--color-accent`) — confirmed by switching themes and re-screenshotting.
2. TARGET label bridges fiction to render — does real IA work, naming geometry the beat copy never names.
3. `steps(4)` reveal easing matches the brand's "hard on/off blinks" CRT vocabulary.

## Priority Issues (resolved)

- **[P1 → Fixed] Camera dolly barely differentiated the 4 waypoints.** Root cause: shared `CAMERA_OFFSET` (magnitude ~10.7) dwarfed the ~3-7 unit deltas between waypoints. Fixed with per-waypoint offsets verified via headless Three.js frustum projection (own-part framing confirmed dead-center at each stop; all 4 parts including PSU confirmed in-frame at the overview).
- **[P1 → Fixed] "SCAN COMPLETE" rendered on top of the still-visible WORLD 1-4 beat card.** Fixed by closing the last beat's reveal window at `CLEAR_FRACTION` instead of `REVEAL_WINDOW` later. Re-verified via scripted scroll-through: beat is null exactly when clear becomes visible.
- **[P2 → Fixed] SVG trace-line rendered as an illegible sliver** (2:1 viewBox inside a ~10:1 container, default `preserveAspectRatio` letterboxed it). Fixed with `preserveAspectRatio="none"`.
- **[P3 → Fixed] `text-[9px]` off the documented type ramp.** Changed to `text-[10px]` (micro step).
- **[P2 → Not fixed, out of scope for this pass] No way to skip the ~400vh pinned sequence.** Flagged for a future pass; not part of this plan's scope (adding a skip affordance is a new feature, not a bug in the shipped redesign).

## Persona Red Flags

**Impatient recruiter skimming quickly**: ~4 screens of scroll for a section whose 3 stops previously looked nearly identical worked against the "prove skill fast" positioning — largely addressed now that each stop is visually distinct.

**Keyboard user without reduced-motion set**: the `VIEW RESUME` link only enters the tab order once its container becomes visible (`invisible` → `visibility:hidden` removes it from the tab sequence), so a keyboard user tabbing without scrolling never reaches the resume CTA via Tab alone. Not fixed in this pass — worth a follow-up since resume download is the site's primary conversion action, but it's a pre-existing pattern shared by every `.scroller-beat`/`.scroller-clear` reveal, not something newly introduced by this redesign, so out of scope for "PC-build section" bug-fixing specifically.

## Minor Observations

- RAM geometry reads as flat plates rather than upright sticks from this camera angle — reasonable given the TARGET label carries the naming.
- The camera-mounted diagnostic probe (glowing cone + point light) reads well in every screenshot.

## Questions to Consider

- Is a "skip to resume" affordance worth adding given the ~4-screen scroll cost, or does the arcade fiction justify the toll for a visitor who chooses to play through it?
- Should the keyboard-tab-order gap (resume CTA unreachable via Tab alone without scrolling) be addressed site-wide across all `.scroller-beat`-style reveals, or is it acceptable given the primary path (nav → resume link elsewhere) already exists?
