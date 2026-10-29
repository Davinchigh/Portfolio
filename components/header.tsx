"use client"

import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import { Logo } from "@/components/logo"

const links = [
  ["Services", "#services"],
  ["How it works", "#how"],
  ["Planting guide", "#guide"],
  ["About", "#about"],
]

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12)
    on()
    window.addEventListener("scroll", on, { passive: true })
    return () => window.removeEventListener("scroll", on)
  }, [])
  return (
    <header className={`sticky top-0 z-40 transition-colors ${scrolled || open ? "border-b border-forest/10 bg-cream/90 backdrop-blur-md" : "bg-transparent"}`}>
      <nav aria-label="Main" className="wrap flex h-[76px] items-center justify-between gap-6">
        <a href="#top" aria-label="Glee Garden, back to top">
          <Logo />
        </a>
        <ul className="hidden items-center gap-1 lg:flex">
          {links.map(([label, href]) => (
            <li key={href}>
              <a href={href} className="rounded-full px-4 py-3 text-[15px] font-medium text-ink/80 transition-colors hover:bg-leaf-soft hover:text-forest">
                {label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <a href="#visit" className="btn-primary hidden sm:inline-flex">Book a garden visit</a>
          <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-nav" className="grid h-12 w-12 place-items-center rounded-full text-forest hover:bg-leaf-soft lg:hidden">
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </nav>
      {open && (
        <ul id="mobile-nav" className="wrap grid gap-1 pb-5 lg:hidden">
          {[...links, ["Book a garden visit", "#visit"]].map(([label, href]) => (
            <li key={href}>
              <a href={href} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-3 text-lg font-medium text-forest hover:bg-leaf-soft">
                {label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
