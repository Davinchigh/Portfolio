"use client"

import { useEffect, useRef, useState } from "react"
import createGlobe from "cobe"
import Link from "next/link"
import { useTheme } from "next-themes"
import { HandNote } from "@/components/site/hand-note"
import { Stop } from "@/components/site/route"
import { useVisitor } from "@/lib/visitor"

type Place = { city: string; country?: string; lat: number; lon: number; tempC?: number | null }
type Here = { home: Place; visitor: Place | null }

const HOME_TZ = "Africa/Accra"
const ACCRA: Place = { city: "Accra", country: "GH", lat: 5.6037, lon: -0.187, tempC: null }

/** Longitude in degrees to the globe's phi angle so that place faces the viewer (cobe's convention). */
const facing = (lon: number) => Math.PI - ((lon * Math.PI) / 180 - Math.PI / 2)

const clock = (d: Date, timeZone: string) =>
  new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone }).format(d)

/** Minutes a time zone is ahead of UTC right now. */
function offset(d: Date, timeZone: string) {
  const local = new Date(d.toLocaleString("en-US", { timeZone }))
  const utc = new Date(d.toLocaleString("en-US", { timeZone: "UTC" }))
  return Math.round((local.getTime() - utc.getTime()) / 60000)
}

function gap(minutes: number) {
  if (minutes === 0) return "same time as you, by the way."
  const abs = Math.abs(minutes)
  const h = Math.floor(abs / 60)
  const m = abs % 60
  const amount = `${h ? `${h} hour${h === 1 ? "" : "s"}` : ""}${h && m ? " " : ""}${m ? `${m} min` : ""}`
  return minutes > 0 ? `you're ${amount} ahead of me.` : `you're ${amount} behind me.`
}

function countryName(code?: string) {
  if (!code) return null
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? null
  } catch {
    return null
  }
}

/**
 * Where a lat/lon lands on the canvas, using cobe's own maths (marker position,
 * rotation matrix and 0.8 radius from its shader). Returns fractions of the canvas
 * size and depth (z > 0 means the front of the globe).
 */
function project(lat: number, lon: number, phi: number, theta: number) {
  const la = (lat * Math.PI) / 180
  const lo = (lon * Math.PI) / 180 - Math.PI
  const a = Math.cos(la)
  const w = [-a * Math.cos(lo), Math.sin(la), a * Math.sin(lo)]
  const c = Math.cos(theta)
  const d = Math.cos(phi)
  const e = Math.sin(theta)
  const f = Math.sin(phi)
  const x = d * w[0] + f * w[2]
  const y = f * e * w[0] + c * w[1] - d * e * w[2]
  const z = -f * c * w[0] + e * w[1] + d * c * w[2]
  return { x: (0.8 * x + 1) / 2, y: (1 - 0.8 * y) / 2, z }
}

const Hi = ({ children }: { children: React.ReactNode }) => <span className="text-foreground">{children}</span>

