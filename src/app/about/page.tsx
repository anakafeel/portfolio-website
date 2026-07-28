import type { Metadata } from "next";

import AboutClientWrapper from "@/components/about/AboutClientWrapper";

export const metadata: Metadata = {
  title: "About — Saim Hashmi",
  description: "About Saim Hashmi — character stats and backstory.",
};

export default function AboutPage() {
  return <AboutClientWrapper />;
}
