import { readFile } from "node:fs/promises";
import path from "node:path";

import { ImageResponse } from "next/og";

import { SITE } from "@/lib/site";

// Link-preview card (og:image / twitter:image), rendered once at build time.
// The TTF is committed alongside so the build never hits the network
// (next/font only ships woff2, which Satori can't read).
export const alt = `${SITE.name} — Software Engineer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Arcade theme tokens from globals.css.
const C = {
  background: "#0a0a12",
  surface: "#16162a",
  border: "#34346a",
  foreground: "#e8e8f4",
  muted: "#8f8fb3",
  accent: "#ff2d78",
  accentAlt: "#00e5ff",
  highlight: "#ffd400",
};

export default async function OpengraphImage() {
  const font = await readFile(
    path.join(process.cwd(), "src/app/_og/PressStart2P-Regular.ttf"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: 40,
          background: C.background,
          fontFamily: "Pixel",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 64px",
            background: C.surface,
            border: `8px solid ${C.border}`,
            boxShadow: `12px 12px 0 0 ${C.accent}`,
          }}
        >
          <div style={{ fontSize: 28, color: C.accentAlt }}>PLAYER 1</div>
          <div style={{ fontSize: 104, marginTop: 40, color: C.highlight }}>
            {SITE.name.toUpperCase()}
          </div>
          <div
            style={{
              fontSize: 32,
              marginTop: 44,
              lineHeight: 1.6,
              color: C.foreground,
            }}
          >
            Software Engineer · Systems, DevOps & Tooling
          </div>
          <div style={{ fontSize: 28, marginTop: 32, color: C.muted }}>
            Carleton CSE &apos;27
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Pixel", data: font, style: "normal", weight: 400 }] },
  );
}
