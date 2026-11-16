"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ArrowRight, Search } from "lucide-react"
import { buildIndex, highlight, search, type Doc } from "@/lib/recall/search"

const SUGGESTIONS = [
  "has he led a team?",
  "any SAP experience?",
  "projects with workflow automation",
  "what did he build with FastAPI?",
  "which certificates are from Anthropic?",
  "how can I contact him?",
]

export function RecallDemo({ docs }: { docs: Doc[] }) {
  const index = useMemo(() => buildIndex(docs), [docs])
  const [query, setQuery] = useState(SUGGESTIONS[0])
  const hits = useMemo(() => search(index, query, 4), [index, query])
  const top = hits[0]?.score ?? 1

  return (
    <div className="rounded-2xl border bg-card p-5 sm:p-8">
      <label htmlFor="recall-q" className="eyebrow block">
        ask about my work
      </label>
      <div className="relative mt-3">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-subtle" aria-hidden="true" />
        <input
          id="recall-q"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
          placeholder="type a question"
          className="h-14 w-full rounded-xl border bg-background pl-12 pr-4 text-lg outline-none focus-visible:ring-2 focus-visible:ring-amber"
        />
      </div>
      <ul className="mt-3 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <li key={s}>
            <button
              type="button"
              onClick={() => setQuery(s)}
              aria-pressed={query === s}
              className={`min-h-9 rounded-full border px-3 text-xs transition-colors hover:border-route/60 hover:text-foreground ${
                query === s ? "border-route/60 text-foreground" : "text-muted-foreground"
              }`}
            >
              {s}
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-8" aria-live="polite">
        {hits.length === 0 ? (
          <p className="text-muted-foreground">
            {query.trim() ? "nothing on this site matches that. try other words, or one of the questions above." : "type a question to search the site."}
          </p>
        ) : (
          <ol key={query} className="space-y-3">
            {hits.map((hit, i) => (
              <li
                key={hit.doc.id}
                className={`swap-in rounded-xl border p-4 sm:p-5 ${i === 0 ? "border-route/50 bg-background" : "bg-background/50"}`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                  <p className="meta flex items-center gap-2">
                    <span className={i === 0 ? "text-route" : ""}>{i === 0 ? "best match" : `match ${i + 1}`}</span>
                    <span aria-hidden="true">/</span>
                    <span>{hit.doc.kind}</span>
                  </p>
                  <span className="flex items-center gap-2" title={`relevance score ${hit.score.toFixed(2)}`}>
                    <span className="h-1 w-16 overflow-hidden rounded-full bg-muted">
                      <span className="block h-full rounded-full bg-route" style={{ width: `${(hit.score / top) * 100}%` }} />
                    </span>
                    <span className="meta tabular-nums">{hit.score.toFixed(1)}</span>
                  </span>
                </div>
                <h3 className={`mt-2 ${i === 0 ? "text-xl" : "text-base"}`}>{hit.doc.title}</h3>
                <p className={`mt-2 leading-relaxed text-muted-foreground ${i === 0 ? "text-[17px]" : "text-sm"}`}>
                  {highlight(hit.snippet, hit.matched).map((piece, n) =>
                    piece.hit ? (
                      <mark key={n} className="rounded bg-route/20 px-0.5 text-foreground">
                        {piece.text}
                      </mark>
                    ) : (
                      piece.text
                    ),
                  )}
                </p>
                <Link href={hit.doc.href} className="link mt-3 inline-flex min-h-11 items-center gap-1 text-sm">
                  see it on the site <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}
