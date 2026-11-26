"use client"

import Link from "next/link"
import { Banner } from "@/components/chrome"
import { useEffect, useRef, useState } from "react"

/*
 * The cinematic home: a hero with the name set behind the roofline, an annotated aerial plan,
 * a scroll-driven walk through five places, and a finale that pulls into the laptop on a student's
 * desk and lands back at the start of the site.
 *
 * All pictures are AI-enhanced renders of the 3D reconstruction (built from satellite measurements,
 * published photos and a former resident's photos). They are visualisations, not photographs.
 */

const PLATE_W = 2752
const PLATE_H = 1536

/** Scroll progress (0..1) of a tall section while it is pinned. */
function useSectionProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [p, setP] = useState(0)
  useEffect(() => {
    let raf = 0
    const tick = () => {
      raf = 0
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const total = r.height - window.innerHeight
      setP(Math.min(1, Math.max(0, total > 0 ? -r.top / total : 0)))
    }
    const on = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }
    tick()
    window.addEventListener("scroll", on, { passive: true })
    window.addEventListener("resize", on)
    return () => {
      window.removeEventListener("scroll", on)
      window.removeEventListener("resize", on)
      cancelAnimationFrame(raf)
    }
  }, [])
  return [ref, p] as const
}

function useReducedMotion() {
  const [r, setR] = useState(false)
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)")
    setR(m.matches)
    const on = () => setR(m.matches)
    m.addEventListener("change", on)
    return () => m.removeEventListener("change", on)
  }, [])
  return r
}

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/* ------------------------------------------------------------------ HERO */

