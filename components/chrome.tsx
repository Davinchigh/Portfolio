"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { BagButton } from "@/components/bag"
import { Lockup } from "@/components/logo"
import { openEsi } from "@/components/concierge"
import { scrollState } from "@/components/motion"
import { askLink, collections, hasSamples, shop } from "@/lib/store"

const nav = [
  ...collections.filter((c) => c.slug !== "new-in").map((c) => ({ href: `/shop/${c.slug}/`, label: c.name })),
  { href: "/shop/new-in/", label: "New in" },
  { href: "/how-to-order/", label: "How to order" },
]

/** The image that floats beside each menu link on hover. */
const menuImage: Record<string, string> = {
  "/shop/women/": "/campaign/look-emerald-sm.webp",
  "/shop/men/": "/campaign/look-menswear-sm.webp",
  "/shop/bags-shoes/": "/campaign/product-bag-sm.webp",
  "/shop/new-in/": "/campaign/look-blazer-sm.webp",
  "/how-to-order/": "/campaign/product-pumps-sm.webp",
}

export function Header() {
  const [open, setOpen] = useState(false)
  const [hover, setHover] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const button = useRef<HTMLButtonElement>(null)
  const first = useRef<HTMLAnchorElement>(null)
  const pathname = usePathname()

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false)
        button.current?.focus()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])
  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open)
    if (open) {
      scrollState.lenis?.stop()
      setTimeout(() => first.current?.focus(), 350)
    } else scrollState.lenis?.start()
  }, [open])

  return (
    <header className={`sticky top-0 z-40 transition-colors duration-500 ${scrolled && !open ? "bg-onyx/90 backdrop-blur-md" : "bg-onyx"}`}>
      {hasSamples && (
        <p className="bg-espresso px-4 py-1.5 text-center text-xs text-champagne">
          Preview: sample pieces, prices and AI-generated campaign images. Her real products and photos are coming.
        </p>
      )}
      <nav aria-label="Main" className="relative z-50 mx-auto grid h-[72px] w-full max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center px-5 sm:px-8">
        <button
          ref={button}
          type="button"
          data-cursor={open ? "Close" : "Menu"}
          className="group flex h-12 items-center gap-3 justify-self-start pr-3 text-[12px] font-medium tracking-caps text-champagne"
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span aria-hidden="true" className="relative block h-3 w-7">
            <span className={`absolute left-0 top-0 h-px w-7 bg-current transition-transform duration-500 ${open ? "translate-y-1.5 rotate-45" : "group-hover:w-5"}`} />
            <span className={`absolute bottom-0 left-0 h-px bg-current transition-all duration-500 ${open ? "w-7 -translate-y-1.5 -rotate-45" : "w-5 group-hover:w-7"}`} />
          </span>
          <span className="hidden sm:inline">{open ? "CLOSE" : "MENU"}</span>
          <span className="sr-only sm:hidden">{open ? "Close menu" : "Open menu"}</span>
        </button>
        <Link href="/" className="justify-self-center">
          <Lockup />
        </Link>
        <div className="flex items-center gap-1 justify-self-end">
          <button type="button" onClick={() => openEsi("I'd like to book a fitting")} className="hidden rounded-full px-4 py-3 text-[12px] font-medium tracking-caps text-champagne/85 hover:text-gold md:block">
            BOOK A FITTING
          </button>
          <BagButton />
        </div>
      </nav>

      <div id="site-menu" className={`site-menu ${open ? "is-open" : ""}`} inert={!open}>
        <div className="mx-auto grid h-full w-full max-w-[1600px] grid-rows-[1fr_auto] px-5 pb-8 pt-28 sm:px-8 md:grid-cols-[1.4fr_1fr] md:grid-rows-1 md:pt-36">
          <ul className="flex flex-col justify-center gap-1" onMouseLeave={() => setHover(null)}>
            {nav.map((n, i) => (
              <li key={n.href} className="overflow-hidden">
                <Link
                  ref={i === 0 ? first : undefined}
                  href={n.href}
                  onMouseEnter={() => setHover(n.href)}
                  onFocus={() => setHover(n.href)}
                  className="menu-link group flex items-baseline gap-5 py-1 font-display text-[clamp(2.6rem,7.5vw,6.5rem)] leading-[1.02] text-champagne"
                  style={{ transitionDelay: open ? `${120 + i * 60}ms` : "0ms" }}
                >
                  <span className="font-sans text-xs tracking-caps text-gold/80">0{i + 1}</span>
                  <span className={`transition-[color,transform] duration-500 group-hover:translate-x-3 group-hover:italic group-hover:text-gold ${hover && hover !== n.href ? "text-champagne/35" : ""}`}>{n.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="relative hidden md:block">
            {Object.entries(menuImage).map(([href, src]) => (
              <img
                key={href}
                src={src}
                alt=""
                loading="lazy"
                className={`absolute inset-y-8 right-0 h-[calc(100%-4rem)] w-[78%] rounded-sm object-cover transition-[opacity,transform,clip-path] duration-700 ${hover === href ? "opacity-100 [clip-path:inset(0)]" : "opacity-0 [clip-path:inset(12%_8%_12%_8%)]"}`}
              />
            ))}
            {!hover && (
              <div className="absolute inset-y-8 right-0 flex w-[78%] flex-col justify-end text-sm text-ash">
                <p className="font-display text-2xl italic text-champagne">Cut in Accra, worn everywhere.</p>
                <p className="mt-3">WhatsApp {shop.phoneDisplay}</p>
                <p>Instagram @{shop.instagram}</p>
              </div>
            )}
          </div>
          <p className="self-end text-xs tracking-caps text-ash md:hidden">WHATSAPP {shop.phoneDisplay}</p>
        </div>
      </div>
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
    <aside aria-label="WhatsApp chat">
    <a
      href={askLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-30 flex h-14 min-w-14 items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 text-sm font-semibold text-onyx shadow-lg shadow-black/40 sm:px-5"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="currentColor">
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4a.5.5 0 0 0 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.7-1.2 2.2 2.2 0 0 0 .2-1.2c-.1-.1-.3-.2-.5-.3Z" />
      </svg>
      <span className="hidden sm:inline" aria-hidden="true">Chat with us</span>
    </a>
    </aside>
  )
}
