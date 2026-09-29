/**
 * Minimal, nonce-free CSP. A full script-src policy would need per-request
 * nonces (Next's RSC payload and the theme boot script in layout.tsx are
 * inline), which forces every page to render dynamically. These directives
 * block clickjacking, plugin content and <base>/form hijacking without
 * touching scripts, styles, fonts, images, fetch() or Web Audio.
 */
const CONTENT_SECURITY_POLICY = [
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-contained server bundle for the Docker runner (node server.js).
  output: "standalone",
  poweredByHeader: false,
  outputFileTracingRoot: import.meta.dirname,
  async redirects() {
    return [
      // The homelab write-up was merged into VaultPi; keep old links working.
      {
        source: "/projects/homelab",
        destination: "/projects/vaultpi",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Content-Security-Policy",
            value: CONTENT_SECURITY_POLICY,
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
