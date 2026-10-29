/** Static site: every page is pre-built, so it can be hosted on any static host (Cloudflare, Netlify or Vercel). */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
}
export default nextConfig
