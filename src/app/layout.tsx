import type { Metadata } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE } from "@/lib/site";

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
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <div
          aria-hidden
          className="crt-scanlines pointer-events-none fixed inset-0 z-50 opacity-40"
        />
        <SpeedInsights />
      </body>
    </html>
  );
}
