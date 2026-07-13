export const SITE = {
  name: "Saim Hashmi",
  handle: "anakafeel",
  title: "Saim Hashmi — Portfolio",
  description:
    "Saim Hashmi's portfolio — projects, experience, and an 8-bit world to explore.",
} as const;

/** Drop the actual PDF at public/resume.pdf — the CTA 404s until it exists. */
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
  { label: "BLOG", href: "/blog" },
  { label: "RICE", href: "/rice" },
  { label: "GAMES", href: "/games" },
] as const;
