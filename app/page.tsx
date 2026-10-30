import Link from "next/link"
import { CollectionsIndex } from "@/components/collections-index"
import { Experience } from "@/components/experience"
import { Lookbook } from "@/components/lookbook"
import { Marquee } from "@/components/motion"
import { ProductCard } from "@/components/product-card"
import { productsIn } from "@/lib/store"

export default function Home() {
  const newIn = productsIn("new-in")
  return (
    <>
      <Experience />

      <Marquee
        items={["Handcrafted in Accra", "Women", "Men", "Bags & Shoes", "Made to fit you", "Delivered worldwide"]}
        className="border-y border-gold/15 bg-onyx py-6 font-display text-3xl italic text-champagne/90 md:text-5xl"
      />

      <Lookbook />

      <div className="bg-ivory text-ink">
      <section aria-labelledby="new-title" className="wrap py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium tracking-caps text-gold-deep">NEW IN</p>
            <h2 id="new-title" data-split className="mt-3 text-4xl md:text-5xl">Fresh from the workroom</h2>
          </div>
          <Link href="/shop/new-in/" className="py-2 text-sm text-ink underline underline-offset-4 hover:text-gold-deep">
            See all new pieces
          </Link>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
          {newIn.map((p) => (
            <li key={p.code}>
              <ProductCard p={p} tone="light" />
            </li>
          ))}
        </ul>
      </section>

      <CollectionsIndex />
      </div>
    </>
  )
}
