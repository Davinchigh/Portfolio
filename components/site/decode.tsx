"use client"

import { useEffect } from "react"

const GLYPHS = "abcdefghijklmnopqrstuvwxyz0123456789/<>_-+*"

/**
 * Section labels (.eyebrow) decode into place the first time they scroll into view:
 * letters cycle through random characters and lock in from left to right, slowing as they settle.
 * Only text nodes change, so icons and markers inside a label are untouched. Screen readers get the
 * final text throughout (aria-label while it runs). Off with reduced motion.
 */
export function DecodeEyebrows() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const run = (el: HTMLElement) => {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
      const nodes: { node: Text; text: string }[] = []
      while (walker.nextNode()) {
        const n = walker.currentNode as Text
        if (n.nodeValue && n.nodeValue.trim()) nodes.push({ node: n, text: n.nodeValue })
      }
      if (!nodes.length) return
      const full = nodes.map((n) => n.text).join("")
      el.setAttribute("aria-label", full.trim())
      const total = full.length
      const start = performance.now()
      const duration = Math.min(1100, 380 + total * 22)
      const tick = (t: number) => {
        const k = Math.min(1, (t - start) / duration)
        // ease-out: fast at first, slower as the last letters lock in
        const locked = Math.floor((1 - Math.pow(1 - k, 2.2)) * total)
        let i = 0
        for (const n of nodes) {
          let out = ""
          for (const ch of n.text) {
            out += i < locked || ch === " " ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0]
            i++
          }
          n.node.nodeValue = out
        }
        if (k < 1) requestAnimationFrame(tick)
        else {
          nodes.forEach((n) => (n.node.nodeValue = n.text))
          el.removeAttribute("aria-label")
        }
      }
      requestAnimationFrame(tick)
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          io.unobserve(e.target)
          run(e.target as HTMLElement)
        }
      },
      { threshold: 1, rootMargin: "0px 0px -10% 0px" },
    )
    // Only labels below the first screen, so nothing flickers on load.
    document.querySelectorAll<HTMLElement>("main .eyebrow").forEach((el) => {
      if (el.getBoundingClientRect().top > window.innerHeight) io.observe(el)
    })
    return () => io.disconnect()
  }, [])
  return null
}
