"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { Menu, X } from "lucide-react"
import { BagButton } from "@/components/bag"
import { Lockup } from "@/components/logo"
import { askLink, collections, hasSamples, shop } from "@/lib/store"

const nav = [
  ...collections.filter((c) => c.slug !== "new-in").map((c) => ({ href: `/shop/${c.slug}/`, label: c.name })),
  { href: "/shop/new-in/", label: "New in" },
  { href: "/how-to-order/", label: "How to order" },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const menu = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b border-gold/15 bg-onyx/90 backdrop-blur">
      {hasSamples && (
        <p className="bg-espresso px-4 py-1.5 text-center text-xs text-champagne">
          Preview: sample pieces and prices. Real products and photos are coming.
        </p>
      )}
      <nav aria-label="Main" className="wrap flex h-[72px] items-center justify-between gap-6">
        <Link href="/" aria-label={`${shop.name}, home`}>
          <Lockup />
        </Link>
        <ul className="hidden items-center gap-1 lg:flex">
          {nav.map((n) => (
            <li key={n.href}>
              <Link href={n.href} className="rounded-full px-3 py-3 text-[13px] font-medium tracking-[0.12em] text-champagne/85 hover:text-gold">
                {n.label.toUpperCase()}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-1">
          <BagButton />
          <button
            type="button"
            className="grid h-12 w-12 place-items-center rounded-full text-champagne hover:bg-espresso lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </nav>
      {open && (
        <div id="mobile-menu" ref={menu} className="border-t border-gold/15 lg:hidden">
          <ul className="wrap py-3">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} onClick={() => setOpen(false)} className="block py-3 text-lg text-champagne">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}

/** Hwehwemudua, the measuring rod: fine tape-measure ticks. */
function Ticks() {
  return (
    <div aria-hidden="true" className="h-3 w-full" style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(201,164,92,0.5) 0 1px, transparent 1px 12px), repeating-linear-gradient(90deg, rgba(201,164,92,0.9) 0 1px, transparent 1px 60px)", backgroundSize: "100% 6px, 100% 12px", backgroundRepeat: "no-repeat", backgroundPosition: "bottom, bottom" }} />
  )
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-gold/15">
      <Ticks />
      <div className="wrap grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Lockup />
          <p className="mt-5 max-w-sm text-ash">{shop.tagline} Cut in Accra, delivered across Ghana and worldwide.</p>
        </div>
        <div>
          <h2 className="text-xs font-medium tracking-caps text-gold">ORDER</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href={askLink()} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                WhatsApp {shop.phoneDisplay}
              </a>
            </li>
            <li>
              <Link href="/how-to-order/" className="hover:text-gold">How to order</Link>
            </li>
            <li>
              <Link href="/delivery-returns/" className="hover:text-gold">Delivery and returns</Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-xs font-medium tracking-caps text-gold">HOUSE</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/about/" className="hover:text-gold">About Lizab</Link>
            </li>
            <li>
              <a href={`https://instagram.com/${shop.instagram}`} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                Instagram @{shop.instagram}
              </a>
            </li>
            <li>
              <Link href="/privacy/" className="hover:text-gold">Privacy</Link>
            </li>
          </ul>
        </div>
      </div>
      <p className="wrap pb-10 text-xs text-ash">
        © {new Date().getFullYear()} {shop.name}, {shop.city}. We never ask for payment before confirming your item is available.
      </p>
    </footer>
  )
}

export function WhatsAppFab() {
  return (
    <a
      href={askLink()}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-30 flex h-14 items-center gap-2 rounded-full bg-[#25D366] px-5 text-sm font-semibold text-onyx shadow-lg shadow-black/40"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="currentColor">
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4a.5.5 0 0 0 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.7-1.2 2.2 2.2 0 0 0 .2-1.2c-.1-.1-.3-.2-.5-.3Z" />
      </svg>
      <span>Chat with us</span>
    </a>
  )
}
