// Gives a website visitor a short-lived ticket to talk to Esi by voice (LiveKit room + Esi dispatched into it).
// Secrets (set in Supabase > Edge Functions > Secrets): LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET.

const LK_URL = Deno.env.get("LIVEKIT_URL") ?? ""
const LK_KEY = Deno.env.get("LIVEKIT_API_KEY") ?? ""
const LK_SECRET = Deno.env.get("LIVEKIT_API_SECRET") ?? ""
const ALLOWED = ["https://lizab-house-of-fashion.vercel.app", "https://lizabhouseoffashion.com", "http://localhost:3200"]

const b64url = (b: ArrayBuffer | Uint8Array | string) => {
  const bytes = typeof b === "string" ? new TextEncoder().encode(b) : new Uint8Array(b instanceof ArrayBuffer ? b : b.buffer)
  let s = ""
  for (const x of bytes) s += String.fromCharCode(x)
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

async function sign(payload: Record<string, unknown>) {
  const head = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }))
  const body = b64url(JSON.stringify(payload))
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(LK_SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"])
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${head}.${body}`))
  return `${head}.${body}.${b64url(sig)}`
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin") ?? ""
  const cors = {
    "Access-Control-Allow-Origin": ALLOWED.includes(origin) ? origin : ALLOWED[0],
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
    Vary: "Origin",
  }
  if (req.method === "OPTIONS") return new Response(null, { headers: cors })
  if (req.method !== "POST" || !ALLOWED.includes(origin)) return new Response("Forbidden", { status: 403, headers: cors })
  if (!LK_URL || !LK_KEY || !LK_SECRET) return Response.json({ error: "Voice is not set up yet." }, { status: 503, headers: cors })

  const now = Math.floor(Date.now() / 1000)
  const room = `esi-${crypto.randomUUID()}`
  const identity = `visitor-${crypto.randomUUID().slice(0, 8)}`
  const token = await sign({
    iss: LK_KEY,
    sub: identity,
    nbf: now - 10,
    exp: now + 15 * 60, // a call ticket lasts 15 minutes
    name: "Website visitor",
    video: { room, roomJoin: true, canPublish: true, canSubscribe: true, canPublishData: true },
    roomConfig: { agents: [{ agentName: "esi" }] },
  })
  return Response.json({ url: LK_URL, token, room }, { headers: cors })
})
