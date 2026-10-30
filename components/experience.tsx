"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { ArrowDown } from "lucide-react"
import { canRun3D } from "@/lib/gate"
import type { Look } from "@/lib/scene"
import { openEsi } from "@/components/concierge"
import { askLink, findProduct, ghs } from "@/lib/store"

/** poster: the still used when 3D is off (the hero poster already has the scarf in her hand) */
const LOOKS: (Look & { alt: string; poster?: string })[] = [
  { src: "/campaign/look-hero.webp", poster: "/campaign/look-blazer.webp", hand: [0.782, 0.218], handMask: { src: "/campaign/look-hero-hand.png", box: [0.7305, 0.1836, 0.1074, 0.0716] }, video: { src: "/campaign/look-hero.mp4", track: "/campaign/look-hero-track.json", packed: true, fps: 24, size: [720, 1280], hand: [0.8365, 0.2137], box: [0.77284, 0.1779, 0.12731, 0.07161] }, silk: "#D6BC8C", alt: "A woman in a black blazer, cream silk camisole and sand wide-leg trousers, holding a champagne silk scarf that streams in the wind" },
  { src: "/campaign/look-emerald.webp", silk: "#D6BC8C", alt: "A woman mid-turn in an emerald silk wrap dress, the skirt swirling around her" },
  { src: "/campaign/look-menswear.webp", silk: "#D6BC8C", alt: "A man in a tailored charcoal two-piece suit and cream open-collar shirt, adjusting his cuff" },
  { src: "/campaign/product-bag.webp", silk: "#D6BC8C", alt: "A black top-handle bag with a round gold clasp and gold chain on a dark marble plinth" },
  { src: "/campaign/product-pumps.webp", silk: "#D6BC8C", alt: "" },
]

function StaticLook({ i, hidden, centre = false }: { i: number; hidden: boolean; centre?: boolean }) {
  const l = LOOKS[i]
  return (
    <img
      src={l.poster ?? l.src}
      alt={l.alt}
      loading={i === 0 ? "eager" : "lazy"}
      fetchPriority={i === 0 ? "high" : "auto"}
      aria-hidden={l.alt ? undefined : true}
      className={`pointer-events-none absolute inset-0 h-full w-full object-contain object-top transition-opacity duration-1000 md:object-bottom ${centre ? "md:left-[20%] md:w-[60%]" : "md:left-auto md:right-[3%] md:w-[53%]"} ${hidden ? "opacity-0" : "opacity-100"}`}
      style={{ maskImage: "radial-gradient(75% 70% at 50% 45%, #000 60%, transparent 100%)", WebkitMaskImage: "radial-gradient(75% 70% at 50% 45%, #000 60%, transparent 100%)" }}
    />
  )
}

