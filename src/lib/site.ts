export const SITE = {
  name: "Saim Hashmi",
  handle: "Saim Hashmi",
  title: "Saim Hashmi | Software Engineer (Systems & DevOps)",
  description:
    "Computer Systems Engineering @ Carleton (May 2027). Previously SWE Intern at Synopsys, merged contributor to Shopify CLI, ROS2 tooling lead. Projects, resume and contact.",
  url: "https://saimhashmi.xyz",
} as const;

export const RESUME_URL = "/resume.pdf";

export const CONTACT = {
  email: "hashmisaim037@gmail.com",
  github: "https://github.com/anakafeel",
  linkedin: "https://www.linkedin.com/in/saim-hashmi",
  // Kept for the /games page ("LFG"); not meant for the main contact row.
  discord: "https://discord.com/users/587612275460931595",
} as const;

/**
 * Primary nav. RESUME is a static PDF, not a route: render it as a plain
 * anchor (target="_blank"), not next/link.
 */
export const NAV_LINKS = [
  { label: "HOME", href: "/" },
  { label: "ABOUT", href: "/about" },
  { label: "PROJECTS", href: "/projects" },
  { label: "RESUME", href: RESUME_URL },
] as const;

/**
 * Bonus content, deliberately kept off the primary nav so "SECRET LEVEL" /
 * "BONUS STAGE" framing (see rice/games pages) stays true — surfaced in the
 * footer and via the terminal's `rice`/`games` commands instead. BLOG stays
 * here until there are a few more posts.
 */
export const EXTRA_LINKS = [
  { label: "RICE", href: "/rice" },
  { label: "GAMES", href: "/games" },
  { label: "BLOG", href: "/blog" },
] as const;
