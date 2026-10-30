// Lizab sales agent toolbox. One endpoint for every brain that sells for Lizab:
// the website chat, WhatsApp, and the phone agent (Vapi-style tool calls are understood too).
//
//   GET  /agent-api            -> the tool list with JSON schemas (paste into any agent platform)
//   POST /agent-api            -> { "tool": "check_stock", "args": { ... } }
//   POST /agent-api (Vapi)     -> { "message": { "type": "tool-calls", "toolCallList": [...] } }
//
// Every call needs the header  x-agent-token: <token>  (only its SHA-256 is stored, in agent_tokens).

const URL_ = Deno.env.get("SUPABASE_URL")!
const KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!

type Spec = { description: string; rpc: string; params: Record<string, { type: string; description: string; enum?: string[]; items?: unknown }>; required: string[] }

const CHANNELS = ["web", "web_chat", "whatsapp", "phone", "instagram", "walk_in", "staff"]
const TOOLS: Record<string, Spec> = {
  shop_info: { description: "Opening hours and the current date and time in Accra.", rpc: "shop_info", params: {}, required: [] },
  catalogue: {
    description: "List pieces with prices, availability, lead times and every colour and size with how many are in stock. Use it before recommending anything.",
    rpc: "catalogue",
    params: {
      p_query: { type: "string", description: "Optional words to search for, e.g. 'suit' or 'dress'." },
      p_collection: { type: "string", description: "Optional collection.", enum: ["women", "men", "bags-shoes", "new-in"] },
    },
    required: [],
  },
  check_stock: {
    description: "Check one item by its code (e.g. LZ-W-001), optionally for a colour and size.",
    rpc: "check_stock",
    params: {
      p_code: { type: "string", description: "Item code, e.g. LZ-B-001." },
      p_colour: { type: "string", description: "Optional colour." },
      p_size: { type: "string", description: "Optional size exactly as listed, e.g. 'UK 12' or 'EU 39'." },
    },
    required: ["p_code"],
  },
  place_order: {
    description: "Place an order. Items in stock are reserved; made-to-order items become a pre-order with a ready-by date. Nothing is charged: Lizab confirms on WhatsApp before payment. Read the order back and get a clear yes before calling.",
    rpc: "place_order",
    params: {
      p_name: { type: "string", description: "Customer's full name." },
      p_phone: { type: "string", description: "Customer's phone or WhatsApp number." },
      p_items: { type: "array", description: "Items to order.", items: { type: "object", properties: { code: { type: "string" }, colour: { type: "string" }, size: { type: "string" }, qty: { type: "integer" } }, required: ["code", "colour", "size"] } },
      p_channel: { type: "string", description: "Where the conversation is happening.", enum: CHANNELS },
      p_delivery: { type: "string", description: "Pick-up or delivery.", enum: ["pickup", "delivery_accra", "delivery_ghana", "delivery_international", "tbc"] },
      p_address: { type: "string", description: "Delivery address or area, if delivering." },
      p_notes: { type: "string", description: "Anything else: measurements, occasion, deadline." },
      p_email: { type: "string", description: "Optional email." },
    },
    required: ["p_name", "p_phone", "p_items", "p_channel"],
  },
  order_status: {
    description: "Look up an order by its reference (e.g. LZ26-0007). The phone number must match the order.",
    rpc: "order_status",
    params: { p_ref: { type: "string", description: "Order reference." }, p_phone: { type: "string", description: "The phone number on the order." } },
    required: ["p_ref", "p_phone"],
  },
  available_slots: {
    description: "Free appointment times on a date (Accra time).",
    rpc: "available_slots",
    params: {
      p_date: { type: "string", description: "Date as YYYY-MM-DD." },
      p_kind: { type: "string", description: "Type of appointment.", enum: ["fitting", "measurement", "collection", "consultation"] },
    },
    required: ["p_date"],
  },
  book_appointment: {
    description: "Book a fitting, measurement, collection or consultation at a free time from available_slots. Confirm the day and time with the customer first.",
    rpc: "book_appointment",
    params: {
      p_name: { type: "string", description: "Customer's full name." },
      p_phone: { type: "string", description: "Customer's phone or WhatsApp number." },
      p_kind: { type: "string", description: "Type of appointment.", enum: ["fitting", "measurement", "collection", "consultation"] },
      p_date: { type: "string", description: "Date as YYYY-MM-DD." },
      p_time: { type: "string", description: "Start time as HH:MM, exactly as returned by available_slots." },
      p_channel: { type: "string", description: "Where the conversation is happening.", enum: CHANNELS },
      p_notes: { type: "string", description: "What it is for." },
    },
    required: ["p_name", "p_phone", "p_kind", "p_date", "p_time", "p_channel"],
  },
  request_callback: {
    description: "Hand over to a person: custom designs, bulk or bridal orders, price questions you cannot answer, complaints, or whenever the customer asks for a human.",
    rpc: "request_callback",
    params: {
      p_name: { type: "string", description: "Customer's name." },
      p_phone: { type: "string", description: "Customer's phone or WhatsApp number." },
      p_reason: { type: "string", description: "What they need, in one or two sentences." },
      p_kind: { type: "string", description: "Type of request.", enum: ["callback", "custom_request", "complaint"] },
    },
    required: ["p_name", "p_phone", "p_reason"],
  },
  log_interaction: {
    description: "At the end of every conversation, log a one-paragraph summary for the Lizab team.",
    rpc: "log_interaction",
    params: {
      p_channel: { type: "string", description: "Channel.", enum: CHANNELS },
      p_summary: { type: "string", description: "What the customer wanted and what happened." },
      p_outcome: { type: "string", description: "Outcome.", enum: ["sale", "preorder", "booking", "question", "callback", "complaint", "other"] },
      p_phone: { type: "string", description: "Customer phone, if given." },
      p_name: { type: "string", description: "Customer name, if given." },
      p_order_ref: { type: "string", description: "Order reference, if any." },
      p_booking_ref: { type: "string", description: "Booking reference, if any." },
    },
    required: ["p_channel", "p_summary"],
  },
}

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, x-agent-token, authorization, apikey",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
}
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } })

