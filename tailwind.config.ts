import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.mdx",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        border: "var(--color-border)",
        foreground: "var(--color-foreground)",
        muted: "var(--color-muted)",
        accent: "var(--color-accent)",
        "accent-alt": "var(--color-accent-alt)",
        highlight: "var(--color-highlight)",
      },
      fontFamily: {
        pixel: ["var(--font-pixel)", "monospace"],
        body: ["var(--font-body)", "monospace"],
      },
      boxShadow: {
        pixel: "4px 4px 0 0 var(--color-border)",
        "pixel-accent": "4px 4px 0 0 var(--color-accent)",
      },
    },
  },
  plugins: [],
};
export default config;
