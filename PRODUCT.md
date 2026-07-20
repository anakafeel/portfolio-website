# Product

## Register

brand

## Platform

web

## Users

Primary audience is hiring managers and recruiters evaluating Saim Hashmi for roles. They arrive with limited attention and a stack of other portfolios open in other tabs; the site's job is to prove real engineering skill fast while staying memorable enough to be the one they come back to.

## Product Purpose

A developer portfolio built as a playable 8-bit arcade world rather than a static resume page. Projects, experience, and writing are delivered through a light gamification layer — XP, achievements, theme-switching, chiptune SFX, a hidden terminal — that turns "look at my work" into something a visitor actively plays through. Success is a recruiter or hiring manager downloading the resume or reaching out after spending real time in the world.

## Positioning

The only portfolio that plays like a game and still proves you can ship production code.

## Conversion & proof

- Primary and secondary CTA: download/view resume (`RESUME_URL`) is primary; browsing projects and blog is the secondary fallback for visitors not ready to commit.
- The line a visitor remembers after 10 seconds: this developer turned their resume into an arcade cabinet — and it still holds up as real engineering.
- Belief ladder: this person is skilled → this person is memorable → worth reaching out.
- Proof on hand: the project and blog entries in `content/projects/*.mdx` and `content/blog/*.mdx`. No external testimonials, logos, or case studies to incorporate.

## Brand Personality

Playful, retro, technical. Arcade-cabinet nostalgia — classic CRT terminals, scanlines, hard on/off blinks, cartridge boxart, rarity-tiered loot framing — carrying real substance underneath, closer to Mario/Sonic-era game boxart and manuals than to a modern SaaS aesthetic. The delight is the hook; the engineering is what earns the reach-out.

## Anti-references

Not a generic corporate dev portfolio: hero + skill-icon row + uniform card grid + contact form, indistinguishable from a thousand template clones. Not gimmicky at the expense of readability — retro effects must never make content, contrast, or navigation harder to use. Not a corporate SaaS landing page: no gradient text, no tracked-uppercase eyebrows, no feature-card grid dressed up as achievements.

## Design Principles

The game is the pitch: every mechanic (XP, achievements, the terminal, chiptune SFX) should reinforce that this person builds things, not just decorate the page. Substance beats novelty: the arcade wrapper never outruns the projects and experience it's showcasing — skill has to read before delight does. Stay true to the fiction: CRT effects, secret-level framing on bonus pages, and chiptune audio hold together as one consistent world rather than isolated flourishes. Discoverable, not gatekept: easter eggs reward curiosity, but the primary path — resume, projects, contact — stays obvious and never blocked behind a hidden interaction. Accessible arcade: retro effects never cost WCAG AA compliance or break for reduced-motion users.

## Accessibility & Inclusion

WCAG AA baseline: keyboard navigation, visible focus states, and sufficient contrast across all four themes. `prefers-reduced-motion` must be honored everywhere animation appears — existing components already check for it; new ones follow the same pattern.
