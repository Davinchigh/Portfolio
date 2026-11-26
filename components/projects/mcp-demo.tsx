"use client"

import { useEffect, useState } from "react"
import { Check, Copy, Play } from "lucide-react"

type Example = { label: string; method: string; params?: Record<string, unknown> }

const EXAMPLES: Example[] = [
  { label: "initialize", method: "initialize", params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "portfolio-demo", version: "1.0.0" } } },
  { label: "tools/list", method: "tools/list" },
  { label: "search: has he led a team?", method: "tools/call", params: { name: "search_portfolio", arguments: { query: "has he led a team?", limit: 2 } } },
  { label: "get_project: cravebox", method: "tools/call", params: { name: "get_project", arguments: { slug: "cravebox" } } },
  { label: "get_contact", method: "tools/call", params: { name: "get_contact", arguments: {} } },
]

function CopyLine({ text }: { text: string }) {
  const [done, setDone] = useState(false)
  return (
    <div className="flex items-center gap-2 rounded-xl border bg-background px-3 py-2 font-mono text-[12.5px]">
      <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap">{text}</code>
      <button
        type="button"
        onClick={() => navigator.clipboard.writeText(text).then(() => { setDone(true); setTimeout(() => setDone(false), 1500) })}
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
        aria-label="Copy"
      >
        {done ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  )
}

/** Connect instructions with this site's real address, and a console that sends real JSON-RPC to /api/mcp. */
export function McpDemo() {
  const [origin, setOrigin] = useState("https://<this site>")
  const [pick, setPick] = useState(2)
  const [reply, setReply] = useState<string>("")
  const [busy, setBusy] = useState(false)
  useEffect(() => setOrigin(window.location.origin), [])

  const request = { jsonrpc: "2.0", id: pick + 1, method: EXAMPLES[pick].method, ...(EXAMPLES[pick].params ? { params: EXAMPLES[pick].params } : {}) }

  const send = async () => {
    setBusy(true)
    try {
      const res = await fetch("/api/mcp", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json, text/event-stream" }, body: JSON.stringify(request) })
      const data = await res.json()
      // tools/call repeats the data as text for older clients; show the structured copy to keep it readable.
      if (data?.result?.structuredContent) data.result.content = [{ type: "text", text: "(same data as structuredContent)" }]
      setReply(JSON.stringify(data, null, 2))
    } catch {
      setReply("Couldn't reach the server. Check your connection and try again.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid gap-10">
      <div>
        <h2 className="text-lg">connect it</h2>
        <p className="mt-1 text-sm text-muted-foreground">in claude code:</p>
        <div className="mt-2">
          <CopyLine text={`claude mcp add --transport http bfb ${origin}/api/mcp`} />
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          in claude desktop or claude.ai, add a custom connector with this url. any other mcp client works too.
        </p>
        <div className="mt-2">
          <CopyLine text={`${origin}/api/mcp`} />
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-5 sm:p-6">
        <h2 className="text-lg">try it here</h2>
        <p className="mt-1 text-sm text-muted-foreground">pick a message, send it, and see exactly what an ai client gets back.</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {EXAMPLES.map((e, i) => (
            <li key={e.label}>
              <button
                type="button"
                onClick={() => {
                  setPick(i)
                  setReply("")
                }}
                aria-pressed={pick === i}
                className={`min-h-9 rounded-full border px-3 font-mono text-xs transition-colors ${pick === i ? "border-route/70 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {e.label}
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="min-w-0">
            <p className="eyebrow">request</p>
            <pre className="mt-2 max-h-80 overflow-auto rounded-xl border bg-background p-4 font-mono text-[12px] leading-relaxed">{JSON.stringify(request, null, 2)}</pre>
            <button type="button" onClick={send} disabled={busy} className="pill-button mt-3 disabled:opacity-60">
              <Play className="h-4 w-4" aria-hidden="true" /> {busy ? "sending" : "send"}
            </button>
          </div>
          <div className="min-w-0" aria-live="polite">
            <p className="eyebrow">response</p>
            <pre className="mt-2 max-h-96 min-h-40 overflow-auto rounded-xl border bg-background p-4 font-mono text-[12px] leading-relaxed text-muted-foreground">
              {reply || "send a message to see the reply."}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
