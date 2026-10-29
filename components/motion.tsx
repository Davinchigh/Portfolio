"use client"

import { useEffect } from "react"
import Lenis from "lenis"

/**
 * Site-wide motion: smooth scrolling (Lenis), reveal-on-scroll, the hero opening,
 * and the statement whose words light up as you read. All of it switches off for reduced motion.
 */
export function Motion() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const root = document.documentElement
    requestAnimationFrame(() => root.classList.add("loaded"))

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in")
            io.unobserve(e.target)
          }
        }),
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    )
    document.querySelectorAll("[data-reveal],[data-mask],.reveal-lines").forEach((el) => io.observe(el))

    let lenis: Lenis | null = null
    let raf = 0
    const words = Array.from(document.querySelectorAll<HTMLElement>(".statement .word"))
    const statement = document.querySelector<HTMLElement>(".statement")
    const parallax = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"))

    const onFrame = () => {
      const vh = window.innerHeight
      if (statement && words.length) {
        const r = statement.getBoundingClientRect()
        const p = Math.min(Math.max((vh * 0.85 - r.top) / (r.height + vh * 0.35), 0), 1)
        const lit = p * words.length
        words.forEach((w, i) => (w.style.opacity = String(reduce ? 1 : Math.min(Math.max(lit - i + 1, 0.18), 1))))
      }
      if (!reduce)
        parallax.forEach((el) => {
          const r = el.parentElement!.getBoundingClientRect()
          const t = (r.top + r.height / 2 - vh / 2) / vh
          el.style.transform = `translate3d(0, ${t * -8}%, 0) scale(1.15)`
        })
    }

    if (!reduce) {
      lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), anchors: { offset: -90 } })
      const loop = (time: number) => {
        lenis!.raf(time)
        onFrame()
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)
    } else {
      onFrame()
      window.addEventListener("scroll", onFrame, { passive: true })
    }
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      lenis?.destroy()
      window.removeEventListener("scroll", onFrame)
    }
  }, [])
  return null
}
