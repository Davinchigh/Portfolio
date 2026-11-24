/**
 * A Model Context Protocol (MCP) server for this portfolio. Any MCP client (Claude Desktop, Claude Code,
 * the MCP Inspector, an agent) can connect to /api/mcp and use these tools to answer questions about
 * Benedict from the site's own data. Stateless JSON-RPC 2.0 over Streamable HTTP; read-only.
 */
import { corpus } from "@/lib/recall/corpus"
import { buildIndex, search, type Index } from "@/lib/recall/search"
import { certifications, degree, person, roles, socials, work } from "@/lib/site"

export const SERVER_INFO = { name: "bfb-portfolio", title: "Benedict Frimpong Boateng's portfolio", version: "1.0.0" }
export const PROTOCOL_VERSIONS = ["2025-06-18", "2025-03-26", "2024-11-05"]

type Json = null | boolean | number | string | Json[] | { [key: string]: Json }
type Args = Record<string, unknown>
export type JsonRpcRequest = { jsonrpc: "2.0"; id?: string | number | null; method: string; params?: Record<string, unknown> }
export type JsonRpcResponse = { jsonrpc: "2.0"; id: string | number | null; result?: unknown; error?: { code: number; message: string } }

type Tool = {
  name: string
  title: string
  description: string
  inputSchema: { type: "object"; properties: Record<string, Json>; required?: string[]; additionalProperties: false }
  run: (args: Args, ctx: Context) => Json
}
type Context = { origin: string; index: Index }

const abs = (origin: string, href: string) => (href.startsWith("http") ? href : `${origin}${href}`)
const text = (value: unknown, name: string, max = 300): string => {
  if (typeof value !== "string" || !value.trim()) throw new ToolError(`"${name}" must be a non-empty string.`)
  return value.trim().slice(0, max)
}

class ToolError extends Error {}

export const TOOLS: Tool[] = [
  {
    name: "search_portfolio",
    title: "Search the portfolio",
    description:
      "Search everything on Benedict's portfolio (projects, roles, certificates, tools, education) and get the passages that answer a question, each with a link to its source. Use this first for any question about him.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "A question or keywords, e.g. 'has he led a team?' or 'FastAPI projects'." },
        limit: { type: "integer", minimum: 1, maximum: 8, description: "How many passages to return (default 4)." },
      },
      required: ["query"],
      additionalProperties: false,
    },
    run: (args, { index, origin }) => {
      const query = text(args.query, "query")
      const limit = typeof args.limit === "number" ? Math.min(8, Math.max(1, Math.floor(args.limit))) : 4
      const hits = search(index, query, limit)
      return {
        query,
        results: hits.map((h) => ({ title: h.doc.title, kind: h.doc.kind, passage: h.snippet, full_text: h.doc.text, url: abs(origin, h.doc.href) })),
      }
    },
  },
  {
    name: "list_projects",
    title: "List projects",
    description: "List every project on the portfolio with its slug, a one-line summary and its tags. Use a slug with get_project for the full write-up.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    run: () => ({ projects: work.map((w) => ({ slug: w.slug, title: w.title, kind: w.org, summary: w.hook, tags: w.tags })) }),
  },
  {
    name: "get_project",
    title: "Get a project",
    description: "The full write-up of one project: the problem, what Benedict did, the result, the tools used and links to try it or read the code.",
    inputSchema: {
      type: "object",
      properties: { slug: { type: "string", description: "The project's slug from list_projects, e.g. 'cravebox'." } },
      required: ["slug"],
      additionalProperties: false,
    },
    run: (args, { origin }) => {
      const slug = text(args.slug, "slug", 80).toLowerCase()
      const w = work.find((p) => p.slug === slug)
      if (!w) throw new ToolError(`No project "${slug}". Call list_projects for the slugs.`)
      return {
        slug: w.slug,
        title: w.title,
        kind: w.org,
        summary: w.hook,
        problem: w.problem,
        what_he_did: w.role,
        result: w.outcome,
        tags: w.tags,
        links: w.links.map((l) => ({ label: l.label, url: abs(origin, l.href) })),
        page: `${origin}/projects#${w.slug}`,
      }
    },
  },
  {
    name: "get_experience",
    title: "Get experience and education",
    description: "Benedict's roles (work, volunteering, leadership), newest first, and his degree.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    run: () => ({
      education: degree,
      roles: roles.map((r) => ({ company: r.company, role: r.role, kind: r.kind, start: r.start, end: r.end, summary: r.summary ?? null, highlights: r.bullets ?? [] })),
    }),
  },
  {
    name: "get_certifications",
    title: "Get certifications",
    description: "Benedict's certificates by issuer, with links to verify them where the issuer allows.",
    inputSchema: {
      type: "object",
      properties: { group: { type: "string", enum: ["professional", "other", "all"], description: "Which certificates (default all)." } },
      additionalProperties: false,
    },
    run: (args, { origin }) => {
      const group = args.group === "professional" || args.group === "other" ? args.group : "all"
      return {
        certifications: certifications
          .filter((c) => group === "all" || c.group === group)
          .map((c) => ({ issuer: c.issuer, year: c.year, group: c.group, items: c.items, verify: c.doc?.verify ?? null, pdf: c.doc?.pdf ? abs(origin, c.doc.pdf) : null })),
      }
    },
  },
  {
    name: "get_contact",
    title: "Get contact details",
    description: "How to reach Benedict, whether he is available, and where to download his CV.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    run: (_args, { origin }) => ({
      name: person.fullName,
      role: person.role,
      location: person.location,
      availability: person.status,
      email: person.email,
      cv: abs(origin, person.cv),
      links: socials.map((s) => ({ label: s.label, url: s.href })),
    }),
  },
]