async function sha256(s: string) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s))
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, "0")).join("")
}

async function rest(path: string, init: RequestInit = {}) {
  const r = await fetch(`${URL_}/rest/v1/${path}`, { ...init, headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json", ...(init.headers ?? {}) } })
  const text = await r.text()
  let body: unknown = text
  try { body = JSON.parse(text) } catch { /* plain text */ }
  return { ok: r.ok, body }
}

async function authorised(req: Request) {
  const t = req.headers.get("x-agent-token") ?? new URL(req.url).searchParams.get("token")
  if (!t || t.length < 20) return false
  const h = await sha256(t)
  const r = await rest(`agent_tokens?select=id&active=eq.true&token_sha256=eq.${h}`)
  return r.ok && Array.isArray(r.body) && r.body.length > 0
}

async function run(tool: string, args: Record<string, unknown>) {
  const spec = TOOLS[tool]
  if (!spec) return { error: `Unknown tool ${tool}` }
  for (const k of spec.required) if (args[k] === undefined || args[k] === null || args[k] === "") return { error: `Missing ${k}` }
  const clean: Record<string, unknown> = {}
  for (const k of Object.keys(spec.params)) {
    let v = args[k]
    if (v === undefined || v === null || v === "") continue
    // some agent platforms send arrays as JSON text
    if (spec.params[k].type === "array" && typeof v === "string") { try { v = JSON.parse(v) } catch { return { error: `${k} must be a list` } } }
    clean[k] = v
  }
  const r = await rest(`rpc/${spec.rpc}`, { method: "POST", body: JSON.stringify(clean) })
  if (r.ok) return r.body
  // Postgres raise exception messages are written for customers, pass them through
  const msg = (r.body as { message?: string })?.message ?? "Something went wrong."
  return { error: msg }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors })
  if (req.method === "GET") {
    return json({
      tools: Object.entries(TOOLS).map(([name, s]) => ({
        type: "function",
        function: { name, description: s.description, parameters: { type: "object", properties: s.params, required: s.required } },
      })),
    })
  }
  if (!(await authorised(req))) return json({ error: "Unauthorised" }, 401)
  let body: Record<string, any>
  try { body = await req.json() } catch { return json({ error: "Send JSON" }, 400) }

  // Vapi and similar voice platforms: a batch of tool calls
  const calls = body?.message?.toolCallList ?? body?.message?.toolCalls
  if (Array.isArray(calls)) {
    const results = await Promise.all(calls.map(async (c: any) => {
      const fn = c.function ?? c
      let a = fn.arguments ?? fn.parameters ?? {}
      if (typeof a === "string") { try { a = JSON.parse(a) } catch { a = {} } }
      if (a.p_channel === undefined && TOOLS[fn.name]?.params.p_channel) a.p_channel = "phone"
      return { toolCallId: c.id, result: JSON.stringify(await run(fn.name, a)) }
    }))
    return json({ results })
  }

  // { tool, args } or flat { tool, p_code: ... }
  const tool = body.tool ?? body.name
  let args = body.args ?? body.arguments
  if (args === undefined) { const { tool: _t, name: _n, ...rest } = body; args = rest }
  if (typeof args === "string") { try { args = JSON.parse(args) } catch { args = {} } }
  return json(await run(tool, args))
})
