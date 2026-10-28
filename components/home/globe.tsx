"use client"

import { useEffect, useRef, useState } from "react"
import createGlobe from "cobe"
import { useTheme } from "next-themes"
import { HandNote } from "@/components/site/hand-note"

type Place = { city: string; country?: string; lat: number; lon: number; tempC: number | null }
type Here = { home: Place; visitor: Place | null }

const ACCRA: Place = { city: "Accra", country: "GH", lat: 5.6037, lon: -0.187, tempC: null }

/** Longitude in degrees to the globe's phi angle so that place faces the viewer (cobe's convention). */
const facing = (lon: number) => Math.PI - ((lon * Math.PI) / 180 - Math.PI / 2)

function Temp({ value }: { value: number | null }) {
  return value === null ? null : <span className="text-foreground">{value}°C</span>
}

export function Globe() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const pointer = useRef<number | null>(null)
  const drag = useRef(0)
  const [here, setHere] = useState<Here>({ home: ACCRA, visitor: null })
  const [loaded, setLoaded] = useState(false)
  const { resolvedTheme } = useTheme()
  const dark = resolvedTheme !== "light"

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
    let phi = facing(here.home.lon) - 0.35
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
          <div className="mt-8 space-y-4 text-lg leading-relaxed text-muted-foreground" aria-live="polite">
            {visitor ? (
              <p>
                you&apos;re reading this from somewhere near <span className="text-foreground">{visitor.city}</span>
                {visitor.tempC !== null && (
                  <>
                    , where it&apos;s <Temp value={visitor.tempC} /> right now
                  </>
                )}
                .
              </p>
            ) : (
              <p>{loaded ? "wherever you're reading this from, hello." : "finding you on the map..."}</p>
            )}
            <p>
              i&apos;m in <span className="text-foreground">{home.city.toLowerCase()}</span>
              {home.tempC !== null && (
                <>
                  , where it&apos;s <Temp value={home.tempC} />
                </>
              )}
              .{visitor && visitor.city.toLowerCase() !== "accra" ? " not that far, really." : ""}
            </p>
          </div>
          <HandNote arrow="none" className="mt-8 -rotate-2 text-xl">
            give it a spin
          </HandNote>
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
