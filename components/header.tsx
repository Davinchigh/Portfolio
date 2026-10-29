"use client"

import { useEffect, useState } from "react"
import { Logo } from "@/components/logo"

const links = [
  ["Services", "#services"],
  ["Process", "#process"],
  ["Guide", "#guide"],
  ["About", "#about"],
]

/** A floating, translucent nav: frosted glass that tightens as you scroll and tucks away when you scroll down. */
export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  useEffect(() => {
    let last = window.scrollY
    const on = () => {
      const y = window.scrollY
      setScrolled(y > 24)
      setHidden(y > 500 && y > last + 4)
      if (y < last - 4) setHidden(false)
      last = y
    }
    on()
    window.addEventListener("scroll", on, { passive: true })
    return () => window.removeEventListener("scroll", on)
  }, [])
  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50 px-3 sm:top-5">
      <nav
        aria-label="Main"
        className={`nav-pill pointer-events-auto mx-auto flex items-center justify-between gap-4 rounded-full border border-white/60 py-2 pl-5 pr-2 ${
          scrolled ? "max-w-[860px] bg-white/70 shadow-[0_10px_40px_-12px_rgba(17,22,19,0.25)]" : "max-w-[1180px] bg-white/45 shadow-[0_6px_24px_-14px_rgba(17,22,19,0.2)]"
        } backdrop-blur-xl backdrop-saturate-150 ${hidden && !open ? "-translate-y-[140%]" : ""}`}
      >
        <a href="#top" aria-label="Glee Garden, back to top">
          <Logo />
        </a>
        <ul className="hidden items-center md:flex">
          {links.map(([label, href]) => (
            <li key={href}>
              <a href={href} className="rounded-full px-4 py-2.5 text-[15px] text-ink-soft transition-colors hover:bg-black/[0.05] hover:text-ink">
                {label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-1">
          <a href="#visit" className="btn-dark hidden min-h-11 px-5 sm:inline-flex">Book a visit</a>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full hover:bg-black/[0.05] md:hidden"
          >
            <span className={`h-px w-5 bg-ink transition-transform duration-500 ease-out ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
            <span className={`h-px w-5 bg-ink transition-transform duration-500 ease-out ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </nav>
      <div
        id="mobile-nav"
        className={`pointer-events-auto mx-auto mt-2 max-w-[860px] overflow-hidden rounded-3xl border border-white/60 bg-white/80 backdrop-blur-xl transition-[max-height,opacity] duration-700 ease-out md:hidden ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
        hidden={!open}
      >
        <ul className="grid p-3">
          {[...links, ["Book a visit", "#visit"]].map(([label, href]) => (
            <li key={href}>
              <a href={href} onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3.5 text-xl tracking-tight text-ink hover:bg-black/[0.04]">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
