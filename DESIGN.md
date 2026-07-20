---
name: Saim Hashmi — Portfolio
description: An 8-bit arcade cabinet that happens to be a developer's resume.
colors:
  arcade-background: "#0a0a12"
  arcade-surface: "#16162a"
  arcade-border: "#34346a"
  arcade-foreground: "#e8e8f4"
  arcade-muted: "#8f8fb3"
  arcade-accent: "#ff2d78"
  arcade-accent-alt: "#00e5ff"
  arcade-highlight: "#ffd400"
  phosphor-background: "#020a04"
  phosphor-surface: "#05170c"
  phosphor-border: "#12522a"
  phosphor-foreground: "#35ff6d"
  phosphor-muted: "#1d9c46"
  phosphor-accent: "#8dffb0"
  phosphor-accent-alt: "#35ff6d"
  phosphor-highlight: "#d6ffe2"
  synthwave-background: "#170733"
  synthwave-surface: "#261252"
  synthwave-border: "#4d2b8f"
  synthwave-foreground: "#f4e9ff"
  synthwave-muted: "#a98fd6"
  synthwave-accent: "#ff3ec8"
  synthwave-accent-alt: "#00f0ff"
  synthwave-highlight: "#ffb300"
  gameboy-background: "#0f380f"
  gameboy-surface: "#306230"
  gameboy-border: "#8bac0f"
  gameboy-foreground: "#9bbc0e"
  gameboy-muted: "#8bac0f"
  gameboy-accent: "#cadc9f"
  gameboy-accent-alt: "#9bbc0e"
  gameboy-highlight: "#cadc9f"
typography:
  display:
    fontFamily: "'Press Start 2P', monospace"
    fontSize: "clamp(1.5rem, 1.1rem + 1.8vw, 2.25rem)"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "normal"
  title:
    fontFamily: "'Press Start 2P', monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: "'Press Start 2P', monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "normal"
  micro:
    fontFamily: "'Press Start 2P', monospace"
    fontSize: "0.625rem"
    fontWeight: 400
    lineHeight: 1.4
  nano:
    fontFamily: "'Press Start 2P', monospace"
    fontSize: "0.5rem"
    fontWeight: 400
    lineHeight: 1.4
  body:
    fontFamily: "'VT323', monospace"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.5
  code:
    fontFamily: "'VT323', monospace"
    fontSize: "1.1rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  none: "0px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "48px"
  section: "96px"
components:
  button-primary:
    backgroundColor: "{colors.arcade-surface}"
    textColor: "{colors.arcade-foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.arcade-surface}"
    textColor: "{colors.arcade-accent}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "12px 24px"
  card-project:
    backgroundColor: "{colors.arcade-surface}"
    textColor: "{colors.arcade-foreground}"
    rounded: "{rounded.none}"
    padding: "16px"
  nav-item:
    textColor: "{colors.arcade-foreground}"
    typography: "{typography.label}"
  nav-item-active:
    textColor: "{colors.arcade-highlight}"
    typography: "{typography.label}"
---

# Design System: Saim Hashmi — Portfolio

## 1. Overview

**Creative North Star: "The Cartridge in the Cabinet"**

Every screen is a level in the same cabinet, not a page on a resume site. The system borrows its entire visual grammar from late-80s/early-90s arcade hardware and boxart — hard square corners, offset drop-shadow silhouettes standing in for sprite shading, chunky monospace pixel type, and CRT scanlines laid over the whole viewport. Four selectable palettes (`arcade`, `phosphor`, `synthwave`, `gameboy`) work like cartridge skins: the layout and components never change shape, only which "cartridge" is inserted changes the color story. This is explicitly not a SaaS landing page or a generic dev-portfolio template — there is no gradient text, no soft rounded card grid, no tracked-uppercase eyebrows. The wrapper is playful and loud in its references, but every mechanic (XP, achievements, rarity tiers, the hidden terminal) still points back at real projects and a real resume; the game never outruns the substance it's dressed around.

**Key Characteristics:**
- Zero border-radius anywhere — every corner is a hard right angle.
- Elevation is a solid offset duplicate (a "pixel shadow"), never a blurred drop shadow.
- Two-font system: Press Start 2P for anything structural (headings, labels, nav, HUD, badges), VT323 for anything read at length (paragraphs, MDX body copy).
- Interactive states recolor to the theme's accent rather than changing shape or adding motion weight.
- The same four semantic color roles (`background`, `surface`, `border`, `foreground`, `muted`, `accent`, `accent-alt`, `highlight`) are re-skinned per theme; components must never reference a raw hex value.

## 2. Colors

Four complete palettes share one semantic role structure, selected by the `data-theme` attribute on `<html>`. `arcade` is the default cartridge.

