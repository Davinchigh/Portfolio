"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import Lenis from "lenis"

gsap.registerPlugin(ScrollTrigger, SplitText)

/** Shared scroll state so marquees and skews can react to how fast you scroll. */
export const scrollState = { velocity: 0, lenis: null as Lenis | null }

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
const finePointer = () => typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches

/**
 * The motion system: weighted smooth scroll (Lenis) driving GSAP ScrollTrigger,
 * line-by-line headline reveals, soft fade-ups, magnetic buttons and a cursor that labels what it is over.
 * Everything is skipped with reduced motion, and nothing is hidden before JavaScript runs.
 */
export function Motion() {
  const pathname = usePathname()

  // smooth scroll, once
  useEffect(() => {
    if (reduced()) return
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9, smoothWheel: true })
    scrollState.lenis = lenis
    lenis.on("scroll", (l: Lenis) => {
      scrollState.velocity = l.velocity
      ScrollTrigger.update()
    })
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      scrollState.lenis = null
    }
  }, [])

  // reveals, per page
  useEffect(() => {
    if (reduced()) return
    const splits: SplitText[] = []
    const ctx = gsap.context(() => {
      document.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
        const split = new SplitText(el, { type: "lines", mask: "lines", linesClass: "split-line", aria: "auto" })
        splits.push(split)
        gsap.from(split.lines, {
          yPercent: 110,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        })
      })
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 28,
          opacity: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 94%", once: true },
        })
      })
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const amt = Number(el.dataset.parallax) || 10
        gsap.fromTo(el, { yPercent: -amt }, { yPercent: amt, ease: "none", scrollTrigger: { trigger: el, scrub: true } })
      })
    })
    const refresh = setTimeout(() => ScrollTrigger.refresh(), 400)
    return () => {
      clearTimeout(refresh)
      ctx.revert()
      splits.forEach((s) => s.revert())
    }
  }, [pathname])

  // magnetic buttons
  useEffect(() => {
    if (reduced() || !finePointer()) return
    const move = (e: PointerEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-magnetic]")
      if (!el) return
      const r = el.getBoundingClientRect()
      gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.28, y: (e.clientY - r.top - r.height / 2) * 0.35, duration: 0.5, ease: "power3.out" })
    }
    const leave = (e: PointerEvent) => {
      const el = (e.target as HTMLElement).closest?.("[data-magnetic]")
      if (el && !el.contains(e.relatedTarget as Node)) gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)" })
    }
    document.addEventListener("pointermove", move, { passive: true })
    document.addEventListener("pointerout", leave, { passive: true })
    return () => {
      document.removeEventListener("pointermove", move)
      document.removeEventListener("pointerout", leave)
    }
  }, [])

  return <Cursor />
}

/** A small gold dot that trails the pointer and opens into a label over links and images. Mouse only. */
function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = dot.current
    if (!el || reduced() || !finePointer()) return
    el.style.display = "grid"
    const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3" })
    const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3" })
    let shown = false
    const move = (e: PointerEvent) => {
      if (!shown) {
        gsap.set(el, { x: e.clientX, y: e.clientY })
        gsap.to(el, { opacity: 1, duration: 0.3 })
        shown = true
      }
      xTo(e.clientX)
      yTo(e.clientY)
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor], a, button")
      const text = t?.dataset.cursor ?? ""
      if (label.current && label.current.textContent !== text) label.current.textContent = text
      el.dataset.state = text ? "label" : t ? "link" : ""
    }
    const out = () => {
      gsap.to(el, { opacity: 0, duration: 0.3 })
      shown = false
    }
    document.addEventListener("pointermove", move, { passive: true })
    document.documentElement.addEventListener("pointerleave", out)
    return () => {
      document.removeEventListener("pointermove", move)
      document.documentElement.removeEventListener("pointerleave", out)
    }
  }, [])
  return (
    <div ref={dot} aria-hidden="true" className="cursor-dot">
      <span ref={label} />
    </div>
  )
}

/** A line of type that drifts sideways and speeds up, or reverses, with your scroll. */
export function Marquee({ items, className = "" }: { items: string[]; className?: string }) {
  const track = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = track.current
    if (!el || reduced()) return
    let x = 0
    let dir = 1
    const tick = () => {
      const v = scrollState.velocity
      if (Math.abs(v) > 0.5) dir = v > 0 ? 1 : -1
      x -= (0.6 + Math.min(Math.abs(v) * 0.35, 9)) * dir
      const half = el.scrollWidth / 2
      if (x <= -half) x += half
      if (x > 0) x -= half
      el.style.transform = `translate3d(${x}px,0,0) skewX(${Math.max(Math.min(-v * 0.25, 8), -8)}deg)`
    }
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [])
  const row = (k: string) => (
    <div key={k} className="flex shrink-0 items-center" aria-hidden={k === "b" ? true : undefined}>
      {items.map((t) => (
        <span key={t} className="flex items-center">
          <span className="px-8">{t}</span>
          <span className="h-2 w-2 rotate-45 border border-gold/70" aria-hidden="true" />
        </span>
      ))}
    </div>
  )
  return (
    <div className={`overflow-hidden ${className}`}>
      <div ref={track} className="flex w-max will-change-transform">
        {row("a")}
        {row("b")}
      </div>
    </div>
  )
}
