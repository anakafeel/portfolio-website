# Doom Corridor Life Story — Design Spec

**Date:** 2026-07-28  
**Branch:** 8bitrevamp  
**Surface:** `/about` — `DoomScrollEffect.tsx` + `page.tsx`  
**Register:** brand (portfolio — design IS the product)

---

## 1. Problem Statement

The About page currently has three compounding bugs:

1. **Z-index overlap** — `DoomScrollEffect` is `position: fixed` inside a `2000vh` ghost container. The real About content (StoryStage, ExperienceLog, LoadoutCard) renders immediately below in normal flow, visually overlapping the game.
2. **Story is outside the game** — Career beats live in `StorySideScroller`/`StoryLevel`, separate from the Doom world. The Doom window is pure aesthetic; it carries no story.
3. **No exit** — After the VICTORY screen there's no way out. The user is stuck or confused.

---

## 2. Design Vision

**"Walk through my life — room by room, wall by wall."**

The Doom corridor IS the biography. Career cards are projected onto the corridor walls at specific scroll depths, aligned to the rooms the existing CSS already creates via `doom-rotate`. Enemies gate each room transition — shoot to advance. After the last enemy falls, the VICTORY screen holds for 1.5s, then the Doom overlay slides up while the normal About content fades in beneath it (crossfade-during-slide).

The result: one continuous scroll arc — game entry → life story told through corridor rooms → victory → About page content reveal.

---

## 3. Architecture

### 3.1 Page Structure Fix (`page.tsx`)

Remove the explicit `height: 2000vh` wrapper div. `DoomScrollEffect` owns its scroll height internally. The page becomes a simple column:

```
<DoomScrollEffect />          ← self-contained, owns its scroll track
<section className="about-content"> ← normal flow, starts invisible, fades in after doom-cleared
  <h1>CHARACTER SELECT</h1>
  <StoryStage />
  <ExperienceLog />
  <LoadoutCard />
</section>
```

`DoomScrollEffect` emits a `doom-cleared` event (or calls a callback prop) after victory. The parent renders `.about-content` with `opacity: 0` initially and transitions to `opacity: 1` while Doom slides out.

### 3.2 Scroll Track Structure

`DoomScrollEffect` wraps everything in a single `position: relative; height: 2000vh` container. All inner elements are `position: fixed` keyed to scroll progress via `animation-timeline: scroll()`. After `doom-cleared` fires, the container collapses and `position: fixed` elements follow the document flow normally.

### 3.3 Career Wall Cards

Six career moments injected as overlays inside `.doom-wrapper`, positioned in 3D space using the same `rotateX(-90deg)` transform the wall divs use. Each card has its own `animation-range` so it appears at the exact scroll depth the camera is passing through that room.

**Scroll → Room → Career moment mapping:**

| Scroll % | Corridor room                | Career card                                                                    |
| -------- | ---------------------------- | ------------------------------------------------------------------------------ |
| 0–15%    | Entry / title screen         | None — let the Doom logo / weapon reveal breathe                               |
| 20–35%   | First corridor turn (Room 1) | **SPAWN POINT** — Carleton University, CSE, first boot curiosity               |
| 38–52%   | Side passage (Room 2)        | **SKILL TREE** — Systems branch (C/C++/Go/Rust/Python) + Web branch (TS/React) |
| 55–70%   | The wide room (Room 3)       | **SIDE QUESTS** — CUMSA Hacks Top 5, Technata 3rd, Shopify CLI OSS, ARC        |
| 75–92%   | Boss room (Room 4)           | **CURRENT QUEST** — Synopsys + ARC lead; two active entries                    |
| 95–100%  | Boss defeated                | VICTORY screen → exit                                                          |

### 3.4 Career Card Visual Design

Each card is a fixed-position overlay rendered inside the `.doom-scroll` stacking context, appearing in front of the 3D walls (z-index above the wrapper, below the weapon). Design spec:

