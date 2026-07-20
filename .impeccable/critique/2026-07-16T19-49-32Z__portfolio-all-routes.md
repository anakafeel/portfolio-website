---
target: portfolio (all routes)
total_score: 26
p0_count: 0
p1_count: 2
timestamp: 2026-07-16T19-49-32Z
slug: portfolio-all-routes
---
Method: dual-agent (Assessment A: design review · Assessment B: detector + browser evidence)

**Caveat on Assessment B / browser visualization**: Playwright MCP browser automation is not usable in this environment — it's configured to launch the system `chrome` channel binary, which isn't installed (only Playwright-bundled Chromium is present, unwired). Both sub-agents confirmed this independently. Every finding below is source-derived (full file reads) plus computed WCAG contrast math — not from live screenshots. Items marked "unverified — needs visual pass" should be confirmed once a browser path is available.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3/4 | HUD XP bar has correct `role="progressbar"`; no loading state during route transitions |
| 2 | Match System / Real World | 2/4 | "Secret level" framing on `/rice` and `/games` contradicts their permanent primary-nav placement |
| 3 | User Control and Freedom | 2/4 | Terminal dialog has no `aria-modal`/focus trap; custom close-dot only responds to Enter, not Space |
| 4 | Consistency and Standards | 3/4 | Strong token discipline, but no dedicated error/danger color — terminal errors reuse the "legendary" highlight yellow |
| 5 | Error Prevention | 2/4 | No `not-found.tsx`/`error.tsx` — a bad link drops into Next's stock unstyled 404 |
| 6 | Recognition Rather Than Recall | 4/4 | Persistent HUD + `aria-current` keep location/level/theme always visible |
| 7 | Flexibility and Efficiency | 4/4 | Terminal supports history (↑/↓), tab-completion, Ctrl+L — real power-user path |
| 8 | Aesthetic and Minimalist Design | 3/4 | CRT scanline overlay is well-layered (z-50, below modals) but reduces body-copy crispness site-wide |
| 9 | Error Recovery | 1/4 | Same 404/500 gap; no consistent error/danger visual language anywhere |
| 10 | Help and Documentation | 2/4 | Terminal `help` + tab-completion is the only documentation; discovery affordance is a hover-only tooltip, invisible on touch |
| **Total** | | **26/40** | **Acceptable — significant improvements needed before users are fully happy** |

## Anti-Patterns Verdict

**LLM assessment**: This does **not** read as AI slop at first glance. The arcade identity is load-bearing, not decorative: numbered `01–06` nav framed as level-select, a real GSAP-pinned side-scroller platformer on `/about`, a working terminal with command history and tab-completion, and a persisted XP/achievement system. Copy has genuine voice ("Exit strategy still unknown," "None of them will be closed"). Reduced-motion handling is unusually thorough for a portfolio — the 3D hero, side-scroller, and CRT animations all gate correctly on `prefers-reduced-motion`.

Where template tells leak through: every card component (`GameGrid`, `LoadoutCard`, `ExperienceLog`) repeats the same eyebrow → title → body → tags anatomy just re-skinned, and every section carries a tiny-uppercase-tracked eyebrow (`QUEST LOG`, `INVENTORY`, `BONUS STAGE`) — structurally the same scaffold the rules flag, just relabeled in-fiction. The bigger tell is a metaphor that doesn't fully commit: content framed as "secret"/"hidden" sits in the permanent primary nav.

**Deterministic scan**: `detect.mjs` found 2 hits across `src` and `content` (exit code 2):
- `side-tab` rule — `src/app/globals.css:123`, `.mdx-content blockquote { border-left: 4px solid var(--color-accent) }`. This is literally the banned "side-stripe accent border" pattern, applied to blog/MDX blockquotes.
- `bounce-easing` rule — `src/components/game/AchievementToast.tsx:46`, Tailwind's `animate-bounce`. The shared Motion rules explicitly ban bounce/elastic easing regardless of register.

Both are plausibly intentional retro touches (an arcade-cabinet bounce, a highlighted quote), but both also match bans in the shared ruleset unconditionally — worth a deliberate keep-or-fix call rather than an accidental pass-through.

**Visual overlays**: Not available this run (see caveat above). No user-visible overlay is present in a browser tab; re-run `/impeccable critique` once a working Chrome/Chromium path exists for the MCP browser tool to get live-rendered confirmation, especially for the "unverified" items below.

## Overall Impression

This is a genuinely distinctive, well-crafted portfolio — the 8-bit conceit is executed with real engineering depth (terminal, XP system, reduced-motion fallbacks) rather than being surface theming. The single biggest opportunity is **closing the gap between the fiction and the literal architecture**: content is called "secret" while sitting in the main nav, and the one place a visitor is most likely to break the illusion — a bad link — drops them into a completely unthemed default error page.

## What's Working

1. **Committed world-building with real engineering behind it** — a working terminal fed from live project/blog data, CRT power-on/off keyframes, and localStorage-persisted XP/achievements. This is what makes the "AI slop" verdict a clear no.
2. **Reduced-motion discipline is better than most production sites** — the 3D hero, the side-scroller (falls back to a vertical `StoryLevel` entirely), and CRT close animations all correctly gate on `prefers-reduced-motion`.
3. **Copy has real voice** — loadout flavor text and story beats read as personally written, doing the most work against a generic-template read.

## Priority Issues

**[P1] No branded 404/error page**
- **Why it matters**: No `not-found.tsx` or `error.tsx` exists under `src/app/`. The entire site is built on an immersive fiction; a mistyped URL or a renamed project slug (very plausible — recruiters often click stale resume links) drops straight into Next's stock unstyled 404 at the exact moment a lost visitor needs reassurance most.
- **Fix**: Add a themed `not-found.tsx` ("GAME OVER — this level doesn't exist ► RETURN TO HUB") reusing existing `pixel-border`/`SfxLink` components. Small, high-leverage fix.
- **Suggested command**: `/impeccable harden`

