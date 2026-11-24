"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useVisitor } from "@/lib/visitor"
import { LogoMark } from "@/components/site/logo"

/** Switch between the recruiter view and the story view. Home page only. */
function ViewSwitch({ className = "" }: { className?: string }) {
  const { mode, setMode } = useVisitor()
  const views = [
    { mode: "recruiter" as const, label: "hiring" },
    { mode: "explorer" as const, label: "exploring" },
  ]
  return (
    <div role="group" aria-label="View the site as" className={`relative grid grid-cols-2 rounded-full border bg-card p-0.5 ${className}`}>
      <span
        aria-hidden="true"
        className={`seg-pill inset-y-0.5 left-0.5 w-[calc(50%-2px)] ${mode === "explorer" ? "translate-x-full" : ""} ${mode === "unknown" ? "scale-75 opacity-0" : ""}`}
      />
      {views.map((v) => {
        const on = mode === v.mode
        return (
          <button
            key={v.mode}
            type="button"
            aria-pressed={on}
            onClick={() => setMode(v.mode)}
            className={`relative z-10 min-h-9 rounded-full px-3.5 text-xs font-medium transition-colors duration-300 ${
              on ? "text-background" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {v.label}
          </button>
        )
      })}
    </div>
  )
}

const links = [
  { label: "work", href: "/#work" },
  { label: "experience", href: "/#experience" },
  { label: "projects", href: "/projects" },
  { label: "resume", href: "/resume" },
  { label: "contact", href: "/#contact" },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const menuButton = useRef<HTMLButtonElement>(null)
  const glass = useRef<HTMLDivElement>(null)
  // A soft highlight follows the pointer across the glass.
  const glow = (e: React.PointerEvent) => {
    const el = glass.current
    if (!el || e.pointerType !== "mouse") return
    const r = el.getBoundingClientRect()
    el.style.setProperty("--gx", `${e.clientX - r.left}px`)
    el.style.setProperty("--gy", `${e.clientY - r.top}px`)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false)
        menuButton.current?.focus()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4">
      <div
        ref={glass}
        onPointerMove={glow}
        data-scrolled={scrolled || open ? "" : undefined}
        className="glass-nav pointer-events-auto mx-auto max-w-5xl rounded-[22px]"
      >
      <nav className="flex h-14 items-center justify-between pl-3 pr-2 sm:pl-4" aria-label="Main">
        <Link href="/" className="logo-link inline-flex min-h-11 items-center gap-2.5 font-display text-lg font-bold tracking-tight" aria-label="bfb, Benedict Frimpong Boateng, home">
          <LogoMark className="h-8 w-8" />
          <span aria-hidden="true">bfb</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = l.href === pathname
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`nav-link inline-flex min-h-11 items-center rounded-full px-3 text-sm transition-colors duration-200 ${
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            )
          })}
          <span className="mx-2 h-5 w-px bg-border" aria-hidden="true" />
          {pathname === "/" && <ViewSwitch className="mr-1" />}
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            ref={menuButton}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-accent"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </nav>

      <div id="mobile-menu" className="fold md:hidden" data-open={open ? "" : undefined} inert={!open}>
        <div>
          <div className="border-t border-foreground/10">
            {pathname === "/" && (
              <div className="flex items-center justify-between px-4 pt-4">
                <span className="text-sm text-muted-foreground">view the site as</span>
                <ViewSwitch />
              </div>
            )}
            <ul className="px-4 py-2">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} onClick={() => setOpen(false)} className="block py-3 text-lg transition-colors hover:text-route">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      </div>
    </header>
  )
}
