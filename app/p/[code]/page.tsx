import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { OrderPanel } from "@/components/order-panel"
import { ProductCard } from "@/components/product-card"
import { collections, findProduct, ghs, productUrl, products, shop } from "@/lib/store"

export const dynamicParams = false
export function generateStaticParams() {
  return products.map((p) => ({ code: p.code.toLowerCase() }))
}

type Props = { params: Promise<{ code: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = findProduct((await params).code)
  if (!p) return {}
  const title = `${p.name} · ${ghs(p.price)}`
  return {
    title,
    description: `${p.name}, ${p.colours.join(", ")}. ${p.leadTime}. Order on WhatsApp from ${shop.name}, Accra.`,
    openGraph: { title: `${title} · ${shop.name}`, images: [p.images[0].src], url: productUrl(p.code) },
  }
}

export default async function ProductPage({ params }: Props) {
  const p = findProduct((await params).code)
  if (!p) notFound()
  const collection = collections.find((c) => c.slug === p.collection)
  const related = products.filter((x) => x.code !== p.code && x.collection === p.collection).slice(0, 3)
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    sku: p.code,
    image: p.images.map((i) => `https://${shop.domain}${i.src}`),
    brand: { "@type": "Brand", name: shop.name },
    offers: {
      "@type": "Offer",
      price: p.price,
      priceCurrency: "GHS",
      availability: p.availability === "sold-out" ? "https://schema.org/OutOfStock" : p.availability === "made-to-order" ? "https://schema.org/PreOrder" : "https://schema.org/InStock",
      url: productUrl(p.code),
    },
  }

  return (
    <>
      {/* Product data for Google, only for real items. */}
      {!p.sample && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />}
      <div className="wrap py-10">
        <nav aria-label="Breadcrumb" className="text-sm text-ash">
          <Link href="/" className="hover:text-champagne">Home</Link>
          <span aria-hidden="true"> / </span>
          <Link href={`/shop/${p.collection}/`} className="hover:text-champagne">{collection?.name}</Link>
        </nav>
        <div className="mt-8 grid gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-espresso ring-1 ring-gold/20">
              <img src={p.images[0].src} alt={p.images[0].alt} fetchPriority="high" className="h-full w-full object-cover object-top" />
            </div>
            {p.images.length > 1 && (
              <ul className="mt-4 grid grid-cols-4 gap-3">
                {p.images.slice(1).map((im) => (
                  <li key={im.src}>
                    <img src={im.src} alt={im.alt} loading="lazy" className="aspect-[4/5] w-full rounded-xl object-cover" />
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="md:col-span-5">
            {p.sample && <p className="mb-4 inline-block rounded-full bg-champagne px-3 py-1 text-xs font-semibold text-onyx">Sample piece for the preview</p>}
            <p className="text-xs tracking-caps text-ash">{p.code}</p>
            <h1 className="mt-2 text-4xl leading-tight">{p.name}</h1>
            <div className="mt-6">
              <OrderPanel p={p} />
            </div>
            <div className="nkyemu my-8" />
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm">
              <dt className="text-ash">Fabric</dt>
              <dd>{p.fabric}</dd>
              <dt className="text-ash">Care</dt>
              <dd>{p.care}</dd>
              <dt className="text-ash">Delivery</dt>
              <dd>
                Accra by rider, rest of Ghana by courier, worldwide by DHL.{" "}
                <Link href="/delivery-returns/" className="underline underline-offset-4 hover:text-gold">Details</Link>
              </dd>
            </dl>
          </div>
        </div>
        {related.length > 0 && (
          <section aria-labelledby="related" className="mt-20">
            <h2 id="related" className="text-3xl">You may also like</h2>
            <ul className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3">
              {related.map((r) => (
                <li key={r.code}>
                  <ProductCard p={r} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  )
}
