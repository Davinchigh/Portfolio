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

/**
 * A typographic index of the collections. With a mouse, a picture of the row you are on
 * glides into the open space between its name and its count, so it never covers the words.
 */
export function CollectionsIndex() {
  const wrap = useRef<HTMLDivElement>(null)
  const box = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<string | null>(null)
  const place = useRef<((slug: string, clientY?: number) => void) | null>(null)

  useEffect(() => {
    const el = box.current
    const w = wrap.current
    if (!el || !w || !window.matchMedia("(pointer: fine) and (min-width: 768px)").matches) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const d = reduced ? 0 : 0.75
    gsap.set(el, { xPercent: -50, yPercent: -50 })
    const xTo = gsap.quickTo(el, "x", { duration: d, ease: "power3" })
    const yTo = gsap.quickTo(el, "y", { duration: d, ease: "power3" })
    const rTo = gsap.quickTo(el, "rotation", { duration: 1, ease: "power3" })
    let first = true
    let lastY = 0
    place.current = (slug, clientY) => {
      const row = w.querySelector<HTMLElement>(`[data-row="${slug}"]`)
      if (!row) return
      const base = w.getBoundingClientRect()
      const r = row.getBoundingClientRect()
      // centre of the open column between the longest name and the counts, so no row's words are covered
      const words = [...w.querySelectorAll<HTMLElement>("[data-word]")].map((e) => e.getBoundingClientRect().right)
      const metas = [...w.querySelectorAll<HTMLElement>("[data-meta] > span:first-child")].map((e) => e.getBoundingClientRect().left)
      const x = (Math.max(...words) + 16 + Math.min(...metas)) / 2 - base.left
      const nudge = clientY === undefined ? 0 : Math.max(Math.min((clientY - (r.top + r.height / 2)) * 0.25, 24), -24)
      const y = r.top + r.height / 2 - base.top + nudge
      if (first) {
        gsap.set(el, { x, y })
        first = false
      }
      xTo(x)
      yTo(y)
      if (!reduced && clientY !== undefined) rTo(Math.max(Math.min((clientY - lastY) * 0.25, 3), -3))
      if (clientY !== undefined) lastY = clientY
    }
    return () => {
      place.current = null
    }
  }, [])

  const items = [...collections.filter((c) => c.slug !== "new-in"), collections.find((c) => c.slug === "new-in")!]
  return (
    <section aria-labelledby="index-title" className="wrap py-24">
      <p className="text-xs font-medium tracking-caps text-gold-deep">THE HOUSE</p>
      <h2 id="index-title" data-split className="mt-3 text-4xl md:text-5xl">Shop by collection</h2>
      <div ref={wrap} className="relative mt-10">
        <ul className="border-t border-ink/15" onMouseLeave={() => setActive(null)}>
          {items.map((c, i) => {
            const count = productsIn(c.slug).length
            const dim = active && active !== c.slug
            return (
              <li key={c.slug} data-row={c.slug} className="border-b border-ink/15">
                <Link
                  href={`/shop/${c.slug}/`}
                  data-cursor="Open"
                  onMouseEnter={(e) => {
                    setActive(c.slug)
                    place.current?.(c.slug, e.clientY)
                  }}
                  onMouseMove={(e) => place.current?.(c.slug, e.clientY)}
                  className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-6 md:py-7"
                >
                  <span className={`text-xs tracking-caps text-stone transition-opacity duration-500 ${dim ? "opacity-40" : ""}`}>0{i + 1}</span>
                  <span>
                    <span
                      data-word
                      className={`inline-block font-display text-[clamp(2.4rem,6.5vw,5.25rem)] leading-[1.05] transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3 group-hover:italic ${dim ? "opacity-25" : ""}`}
                    >
                      {c.name}
                    </span>
                  </span>
                  <span data-meta className={`text-right transition-opacity duration-500 ${dim ? "opacity-40" : ""}`}>
                    <span className="block text-xs font-medium tracking-caps text-gold-deep">{count ? `${count} PIECE${count === 1 ? "" : "S"}` : "ARRIVING SOON"}</span>
                    <span className="mt-1 hidden text-sm text-stone md:block">{c.line}</span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
        <div ref={box} aria-hidden="true" className="pointer-events-none absolute left-0 top-0 z-10 hidden h-44 w-36 md:block lg:h-52 lg:w-40">
          {items.map((c) => (
            <img
              key={c.slug}
              src={IMAGE[c.slug]}
              alt=""
              loading="lazy"
              className={`absolute inset-0 h-full w-full rounded-sm object-cover shadow-[0_30px_60px_-20px_rgba(23,21,19,0.55)] transition-[opacity,clip-path,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${active === c.slug ? "scale-100 opacity-100 [clip-path:inset(0)]" : "scale-105 opacity-0 [clip-path:inset(50%_0_50%_0)]"}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
