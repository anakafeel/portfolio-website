# saimhashmi.xyz

The personal site of **Saim Hashmi**, a Computer Systems Engineering student at Carleton University (graduating May 2027) working on systems, DevOps/infrastructure and developer tooling. The site has an 8-bit arcade look, but the resume, projects and experience are quick to find.

**Live:** [saimhashmi.xyz](https://saimhashmi.xyz) · **Resume:** [saimhashmi.xyz/resume.pdf](https://saimhashmi.xyz/resume.pdf)

<!-- Screenshot: add docs/screenshot.png (home page hero) and reference it here. -->

## Features

- **Voxel hero:** a three.js scene rendered with React Three Fiber, loaded client-side only and shown as a static frame under `prefers-reduced-motion`.
- **Game layer:** XP, levels and achievements (for example, opening the terminal or switching themes) are kept in a reducer and saved to `localStorage`. There are four colour themes (arcade, phosphor, synthwave, gameboy), and sound effects are synthesised with Web Audio, so no audio files ship.
- **Terminal:** press ``Ctrl+` `` or use the HUD button to open a shell-style overlay with `help`, `ls`, `cat`, `open`, `projects`, `theme`, `stats`, `contact` and more. It is a focus-trapped dialog that restores focus when it closes.
- **MDX content:** projects and blog posts live in `content/` as MDX, with frontmatter validated by zod at build time (`src/lib/content.ts`). They render through `next-mdx-remote` with themed components.
- **Doom easter egg:** on desktop, `/about` has an opt-in Doom-style corridor. The experience content always renders without it.
- **SEO and sharing:** a generated Open Graph image, sitemap, robots.txt, canonical URLs and Person JSON-LD.

## Stack

Next.js 15 (App Router, React Server Components) · React 19 · TypeScript · Tailwind CSS · three.js / @react-three/fiber · next-mdx-remote · zod · motion · Embla Carousel · Docker · GitHub Actions

## Project layout

```
content/            MDX for projects and blog posts
public/             static assets (resume.pdf, images, sprites)
src/app/            routes, metadata, OG image, sitemap/robots
src/components/     UI: hero, game HUD, terminal, quests, about, mdx
src/lib/            site config, content loader, game state, terminal commands
```

## Local development

Requires Node.js 22 and pnpm 10 (`corepack enable` picks up the version pinned in `package.json`).

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm lint
pnpm exec tsc --noEmit
pnpm build && pnpm start
```

To add a project, create `content/projects/<slug>.mdx`. The frontmatter schema is in `src/lib/content.ts`, and the page, sitemap entry and terminal listing are picked up automatically.

## Deployment

The site is self-hosted on a Raspberry Pi homelab:

1. **CI** (`.github/workflows/deploy.yml`) runs lint, typecheck and a production build on every pull request and push to `main`.
2. On `main` only, it builds the Docker image for `linux/amd64` and `linux/arm64` (on a native ARM runner, not QEMU), pushes both to Docker Hub, and merges them into a multi-arch `:latest` tag.
3. **Watchtower** on the Pi pulls the new `:latest` and restarts the container.
4. A **Cloudflare Tunnel** exposes the container publicly, with no inbound ports open on the home network.

The image (`Dockerfile`) is a multi-stage build that uses Next's `output: "standalone"`. It runs `node server.js` as a non-root user, and a `HEALTHCHECK` hits `http://127.0.0.1:3000/`.

```bash
docker build -t saim-portfolio .
docker run --rm -p 3000:3000 saim-portfolio
```
