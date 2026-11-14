const isDev = process.env.NODE_ENV !== "production"

/**
 * Security headers.
 * - Every route: no MIME sniffing, no framing by other sites, trimmed referrers, HTTPS only, and no access to
 *   device features the site never uses.
 * - The Next.js pages also get a content security policy: scripts, styles, images and requests may only come
 *   from this site. ('unsafe-inline' stays because Next.js and the theme script are inlined.)
 * - /builds/* are self-contained demo apps that load React, Babel and fonts from CDNs, so the strict policy
 *   is not applied to them.
 */
const baseHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
]

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "frame-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ")

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  // Stop `next dev` writing an AGENTS.md file into the repo.
  agentRules: false,
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      { source: "/:path*", headers: baseHeaders },
      { source: "/((?!builds/).*)", headers: [{ key: "Content-Security-Policy", value: csp }] },
    ]
  },
  async redirects() {
    return [
      { source: "/techtriumph", destination: "/", permanent: true },
      { source: "/about", destination: "/#experience", permanent: false },
      { source: "/contact", destination: "/#contact", permanent: false },
      { source: "/figma-designs", destination: "/#designs", permanent: false },
      { source: "/blog", destination: "/", permanent: false },
    ]
  },
}

export default nextConfig