**[P1] Terminal dialog fails keyboard/screen-reader modal expectations**
- **Why it matters**: `Terminal.tsx`'s dialog has no `aria-modal="true"` and no focus trap — Tab escapes into the page behind it. The custom close-dot (`role="button"`) in both `Terminal.tsx` and `GameGrid.tsx` only wires `Enter`, not `Space`, so keyboard users trained on native button semantics find it silently unresponsive half the time. This is a real WCAG 4.1.2 gap, not a nitpick.
- **Fix**: Add `aria-modal="true"` plus a focus trap (first/last focusable element wrap), and extend the close-dot's `onKeyDown` to also fire on `" "`.
- **Suggested command**: `/impeccable audit`

**[P2] "Secret level" framing contradicts primary-nav placement**
- **Why it matters**: `/rice` and `/games` are permanent items 5–6 of 6 in the primary nav (`site.ts`), yet their own copy and achievement text call them "SECRET LEVEL" and "hidden rice zone." A secret one click from Home isn't a secret — it reads as an inconsistency in the game's own internal logic rather than as cleverness.
- **Fix**: Either genuinely hide them from primary nav (discoverable via terminal `open rice`, footer easter egg, or an achievement unlock) to match the copy, or drop the hidden-content pretense and own them as normal sections.
- **Suggested command**: `/impeccable clarify`

**[P2] Primary nav exceeds the ≤4-visible-options guideline**
- **Why it matters**: 6 always-visible nav items (`HOME/ABOUT/PROJECTS/BLOG/RICE/GAMES`) plus a 6-control HUD strip (LV/XP/★, 4 theme buttons, mute, terminal-toggle) sit at the single highest-traffic decision point on every page. This is the one clear, unambiguous cognitive-load checklist failure across the whole site (2 of 8 items fail: chunking and decision width — "moderate" band).
- **Fix**: Fold RICE/GAMES under an "EXTRAS"/"BONUS" grouping, or move them to a secondary row/footer, keeping the primary nav to 4 items.
- **Suggested command**: `/impeccable layout`

**[P3] Borderline contrast at the top of the side-scroller's sky gradient**
- **Why it matters**: `StorySideScroller.tsx`'s hardcoded ink `#16327c` on the `skyTop` end of its gradient (`#5c94fc`) computes to ≈3.99:1 — just under the 4.5:1 AA threshold — for text positioned in the top ~15–20% of the pinned stage. The rest of the theme (muted gray ≈6.3:1, accent pink ≈5.5:1) passes comfortably, so this is localized, not systemic.
- **Fix**: Darken `LEVEL.ink` slightly (e.g. `#0e2258`) or nudge the intro text block down from the very top of the gradient.
- **Suggested command**: `/impeccable audit`

## Persona Red Flags

**Jordan (recruiter, first-time visitor, ~30s patience)**: Credentials-first hero is a strong open. But a stale resume link straight into the stock 404 (P1) is the worst possible first impression for exactly this persona. The 6-item nav + HUD means Jordan parses ~12 interactive controls before reaching "Projects."

**Casey (distracted mobile user)**: Mobile hamburger nav collapses correctly and closes on route change — solid hygiene. But the `>_` terminal-toggle button relies on a hover-only `title` tooltip for its label; on touch, only `aria-label` reaches assistive tech, so a sighted mobile visitor gets zero hint what that control does. (Unverified — needs visual pass: whether the HUD's flex-wrap row feels cramped at 375px.)

**Sam (screen-reader / keyboard user)**: The terminal's missing focus trap and Space-key gap (P1) directly break Sam's expected modal behavior. On the positive side, the XP bar's `role="progressbar"` + `aria-valuenow`, the achievement toast's `aria-live="polite"`, and the theme buttons' `aria-pressed` are all correctly wired — better than average. The infinite `motion-safe:animate-blink` on "PRESS START" has no in-page stop control, a WCAG 2.2.2 (Pause/Stop/Hide) concern for anyone sensitive to blinking who hasn't set `prefers-reduced-motion`.

## Minor Observations

- Terminal error output reuses the same yellow (`text-highlight`) used for "LEGENDARY" rarity and achievement-unlock text — no dedicated error/danger token exists in the 8-variable theme palette.
- `GameGrid.tsx` and `Terminal.tsx` both render a decorative "traffic light" dot *and* a separate explicit "×" close button — mildly redundant, though it does reinforce recognition via a familiar window-chrome cue.
- `text-[8px]`/`text-[10px]` pixel-font labels are used extensively for status badges — small for a chunky, naturally-low-legibility pixel font; worth a legibility pass.
- Detector-flagged `animate-bounce` on `AchievementToast` and the `border-left` accent on MDX blockquotes both match items on the shared absolute-ban list; likely intentional for the retro register, but worth a deliberate keep-or-fix call (see `/impeccable quieter` or `/impeccable polish`).
- No loading/pending UI for client-side route transitions — on a slow connection, a nav click could feel unresponsive.

## Questions to Consider

1. If "secret level" framing is core to the game identity, why are `/rice` and `/games` one click from Home rather than genuinely discoverable easter eggs?
2. The side-scroller is the site's most ambitious build, but it's desktop-only and buried on `/about` — is the flagship interactive piece positioned where recruiters will actually see it?
3. Given every other error state is themed and in-fiction, is a stock Next.js 404 an acceptable one-time cost, or does it undermine the "design IS the product" premise the moment it's hit?
