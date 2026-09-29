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

/** One-line "what I'm doing now", for the top of /about (plain text). */
export const CURRENT_STATUS =
  "Seeking new-grad Software Engineer roles (systems, DevOps and developer tooling) starting summer 2027 · Ottawa, ON · open to relocation";

/** Plain education block, mirrors the resume. */
export const EDUCATION = {
  school: "Carleton University",
  degree: "B.Eng. Computer Systems Engineering",
  standing: "Fourth-year standing",
  graduation: "Expected May 2027",
  location: "Ottawa, ON",
  coursework: [
    "Operating Systems",
    "Computer Networks",
    "Signals & Communications",
    "Data Structures & Algorithms",
    "Object-Oriented Programming",
    "Embedded Systems",
  ],
} as const;

/** Skills, grouped exactly as on the resume. */
export const SKILLS: { label: string; items: string[] }[] = [
  {
    label: "Languages",
    items: ["C", "C++", "Go", "Java", "JavaScript", "Python", "Ruby", "SQL", "TypeScript"],
  },
  {
    label: "Frameworks",
    items: [
      "FastAPI",
      "Flask",
      "Next.js",
      "Node.js",
      "React",
      "ROS2",
      "Ruby on Rails",
      "scikit-learn",
      "Tailwind CSS",
    ],
  },
  {
    label: "Tools",
    items: [
      "AWS",
      "Bash",
      "Docker",
      "GCP",
      "Git",
      "GitHub",
      "GitLab",
      "Grafana",
      "Jenkins",
      "Jira",
      "Linux",
      "pytest",
      "QNX",
      "Tmux",
      "Vim",
    ],
  },
];

export const STORY_BEATS: StoryBeat[] = [
  {
    world: "WORLD 1-1",
    title: "SPAWN POINT",
    body: [
      "B.Eng. Computer Systems Engineering, Carleton University",
      "Fourth year, graduating May 2027",
    ],
    logo: { src: "/logos/carleton.svg", alt: "Carleton University logo" },
  },
  {
    world: "WORLD 1-2",
    title: "SKILL TREE",
    body: SKILLS.map(({ label, items }) => `${label}: ${items.join(", ")}`),
    logo: { src: "/logos/skill-tree.svg", alt: "Skill tree badge" },
  },
  {
    world: "WORLD 1-3",
    title: "SIDE QUESTS",
    body: [
      "Top 5 at CUMSA Hacks 2026 (Nightwatch)",
      "$1,000 BlackBerry QNX grant to build BOOPBOT for cuHacking 7",
      "3rd place at Technata Hacks 2024",
    ],
    logo: { src: "/logos/side-quests.svg", alt: "Side quests trophy badge" },
  },
  {
    world: "WORLD 1-4",
    title: "CURRENT QUEST",
    body: [
      "Seeking new-grad SWE roles in systems, DevOps and developer tooling, starting summer 2027",
      "Last quest cleared: Software Development Intern at Synopsys (May–Aug 2026)",
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
    status: "cleared",
    tech: ["Python", "Azure DevOps", "CI/CD", "Cypress", "Plotly", "React", "Docker", "Bash"],
    highlights: [
      "Built a new plotting feature for Ansys Fluent's visualization tool in 2 weeks, extending its backend API and shipping it end-to-end in a major customer release used by all Fluent users.",
      "Extended the feature into three of Ansys's Python client libraries (PyFluent-Visualization, PyEnSight, PySimAI) to prevent silent failures from the Python scripting interface, adding CI and Cypress test coverage to catch regressions.",
      "Led a Python 3.13 baseline consolidation across 13+ repositories, resolving failing CI builds with the DevOps, Fluids and Fluent Prime teams.",
    ],
    logo: { src: "/logos/synopsys.webp", alt: "Synopsys logo" },
  },
  {
    org: "Shopify CLI (OSS)",
    role: "Open-Source Contributor",
    period: "NOV 2025 — PRESENT",
    status: "active",
    tech: ["TypeScript", "Ruby", "oclif", "Node.js", "GitHub Actions"],
    highlights: [
      "Built a new command, shopify app config pull, that detects an already-linked app config and pulls it without repeated setup prompts (merged upstream, Shopify/cli#6662).",
      "Standardized config validation across core commands to prevent inconsistent state and common config-related failures.",
      "Refactored shared configuration modules to unify core logic, reducing duplication and long-term maintenance overhead.",
    ],
  },
  {
    org: "CuHacking",
    role: "Full Stack Developer: Website, Dev-Docs, Portal",
    period: "SEP 2024 — APR 2026",
    status: "cleared",
    tech: ["React", "TypeScript", "Payload CMS", "Node.js", "REST APIs"],
    highlights: [
      "Engineered a developer portal for 400+ attendees using modular React, keeping it reliable during live events at scale.",
      "Led the adoption of Storybook for reusable UI components, eliminating redundant testing and per-platform variants site-wide.",
      "Set up an Nx monorepo unifying the docs, website, portal and Figma scopes, clarifying ownership and build hierarchy.",
    ],
    logo: { src: "/logos/cuhacking.png", alt: "cuHacking logo" },
  },
  {
    org: "Autonomous Robotics Carleton",
    role: "Software Development Lead: Systems & Tooling",
    period: "JUL 2025 — JAN 2026",
    status: "cleared",
    tech: ["ROS2", "Python", "C++", "Linux", "Docker"],
    highlights: [
      "Led ROS2 perception and navigation development in C++/Python, applying concurrent programming to cut inter-process latency.",
      "Established Docker-based CI, enforced code reviews, and expanded test coverage across contributor PRs as the codebase scaled.",
      "Defined contribution standards and maintained centralized docs that onboarded and supported 20+ new contributors.",
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