export function Globe() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const youDot = useRef<HTMLSpanElement>(null)
  const { mode, company } = useVisitor()
  const pointer = useRef<number | null>(null)
  const drag = useRef(0)
  const [here, setHere] = useState<Here>({ home: ACCRA, visitor: null })
  const [loaded, setLoaded] = useState(false)
  const [now, setNow] = useState<Date | null>(null)
  const [visitorTz, setVisitorTz] = useState<string | null>(null)
  const { resolvedTheme } = useTheme()
  const dark = resolvedTheme !== "light"

  // Visitor's time zone comes from their own browser. It never leaves the page.
  useEffect(() => {
    try {
      setVisitorTz(Intl.DateTimeFormat().resolvedOptions().timeZone || null)
    } catch {
      setVisitorTz(null)
    }
    setNow(new Date())
    const id = window.setInterval(() => setNow(new Date()), 15000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    const ctrl = new AbortController()
    fetch("/api/here", { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: Here | null) => data && setHere(data))
      .catch(() => {})
      .finally(() => setLoaded(true))
    return () => ctrl.abort()
  }, [])

  useEffect(() => {
    const el = canvas.current
    if (!el) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let width = el.offsetWidth
    // Start facing the midpoint between the two dots so both are visible.
    const dLon = here.visitor ? ((here.visitor.lon - here.home.lon + 540) % 360) - 180 : 0
    let phi = here.visitor ? facing(here.home.lon + dLon / 2) : facing(here.home.lon) - 0.35
    const onResize = () => (width = el.offsetWidth)
    window.addEventListener("resize", onResize)

    // Only Ben's dot is drawn by cobe (one colour for all markers). The visitor's dot is an
    // orange element placed over the canvas each frame with the same projection.
    const markers = [{ location: [here.home.lat, here.home.lon] as [number, number], size: 0.08 }]
    const visitor = here.visitor

    const globe = createGlobe(el, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi,
      theta: 0.2,
      dark: dark ? 1 : 0,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: dark ? 5 : 8,
      mapBaseBrightness: dark ? 0 : 0.05,
      baseColor: dark ? [0.11, 0.18, 0.21] : [0.93, 0.96, 0.97],
      markerColor: dark ? [0.3, 0.78, 0.81] : [0.04, 0.42, 0.45],
      glowColor: dark ? [0.07, 0.13, 0.15] : [0.84, 0.9, 0.92],
      markers,
      onRender: (state) => {
        if (pointer.current === null && !reduced) phi += 0.0025
        state.phi = phi + drag.current
        state.width = width * 2
        state.height = width * 2
        const dot = youDot.current
        if (dot && visitor) {
          const p = project(visitor.lat, visitor.lon, state.phi, 0.2)
          dot.style.left = `${p.x * 100}%`
          dot.style.top = `${p.y * 100}%`
          dot.style.opacity = String(Math.max(0, Math.min(1, p.z * 5)))
        }
      },
    })
    requestAnimationFrame(() => (el.style.opacity = "1"))

    return () => {
      globe.destroy()
      window.removeEventListener("resize", onResize)
    }
  }, [here, dark])

  const { home, visitor } = here

  return (
    <section id="now" aria-labelledby="now-title" className="wrap scroll-mt-20 py-16 sm:py-20">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <p className="eyebrow relative text-signal">
            <Stop you />
            where you come in
          </p>
          <h2 id="now-title" className="mt-3 text-3xl sm:text-[2.6rem] sm:leading-[1.05]">
            {mode === "recruiter" ? `next stop: ${company ? company : "your team"}` : "next stop: wherever you're headed"}
          </h2>
          <div className="mt-8 space-y-4 text-lg leading-relaxed text-muted-foreground">
            <p aria-live="polite">
              {visitor ? (
                <>
                  you&apos;re reading this from somewhere near{" "}
                  <Hi>
                    {visitor.city}
                    {countryName(visitor.country) ? `, ${countryName(visitor.country)}` : ""}
                  </Hi>
                  {now && visitorTz ? (
                    <>
                      , where it&apos;s <Hi>{clock(now, visitorTz)}</Hi>.
                    </>
                  ) : (
                    "."
                  )}
                </>
              ) : !loaded ? (
                "finding you on the map..."
              ) : now && visitorTz ? (
                <>
                  you&apos;re somewhere on this globe, where it&apos;s <Hi>{clock(now, visitorTz)}</Hi>. that much i know.
                </>
              ) : (
                "you're somewhere on this globe. that much i know."
              )}
            </p>
            <p>
              i&apos;m in <Hi>{home.city.toLowerCase()}</Hi>
              {now && (
                <>
                  , where it&apos;s <Hi>{clock(now, HOME_TZ)}</Hi>
                </>
              )}
              {home.tempC != null && (
                <>
                  {" "}
                  and <Hi>{home.tempC}°C</Hi>
                </>
              )}
              .{now && visitorTz ? ` ${gap(offset(now, visitorTz) - offset(now, HOME_TZ))}` : ""}
            </p>
            <p className="text-foreground">
              {mode === "recruiter"
                ? "every stop on this road added something: data, testing, teaching, then ai. i'd like the next one to be with you."
                : "a few years ago i was a statistics student with a lot of curiosity and no plan. if that road led here, yours can lead somewhere good too."}
            </p>
          </div>
          <HandNote arrow="none" className="mt-8 -rotate-2 text-xl">
            give it a spin
          </HandNote>
          <p className="meta mt-8 max-w-sm leading-relaxed">
            your rough location is worked out from your IP address by my host, shown only to you, and never saved.{" "}
            <Link href="/privacy" className="link">
              privacy
            </Link>
            . weather by{" "}
            <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" className="link">
              open-meteo
            </a>
            .
          </p>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[460px]">
          <canvas
            ref={canvas}
            role="img"
            aria-label={`A dotted globe marking ${home.city}${visitor ? ` and ${visitor.city}` : ""}. Drag to spin it.`}
            className="h-full w-full cursor-grab opacity-0 transition-opacity duration-1000 active:cursor-grabbing motion-reduce:transition-none"
            style={{ contain: "layout paint size", touchAction: "pan-y" }}
            onPointerDown={(e) => {
              pointer.current = e.clientX - drag.current * 200
              e.currentTarget.setPointerCapture(e.pointerId)
            }}
            onPointerUp={() => (pointer.current = null)}
            onPointerCancel={() => (pointer.current = null)}
            onPointerMove={(e) => {
              if (pointer.current !== null) drag.current = (e.clientX - pointer.current) / 200
            }}
          />
          {visitor && (
            <span
              ref={youDot}
              aria-hidden="true"
              className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal opacity-0 ring-4 ring-signal/25"
            />
          )}
          <div className="pointer-events-none absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-4 text-xs text-subtle">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-route" aria-hidden="true" /> me
            </span>
            {visitor && (
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-signal" aria-hidden="true" /> you
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
