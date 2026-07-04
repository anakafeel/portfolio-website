import { CONTACT, SITE } from "@/lib/site";
import type { GameState } from "@/lib/game/state";
import { THEMES, isThemeName, type ThemeName } from "@/lib/game/state";
import { ACHIEVEMENTS } from "@/lib/game/achievements";

/** Serializable slice of content passed from the server to the terminal. */
export interface TerminalProjectInfo {
  slug: string;
  title: string;
  summary: string;
  rarityTier: string;
  techStack: string[];
}

export interface TerminalPostInfo {
  slug: string;
  title: string;
  date: string;
}

export interface TerminalData {
  projects: TerminalProjectInfo[];
  posts: TerminalPostInfo[];
}

/** One rendered output line; className is a theme-token text class. */
export interface TerminalLine {
  className?: string;
  text: string;
}

export type TerminalAction =
  | { kind: "clear" }
  | { kind: "exit" }
  | { kind: "navigate"; path: string }
  | { kind: "setTheme"; theme: ThemeName };

export interface CommandResult {
  lines: TerminalLine[];
  action?: TerminalAction;
}

export const TERMINAL_COMMANDS = [
  "help",
  "ls",
  "cat",
  "open",
  "stats",
  "theme",
  "themes",
  "about",
  "projects",
  "blog",
  "rice",
  "games",
  "home",
  "contact",
  "whoami",
  "clear",
  "exit",
] as const;

const HEADER = "text-accent";
const INFO = "text-accent-alt";
const DIM = "text-muted";
const ERROR = "text-highlight";

const NAV_ROUTES: Record<string, string> = {
  home: "/",
  about: "/about",
  projects: "/projects",
  blog: "/blog",
  rice: "/rice",
  games: "/games",
};

function err(text: string): CommandResult {
  return { lines: [{ className: ERROR, text }] };
}

function lsRoot(): CommandResult {
  return {
    lines: [{ text: "about.md    projects/    blog/    contact" }],
  };
}

function catAbout(): CommandResult {
  return {
    lines: [
      { className: HEADER, text: "# about" },
      { text: SITE.description },
      { text: "" },
      { className: DIM, text: `handle: ${SITE.handle}` },
      { className: DIM, text: "run 'about' to open the full page" },
    ],
  };
}