/** The gold FITTED word as SVG text: a gradient fill that every browser paints, unlike background-clip text. */
function FittedWord({ className = "w-[clamp(15rem,78vw,32rem)]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 520 112" className={`block h-auto ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id="fitted-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F3E2B8" />
          <stop offset="0.55" stopColor="#D1AE69" />
          <stop offset="1" stopColor="#A9792F" />
        </linearGradient>
      </defs>
      <text x="0" y="100" fill="url(#fitted-gold)" fontFamily="'Bodoni Moda Variable', Georgia, serif" fontWeight="600" fontSize="128" letterSpacing="2" textLength="516" lengthAdjust="spacingAndGlyphs">
        FITTED
      </text>
    </svg>
  )
}

export function Experience() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const sections = useRef<(HTMLElement | null)[]>([])
  const [gl, setGl] = useState(false)

  useEffect(() => {
    const el = canvas.current
    if (!el || !canRun3D()) return
    let exp: { setProgress: (p: number) => void; destroy: () => void } | null = null
    let cancelled = false
    let raf = 0

    const progress = () => {
      const y = window.scrollY + window.innerHeight * 0.15
      const list = sections.current.filter(Boolean) as HTMLElement[]
      for (let i = list.length - 1; i >= 0; i--) {
        const top = list[i].offsetTop
        if (y >= top) return Math.min(i + (y - top) / list[i].offsetHeight, list.length - 1)
      }
      return 0
    }
    const onScroll = () => {
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0
          exp?.setProgress(progress())
        })
    }

    const start = () =>
      import("@/lib/scene").then(({ createExperience }) => {
        if (cancelled) return
        exp = createExperience(el, LOOKS, () => setGl(true), { word: "LIZAB" })
        exp.setProgress(progress())
        window.addEventListener("scroll", onScroll, { passive: true })
      })
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback
    if (idle) idle(() => void start())
    else setTimeout(() => void start(), 200)

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", onScroll)
      exp?.destroy()
    }
  }, [])

  const bag = findProduct("LZ-B-001")
  const pumps = findProduct("LZ-S-001")
  const reg = (i: number) => (n: HTMLElement | null) => {
    sections.current[i] = n
  }
  const panel = "relative z-10 flex min-h-[100svh] items-end pb-24 md:items-center md:pb-0"
  const copy = "wrap relative w-full [text-shadow:0_1px_24px_rgba(13,12,11,0.75)]"
  const mobileShade = "pointer-events-none absolute inset-0 bg-gradient-to-t from-onyx from-10% via-onyx/55 via-45% to-transparent to-70% md:hidden"

  return (
    <div className="relative">
      {/* The 3D stage, pinned behind the sections */}
      <div aria-hidden="true" className="sticky top-0 -mb-[100svh] h-[100svh] w-full overflow-hidden">
        <canvas ref={canvas} className={`h-full w-full transition-opacity duration-1000 ${gl ? "opacity-100" : "opacity-0"}`} />
      </div>

      <section ref={reg(0)} aria-labelledby="hero-title" className="relative z-10 flex min-h-[calc(100svh-120px)] flex-col justify-end pb-24 md:min-h-[calc(100svh-100px)] md:pb-12">
        {/* without WebGL the wordmark is plain type behind the photo */}
        <p aria-hidden="true" className={`pointer-events-none absolute inset-x-0 top-[22%] select-none text-center font-display text-[24vw] font-medium leading-none tracking-[-0.02em] text-gold/80 transition-opacity duration-1000 md:top-[30%] md:text-[19vw] ${gl ? "opacity-0" : "opacity-100"}`}>
          LIZAB
        </p>
        <StaticLook i={0} hidden={gl} centre />
        <div className={mobileShade} />
        <div className={`${copy} grid items-end gap-8 md:grid-cols-[1fr_minmax(0,1fr)]`}>
          <div>
            <h1 id="hero-title" className="font-sans font-light">
              <span data-split className="block text-[13px] tracking-caps text-champagne sm:text-[15px]">HAVE YOU BEEN</span>
              <span className="sr-only">fitted</span>
              <span className="mt-2 block"><FittedWord className="w-[clamp(13rem,60vw,22rem)]" /></span>
              <span data-split className="mt-2 block text-[13px] tracking-caps text-champagne sm:text-[15px]">THIS SEASON?</span>
            </h1>
          </div>
          <div className="md:justify-self-end md:text-right">
            <p data-reveal className="font-display text-xl italic text-champagne">Handcrafted elegance, cut in Accra.</p>
            <p data-reveal className="mt-1 hidden max-w-sm text-champagne/75 sm:block md:ml-auto">Men&apos;s and women&apos;s wear, bags and shoes. Delivery and pick-up worldwide.</p>
            <div data-reveal className="mt-6 flex flex-wrap gap-3 md:justify-end">
              <Link href="/shop/new-in/" data-magnetic data-cursor="Shop" className="btn-gold">See what&apos;s new</Link>
              <button type="button" onClick={() => openEsi("I'd like to book a fitting")} data-magnetic className="btn-ghost bg-onyx/40 backdrop-blur-sm">
                Book a fitting
              </button>
            </div>
          </div>
        </div>
        <p className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-[11px] tracking-caps text-ash md:flex">
          <ArrowDown className="h-3.5 w-3.5 animate-bounce motion-reduce:animate-none" aria-hidden="true" /> SCROLL
        </p>
      </section>

      <section ref={reg(1)} aria-labelledby="women-title" className={panel}>
        <StaticLook i={1} hidden={gl} />
        <div className={mobileShade} />
        <div className={copy}>
          <div className="max-w-md">
            <p className="eyebrow">WOMEN</p>
            <h2 data-split id="women-title" className="mt-3 text-5xl leading-tight sm:text-6xl">Cut to move.</h2>
            <p className="mt-4 text-champagne/80">Dresses, sets and tailoring, made in Accra to fit you.</p>
            <Link href="/shop/women/" className="btn-gold mt-8">Shop women</Link>
          </div>
        </div>
      </section>

      <section ref={reg(2)} aria-labelledby="men-title" className={panel}>
        <StaticLook i={2} hidden={gl} />
        <div className={mobileShade} />
        <div className={copy}>
          <div className="max-w-md">
            <p className="eyebrow">MEN</p>
            <h2 data-split id="men-title" className="mt-3 text-5xl leading-tight sm:text-6xl">Tailoring with presence.</h2>
            <p className="mt-4 text-champagne/80">Suits, shirts and occasion wear, cut to your measurements.</p>
            <Link href="/shop/men/" className="btn-gold mt-8">Shop men</Link>
          </div>
        </div>
      </section>

      <section ref={reg(3)} aria-labelledby="acc-title" className={panel}>
        <StaticLook i={3} hidden={gl} />
        <div className={mobileShade} />
        <div className={copy}>
          <div className="max-w-md">
            <p className="eyebrow">BAGS &amp; SHOES</p>
            <h2 data-split id="acc-title" className="mt-3 text-5xl leading-tight sm:text-6xl">The finishing touch.</h2>
            <ul className="mt-8 grid grid-cols-2 gap-4">
              {[bag, pumps].filter(Boolean).map((p) => (
                <li key={p!.code}>
                  <Link href={`/p/${p!.code.toLowerCase()}/`} className="group block rounded-2xl bg-onyx/60 p-2 ring-1 ring-gold/20 backdrop-blur-sm transition-colors hover:ring-gold/60">
                    <img src={p!.images[0].src.replace(".webp", "-sm.webp")} alt={p!.images[0].alt} loading="lazy" className="aspect-[4/5] w-full rounded-xl object-cover" />
                    <span className="mt-3 block px-1 font-display text-base leading-snug">{p!.name}</span>
                    <span className="block px-1 pb-1 text-sm text-gold">{ghs(p!.price)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section ref={reg(4)} aria-labelledby="order-title" className={panel}>
        <StaticLook i={4} hidden={gl} />
        <div className={mobileShade} />
        <div className={copy}>
          <div className="max-w-lg rounded-3xl bg-onyx/70 p-7 ring-1 ring-gold/20 backdrop-blur-md sm:p-9">
            <p className="eyebrow">MADE FOR YOU</p>
            <h2 data-split id="order-title" className="mt-3 text-4xl leading-tight sm:text-5xl">Ordering is a conversation.</h2>
            <ol className="mt-6 space-y-4">
              {[
                ["Choose", "Pick a piece, your colour and your size."],
                ["Message", "Tap Order on WhatsApp. The message is written for you."],
                ["Confirm", "We confirm availability and delivery. You pay only after that."],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-4">
                  <span className="font-display text-3xl leading-none text-gold">{i + 1}</span>
                  <span>
                    <span className="block font-medium">{t}</span>
                    <span className="block text-sm text-champagne/75">{d}</span>
                  </span>
                </li>
              ))}
            </ol>
            <a href={askLink()} target="_blank" rel="noopener noreferrer" className="btn-gold mt-8">
              Start on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
