import Link from "next/link"
import { Monogram } from "@/components/logo"
import { ProductCard } from "@/components/product-card"
import { Silk } from "@/components/silk"
import { Spotlight } from "@/components/spotlight"
import { askLink, collections, products, productsIn, shop } from "@/lib/store"

const hero = products.find((p) => p.code === "LZ-B-001") ?? products[0]

export default function Home() {
  const newIn = productsIn("new-in")
  return (
    <>
      {/* Hero: one product, one light, one word. */}
      <section className="relative overflow-hidden">
        <div className="wrap grid items-center gap-10 py-12 md:grid-cols-12 md:py-20">
          <div className="md:col-span-6">
            <Monogram className="draw-in h-16 w-16 text-gold" />
            <p className="mt-8 text-[15px] font-light tracking-caps text-champagne sm:text-lg">HAVE YOU BEEN</p>
            <h1 className="mt-2 bg-gradient-to-b from-[#EFD9A8] via-gold to-[#B8742F] bg-clip-text font-display text-[clamp(3.6rem,15vw,7.4rem)] font-semibold leading-[0.9] tracking-[0.02em] text-transparent">
              FITTED
            </h1>
            <p className="mt-3 text-[15px] font-light tracking-caps text-champagne sm:text-lg">THIS SEASON?</p>
            <div className="mt-8 border-l-2 border-gold pl-5">
              <p className="font-display text-xl italic text-champagne">Handcrafted elegance, cut in Accra.</p>
              <p className="mt-1 text-ash">Men&apos;s and women&apos;s wear, bags and shoes. Delivery and pick-up worldwide.</p>
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/shop/new-in/" className="btn-gold">
                See what&apos;s new
              </Link>
              <a href={askLink("a fitting")} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                Book a fitting on WhatsApp
              </a>
            </div>
          </div>
          <div className="md:col-span-6">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[520px] overflow-hidden rounded-[28px] ring-1 ring-gold/20">
              <Spotlight src={hero.images[0].src} alt={hero.images[0].alt} priority />
            </div>
            <p className="mt-3 text-center text-xs text-ash">
              {hero.name}, <Link href={`/p/${hero.code.toLowerCase()}/`} className="underline underline-offset-4 hover:text-champagne">view the piece</Link>
            </p>
          </div>
        </div>
      </section>

      <div className="wrap">
        <div className="nkyemu" />
      </div>

      {/* New in */}
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
        <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3">
          {newIn.map((p) => (
            <li key={p.code}>
              <ProductCard p={p} />
            </li>
          ))}
        </ul>
      </section>

      {/* Collections */}
      <section aria-labelledby="col-title" className="wrap py-10">
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

      {/* How ordering works */}
      <section aria-labelledby="how-title" className="wrap py-16">
        <p className="eyebrow">HOW ORDERING WORKS</p>
        <h2 id="how-title" className="mt-3 text-4xl">Three steps, all on WhatsApp</h2>
        <ol className="mt-10 grid gap-8 md:grid-cols-3">
          {[
            ["Choose", "Pick a piece, your colour and your size. Not sure of your size? Choose “please advise” and we’ll help."],
            ["Message", "Tap Order on WhatsApp. Your message is written for you with the item, code, size and price."],
            ["Confirm", "We confirm availability and delivery, then you pay by mobile money or bank transfer. Never before we confirm."],
          ].map(([t, d], i) => (
            <li key={t} className="border-t border-gold/25 pt-6">
              <p className="font-display text-5xl text-gold/80">{i + 1}</p>
              <h3 className="mt-3 text-2xl">{t}</h3>
              <p className="mt-2 text-ash">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* WhatsApp band over silk (desktop with a capable GPU; a still gradient everywhere else) */}
      <section aria-labelledby="band-title" className="relative isolate mx-auto my-10 max-w-6xl overflow-hidden sm:rounded-[32px]">
        <Silk />
        <div className="relative px-6 py-20 sm:px-14">
          <div className="max-w-xl rounded-3xl bg-onyx/85 p-8 ring-1 ring-gold/20 backdrop-blur-sm">
            <p className="eyebrow">MADE FOR YOU</p>
            <h2 id="band-title" className="mt-3 text-4xl">Something in mind?</h2>
            <p className="mt-3 text-champagne/85">Send a photo or an idea. We&apos;ll tell you what we can make, the fabric, the price and when it will be ready.</p>
            <a href={askLink("a custom piece")} target="_blank" rel="noopener noreferrer" className="btn-gold mt-7">
              Message {shop.short} on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
