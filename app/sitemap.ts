import type { MetadataRoute } from "next"
import { collections, productUrl, products, shop } from "@/lib/store"

export const dynamic = "force-static"
export default function sitemap(): MetadataRoute.Sitemap {
  const base = `https://${shop.domain}`
  return [
    { url: `${base}/` },
    ...collections.map((c) => ({ url: `${base}/shop/${c.slug}/` })),
    ...products.filter((p) => !p.sample).map((p) => ({ url: productUrl(p.code) })),
    ...["how-to-order", "delivery-returns", "about", "privacy"].map((s) => ({ url: `${base}/${s}/` })),
  ]
}
