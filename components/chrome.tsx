"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Flame } from "@/components/flame"
import { disclaimer, nav, site } from "@/lib/site"

export function Banner() {
  return (
    <aside aria-label="Site notice" className="border-b border-line bg-paper-2">
      <p className="wrap flex items-center justify-center gap-2 py-2 text-center text-[0.8rem] text-ink-muted">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-lamp" aria-hidden="true" />
        An unofficial guide by a former resident. Not affiliated with the University of Ghana.
      </p>
    </aside>
  )
}

/** A floating, translucent nav that tightens as you scroll. */
export function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on()
    window.addEventListener("scroll", on, { passive: true })
    return () => window.removeEventListener("scroll", on)
  }, [])

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname?.startsWith(href.replace(/\/$/, "")))

  return (
    <header className="pointer-events-none sticky top-0 z-40 px-3 pt-3 sm:px-5 sm:pt-4">
      <div
        className={`pointer-events-auto mx-auto max-w-6xl rounded-[22px] border transition-[background-color,box-shadow,border-color,padding] duration-500 ease-out ${
          scrolled || open
            ? "border-black/[0.06] bg-white/70 shadow-[0_12px_40px_-18px_rgba(15,17,21,0.35)] backdrop-blur-xl backdrop-saturate-150"
            : "border-transparent bg-white/40 backdrop-blur-md"
        }`}
      >
        <div className={`flex items-center justify-between gap-4 px-4 transition-[height] duration-500 sm:px-5 ${scrolled ? "h-14" : "h-16"}`}>
          <Link href="/" className="flex min-h-[44px] items-center gap-3 text-ink">
            <Flame />
            <span className="font-display text-[1.15rem] leading-none tracking-[-0.01em]">
              Jean Nelson Aka Hall
              <span className="sr-only">, unofficial site</span>
            </span>
          </Link>
          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-0.5">
              {nav.slice(1).map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    aria-current={isActive(n.href) ? "page" : undefined}
                    className="relative inline-flex min-h-[44px] items-center rounded-full px-3.5 text-[0.92rem] text-ink-muted transition-colors duration-300 hover:text-ink aria-[current=page]:text-ink after:absolute after:inset-x-3.5 after:bottom-2.5 after:h-px after:origin-left after:scale-x-0 after:bg-lamp-deep after:transition-transform after:duration-500 hover:after:scale-x-100 aria-[current=page]:after:scale-x-100"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <Link href="/rooms/" className="btn-ink hidden min-h-[40px] px-5 py-2 lg:inline-flex">
            Getting a room
          </Link>
          <button
            type="button"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full px-3 text-[0.95rem] font-medium text-ink lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-3 w-5" aria-hidden="true">
              <span className={`absolute left-0 top-0 h-px w-5 bg-ink transition-transform duration-300 ${open ? "translate-y-1.5 rotate-45" : ""}`} />
              <span className={`absolute bottom-0 left-0 h-px w-5 bg-ink transition-transform duration-300 ${open ? "-translate-y-1.5 -rotate-45" : ""}`} />
            </span>
            {open ? "Close" : "Menu"}
          </button>
        </div>
        <nav id="mobile-nav" aria-label="Main" hidden={!open} className="border-t border-black/[0.06] lg:hidden">
          <ul className="grid gap-0.5 px-3 py-3">
            {nav.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  aria-current={isActive(n.href) ? "page" : undefined}
                  className="flex min-h-[52px] items-center justify-between rounded-2xl px-3 font-display text-2xl text-ink hover:bg-paper-2 aria-[current=page]:text-lamp-deep"
                >
                  {n.label}
                  <span aria-hidden="true" className="text-base text-ink-muted">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="on-night mt-24 bg-night text-mist-muted">
      <div className="wrap grid gap-14 py-20 md:grid-cols-[1.5fr_1fr]">
        <div>
          <p className="flex items-center gap-3 text-mist">
            <Flame className="h-11 w-11" />
            <span className="font-display text-3xl">
              <em>Lux in Tenebris</em>
            </span>
          </p>
          <p className="mt-6 max-w-md">{disclaimer}</p>
          <p className="mt-3 max-w-md">
            Made by {site.maker}, a former resident. Spotted a mistake? The{" "}
            <Link href="/sources/" className="link-night">
              sources page
            </Link>{" "}
            says how to tell us.
          </p>
        </div>
        <nav aria-label="Footer">
          <p className="label text-mist-muted">Explore</p>
          <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-1">
            {[...nav, { href: "/sources/", label: "Sources and credits" }, { href: "/privacy/", label: "Privacy" }].map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="inline-flex min-h-[40px] items-center text-mist/85 transition-colors duration-300 hover:text-lamp">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/10">
        <p className="wrap py-6 text-sm">
          No University of Ghana or hall logos are used on this site. For anything official, go to{" "}
          <a href="https://www.ug.edu.gh" className="link-night" target="_blank" rel="noopener noreferrer">
            ug.edu.gh<span className="sr-only"> (opens in a new tab)</span>
          </a>
          .
        </p>
      </div>
    </footer>
  )
}
