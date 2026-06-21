/**
 * Next.js configuration for Gene Prioritizer AI.
 *
 * Notes for future phases:
 * - Do NOT add `images.domains` or `images.remotePatterns` for GeneCards or
 *   any external biomedical data source. This app must never proxy/fetch
 *   GeneCards content (see docs/PHASE_0_ARCHITECTURE.md, Safety Model).
 * - Security headers are added here in Phase 1 in minimal form and will be
 *   hardened further (CSP, etc.) in Phase 9.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "off" },
        ],
      },
    ];
  },
};

export default nextConfig;
