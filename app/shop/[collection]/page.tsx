import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ProductCard } from "@/components/product-card"
import { askLink, collections, productsIn, type CollectionSlug } from "@/lib/store"

export const dynamicParams = false
export function generateStaticParams() {
  return collections.map((c) => ({ collection: c.slug }))
}

type Props = { params: Promise<{ collection: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { collection } = await params
  const c = collections.find((x) => x.slug === collection)
  return c ? { title: c.name, description: `${c.name} at Lizab House of Fashion, Accra. ${c.line}` } : {}
}

export default async function CollectionPage({ params }: Props) {
  const slug = (await params).collection as CollectionSlug
  const c = collections.find((x) => x.slug === slug)
  if (!c) notFound()
  const items = productsIn(slug)

  return (
    <section className="wrap py-14">
      <nav aria-label="Collections" className="flex flex-wrap gap-2">
        {collections.map((x) => (
          <Link
            key={x.slug}
            href={`/shop/${x.slug}/`}
            aria-current={x.slug === slug ? "page" : undefined}
            className={`min-h-11 rounded-full border px-4 py-2.5 text-sm ${x.slug === slug ? "border-gold bg-gold text-onyx" : "border-champagne/25 text-champagne hover:border-gold/60"}`}
          >
            {x.name}
          </Link>
        ))}
      </nav>
      <h1 data-split className="mt-10 text-6xl md:text-8xl">{c.name}</h1>
      <p className="mt-3 text-ash">{c.line}</p>
      <div className="nkyemu mt-10" />
      <h2 className="sr-only">Pieces</h2>
      {items.length ? (
        <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3">
          {items.map((p) => (
            <li key={p.code}>
              <ProductCard p={p} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-12 max-w-lg">
          <p className="font-display text-2xl">New pieces are on their way.</p>
          <p className="mt-2 text-ash">Tell us what you&apos;re looking for and we&apos;ll show you what we have or can make.</p>
          <a href={askLink(`the ${c.name.toLowerCase()} collection`)} target="_blank" rel="noopener noreferrer" className="btn-gold mt-6">
            Ask on WhatsApp
          </a>
        </div>
      )}
    </section>
  )
}