/** The hero picture and words; `t` is the scroll parallax. Shared with the laptop finale so it lands on the same frame. */
function HeroArt({ t, copy = false }: { t: number; copy?: boolean }) {
  return (
    <>
      {/* sky and building */}
      <img
        src="/plates/entrance.webp"
        alt={copy ? "" : "The hall's entrance at dusk: a four-storey block with a red tiled roof, a gabled entrance tower with a tall arched window, lit windows and trees in the car park."}
        aria-hidden={copy || undefined}
        className="absolute inset-0 h-full w-full select-none object-cover object-[50%_70%]"
        style={{ transform: `scale(${1.04 + t * 0.06})` }}
        fetchPriority={copy ? undefined : "high"}
        draggable={false}
      />
      {/* the name, set in the sky behind the roofline */}
      <h1
        id={copy ? undefined : "hero-h"}
        aria-label={copy ? undefined : "Jean Nelson Aka Hall"}
        aria-hidden={copy || undefined}
        className="pointer-events-none absolute inset-x-0 top-[13vh] select-none text-center font-sans font-black uppercase leading-[0.8] tracking-[-0.045em] text-white/95 sm:top-[11vh]"
        style={{ transform: `translateY(${t * 90}px)`, opacity: 1 - t * 0.7 }}
      >
        <span className="block text-[clamp(3.4rem,12.4vw,13rem)] [text-shadow:0_10px_60px_rgba(20,10,60,0.35)] sm:whitespace-nowrap">Jean Nelson</span>
      </h1>
      {/* the building again, on top of the name */}
      <img
        src="/plates/entrance-front.webp"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[50%_70%]"
        style={{ transform: `scale(${1.04 + t * 0.06})` }}
      />
      <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-[#0b0c1a] via-[#0b0c1a]/55 to-transparent" aria-hidden="true" />
      <div className="grain absolute inset-0 opacity-[0.07] mix-blend-overlay" aria-hidden="true" />

      <div aria-hidden={copy || undefined} className="wrap absolute inset-x-0 bottom-0 flex flex-col gap-8 pb-10 sm:pb-14 lg:flex-row lg:items-end lg:justify-between">
        <div className={`max-w-xl ${copy ? "" : "fade-in"}`}>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/70">Aka Hall · University of Ghana, Legon</p>
          <p className="mt-1 text-[0.7rem] text-white/50 sm:hidden">AI-enhanced render of a 3D reconstruction.</p>
          <p className="mt-4 font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.1]">
            Light in darkness. Home to the Royals since 2011.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#walk" tabIndex={copy ? -1 : undefined} className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-white px-6 font-medium text-ink transition hover:bg-lamp-soft">
              Walk through the hall <span aria-hidden="true">↓</span>
            </a>
            <Link href="/rooms/" tabIndex={copy ? -1 : undefined} className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-white/40 px-6 font-medium text-white backdrop-blur transition hover:bg-white/10">
              Getting a room
            </Link>
          </div>
        </div>
        <dl className="grid grid-cols-3 gap-6 text-white sm:gap-10">
          {[
            ["430", "self-contained rooms"],
            ["~1,700", "residents"],
            ["4", "storeys round a courtyard"],
          ].map(([k, v]) => (
            <div key={v}>
              <dt className="sr-only">{v}</dt>
              <dd className="font-sans text-[clamp(1.8rem,3.4vw,2.8rem)] font-semibold leading-none tracking-[-0.03em] tabular-nums">{k}</dd>
              <dd className="mt-2 max-w-[9rem] text-[0.8rem] leading-snug text-white/65">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <p className="absolute bottom-3 right-4 hidden text-right text-[0.7rem] leading-snug text-white/50 sm:right-8 sm:block">
        AI-enhanced render of a 3D reconstruction. Not a photograph.
      </p>
    </>
  )
}

export function CinemaHero() {
  const [y, setY] = useState(0)
  useEffect(() => {
    const on = () => setY(window.scrollY)
    on()
    window.addEventListener("scroll", on, { passive: true })
    return () => window.removeEventListener("scroll", on)
  }, [])
  return (
    <section aria-labelledby="hero-h" className="relative -mt-[5.5rem] h-[100svh] min-h-[640px] overflow-hidden bg-[#1b1d3a] text-white">
      <HeroArt t={clamp(y / 800)} />
    </section>
  )
}

/* ------------------------------------------------------------------ PLAN */

const pins = [
  { n: 1, x: 59.2, y: 48.5, title: "Entrance and porters' lodge", body: "The gabled tower on the long side, facing the car park and the taxi rank." },
  { n: 2, x: 61.5, y: 42, title: "Mart, upstairs", body: "Climb the entrance stairs and it is the first thing you meet. A spacious one.", resident: true },
  { n: 3, x: 33.5, y: 56, title: "Basketball court", body: "One of the two courts in the courtyard, ringed by tiled walks.", resident: true },
  { n: 4, x: 44.5, y: 46.5, title: "The round garden", body: "A round flower bed at the centre of the courtyard, where the paths meet." },
  { n: 5, x: 53, y: 37.5, title: "Tennis court", body: "The court with the net, at the other end of the courtyard.", resident: true },
  { n: 6, x: 12, y: 55.5, title: "Restaurant, shops and laundry", body: "From the entrance turn left down the hallway; the restaurant is at the far corner, with small shops along the way.", resident: true },
  { n: 7, x: 69, y: 27, title: "The second mart", body: "At the opposite far end of the hall.", resident: true },
  { n: 8, x: 87, y: 68, title: "Elizabeth Sey Hall", body: "The next diaspora hall, built to the same plan, across the car park." },
]

export function CinemaPlan() {
  const [active, setActive] = useState(1)
  const a = pins.find((p) => p.n === active)!
  return (
    <section aria-labelledby="plan-h" className="bg-paper py-24 sm:py-32">
      <div className="wrap grid items-end gap-6 md:grid-cols-[1.2fr_1fr]">
        <div className="reveal">
          <p className="label flex items-center gap-3 text-lamp-deep">
            <span className="rule" aria-hidden="true" /> The plan
          </p>
          <h2 id="plan-h" className="mt-5 text-4xl sm:text-6xl">
            A ring of rooms round a long green courtyard.
          </h2>
        </div>
        <p className="reveal max-w-md text-ink-muted">
          About 157 by 79 metres, measured from satellite imagery. Four wings of rooms, two courts, a garden in the middle and
          everything you need along the hallways.
        </p>
      </div>
      <div className="wrap mt-12">
        <div className="relative overflow-hidden rounded-[28px] bg-night shadow-[0_40px_80px_-40px_rgba(15,17,21,0.6)]">
          <img
            src="/plates/aerial.webp"
            alt="Aerial view of the hall at golden hour: a red-roofed ring block round a courtyard with two teal courts, a car park beside it and the next hall to the right."
            className="block w-full"
            loading="lazy"
          />
          {pins.map((p) => (
            <button
              key={p.n}
              type="button"
              onClick={() => setActive(p.n)}
              aria-pressed={active === p.n}
              aria-label={`${p.n}. ${p.title}`}
              className={`absolute flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-sm font-semibold shadow-lg ring-4 transition duration-300 ${
                active === p.n ? "scale-110 bg-lamp text-ink ring-white/70" : "bg-white/90 text-ink ring-white/25 hover:bg-white"
              }`}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            >
              {p.n}
            </button>
          ))}
          <div aria-live="polite" className="absolute bottom-3 left-3 right-3 rounded-2xl bg-white/85 p-4 backdrop-blur-xl sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-sm sm:p-5">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-lamp-deep">
              {String(a.n).padStart(2, "0")} {a.resident && <span className="ml-2 normal-case tracking-normal text-ink-muted">from a former resident</span>}
            </p>
            <p className="mt-1 font-display text-2xl leading-tight">{a.title}</p>
            <p className="mt-1 text-[0.95rem] leading-snug text-ink-muted">{a.body}</p>
          </div>
        </div>
        <p className="mt-4 text-[0.8rem] text-ink-muted">
          Positions are approximate. AI-enhanced render of a 3D reconstruction; layout details from a former resident.
        </p>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ WALK */

const stops = [
  { img: "entrance", k: "Arrival", title: "Under the trees, through the tall arched door.", body: "Taxis wait in the car park. Inside, the porters' lodge, and the stairs up to the mart.", pos: "50% 70%" },
  { img: "courtyard", k: "The courtyard", title: "Two courts, a round garden and laundry in the sun.", body: "Every room looks onto green: the courtyard on one side, the bush and the next hall on the other.", pos: "50% 60%" },
  { img: "room", k: "Your room", title: "Four to a room, yellow bunks, blue curtains.", body: "Self-contained rooms with louvre windows, wall shelves and a desk by the window.", pos: "50% 55%" },
  { img: "reading", k: "The reading room", title: "Quiet rows of carrels, and room to think.", body: "Long rows of desks with dividers, louvre windows on both sides and fans overhead.", pos: "50% 55%" },
  { img: "mart", k: "The mart", title: "Cold drinks, bread and noodles, a few steps away.", body: "One mart at the top of the entrance stairs and another at the far end; a restaurant, a salon and foodstuff shops downstairs.", pos: "50% 60%" },
]

export function CinemaWalk() {
  const [ref, p] = useSectionProgress<HTMLElement>()
  const reduced = useReducedMotion()
  const seg = 1 / stops.length
  const i = Math.min(stops.length - 1, Math.floor(p / seg))
  return (
    <section id="walk" ref={ref} aria-labelledby="walk-h" className="relative bg-night text-white" style={{ height: `${stops.length * 110}vh` }}>
      <h2 id="walk-h" className="sr-only">
        A walk through the hall
      </h2>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {stops.map((s, k) => {
          const local = (p - k * seg) / seg // 0..1 inside its segment
          const fadeIn = k === 0 ? 1 : clamp((p - (k * seg - seg * 0.18)) / (seg * 0.18))
          const visible = k <= i + 1
          const zoom = reduced ? 1.02 : 1.02 + clamp(local, -0.2, 1.2) * 0.09
          return (
            <img
              key={s.img}
              src={`/plates/${s.img}.webp`}
              alt=""
              aria-hidden="true"
              loading={k === 0 ? "eager" : "lazy"}
              className="absolute inset-0 h-full w-full object-cover will-change-transform"
              style={{ opacity: visible ? fadeIn : 0, transform: `scale(${zoom})`, objectPosition: s.pos, zIndex: k }}
            />
          )
        })}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/70 via-black/25 to-transparent" aria-hidden="true" />
        <div className="grain absolute inset-0 z-10 opacity-[0.06] mix-blend-overlay" aria-hidden="true" />

        <div className="wrap relative z-20 flex h-full flex-col justify-end pb-14 sm:justify-center sm:pb-0">
          <ol className="max-w-xl">
            {stops.map((s, k) => (
              <li
                key={s.k}
                className={`transition-all duration-700 ${k === i ? "relative opacity-100" : "pointer-events-none absolute opacity-0"} ${k === i ? "translate-y-0" : k < i ? "-translate-y-6" : "translate-y-6"}`}
                aria-current={k === i ? "step" : undefined}
              >
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-lamp">
                  {String(k + 1).padStart(2, "0")} / {String(stops.length).padStart(2, "0")} · {s.k}
                </p>
                <p className="mt-4 font-display text-[clamp(2.2rem,5vw,4.2rem)] leading-[1.02]">{s.title}</p>
                <p className="mt-5 max-w-md text-lg text-white/75">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
        {/* progress */}
        <div className="absolute bottom-6 right-5 z-20 flex items-center gap-2 sm:right-8" aria-hidden="true">
          {stops.map((s, k) => (
            <span key={s.k} className={`h-1 rounded-full transition-all duration-500 ${k === i ? "w-10 bg-white" : "w-4 bg-white/35"}`} />
          ))}
        </div>
        <p className="absolute right-5 top-[6.5rem] z-20 max-w-[14rem] text-right text-[0.7rem] leading-snug text-white/55 sm:right-8">
          AI-enhanced renders of a 3D reconstruction.
        </p>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ FINALE: into the laptop */

// Laptop screen corners in the room plate (plate pixels, 2752 x 1536): TL, TR, BR, BL.
const SCREEN: [number, number][] = [
  [194, 1118],
  [484, 1034],
  [508, 1218],
  [222, 1330],
]

type Pt = [number, number]

/** CSS matrix3d that maps a w x h box (at 0,0) onto the quad TL, TR, BR, BL (a homography). */
function quadMatrix(w: number, h: number, q: Pt[]) {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = q
  const dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3
  const dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3
  const den = dx1 * dy2 - dx2 * dy1
  const g = (dx3 * dy2 - dx2 * dy3) / den
  const hh = (dx1 * dy3 - dx3 * dy1) / den
  const a = x1 - x0 + g * x1, b = x3 - x0 + hh * x3, c = x0
  const d = y1 - y0 + g * y1, e = y3 - y0 + hh * y3, f = y0
  const m = [a / w, d / w, 0, g / w, b / h, e / h, 0, hh / h, 0, 0, 1, 0, c, f, 0, 1]
  return `matrix3d(${m.map((v) => +v.toFixed(9)).join(",")})`
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

/**
 * The walk ends in a student room. Scrolling pulls the camera to the laptop on the desk; the site on its screen
 * then lifts off the laptop, straightens and grows until it is the hero itself, at full resolution, and you are
 * handed back to the top of the page on the same frame.
 *
 * The screen content is the real hero rendered at viewport size and transformed DOWN onto the screen, so the last
 * frame is pixel-sharp. Motion runs in one rAF loop with smoothed progress and writes transforms directly.
 */
export function CinemaFinale() {
  const section = useRef<HTMLElement>(null)
  const room = useRef<HTMLDivElement>(null)
  const roomShade = useRef<HTMLDivElement>(null)
  const screen = useRef<HTMLDivElement>(null)
  const glare = useRef<HTMLDivElement>(null)
  const intro = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLParagraphElement>(null)
  const notice = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState({ w: 1440, h: 900, top: 34 })
  const reduced = useReducedMotion()

  useEffect(() => {
    const measure = () =>
      setBox({
        w: window.innerWidth,
        h: Math.max(window.innerHeight, 640), // the hero is 100svh with a 640px floor
        top: (document.querySelector('aside[aria-label="Site notice"]') as HTMLElement | null)?.offsetHeight ?? 0,
      })
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  useEffect(() => {
    const el = section.current
    if (!el) return
    const vw = window.innerWidth, vh = window.innerHeight
    const { w: BW, h: BH, top: BT } = box

    // Geometry that does not change with scroll.
    const cover = Math.max(vw / PLATE_W, vh / PLATE_H)
    const xs = SCREEN.map((c) => c[0]), ys = SCREEN.map((c) => c[1])
    const scx = (Math.min(...xs) + Math.max(...xs)) / 2, scy = (Math.min(...ys) + Math.max(...ys)) / 2
    const sw = Math.max(...xs) - Math.min(...xs)
    const zoomTo = (0.5 * vw) / (sw * cover) // room scale factor at which the screen spans half the viewport
    const end: Pt[] = [
      [0, BT],
      [BW, BT],
      [BW, BT + BH],
      [0, BT + BH],
    ]

    const apply = (sp: number) => {
      // 1. camera moves in on the laptop
      // Zoom eases in and out; the laptop is panned to the centre a little ahead of the zoom so it never leaves the frame.
      const z = easeInOut(clamp((sp - 0.04) / 0.56))
      const pan = easeOut(clamp((sp - 0.02) / 0.4))
      const scale = cover * (1 + (zoomTo - 1) * z)
      const sx0 = vw / 2 + (scx - PLATE_W / 2) * cover, sy0 = vh / 2 + (scy - PLATE_H / 2) * cover // laptop at the start
      const fx = sx0 + (vw / 2 - sx0) * pan, fy = sy0 + (vh * 0.52 - sy0) * pan // where the laptop sits on screen now
      // never let the edge of the room picture show
      const tx = clamp(fx - scx * scale, vw - PLATE_W * scale, 0)
      const ty = clamp(fy - scy * scale, vh - PLATE_H * scale, 0)
      room.current!.style.transform = `translate3d(${tx}px,${ty}px,0) scale(${scale})`
      // 2. the screen lifts off the laptop and becomes the page
      const k = easeInOut(clamp((sp - 0.36) / 0.56))
      const quad = SCREEN.map(([x, y], i) => {
        const ax = tx + x * scale, ay = ty + y * scale
        return [ax + (end[i][0] - ax) * k, ay + (end[i][1] - ay) * k] as Pt
      })
      screen.current!.style.transform = quadMatrix(BW, BH, quad)
      glare.current!.style.opacity = String(0.9 * (1 - easeOut(k)))
      // 3. the room falls away behind it
      const fade = clamp((sp - 0.5) / 0.35)
      room.current!.style.opacity = String(1 - fade)
      roomShade.current!.style.opacity = String(0.25 + 0.5 * clamp((sp - 0.3) / 0.4))
      intro.current!.style.opacity = String(1 - clamp(sp / 0.16))
      intro.current!.style.transform = `translate3d(0,${-40 * clamp(sp / 0.16)}px,0)`
      label.current!.style.opacity = String(1 - clamp((sp - 0.85) / 0.1))
      // At the top of the page the site notice sits above the hero and the nav sits below it: match that as we land.
      const land = clamp((sp - 0.86) / 0.1)
      notice.current!.style.opacity = String(land)
      document.documentElement.style.setProperty("--hdr-shift", `${(BT * land).toFixed(2)}px`)
    }

    if (reduced) {
      apply(0)
      return
    }

    let target = 0, sp = 0, last = performance.now(), raf = 0, visible = false, landedAt = 0
    const read = () => {
      const r = el.getBoundingClientRect()
      const total = r.height - vh
      target = clamp(total > 0 ? -r.top / total : 0)
    }
    const loop = (now: number) => {
      const dt = Math.min(64, now - last) / 16.667
      last = now
      read()
      sp += (target - sp) * (1 - Math.pow(0.86, dt))
      if (Math.abs(target - sp) < 0.0004) sp = target
      apply(sp)
      // Landed on the hero's frame and settled: hand over to the real top of the page, invisibly.
      if (sp > 0.995 && target > 0.995) {
        landedAt ||= now
        if (now - landedAt > 380) {
          landedAt = 0
          sp = 0
          window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior })
          document.documentElement.style.setProperty("--hdr-shift", "0px")
        }
      } else landedAt = 0
      if (visible) raf = requestAnimationFrame(loop)
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible) {
        last = performance.now()
        cancelAnimationFrame(raf)
        raf = requestAnimationFrame(loop)
      }
    })
    io.observe(el)
    read()
    sp = target
    apply(sp)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      document.documentElement.style.setProperty("--hdr-shift", "0px")
    }
  }, [box, reduced])

  return (
    <section ref={section} aria-labelledby="fin-h" className="relative bg-[#07080f]" style={{ height: reduced ? "auto" : "380vh" }}>
      <div className={`${reduced ? "relative" : "sticky top-0"} h-[100svh] overflow-hidden`}>
        <div ref={room} className="absolute left-0 top-0 origin-top-left will-change-transform" style={{ width: PLATE_W, height: PLATE_H }}>
          <img
            src="/plates/room.webp"
            alt="A student room: two yellow bunk beds, blue curtains at a louvre window, and a laptop open on the desk."
            className="absolute inset-0 h-full w-full select-none"
            draggable={false}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div ref={roomShade} className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(5,6,12,0.85))]" aria-hidden="true" />

        {/* the site on the laptop screen: the real hero at viewport size, transformed onto the screen */}
        <div
          ref={screen}
          className="absolute left-0 top-0 origin-top-left overflow-hidden bg-[#1b1d3a] text-white will-change-transform [backface-visibility:hidden]"
          style={{ width: box.w, height: box.h }}
          aria-hidden="true"
        >
          <HeroArt t={0} copy />
          <div ref={glare} className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.32)_0%,rgba(255,255,255,0.06)_38%,transparent_55%)]" />
        </div>

        <div ref={intro} className="wrap pointer-events-none absolute inset-x-0 top-[22vh] text-white">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-lamp">The end of the walk</p>
          <h2 id="fin-h" className="mt-4 max-w-xl font-display text-[clamp(2.2rem,5vw,4rem)] leading-[1.02] [text-shadow:0_4px_30px_rgba(0,0,0,0.45)]">
            And at the end of the day, a desk by the window.
          </h2>
          <p className="mt-4 text-white/70">Keep scrolling.</p>
        </div>
        {/* a copy of the site notice, faded in as we land so the hand-over to the real page top is invisible */}
        <div ref={notice} className="pointer-events-none absolute inset-x-0 top-0 opacity-0" aria-hidden="true">
          <Banner />
        </div>
        <p ref={label} className="absolute bottom-3 left-4 text-[0.7rem] text-white/50 sm:left-8">
          AI-enhanced render of a 3D reconstruction.
        </p>
        {reduced && (
          <div className="absolute inset-x-0 bottom-16 flex justify-center">
            <button type="button" onClick={() => window.scrollTo({ top: 0 })} className="inline-flex min-h-[52px] items-center gap-2 rounded-full bg-white px-7 font-medium text-ink shadow-2xl">
              Back to the start <span aria-hidden="true">↑</span>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
