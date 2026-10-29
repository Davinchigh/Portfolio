"use client"

import Link from "next/link"
import { useRef } from "react"
import { ghs, type Product } from "@/lib/store"

/** Plain HTML card. A CSS-only tilt and a bronze glow that follows the pointer give it depth for zero bytes. */
export function ProductCard({ p }: { p: Product }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const move = (e: React.PointerEvent) => {
    const el = ref.current
    if (!el || e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    el.style.setProperty("--gx", `${x * 100}%`)
    el.style.setProperty("--gy", `${y * 100}%`)
    el.style.transform = `perspective(900px) rotateY(${(x - 0.5) * 5}deg) rotateX(${(0.5 - y) * 5}deg)`
  }
  const reset = () => {
    if (ref.current) ref.current.style.transform = ""
  }
  const status = p.availability === "sold-out" ? "Sold out" : p.availability === "made-to-order" ? "Made to order" : null

  return (
    <Link
      ref={ref}
      href={`/p/${p.code.toLowerCase()}/`}
      onPointerMove={move}
      onPointerLeave={reset}
      className="card-glow group block rounded-2xl transition-transform duration-500 ease-out"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-espresso">
        <img src={p.images[0].src} alt={p.images[0].alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
        <span aria-hidden="true" className="glow pointer-events-none absolute inset-0" />
        <div className="absolute left-3 right-3 top-3 flex flex-wrap gap-2">
          {status && <span className="rounded-full bg-onyx/85 px-2.5 py-1 text-[11px] font-medium text-champagne">{status}</span>}
          {p.sample && <span className="rounded-full bg-champagne px-2.5 py-1 text-[11px] font-semibold text-onyx">Sample</span>}
        </div>
      </div>
      <div className="mt-3 sm:flex sm:items-start sm:justify-between sm:gap-3">
        <div>
          <h3 className="font-display text-lg leading-snug">{p.name}</h3>
          <p className="mt-0.5 text-xs tracking-[0.14em] text-ash">{p.code}</p>
        </div>
        <p className="mt-1 whitespace-nowrap text-sm text-gold sm:mt-0">{ghs(p.price)}</p>
      </div>
    </Link>
  )
}
