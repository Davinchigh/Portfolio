"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { Monogram } from "@/components/logo"
import { scrollState } from "@/components/motion"

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches

/**
 * Preloader and page transitions share one curtain.
 * First visit in a session: the curtain counts up while the page loads, then lifts.
 * Between pages: it falls over the old page, the route changes underneath, and it lifts again.
 */
export function Curtain() {
  const router = useRouter()
  const pathname = usePathname()
  const panel = useRef<HTMLDivElement>(null)
  const count = useRef<HTMLSpanElement>(null)
  const pending = useRef(false)
  const [intro, setIntro] = useState(true)

  // the preloader
  useEffect(() => {
    const el = panel.current
    if (!el) return
    // an inline script in <head> marks the first visit before paint (see INTRO_SCRIPT)
    const root = document.documentElement
    const first = root.classList.contains("intro-pending")
    gsap.set(el, { yPercent: first ? 0 : -100 })
    root.classList.remove("intro-pending")
    if (!first) {
      setIntro(false)
      return
    }
    const n = { v: 0 }
    const show = () => {
      if (count.current) count.current.textContent = String(Math.round(n.v))
    }
    const loaded = new Promise<void>((res) => (document.readyState === "complete" ? res() : window.addEventListener("load", () => res(), { once: true })))
    const fonts = document.fonts?.ready ?? Promise.resolve()
    const tl = gsap.timeline()
    tl.to(n, { v: 82, duration: 1.4, ease: "power2.out", onUpdate: show })
    Promise.all([loaded, fonts, new Promise((r) => setTimeout(r, 1200))]).then(() => {
      tl.to(n, { v: 100, duration: 0.45, ease: "power1.inOut", onUpdate: show })
        .to(el, { yPercent: -100, duration: 1.1, ease: "expo.inOut" }, "+=0.15")
        .add(() => setIntro(false))
    })
    // never trap anyone behind it
    const bail = setTimeout(() => {
      gsap.to(el, { yPercent: -100, duration: 0.6 })
      setIntro(false)
    }, 6000)
    return () => {
      clearTimeout(bail)
      tl.kill()
    }
  }, [])

  // intercept internal links
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as HTMLElement).closest("a")
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return
      const url = new URL(a.href, location.href)
      if (url.origin !== location.origin) return
      if (url.pathname === location.pathname) return // same page, maybe a hash
      if (reduced() || !panel.current) return
      e.preventDefault()
      e.stopPropagation()
      pending.current = true
      gsap.fromTo(
        panel.current,
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: 0.7,
          ease: "expo.inOut",
          onComplete: () => router.push(url.pathname + url.search + url.hash),
        },
      )
    }
    document.addEventListener("click", onClick, true)
    return () => document.removeEventListener("click", onClick, true)
  }, [router])

  // the new page is in: jump to the top under the curtain, then lift it
  useEffect(() => {
    if (!pending.current || !panel.current) return
    pending.current = false
    if (scrollState.lenis) scrollState.lenis.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
    gsap.to(panel.current, { yPercent: -100, duration: 0.9, ease: "expo.inOut", delay: 0.1 })
    document.getElementById("main")?.focus({ preventScroll: true })
  }, [pathname])

  return (
    <div ref={panel} aria-hidden="true" className="curtain">
      <div className="flex flex-col items-center gap-6">
        <Monogram className="draw-in h-20 w-20 text-gold" />
        {intro && (
          <p className="font-display text-sm tracking-caps text-champagne/70">
            <span ref={count}>0</span>
          </p>
        )}
      </div>
      <span className="curtain-edge" />
    </div>
  )
}

/** Runs before paint: covers the first page of a session with the curtain, and always uncovers it within 5 s. */
export const INTRO_SCRIPT = `try{var d=document.documentElement;if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&sessionStorage.getItem('lizab-intro')!=='1'){sessionStorage.setItem('lizab-intro','1');d.classList.add('intro-pending');setTimeout(function(){d.classList.remove('intro-pending')},5000)}}catch(e){}`
