import type { MetadataRoute } from "next"

const paths = ["/", "/projects", "/projects/flowline", "/projects/mcp", "/projects/recall", "/projects/zero", "/resume", "/privacy"]

export default function sitemap(): MetadataRoute.Sitemap {
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL
  const base = host ? `https://${host}` : "http://localhost:3000"
  return paths.map((p) => ({ url: `${base}${p}`, changeFrequency: p === "/" ? "weekly" : "monthly", priority: p === "/" ? 1 : 0.6 }))
}
