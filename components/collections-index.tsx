"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { collections, productsIn } from "@/lib/store"

const IMAGE: Record<string, string> = {
  women: "/campaign/look-emerald-sm.webp",
  men: "/campaign/look-menswear-sm.webp",
  "bags-shoes": "/campaign/product-bag-sm.webp",
  "new-in": "/campaign/look-blazer-sm.webp",
}

/** A typographic index of the collections. With a mouse, a picture of each follows the pointer. */
export function CollectionsIndex() {
  const box = useRef<HTMLDivElement>(null)
  const list = useRef<HTMLUListElement>(null)
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const el = box.current
    const ul = list.current
    if (!el || !ul || !window.matchMedia("(pointer: fine)").matches) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    gsap.set(el, { xPercent: -50, yPercent: -50 })
    const xTo = gsap.quickTo(el, "x", { duration: reduced ? 0 : 0.7, ease: "power3" })
    const yTo = gsap.quickTo(el, "y", { duration: reduced ? 0 : 0.7, ease: "power3" })
    const rTo = gsap.quickTo(el, "rotation", { duration: 0.9, ease: "power3" })
    let lastX = 0
    const move = (e: PointerEvent) => {
      const r = ul.getBoundingClientRect()
      xTo(e.clientX - r.left)
      yTo(e.clientY - r.top)
      if (!reduced) rTo(Math.max(Math.min((e.clientX - lastX) * 0.6, 8), -8))
      lastX = e.clientX
    }
    ul.addEventListener("pointermove", move)
    return () => ul.removeEventListener("pointermove", move)
  }, [])

  const items = [...collections.filter((c) => c.slug !== "new-in"), collections.find((c) => c.slug === "new-in")!]
  return (
    <section aria-labelledby="index-title" className="wrap py-24">
      <p className="text-xs font-medium tracking-caps text-gold-deep">THE HOUSE</p>
      <h2 id="index-title" data-split className="mt-3 text-4xl md:text-5xl">Shop by collection</h2>
      <div className="relative mt-10">
      <ul ref={list} className="border-t border-ink/15" onMouseLeave={() => setActive(null)}>
        {items.map((c, i) => {
          const count = productsIn(c.slug).length
          return (
            <li key={c.slug} className="border-b border-ink/15">
              <Link
                href={`/shop/${c.slug}/`}
                data-cursor="Open"
                onMouseEnter={() => setActive(c.slug)}
                className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-5 py-6 md:py-8"
              >
                <span className="text-xs tracking-caps text-stone">0{i + 1}</span>
                <span className={`font-display text-[clamp(2.4rem,7vw,5.5rem)] leading-none transition-[color,transform,opacity] duration-500 group-hover:translate-x-4 group-hover:italic ${active && active !== c.slug ? "opacity-30" : ""}`}>
                  {c.name}
                </span>
                <span className="text-right text-xs font-medium tracking-caps text-gold-deep">
                  {count ? `${count} PIECE${count === 1 ? "" : "S"}` : "ARRIVING SOON"}
                  <span className="mt-1 hidden text-stone md:block normal-case tracking-normal">{c.line}</span>
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
        <div ref={box} aria-hidden="true" className="pointer-events-none absolute left-0 top-0 z-10 hidden h-64 w-48 md:block">
          {items.map((c) => (
            <img
              key={c.slug}
              src={IMAGE[c.slug]}
              alt=""
              loading="lazy"
              className={`absolute inset-0 h-full w-full object-cover shadow-2xl transition-[opacity,clip-path] duration-500 ${active === c.slug ? "opacity-100 [clip-path:inset(0)]" : "opacity-0 [clip-path:inset(50%_0_50%_0)]"}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
