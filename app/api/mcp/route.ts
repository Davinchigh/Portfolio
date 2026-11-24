import { type NextRequest } from "next/server"
import { handle, SERVER_INFO } from "@/lib/mcp/server"

/**
 * The portfolio as an MCP server (Streamable HTTP, stateless, read-only).
 * Connect with: claude mcp add --transport http bfb https://<this site>/api/mcp
 * Everything it returns is public on this site; nothing is stored or logged.
 */

export const dynamic = "force-dynamic"

const MAX_BYTES = 64 * 1024
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept, Mcp-Session-Id, Mcp-Protocol-Version",
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...CORS } })

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS })
}

/** A plain GET gets a short description, so a person who opens the URL sees what it is. */
export function GET() {
  return json({ ...SERVER_INFO, protocol: "MCP over Streamable HTTP. POST JSON-RPC 2.0 messages to this URL.", docs: "/projects/mcp" })
}

export async function POST(req: NextRequest) {
  const raw = await req.text()
  if (raw.length > MAX_BYTES) return json({ jsonrpc: "2.0", id: null, error: { code: -32600, message: "Request too large" } }, 413)

  let body: unknown
  try {
    body = JSON.parse(raw)
  } catch {
    return json({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } }, 400)
  }

  const origin = new URL(req.url).origin
  if (Array.isArray(body)) {
    if (body.length === 0 || body.length > 20) return json({ jsonrpc: "2.0", id: null, error: { code: -32600, message: "Invalid batch" } }, 400)
    const replies = body.map((m) => handle(m, origin)).filter(Boolean)
    return replies.length ? json(replies) : new Response(null, { status: 202, headers: CORS })
  }
  const reply = handle(body, origin)
  return reply ? json(reply) : new Response(null, { status: 202, headers: CORS })
}