- **Background:** `rgba(10, 10, 18, 0.88)` — Void Black with 88% opacity so wall texture bleeds through slightly, grounding it in the 3D space
- **Border:** 2px solid `arcade-border` (#34346a) — same as `.pixel-border`; no border-radius
- **Box shadow:** `4px 4px 0 0 var(--color-border)` — canonical pixel shadow
- **Typography:**
  - World label (e.g. "WORLD 1-1") — Press Start 2P, `nano` size (0.5rem), `arcade-accent-alt` (#00e5ff)
  - Card title — Press Start 2P, `micro` size (0.625rem), `arcade-highlight` (#ffd400)
  - Body — VT323, 1.1rem, `arcade-foreground` — max 2 lines to keep it scannable while walking
  - Company name if applicable — VT323, 1rem, `arcade-muted`
- **Size:** `max-width: min(340px, 80vw)`, no fixed height
- **Position:** `position: fixed`, centered horizontally, offset vertically per room (Room 1 upper-left, Room 2 upper-right, Room 3 lower-center, Room 4 full-width boss card)
- **Animation:** `animation-timeline: scroll()` with `animation-range: entry <start%> cover <end%>`. Fade in over ~5% scroll, hold, fade out over ~3% scroll as next room begins. Use `opacity` + `translateY(8px → 0px)` entrance only — no scale, no bounce.

### 3.5 Enemy Progression Gate

The existing checkbox mechanic (shooting enemies) is preserved exactly. No changes to enemy logic. The only addition: each enemy room loosely corresponds to a career card room. Enemy 1 guards Room 1 card, etc. This is narrative coherence only — not a technical gate, since the CSS already sequences enemies correctly.

### 3.6 Victory Exit Sequence

**Trigger:** Last enemy checkbox checked (`.doom-inner span:nth-of-type(6) input:checked`).

**Sequence (JS-driven, not CSS — checkbox state is unreliable for multi-step CSS transitions):**

1. A small React `useEffect` watches for the last checkbox via `MutationObserver`
2. After 1500ms (let VICTORY text read), sets state `cleared = true`
3. `cleared = true` applies:
   - On `.doom-scroll`: `transform: translateY(-100vh); transition: transform 1.2s cubic-bezier(0.76, 0, 0.24, 1)` — slides the whole fixed overlay up and off-screen
   - On `.about-content`: `opacity: 1; transition: opacity 0.9s ease 0.4s` — fades in while Doom is mid-slide (0.4s delay so content appears as Doom is rising, not before)
4. After transition completes (1.4s), `doom-scroll` gets `display: none` and the scroll track container gets `height: 0` — collapses cleanly so `.about-content` is the document

**Reduced motion:** Skip the slide animation. `cleared = true` immediately sets `doom-scroll` to `opacity: 0; display: none` and `about-content` to `opacity: 1`, no transitions.

### 3.7 Stacking Fix Summary

| Layer                          | z-index  | Notes                         |
| ------------------------------ | -------- | ----------------------------- |
| `.doom-scroll` (fixed overlay) | 0 (host) | Fixed, covers viewport        |
| `.doom-wrapper` (3D scene)     | -1       | Behind HUD                    |
| Career wall cards              | 5        | Above walls, below weapon     |
| `.doom-weapon`                 | 9        | Fixed bottom-center           |
| `.doom-hud`                    | 999      | Fixed bottom strip            |
| `.doom-logo`                   | 10       | Fixed, hides after click      |
| `.about-content` (below game)  | auto     | Normal flow, starts opacity 0 |

---

## 4. Impeccable / Brand Register Notes

- **One Cartridge Rule:** All career card colors use semantic token hex values (no raw hardcodes outside CSS that can't read CSS vars — since the Doom overlay uses raw CSS in a `<style>` block, hex values from the arcade theme are acceptable here and match DESIGN.md exactly)
- **No gradient text, no eyebrows, no card grids** — cards are contextual overlays in 3D space, not a grid
- **Pixel shadow** on every card — matches the system's elevation language
- **Zero border-radius** — hard corners only
- **VT323 for body, Press Start 2P for structural labels** — Cartridge Label Rule enforced
- **Reduced motion:** all card animations disabled, victory exit is instant crossfade

---

## 5. What Gets Changed

| File                                        | Change                                                                                                                                                |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/about/page.tsx`                    | Remove `height: 2000vh` wrapper; add `about-content` section with initial `opacity: 0`; wire `onCleared` callback                                     |
| `src/components/about/DoomScrollEffect.tsx` | Add career wall cards (6 CSS-animated overlays); add `MutationObserver` for last-enemy detection; add victory exit animation; accept `onCleared` prop |
| `src/app/globals.css`                       | Add `.doom-card` styles, `.doom-cleared` transition classes, `@keyframes doom-card-in`                                                                |

`StorySideScroller.tsx`, `StoryLevel.tsx`, `StoryStage.tsx` — **not touched**. They remain as the content below the game once Doom exits.

---

## 6. Out of Scope

- No changes to enemy behavior, sprite assets, or corridor geometry
- No mobile version of the wall cards (Doom effect already gracefully degrades on mobile; cards only show on `min-width: 640px`)
- No audio changes
- `StorySideScroller` PC-build scene remains the desktop story below the game
