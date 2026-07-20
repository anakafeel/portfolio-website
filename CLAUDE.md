# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

This project uses **pnpm** (see `packageManager` in package.json).

- `pnpm dev` — start the Next.js dev server at http://localhost:3000
- `pnpm build` — production build; this is the main type/correctness check (there are no tests)
- `pnpm lint` — run ESLint via `next lint`

Note: the `slicemachine` script in package.json is a leftover from a removed Prismic setup and no longer works.

## Architecture

Next.js 15 App Router portfolio site with an **8-bit arcade theme**. There is no CMS or database — all content is local (MDX files + typed data modules) and pages are statically generated. The site's identity is a light gamification layer (XP, achievements, themes, chiptune SFX, a hidden terminal) that wraps otherwise ordinary pages.

### Content

- `content/projects/*.mdx` and `content/blog/*.mdx` — the only editorial content. Frontmatter is validated with Zod in `src/lib/content.ts` (build fails loudly on invalid frontmatter). Bodies render via `next-mdx-remote`. Projects carry a `rarityTier` (`common`/`rare`/`epic`/`legendary`) used for card styling.
- Structured non-MDX data lives in `src/lib/`: `site.ts` (name, contact, nav links), `about.ts` (story beats, loadout, experience), `games.ts`, `rice.ts`. Editing these files is how you change most page content.
- Routes: `/`, `/about`, `/projects` + `/projects/[slug]`, `/blog` + `/blog/[slug]`, `/rice`, `/games`. Dynamic routes read slugs from the `content/` directory.

### Game layer (the core cross-cutting system)

- `src/components/game/GameProvider.tsx` — client context + reducer holding `GameState` (xp, level, achievements, theme, muted, volume). Wraps the whole app in `layout.tsx`.
- `src/lib/game/state.ts` — pure reducer and helpers. Awarding an achievement is idempotent; theme switches auto-award `theme_shifter`.
- `src/lib/game/achievements.ts` — the achievement registry. **IDs are persisted in localStorage — never rename one once shipped.**
- `src/lib/game/storage.ts` — persistence under localStorage key `saim:v1` in a versioned envelope; `sanitizeGameState` rebuilds valid state from untrusted storage data.
- Achievement triggers: `AwardOnVisit` (page-visit awards), `QuestCard` (projects), `CopyEmailButton`, terminal discovery, etc. `HUD` shows XP/level; `AchievementToast` announces unlocks.

### Theming

- Four themes (`arcade`, `phosphor`, `synthwave`, `gameboy`) defined as CSS custom property blocks in `src/app/globals.css`, selected by the `data-theme` attribute on `<html>`.
- Tailwind color tokens (`background`, `surface`, `accent`, `highlight`, …) map to those variables in `tailwind.config.ts` — components must use the token classes, never raw colors, or they will break under theme switches.
- `layout.tsx` contains an inline `THEME_BOOT_SCRIPT` that applies the saved theme before first paint; it must stay in sync with `STORAGE_KEY` in `src/lib/game/storage.ts`.
- Fonts: Press Start 2P (`font-pixel`, headings/labels) and VT323 (`font-body`), exposed as CSS variables from `layout.tsx`.

### Sound

- `src/lib/audio/sfx.ts` synthesizes all chiptune SFX with the Web Audio API (square-wave note sequences — no audio files). The AudioContext is created lazily on first play so it always follows a user gesture.
- `src/components/game/useSound.ts` is the hook components use; it respects global mute/volume from GameState (sound starts **muted** by default). `SfxLink`/`SfxAnchor` are drop-in link wrappers that play SFX.

### Terminal easter egg

- `TerminalOverlay` (rendered site-wide from `layout.tsx`) is toggled by keyboard or the HUD button via the `terminal:toggle` window event (`src/lib/terminal/events.ts`).
- Command parsing/execution is pure and lives in `src/lib/terminal/commands.ts` — commands return `{ lines, action }` where actions (navigate, setTheme, exit…) are interpreted by the overlay. Project/blog data is serialized server-side in `layout.tsx` and passed down as `TerminalData`.
- Open/close uses a CRT power-on/power-off animation (globals.css) paired with `terminal`/`terminal_off` SFX.

### Animation and motion

- GSAP (+ `@gsap/react`) for scroll/entrance animations; Lenis smooth scrolling in the vertical story level; react-three-fiber + drei for the hero voxel scene.
- The About page story has two implementations: `StorySideScroller` (horizontal, pointer-driven) with `StoryLevel` (vertical GSAP scroll) as the fallback — `StoryStage` picks between them (progressive enhancement).
- Respect `prefers-reduced-motion`; existing animated components already check it — follow their pattern in new ones.

### Path alias

`@/*` maps to `src/*` (see tsconfig.json).

## Design Context

`PRODUCT.md` and `DESIGN.md` at the project root capture the strategic and visual design system (written by `/impeccable init`/`document`). Read them before any design-affecting change.

- **Register:** brand (portfolio — design IS the product). **Platform:** web.
- **Positioning:** the only portfolio that plays like a game and still proves you can ship production code.
- **Visual system:** "The Cartridge in the Cabinet" — four selectable theme palettes (arcade/phosphor/synthwave/gameboy) over one fixed component shape. Zero border-radius, hard offset "pixel" shadows (no blur), Press Start 2P for structural text, VT323 for body copy. See `DESIGN.md` for full tokens, components, and the named rules (One Cartridge, Rarity, Cartridge Label, Square Corner).
- **Anti-references:** generic corporate dev portfolios, corporate-SaaS-landing-page tropes (gradient text, eyebrows, feature-card grids), and gimmick-over-readability retro effects.
