import type { Metadata } from "next"
import { Notes, ProjectPage } from "@/components/projects/project-page"
import { McpDemo } from "@/components/projects/mcp-demo"
import { TOOLS } from "@/lib/mcp/server"

export const metadata: Metadata = {
  title: "An MCP server for this portfolio | Benedict Frimpong Boateng",
  description: "Connect Claude or any MCP client to this site and ask it about my work. Six read-only tools over the site's own data, live at /api/mcp.",
}

export default function McpPage() {
  return (
    <ProjectPage
      eyebrow="project, ai agents and mcp"
      title="bfb mcp server"
      intro="this portfolio is also an mcp server. connect claude, or any agent that speaks the model context protocol, and it can search my work, open a project, read my experience and certificates, and find how to reach me. everything comes from this site, with links back to the source."
      code="https://github.com/Davinchigh/Portfolio/tree/main/lib/mcp"
    >
      <section className="mt-12" aria-label="Connect and try it">
        <McpDemo />
      </section>

      <section className="mt-20" aria-labelledby="tools-title">
        <p className="eyebrow">what an agent can do with it</p>
        <h2 id="tools-title" className="mt-3 text-3xl sm:text-[2.6rem] sm:leading-[1.05]">
          six tools
        </h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {TOOLS.map((t) => (
            <li key={t.name} className="rounded-2xl border bg-card p-5">
              <p className="font-mono text-sm text-route">{t.name}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.description}</p>
              {Object.keys(t.inputSchema.properties).length > 0 && (
                <p className="meta mt-3">takes: {Object.keys(t.inputSchema.properties).join(", ")}</p>
              )}
            </li>
          ))}
        </ul>
      </section>

      <Notes
        items={[
          {
            title: "the protocol, by hand",
            body: "stateless json-rpc 2.0 over streamable http, with version negotiation, notifications and batches. no sdk: about 200 lines, so every part of the protocol is visible.",
          },
          {
            title: "retrieval it can trust",
            body: "search_portfolio runs recall, the bm25 engine with its own evaluation set, so an agent gets real passages with sources instead of a guess.",
          },
          {
            title: "safe to leave open",
            body: "read-only and public data only: no keys, nothing stored or logged, a 64 kb request limit, and tool errors that tell the agent what to do next.",
          },
        ]}
      />
    </ProjectPage>
  )
}
