export interface StoryBeat {
  world: string;
  title: string;
  body: string[];
  /**
   * Card badge. The files in public/logos/ are pixel placeholders — swap
   * each one for the real company/org logo (keep the path, or update it
   * here if the replacement uses a different name/format).
   */
  logo: { src: string; alt: string };
}

export type Rarity = "legendary" | "epic" | "rare";

export interface LoadoutItem {
  slot: string;
  item: string;
  rarity: Rarity;
  flavor: string;
}

export const LOADOUT: LoadoutItem[] = [
  {
    slot: "KEYBOARD",
    item: "HHKB Professional Hybrid",
    rarity: "legendary",
    flavor: "Topre switches. +10 WPM, permanently bound to home row.",
  },
  {
    slot: "MACHINE",
    item: "Ryzen 7 7840HS · 32 GB DDR5",
    rarity: "epic",
    flavor: "Daily driver. Compiles anything you feed it.",
  },
  {
    slot: "OS",
    item: "Fedora 42 + Niri",
    rarity: "legendary",
    flavor: "Scrollable-tiling Wayland. Fully riced — see the secret level.",
  },
  {
    slot: "EDITOR",
    item: "AstroNvim",
    rarity: "epic",
    flavor: "Modal editing unlocked. Exit strategy still unknown.",
  },
  {
    slot: "TERMINAL",
    item: "Alacritty + fish",
    rarity: "rare",
    flavor: "GPU-accelerated incantations with autocompletion.",
  },
  {
    slot: "MULTIPLEXER",
    item: "tmux",
    rarity: "rare",
    flavor: "Six sessions deep. None of them will be closed.",
  },
];

export const STORY_BEATS: StoryBeat[] = [
  {
    world: "WORLD 1-1",
    title: "SPAWN POINT",
    body: [
      "Computer Systems Engineering at Carleton University, 4th year -  graduating May 2027",
    ],
    logo: { src: "/logos/carleton.svg", alt: "Carleton University logo" },
  },
  {
    world: "WORLD 1-2",
    title: "SKILL TREE",
    body: [
      "Systems branch: C, C++, Go, Rust, and Python",
      "Web branch: TypeScript, React, and Next.js",
      "DevOps branch: CI/CD, Docker, and Azure DevOps",
    ],
    logo: { src: "/logos/skill-tree.svg", alt: "Skill tree badge" },
  },
  {
    world: "WORLD 1-3",
    title: "SIDE QUESTS",
    body: [
      "Top 5 at CUMSA Hacks 2026",
      "OSS contributions to Shopify CLI",
      "3rd place at Technata Hacks 2024",
    ],
    logo: { src: "/logos/side-quests.svg", alt: "Side quests trophy badge" },
  },
  {
    world: "WORLD 1-4",
    title: "CURRENT QUEST",
    body: [
      "Software Development Intern at Synopsys",
      "Building CI/CD pipelines for the Ansys Fluent R&D team",
    ],
    logo: { src: "/logos/synopsys.webp", alt: "Synopsys logo" },
  },
];

export interface ExperienceEntry {
  org: string;
  role: string;
  period: string;
  status: "active" | "cleared";
  tech: string[];
  highlights: string[];
  /** Org logo badge. Optional — omit for entries with no real logo on hand. */
  logo?: { src: string; alt: string };
}

export const EXPERIENCE: ExperienceEntry[] = [
  {
    org: "Synopsys",
    role: "Software Development Intern",
    period: "MAY 2026 — AUG 2026",
    status: "active",
    tech: ["Azure DevOps", "CI/CD", "Bash", "Docker", "Python"],
    highlights: [
      "Built and maintained CI/CD pipelines on Azure DevOps for the Ansys Fluent R&D team, streamlining build and release workflows.",
      "Automated recurring build and deployment tasks with Bash and Python, reducing manual intervention across the pipeline.",
    ],
    logo: { src: "/logos/synopsys.webp", alt: "Synopsys logo" },
  },
  {
    org: "Shopify CLI (OSS)",
    role: "Open-Source Contributor",
    period: "NOV 2025 — PRESENT",
    status: "active",
    tech: ["TypeScript", "Ruby", "oclif", "Node.js"],
    highlights: [
      "Built config:pull to detect shopify.project.toml and skip redundant prompts, reducing manual setup for CLI users.",
      "Standardized config validation across core commands and refactored shared config modules to cut duplication.",
    ],
  },
  {
    org: "Autonomous Robotics Carleton",
    role: "Software Development Lead: Systems & Tooling",
    period: "JUL 2025 — PRESENT",
    status: "active",
    tech: ["ROS2", "Python", "C++", "Linux"],
    highlights: [
      "Led ROS2 data pipelines for perception and navigation, reducing inter-process latency across the autonomy stack.",
      "Established Docker-based CI, enforced code reviews, and maintained docs that onboarded 20+ new contributors.",
    ],
    logo: {
      src: "/logos/autonomous-robotics-carleton.png",
      alt: "Autonomous Robotics Carleton (arc) logo",
    },
  },
  {
    org: "IEEE SPAC",
    role: "Full Stack Developer & UI/UX Designer",
    period: "JUL 2025 — OCT 2025",
    status: "cleared",
    tech: ["React", "TypeScript", "Figma"],
    highlights: [
      "Redesigned responsive, WCAG-compliant UI components, improving accessibility and cross-device usability.",
      "Built onboarding and submission workflows that significantly reduced failed submissions for candidates and sponsors.",
    ],
    logo: { src: "/logos/ieee-spac.webp", alt: "IEEE SPAC 2025 logo" },
  },
  {
    org: "CuHacking",
    role: "Full Stack Developer: Website, Dev-Docs, Portal",
    period: "SEP 2024 — MAY 2025",
    status: "cleared",
    tech: ["React", "TypeScript", "Payload CMS", "Node.js"],
    highlights: [
      "Engineered a developer portal for 400+ attendees using modular React, keeping it reliable during live events at scale.",
      "Automated content pipelines via Payload CMS and shell scripts, eliminating JSON editing for non-technical organizers.",
    ],
    logo: { src: "/logos/cuhacking.png", alt: "cuHacking logo" },
  },
  {
    org: "Environmental Health & Safety, Carleton",
    role: "Web Developer",
    period: "JAN 2025 — APR 2025",
    status: "cleared",
    tech: ["CMS", "SEO", "JavaScript"],
    highlights: [
      "Redesigned CMS workflows so non-technical staff could publish events and updates without developer help.",
      "Restructured site architecture and SEO to improve discoverability while reducing page load times.",
    ],
  },
];