function catProject(arg: string, data: TerminalData): CommandResult {
  const slug = arg.replace(/^projects\//, "").replace(/\.mdx?$/, "");
  const project = data.projects.find((p) => p.slug === slug);
  if (!project) {
    return err(`cat: ${arg}: No such file`);
  }
  return {
    lines: [
      { className: HEADER, text: `# ${project.title}` },
      { className: DIM, text: `rarity: ${project.rarityTier}` },
      { className: DIM, text: `tech: ${project.techStack.join(", ")}` },
      { text: "" },
      { text: project.summary },
      { className: DIM, text: `run 'open ${project.slug}' for the full quest` },
    ],
  };
}

function statsCard(game: GameState): CommandResult {
  const unlocked = game.achievements.map((id) => ACHIEVEMENTS[id].title);
  return {
    lines: [
      { className: HEADER, text: `${SITE.handle}@portfolio` },
      { text: "──────────────────────────" },
      { text: `Level        ${game.level}` },
      { text: `XP           ${game.xp}` },
      { text: `Theme        ${game.theme}` },
      { text: `Audio        ${game.muted ? "muted" : "on"}` },
      {
        text: `Unlocked     ${unlocked.length ? unlocked.join(", ") : "none yet"}`,
      },
    ],
  };
}

const HELP_LINES: TerminalLine[] = [
  { className: HEADER, text: "available commands" },
  { text: "  ls [dir]           list contents" },
  { text: "  cat <file>         read a file" },
  { text: "  open <slug>        jump to a project quest" },
  { text: "  stats              player card (xp, level, unlocks)" },
  { text: "  theme <name>       switch palette" },
  { text: "  about|projects|blog|rice|games|home   navigate" },
  { text: "  contact            ways to reach me" },
  { text: "  clear / exit       tidy up / close" },
  { className: DIM, text: "  ─ tip: ↑/↓ history · tab completes" },
];

/**
 * Pure command interpreter: maps a raw input line to output lines plus an
 * optional side effect for the caller (navigate, theme switch, clear, exit).
 */
export function interpret(
  raw: string,
  data: TerminalData,
  game: GameState,
): CommandResult {
  const [name, ...rest] = raw.trim().split(/\s+/);
  const arg = rest.join(" ");

  switch (name) {
    case "help":
      return { lines: HELP_LINES };

    case "ls": {
      const dir = arg || ".";
      if (dir === "." || dir === "~" || dir === "/") {
        return lsRoot();
      }
      if (dir.replace(/\/$/, "") === "projects") {
        return {
          lines: [
            { text: data.projects.map((p) => `${p.slug}.md`).join("    ") },
          ],
        };
      }
      if (dir.replace(/\/$/, "") === "blog") {
        if (data.posts.length === 0) {
          return { lines: [{ className: DIM, text: "(no entries yet)" }] };
        }
        return {
          lines: data.posts.map((post) => ({
            text: `${post.date}  ${post.slug}.md`,
          })),
        };
      }
      return err(`ls: cannot access '${dir}'`);
    }

    case "cat": {
      if (!arg) return err("cat: missing file operand");
      if (arg === "about.md" || arg === "about") return catAbout();
      return catProject(arg, data);
    }

    case "open": {
      if (!arg) return err("open: missing project slug");
      const slug = arg.replace(/^projects\//, "").replace(/\.mdx?$/, "");
      const project = data.projects.find((p) => p.slug === slug);
      if (!project) return err(`open: ${arg}: no such quest`);
      return {
        lines: [{ className: INFO, text: `→ loading quest '${slug}'…` }],
        action: { kind: "navigate", path: `/projects/${slug}` },
      };
    }

    case "about":
    case "projects":
    case "blog":
    case "rice":
    case "games":
    case "home":
      return {
        lines: [{ className: INFO, text: `→ warping to ${name}` }],
        action: { kind: "navigate", path: NAV_ROUTES[name] },
      };

    case "themes":
      return {
        lines: [
          { className: HEADER, text: "palettes" },
          ...THEMES.map((theme) => ({
            className: theme === game.theme ? INFO : undefined,
            text: `  ${theme}${theme === game.theme ? "  ◄ current" : ""}`,
          })),
          { className: DIM, text: "  switch with: theme <name>" },
        ],
      };

    case "theme": {
      if (!arg) return err("theme: missing palette name. try 'themes'");
      if (!isThemeName(arg)) return err(`theme: unknown palette '${arg}'`);
      return {
        lines: [{ className: INFO, text: `→ palette set to ${arg}` }],
        action: { kind: "setTheme", theme: arg },
      };
    }

    case "stats":
    case "neofetch":
      return statsCard(game);

    case "contact":
      return {
        lines: [
          { className: HEADER, text: "# contact" },
          { text: `email     ${CONTACT.email}` },
          { text: `github    ${CONTACT.github}` },
          { text: `linkedin  ${CONTACT.linkedin}` },
        ],
      };

    case "whoami":
      return { lines: [{ text: SITE.handle }] };

    case "sudo":
      return err("sudo: nice try. this save file has no root access");

    case "clear":
      return { lines: [], action: { kind: "clear" } };

    case "exit":
    case "quit":
      return { lines: [], action: { kind: "exit" } };

    default:
      return err(`${name}: command not found. try 'help'`);
  }
}

/** Completion candidates for the current input, used by tab and the chip row. */
export function completions(input: string, data: TerminalData): string[] {
  const trimmed = input.trimStart();
  const parts = trimmed.split(/\s+/);

  if (!trimmed || parts.length === 1) {
    return TERMINAL_COMMANDS.filter((c) => c.startsWith(parts[0] ?? "")).slice(
      0,
      8,
    );
  }

  const [cmd, partial = ""] = [parts[0], parts[parts.length - 1]];
  if (cmd === "cat") {
    const options = [
      "about.md",
      ...data.projects.map((p) => `projects/${p.slug}.md`),
    ];
    return options.filter((o) => o.startsWith(partial)).slice(0, 6);
  }
  if (cmd === "open") {
    return data.projects
      .map((p) => p.slug)
      .filter((s) => s.startsWith(partial))
      .slice(0, 6);
  }
  if (cmd === "ls") {
    return ["projects/", "blog/", "."].filter((o) => o.startsWith(partial));
  }
  if (cmd === "theme") {
    return THEMES.filter((t) => t.startsWith(partial));
  }
  return [];
}
