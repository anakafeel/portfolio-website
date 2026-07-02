import type { Metadata } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { GameProvider } from "@/components/game/GameProvider";
import HUD from "@/components/game/HUD";
import AchievementToast from "@/components/game/AchievementToast";
import { SITE } from "@/lib/site";

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
  title: SITE.title,
  description: SITE.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="arcade" suppressHydrationWarning>
      <body
        className={`${pressStart.variable} ${vt323.variable} flex min-h-screen flex-col font-body`}
      >
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
        <GameProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <HUD />
          <AchievementToast />
        </GameProvider>
        <div
          aria-hidden
          className="crt-scanlines pointer-events-none fixed inset-0 z-50 opacity-40"
        />
        <SpeedInsights />
      </body>
    </html>
  );
}
