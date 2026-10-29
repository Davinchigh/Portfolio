"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Flame } from "@/components/flame"
import { disclaimer, nav, site } from "@/lib/site"

export function Banner() {
  return (
    <aside aria-label="Site notice" className="bg-lamp text-night">
      <p className="wrap py-2 text-center text-sm font-bold">
        Unofficial site by a former resident. Not affiliated with the University of Ghana.
      </p>
    </aside>
  )
}

export function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  useEffect(() => setOpen(false), [pathname])

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname?.startsWith(href.replace(/\/$/, "")))

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-night/95 text-mist backdrop-blur">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex min-h-[44px] items-center gap-2.5 font-display text-lg">
          <Flame />
          <span>
            Jean Nelson Aka Hall
            <span className="sr-only">, unofficial site</span>
          </span>
        </Link>
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  aria-current={isActive(n.href) ? "page" : undefined}
                  className="inline-flex min-h-[44px] items-center rounded-full px-3 text-[0.95rem] hover:text-lamp aria-[current=page]:bg-white/10 aria-[current=page]:text-lamp"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <button
          type="button"
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/25 px-4 font-bold lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      <nav id="mobile-nav" aria-label="Main" hidden={!open} className="border-t border-white/10 lg:hidden">
        <ul className="wrap grid gap-1 py-3">
          {nav.map((n) => (
            <li key={n.href}>
              <Link
                href={n.href}
                aria-current={isActive(n.href) ? "page" : undefined}
                className="flex min-h-[48px] items-center rounded-xl px-3 text-lg hover:bg-white/5 aria-[current=page]:text-lamp"
              >
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="bg-night text-mist-muted">
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="flex items-center gap-2.5 font-display text-xl text-mist">
            <Flame /> Light in Darkness
          </p>
          <p className="mt-4 max-w-md">{disclaimer}</p>
          <p className="mt-3 max-w-md">
            Made with love by {site.maker}, a former resident. Spotted a mistake? See the{" "}
            <Link href="/sources/" className="link-night">
              sources page
            </Link>{" "}
            for how to tell us.
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-1">
            {[...nav, { href: "/sources/", label: "Sources and credits" }, { href: "/privacy/", label: "Privacy" }].map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="inline-flex min-h-[40px] items-center hover:text-lamp">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/10">
        <p className="wrap py-5 text-sm">
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
