import { describe, expect, it } from "vitest"
import { handle, PROTOCOL_VERSIONS, TOOLS } from "@/lib/mcp/server"

const ORIGIN = "https://example.test"
const call = (name: string, args: Record<string, unknown> = {}) =>
  handle({ jsonrpc: "2.0", id: 7, method: "tools/call", params: { name, arguments: args } }, ORIGIN) as {
    result: { isError: boolean; structuredContent: Record<string, unknown>; content: { text: string }[] }
  }

describe("mcp server", () => {
  it("negotiates the protocol version and advertises tools", () => {
    const r = handle({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-03-26" } }, ORIGIN) as { result: Record<string, unknown> }
    expect(r.result.protocolVersion).toBe("2025-03-26")
    expect(r.result.capabilities).toEqual({ tools: { listChanged: false } })
    const unknown = handle({ jsonrpc: "2.0", id: 2, method: "initialize", params: { protocolVersion: "1999-01-01" } }, ORIGIN) as { result: Record<string, unknown> }
    expect(unknown.result.protocolVersion).toBe(PROTOCOL_VERSIONS[0])
  })

  it("lists every tool with a JSON schema", () => {
    const r = handle({ jsonrpc: "2.0", id: 3, method: "tools/list" }, ORIGIN) as { result: { tools: { name: string; inputSchema: { type: string } }[] } }
    expect(r.result.tools.map((t) => t.name)).toEqual(TOOLS.map((t) => t.name))
    for (const t of r.result.tools) expect(t.inputSchema.type).toBe("object")
  })

  it("answers a question with sourced passages", () => {
    const r = call("search_portfolio", { query: "has he led a team?" })
    expect(r.result.isError).toBe(false)
    const results = r.result.structuredContent.results as { title: string; url: string }[]
    expect(results[0].title).toMatch(/Team Lead at CodeRaccoon/)
    expect(results[0].url.startsWith(ORIGIN)).toBe(true)
  })

  it("returns a project's full write-up, and a tool error for an unknown slug", () => {
    expect(call("get_project", { slug: "cravebox" }).result.structuredContent.title).toBe("CraveBox")
    const missing = call("get_project", { slug: "nope" })
    expect(missing.result.isError).toBe(true)
    expect(missing.result.content[0].text).toMatch(/list_projects/)
  })

  it("validates arguments and filters certificates", () => {
    expect(call("search_portfolio", { query: "  " }).result.isError).toBe(true)
    const pro = call("get_certifications", { group: "professional" }).result.structuredContent.certifications as { group: string }[]
    expect(pro.every((c) => c.group === "professional")).toBe(true)
  })

  it("follows JSON-RPC: notifications get no reply, unknown methods and tools are errors", () => {
    expect(handle({ jsonrpc: "2.0", method: "notifications/initialized" }, ORIGIN)).toBeNull()
    expect((handle({ jsonrpc: "2.0", id: 9, method: "nope" }, ORIGIN) as { error: { code: number } }).error.code).toBe(-32601)
    expect((handle({ jsonrpc: "2.0", id: 10, method: "tools/call", params: { name: "nope" } }, ORIGIN) as { error: { code: number } }).error.code).toBe(-32602)
    expect((handle("garbage", ORIGIN) as { error: { code: number } }).error.code).toBe(-32600)
  })
})
