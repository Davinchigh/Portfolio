// Everything the site loads is served from this domain, so the policy can stay tight.
// Next.js and the build pages use inline scripts, hence 'unsafe-inline' (no eval anywhere).
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ")

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }]
  },
  images: {
    unoptimized: true,
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
