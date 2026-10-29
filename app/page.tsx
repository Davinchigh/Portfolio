import Link from "next/link"
import { Experience } from "@/components/experience"
import { ProductCard } from "@/components/product-card"
import { collections, productsIn } from "@/lib/store"

export default function Home() {
  const newIn = productsIn("new-in")
  return (
    <>
      <Experience />

      <div className="wrap">
        <div className="nkyemu" />
      </div>

      <section aria-labelledby="new-title" className="wrap py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">NEW IN</p>
            <h2 id="new-title" className="mt-3 text-4xl">Fresh from the workroom</h2>
          </div>
          <Link href="/shop/new-in/" className="py-2 text-sm text-champagne underline underline-offset-4 hover:text-gold">
            See all new pieces
          </Link>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
          {newIn.map((p) => (
            <li key={p.code}>
              <ProductCard p={p} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="col-title" className="wrap pb-10">
        <h2 id="col-title" className="sr-only">Collections</h2>
        <ul className="grid gap-4 sm:grid-cols-3">
          {collections
            .filter((c) => c.slug !== "new-in")
            .map((c) => {
              const count = productsIn(c.slug).length
              return (
                <li key={c.slug}>
                  <Link href={`/shop/${c.slug}/`} className="card-glow group relative block overflow-hidden rounded-2xl border border-gold/20 bg-espresso/40 p-7 transition-colors hover:border-gold/60">
                    <span aria-hidden="true" className="glow pointer-events-none absolute inset-0" />
                    <span className="relative block font-display text-3xl">{c.name}</span>
                    <span className="relative mt-2 block text-sm text-ash">{c.line}</span>
                    <span className="relative mt-6 block text-xs tracking-caps text-gold">{count ? `${count} PIECE${count === 1 ? "" : "S"}` : "ARRIVING SOON"}</span>
                  </Link>
                </li>
              )
            })}
        </ul>
      </section>
    </>
  )
}