### Primary

- **Cathode Pink** (`#ff2d78`, `arcade-accent`): the arcade cartridge's primary accent — active nav arrow, hover states, primary CTA hover text, "epic" rarity tier.
- **Coin Gold** (`#ffd400`, `arcade-highlight`): reserved for the single most important element on screen — the active nav label, HUD level number, "legendary" rarity tier, "LEVEL CLEAR" moments.
- **Arcade Cyan** (`#00e5ff`, `arcade-accent-alt`): secondary accent — "PLAYER 1" eyebrow, MDX link color, "rare" rarity tier.

### Neutral

- **Void Black** (`#0a0a12`, `arcade-background`): page background.
- **Cabinet Navy** (`#16162a`, `arcade-surface`): every raised surface — header, HUD strip, cards, buttons.
- **Circuit Indigo** (`#34346a`, `arcade-border`): all borders and the default pixel-shadow color.
- **Phosphor White** (`#e8e8f4`, `arcade-foreground`): primary text.
- **Dim Lilac** (`#8f8fb3`, `arcade-muted`): secondary text, index numbers, tech-stack tags, "common" rarity tier.

### Theme Variants (swap the roles above, keep the structure)

- **Phosphor** — a monochrome green CRT terminal: background `#020a04`, surface `#05170c`, border `#12522a`, foreground `#35ff6d`, muted `#1d9c46`, accent `#8dffb0`, accent-alt `#35ff6d`, highlight `#d6ffe2`.
- **Synthwave** — magenta/cyan neon grid: background `#170733`, surface `#261252`, border `#4d2b8f`, foreground `#f4e9ff`, muted `#a98fd6`, accent `#ff3ec8`, accent-alt `#00f0ff`, highlight `#ffb300`.
- **Game Boy** — the original DMG four-shade green LCD: background `#0f380f`, surface `#306230`, border `#8bac0f`, foreground `#9bbc0e`, muted `#8bac0f`, accent `#cadc9f`, accent-alt `#9bbc0e`, highlight `#cadc9f`.

### Named Rules

**The One Cartridge Rule.** A component only ever reads the eight semantic tokens (`background` / `surface` / `border` / `foreground` / `muted` / `accent` / `accent-alt` / `highlight`) via the Tailwind color classes that map to them. A raw hex value hard-coded into a component is a bug: it breaks the instant a visitor switches cartridges.

**The Rarity Rule.** Rarity tiers always map to the same four tokens in the same order regardless of theme: common → `muted`, rare → `accent-alt`, epic → `accent`, legendary → `highlight`. Never introduce a fifth rarity color outside this ramp.

## 3. Typography

**Display/Label Font:** Press Start 2P (`--font-pixel`), with `monospace` fallback.
**Body Font:** VT323 (`--font-body`), with `monospace` fallback.

**Character:** Press Start 2P is the "cartridge label" voice — blocky, all-structural, used in short bursts only (it gets unreadable at paragraph length). VT323 is the "CRT terminal" reading voice — a tall, slightly ragged monospace built to be read in quantity, so it carries every paragraph, MDX body, and long-form blog copy.

### Hierarchy

- **Display** (400, `clamp(1.5rem, 1.1rem + 1.8vw, 2.25rem)`, 1.4): the single H1 on the homepage hero only. One per page, maximum.
- **Title** (400, 0.875rem, 1.4): section and card headings (project titles, story-beat headings).
- **Body** (400, 1.25rem, 1.5): paragraph copy, MDX content, the default `<body>` text. Keep MDX prose under 75ch.
- **Code** (400, 1.1rem, 1.5): inline `<code>` within MDX prose. Deliberately a notch under Body so inline code reads as visually recessed from surrounding paragraph text without switching families.
- **Label** (400, 0.75rem, 1.4): nav items, buttons, HUD readouts, terminal chrome.
- **Micro** (400, 0.625rem, 1.4): rarity badges, tech-stack tags, index numbers, the smallest HUD readouts (level, XP, achievement count).
- **Nano** (400, 0.5rem, 1.4): the terminal title bar, modal status/stat labels (`<dt>` text, game-card status pills), and other chrome-within-chrome that sits below Micro. Reserve for non-essential metadata only — never the only copy conveying something the user needs.

### Named Rules

**The Cartridge Label Rule.** Press Start 2P never appears below 0.5rem (Nano) or runs longer than a short label/phrase (rarity badge, nav item, button text). If a sentence needs to be read comfortably, it belongs in VT323, not Press Start 2P.

## 4. Elevation

No blurred shadows exist anywhere in the system. Depth is conveyed with a **pixel shadow**: a hard, unblurred offset duplicate of the element's silhouette, the way an 8-bit sprite gets a solid drop-shadow tile beneath it. It never softens, never fades, and its color swaps to the active accent on hover/focus rather than gaining size or blur.