let cachedIndex: Index | null = null
const getIndex = () => (cachedIndex ??= buildIndex(corpus()))

const ok = (id: JsonRpcResponse["id"], result: unknown): JsonRpcResponse => ({ jsonrpc: "2.0", id, result })
const fail = (id: JsonRpcResponse["id"], code: number, message: string): JsonRpcResponse => ({ jsonrpc: "2.0", id, error: { code, message } })

/** Handles one JSON-RPC message. Returns null for notifications, which get no reply. */
export function handle(message: unknown, origin: string): JsonRpcResponse | null {
  if (!message || typeof message !== "object" || Array.isArray(message)) return fail(null, -32600, "Invalid request")
  const req = message as Partial<JsonRpcRequest>
  const isNotification = !("id" in req)
  const id = (req.id ?? null) as JsonRpcResponse["id"]
  if (req.jsonrpc !== "2.0" || typeof req.method !== "string") return isNotification ? null : fail(id, -32600, "Invalid request")
  if (isNotification) return null

  switch (req.method) {
    case "initialize": {
      const asked = typeof req.params?.protocolVersion === "string" ? req.params.protocolVersion : ""
      return ok(id, {
        protocolVersion: PROTOCOL_VERSIONS.includes(asked) ? asked : PROTOCOL_VERSIONS[0],
        capabilities: { tools: { listChanged: false } },
        serverInfo: SERVER_INFO,
        instructions:
          "Tools for answering questions about Benedict Frimpong Boateng, an AI engineer and software developer in Accra. Start with search_portfolio; use get_project for detail. Everything comes from his portfolio site, with source links.",
      })
    }
    case "ping":
      return ok(id, {})
    case "tools/list":
      return ok(id, { tools: TOOLS.map(({ name, title, description, inputSchema }) => ({ name, title, description, inputSchema })) })
    case "tools/call": {
      const name = req.params?.name
      const tool = TOOLS.find((t) => t.name === name)
      if (!tool) return fail(id, -32602, `Unknown tool: ${String(name)}`)
      const args = (req.params?.arguments ?? {}) as Args
      if (typeof args !== "object" || Array.isArray(args)) return fail(id, -32602, "Arguments must be an object")
      try {
        const data = tool.run(args, { origin, index: getIndex() })
        return ok(id, { content: [{ type: "text", text: JSON.stringify(data, null, 2) }], structuredContent: data, isError: false })
      } catch (e) {
        if (e instanceof ToolError) return ok(id, { content: [{ type: "text", text: e.message }], isError: true })
        return fail(id, -32603, "Internal error")
      }
    }
    default:
      return fail(id, -32601, `Method not found: ${req.method}`)
  }
}
