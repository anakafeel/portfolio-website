export const SITE = {
  name: "Saim Hashmi",
  handle: "Saim Hashmi:)",
  title: "Saim Hashmi Portfolio",
  description:
    "Saim Hashmi's portfolio website:  projects, experience, and an 8-bit world to explore :)",
} as const;

export const RESUME_URL = "/resume.pdf";

export const CONTACT = {
  email: "hashmisaim037@gmail.com",
  github: "https://github.com/anakafeel",
  linkedin: "https://www.linkedin.com/in/saim-hashmi-2230b6243/",
} as const;

export const NAV_LINKS = [
  { label: "HOME", href: "/" },
  { label: "ABOUT", href: "/about" },
  { label: "PROJECTS", href: "/projects" },
  { label: "RICE", href: "/rice" },
  
] as const;

/**
 * Bonus content, deliberately kept off the primary nav so "SECRET LEVEL" /
 * "BONUS STAGE" framing (see rice/games pages) stays true — surfaced in the
 * footer and via the terminal's `rice`/`games` commands instead.
 */
export const EXTRA_LINKS = [
  { label: "GAMES", href: "/games" },
  { label: "BLOG", href: "/blog" },
] as const;