### Shadow Vocabulary

- **Pixel** (`box-shadow: 4px 4px 0 0 var(--color-border)`): default resting elevation on every card, button, and bordered container.
- **Pixel Accent** (`box-shadow: 4px 4px 0 0 var(--color-accent)`): the hover/focus-within state of any element carrying `.pixel-border-interactive` — border color and shadow color both shift to the theme accent together.

### Named Rules

**The Square Corner Rule.** `border-radius` is `0px`, everywhere, with no exceptions. A rounded corner is the single fastest way to break the cartridge illusion.

## 5. Components

### Buttons

- **Shape:** 2px solid border (`arcade-border`), square corners (0px radius), `.pixel-border` box-shadow at rest.
- **Primary/CTA:** `surface` background, `foreground` text, Label typography, `12px 24px` padding (e.g. "VIEW RESUME ►").
- **Icon-only (mobile menu toggle):** same treatment, `8px 12px` padding, single glyph (`≡` / `✕`).
- **Hover / Focus:** text recolors to `accent`; border and box-shadow recolor to `accent` together via `.pixel-border-interactive`. No scale, no translate on the button itself.

### Cards

- **Corner Style:** square (0px radius).
- **Background:** `surface`.
- **Shadow Strategy:** `.pixel-border` at rest, `.pixel-border-interactive` on hover — see Elevation.
- **Border:** 2px solid `border`, recoloring to `accent` on hover.
- **Internal Padding:** 16px.
- **Motion:** `motion-safe:hover:-translate-x-0.5 motion-safe:hover:-translate-y-0.5` — the whole card nudges up-left on hover, as if lifting off the felt of a cartridge slot. Respects `prefers-reduced-motion`.
- **Rarity badge:** Micro typography, uppercase, `◆` prefix, colored per the Rarity Rule.

### Navigation

- **Style:** sticky header, `surface` background, 2px bottom border. Each item is Label typography with a small Micro-scale index prefix (`01`, `02`, ...) and a `►` glyph that's always visible and pulsing on the active route, otherwise hidden until hover.
- **Default:** `foreground` text.
- **Hover/Focus:** `accent` text.
- **Active route:** `highlight` text, `►` glyph visible with `motion-safe:animate-pulse`.
- **Mobile:** nav collapses behind a `.pixel-border` icon toggle; the expanded list uses the same item styling with `border-border/40` dividers between rows.

### HUD (signature component)

The persistent status strip beneath the header — this is the component that makes the "you are playing a game" premise concrete on every single page, not just the homepage.

- Level and XP progress bar (`h-2` track, `background` fill track / `accent` progress fill, Micro typography for the "LV" readout).
- Achievement counter (`★ n/total`, Micro typography, `muted`).
- Theme switcher: one-letter toggle buttons per cartridge (`A`/`P`/`S`/`G`), Micro typography, the active theme filled solid with `accent` background and `background` text, inactive themes bordered-only.
- Mute toggle and terminal-open button, same bordered-only Micro-button treatment.
- All controls in the HUD share one visual family: `border border-border`, `px-1.5 py-0.5`, Micro typography, `hover:border-accent`.

## 6. Do's and Don'ts

### Do:

- **Do** keep every color reference to the eight semantic tokens so a component survives a theme switch untouched (The One Cartridge Rule).
- **Do** use the pixel shadow (`4px 4px 0 0`, no blur) for any element that needs to read as "raised" — cards, buttons, bordered panels.
- **Do** keep Press Start 2P short: labels, headings, badges, never body paragraphs.
- **Do** map rarity tiers to the same four tokens in the same order every time (The Rarity Rule).
- **Do** honor `prefers-reduced-motion` on every hover/entrance animation, matching the pattern already used on card hover and nav pulse.

### Don't:

- **Don't** add `border-radius` anywhere. Zero exceptions (The Square Corner Rule).
- **Don't** reach for a blurred `box-shadow`, `backdrop-filter` glass panel, or glow effect — it isn't in this system's material vocabulary.
- **Don't** build a generic corporate portfolio layout: hero + skill-icon row + uniform card grid + contact form. That's the exact anti-reference PRODUCT.md calls out.
- **Don't** use gradient text, tracked-uppercase eyebrow labels, or a feature-card grid — the corporate-SaaS-landing-page look PRODUCT.md explicitly rejects.
- **Don't** let a retro effect (scanlines, CRT blink, pixel animation) win over readability or accessibility — PRODUCT.md's "overly gimmicky/unreadable" anti-reference applies to every new surface.
- **Don't** hard-code a hex value into a component. If a new color is genuinely needed, it must be added as a token to all four themes, not inlined once.
