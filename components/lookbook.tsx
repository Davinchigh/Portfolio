"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { scrollState } from "@/components/motion"

gsap.registerPlugin(ScrollTrigger)

const FRAMES = [
  { src: "/campaign/look-blazer.webp", title: "The Blazer Set", note: "Black blazer, silk cami, sand trousers", href: "/shop/women/", alt: "A woman in a black blazer, cream silk camisole and sand wide-leg trousers" },
  { src: "/campaign/look-emerald.webp", title: "Emerald Wrap", note: "Silk wrap dress, cut to move", href: "/shop/women/", alt: "A woman mid-turn in an emerald silk wrap dress" },
  { src: "/campaign/look-menswear.webp", title: "Charcoal Two-Piece", note: "Tailored to your measurements", href: "/shop/men/", alt: "A man in a tailored charcoal two-piece suit adjusting his cuff" },
  { src: "/campaign/product-bag.webp", title: "Top-Handle Bag", note: "Black leather, gold clasp", href: "/shop/bags-shoes/", alt: "A black top-handle bag with a round gold clasp" },
  { src: "/campaign/product-pumps.webp", title: "Gold-Heel Pumps", note: "The finishing touch", href: "/shop/bags-shoes/", alt: "Black pointed pumps with gold heels" },
]

/** The season's edit: a pinned row of looks that slides sideways as you scroll, leaning into your speed. */
export function Lookbook() {
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const s = section.current
    const t = track.current
    if (!s || !t) return
    const mm = gsap.matchMedia()
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const distance = () => t.scrollWidth - window.innerWidth + 64
      const tween = gsap.to(t, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: { trigger: s, start: "top top", end: () => `+=${distance()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1 },
      })
      const imgs = t.querySelectorAll<HTMLElement>("[data-skew]")
      const skew = gsap.quickTo(imgs, "skewX", { duration: 0.6, ease: "power3" })
      const tick = () => {
        skew(Math.max(Math.min(scrollState.velocity * -0.18, 6), -6))
      }
      gsap.ticker.add(tick)
      return () => {
        gsap.ticker.remove(tick)
        tween.kill()
      }
    })
    return () => mm.revert()
  }, [])

  // the outer div belongs to React; ScrollTrigger wraps the section in a pin spacer inside it
  return (
    <div>
    <section ref={section} aria-labelledby="edit-title" className="relative overflow-hidden bg-onyx py-16 md:flex md:h-[100svh] md:flex-col md:justify-center md:pb-0 md:pt-24">
      <div className="mx-auto mb-10 flex w-full max-w-[1600px] items-end justify-between gap-6 px-5 sm:px-8">
        <div>
          <p className="eyebrow">THE SEASON&apos;S EDIT</p>
          <h2 id="edit-title" data-split className="mt-3 text-5xl leading-none md:text-7xl">
            Five pieces, <em className="text-gold">one house.</em>
          </h2>
        </div>
        <p className="hidden max-w-xs text-right text-sm text-ash md:block">Campaign images are AI-generated previews. Real pieces and photos are coming.</p>
      </div>
      <ul ref={track} className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:px-8 md:w-max md:snap-none md:overflow-visible md:pb-0">
        {FRAMES.map((f, i) => (
          <li key={f.src} className="w-[78vw] shrink-0 snap-start sm:w-[46vw] md:w-[30vw] lg:w-[26vw]">
            <Link href={f.href} data-cursor="View" className="group block">
              <div data-skew className="relative aspect-[3/4] overflow-hidden bg-espresso">
                <img src={f.src.replace(".webp", "-sm.webp")} alt={f.alt} loading="lazy" className="h-full w-full scale-[1.06] object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100" />
                <span className="absolute left-4 top-4 font-display text-sm text-champagne/80">0{i + 1}</span>
              </div>
              <h3 className="mt-4 text-2xl transition-colors group-hover:text-gold">{f.title}</h3>
              <p className="mt-1 text-sm text-ash">{f.note}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
    </div>
  )
}
