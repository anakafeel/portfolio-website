import type { Metadata } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";

import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { GameProvider } from "@/components/game/GameProvider";
import AchievementToast from "@/components/game/AchievementToast";
import SoundEffects from "@/components/game/SoundEffects";
import TerminalOverlay from "@/components/terminal/TerminalOverlay";
import { getBlogPosts, getProjects } from "@/lib/content";
import { CONTACT, SITE } from "@/lib/site";
import type { TerminalData } from "@/lib/terminal/commands";

// Applies the saved theme before first paint to avoid a flash of the default
// theme. Must stay in sync with STORAGE_KEY in src/lib/game/storage.ts.
const THEME_BOOT_SCRIPT = `try{var s=JSON.parse(localStorage.getItem("saim:v1"));var t=s&&s.state&&s.state.theme;if(t)document.documentElement.setAttribute("data-theme",t)}catch(e){}`;

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
  display: "swap",
});

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: `%s — ${SITE.name}` },
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    locale: "en_CA",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

// schema.org Person, so search engines can tie the site to the GitHub and
// LinkedIn profiles. `<` is escaped so the JSON can never close the tag early.
const PERSON_JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE.name,
  url: SITE.url,
  jobTitle: "Software Engineer",
  alumniOf: { "@type": "CollegeOrUniversity", name: "Carleton University" },
  sameAs: [CONTACT.github, CONTACT.linkedin],
}).replace(/</g, "\\u003c");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const terminalData: TerminalData = {
    projects: getProjects().map(({ slug, frontmatter }) => ({
      slug,
      title: frontmatter.title,
      summary: frontmatter.summary,
      rarityTier: frontmatter.rarityTier,
      techStack: frontmatter.techStack,
    })),
    posts: getBlogPosts().map(({ slug, frontmatter }) => ({
      slug,
      title: frontmatter.title,
      date: frontmatter.date,
    })),
  };

  return (
    <html lang="en" data-theme="arcade" suppressHydrationWarning>
      <body
        className={`${pressStart.variable} ${vt323.variable} flex min-h-screen flex-col font-body`}
      >
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: PERSON_JSON_LD }}
        />
        <a
          href="#main"
          className="sr-only z-[60] bg-highlight px-3 py-2 font-pixel text-[10px] text-background focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          SKIP TO CONTENT
        </a>
        <GameProvider>
          <Header />
          <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
            {children}
          </main>
          <Footer />
          <AchievementToast />
          <SoundEffects />
          <TerminalOverlay data={terminalData} />
        </GameProvider>
        <div
          aria-hidden
          className="crt-scanlines pointer-events-none fixed inset-0 z-50 opacity-40"
        />
      </body>
    </html>
  );
}
