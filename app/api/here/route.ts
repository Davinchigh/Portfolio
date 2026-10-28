import { NextResponse, type NextRequest } from "next/server"

/**
 * "Two dots on a globe": roughly where the visitor is and where Ben is.
 *
 * Privacy:
 * - The visitor's city comes from Vercel's IP geolocation headers. Their IP address itself is never read here.
 * - Coordinates are rounded to 1 decimal (about 10 km) before being sent back.
 * - Nothing is stored or logged, and the result only goes back to the same visitor (no-store).
 * - No visitor data is sent to any third party. Only Ben's fixed Accra coordinates go to Open-Meteo.
 */

export const dynamic = "force-dynamic"

const HOME = { city: "Accra", country: "GH", lat: 5.6037, lon: -0.187, timeZone: "Africa/Accra" }

type Place = { city: string; country?: string; lat: number; lon: number; tempC?: number | null; timeZone?: string }

const round1 = (n: number) => Math.round(n * 10) / 10

async function accraTemperature(): Promise<number | null> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${HOME.lat}&longitude=${HOME.lon}&current=temperature_2m`
    // Same URL for every visitor, so the cache serves it: roughly one upstream call every 10 minutes.
    const res = await fetch(url, { next: { revalidate: 600 }, signal: AbortSignal.timeout(2500) })
    if (!res.ok) return null
    const data = (await res.json()) as { current?: { temperature_2m?: number } }
    const t = data.current?.temperature_2m
    return typeof t === "number" ? Math.round(t) : null
  } catch {
    return null
  }
}

function safeDecode(v: string | null) {
  if (!v) return null
  try {
    return decodeURIComponent(v)
  } catch {
    return v
  }
}

export async function GET(req: NextRequest) {
  const h = req.headers
  const lat = Number(h.get("x-vercel-ip-latitude"))
  const lon = Number(h.get("x-vercel-ip-longitude"))
  const city = safeDecode(h.get("x-vercel-ip-city"))
  const hasVisitor = Boolean(city) && Number.isFinite(lat) && Number.isFinite(lon) && (lat !== 0 || lon !== 0)

  const home: Place = { ...HOME, tempC: await accraTemperature() }
  const visitor: Place | null = hasVisitor
    ? { city: city!, country: h.get("x-vercel-ip-country") ?? undefined, lat: round1(lat), lon: round1(lon) }
    : null

  return NextResponse.json({ home, visitor }, { headers: { "Cache-Control": "private, no-store" } })
}
