"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

const navLinks = [
  { name: "About", path: "/about" },
  { name: "Projects", path: "/projects" },
  { name: "Designs", path: "/figma-designs" },
  { name: "Resume", path: "/resume" },
  { name: "Contact", path: "/contact" },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => setIsOpen(false), [pathname])

  const isActive = (path: string) => pathname === path

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-background/90 backdrop-blur-md transition-[border-color] ${
        scrolled || isOpen ? "border-b border-border" : "border-b border-transparent"
      }`}
    >
      <nav className="page flex h-16 items-center justify-between" aria-label="Main">
        <Link href="/" className="text-base font-semibold tracking-tight">
          Benedict Frimpong Boateng
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              aria-current={isActive(link.path) ? "page" : undefined}
              className={`px-3 py-2 text-sm transition-colors ${
                isActive(link.path)
                  ? "font-medium text-foreground underline decoration-2 underline-offset-[10px]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-accent"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </nav>

      {isOpen && (
        <div id="mobile-menu" className="border-t border-border md:hidden">
          <div className="page flex flex-col py-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                aria-current={isActive(link.path) ? "page" : undefined}
                className={`py-3 text-lg ${isActive(link.path) ? "font-medium" : "text-muted-foreground"}`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
