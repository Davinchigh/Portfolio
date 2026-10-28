"use client"

import { useEffect, useRef, useState } from "react"
import createGlobe from "cobe"
import Link from "next/link"
import { useTheme } from "next-themes"
import { HandNote } from "@/components/site/hand-note"

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

const Hi = ({ children }: { children: React.ReactNode }) => <span className="text-foreground">{children}</span>

export function Globe() {
  const canvas = useRef<HTMLCanvasElement>(null)
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

    const markers = [{ location: [here.home.lat, here.home.lon] as [number, number], size: 0.08 }]
    if (here.visitor) markers.push({ location: [here.visitor.lat, here.visitor.lon], size: 0.06 })

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
      baseColor: dark ? [0.18, 0.18, 0.17] : [0.95, 0.94, 0.92],
      markerColor: dark ? [0.98, 0.75, 0.14] : [0.7, 0.33, 0.04],
      glowColor: dark ? [0.12, 0.12, 0.11] : [0.88, 0.87, 0.84],
      markers,
      onRender: (state) => {
        if (pointer.current === null && !reduced) phi += 0.0025
        state.phi = phi + drag.current
        state.width = width * 2
        state.height = width * 2
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
          <p className="eyebrow">right now</p>
          <h2 id="now-title" className="mt-3 text-3xl sm:text-4xl">
            two dots on a globe
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
          <div className="pointer-events-none absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-4 font-mono text-[11px] text-subtle">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber" aria-hidden="true" /> me
            </span>
            {visitor && (
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber/70" aria-hidden="true" /> you
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
