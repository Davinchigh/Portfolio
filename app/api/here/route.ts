import { NextResponse, type NextRequest } from "next/server"

/**
 * "Two dots on a globe": where the visitor roughly is (from Vercel's IP geolocation headers)
 * and where Ben is, with the current temperature in each place from Open-Meteo.
 * Nothing is stored. The visitor's city is only sent back to that visitor.
 */

export const dynamic = "force-dynamic"

const HOME = { city: "Accra", country: "GH", lat: 5.6037, lon: -0.187 }

type Place = { city: string; country?: string; lat: number; lon: number; tempC: number | null }

async function temperature(lat: number, lon: number): Promise<number | null> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(2)}&longitude=${lon.toFixed(2)}&current=temperature_2m`
    const res = await fetch(url, { next: { revalidate: 600 }, signal: AbortSignal.timeout(2500) })
    if (!res.ok) return null
    const data = (await res.json()) as { current?: { temperature_2m?: number } }
    const t = data.current?.temperature_2m
    return typeof t === "number" ? Math.round(t) : null
  } catch {
    return null
  }
}

export async function GET(req: NextRequest) {
  const h = req.headers
  const lat = Number(h.get("x-vercel-ip-latitude"))
  const lon = Number(h.get("x-vercel-ip-longitude"))
  const cityRaw = h.get("x-vercel-ip-city")
  const city = cityRaw ? decodeURIComponent(cityRaw) : null
  const hasVisitor = Number.isFinite(lat) && Number.isFinite(lon) && (lat !== 0 || lon !== 0) && Boolean(city)

  const [homeTemp, visitorTemp] = await Promise.all([
    temperature(HOME.lat, HOME.lon),
    hasVisitor ? temperature(lat, lon) : Promise.resolve(null),
  ])

  const home: Place = { ...HOME, tempC: homeTemp }
  const visitor: Place | null = hasVisitor
    ? { city: city!, country: h.get("x-vercel-ip-country") ?? undefined, lat, lon, tempC: visitorTemp }
    : null

  return NextResponse.json({ home, visitor }, { headers: { "Cache-Control": "private, no-store" } })
}
