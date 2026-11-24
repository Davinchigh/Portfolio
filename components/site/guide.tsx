"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, ArrowUp, Sparkles, X } from "lucide-react"
import { LogoMark } from "@/components/site/logo"
import { corpus } from "@/lib/recall/corpus"
import { buildIndex, search, type Hit } from "@/lib/recall/search"

type Turn = { from: "you" | "guide"; text: string; hits?: Hit[] }

const STARTERS = ["what does he do?", "show me his best project", "has he led a team?", "what has he built with ai?", "is he available to hire?"]

/** Phrases a visitor might use that the search should read as something more specific. */
const REWRITE: [RegExp, string][] = [
  [/best (project|work)|proudest|favourite project|most impressive/i, "bakery ordering site 3d cake builder cravebox"],
  [/(available|hire|hiring|open to work|looking for)/i, "contact availability open to full time freelance"],
  [/(what does he do|who is|about him|about you|tell me about)/i, "ai engineer prompt engineer software developer accra"],
  [/(with ai|ai projects|llm|claude)/i, "built assistant workflow automation classifier test plan claude api voice"],
  [/(do|did|work|worked|role) (at|for|with) /i, "role experience job"],
  [/(stud(y|ied)|university|degree|education|school|college)/i, "studied statistics computer science university of ghana legon"],
]

function answer(hits: Hit[], question: string): Turn {
  if (hits.length === 0)
    return {
      from: "guide",
      text: "i couldn't find that on this site. try asking about a project, a role, a tool or a certificate, or reach him through the contact section.",
    }
  const [top] = hits
  // For a project or a role, lead with what it is; otherwise with the sentence that matches best.
  const firstSentence = top.doc.text.split(/(?<=[.!?])\s+/)[0]
  const lead = /contact|availab|hire/i.test(question)
    ? top.doc.text
    : ["project", "experience", "side project", "app you can try", "design work"].includes(top.doc.kind)
      ? firstSentence
      : top.snippet
  return { from: "guide", text: lead, hits }
}

/**
 * A small guide that answers questions about Benedict from this site's own content.
 * It runs Recall (the BM25 search engine on /projects/recall) in the browser: every answer is a
 * real passage from the site with a link to where it lives, nothing is generated or sent anywhere.
 */
export function Guide() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState("")
  const [turns, setTurns] = useState<Turn[]>([])
  const index = useMemo(() => (open ? buildIndex(corpus()) : null), [open])
  const input = useRef<HTMLInputElement>(null)
  const button = useRef<HTMLButtonElement>(null)
  const log = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    input.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false)
        button.current?.focus()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight, behavior: "smooth" })
  }, [turns])

  const ask = (question: string) => {
    const text = question.trim()
    if (!text || !index) return
    const rewritten = REWRITE.reduce((acc, [re, extra]) => (re.test(text) ? `${acc} ${extra}` : acc), text)
    const hits = search(index, rewritten, 3)
    setTurns((t) => [...t, { from: "you", text }, answer(hits, text)])
    setQ("")
  }

  return (
    <>
      <button
        ref={button}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="guide-panel"
        className="guide-fab fixed bottom-5 right-5 z-40 inline-flex h-12 items-center gap-2 rounded-full pl-2 pr-4 text-sm font-medium"
      >
        <LogoMark className="h-8 w-8" />
        {open ? "close" : "ask about me"}
      </button>

      <div
        id="guide-panel"
        role="dialog"
        aria-label="Ask about Benedict"
        data-open={open ? "" : undefined}
        inert={!open}
        className="guide-panel fixed bottom-20 right-3 z-40 flex w-[min(400px,calc(100vw-24px))] flex-col overflow-hidden rounded-3xl sm:right-5"
      >
        <div className="flex items-center justify-between border-b border-foreground/10 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-4 w-4 text-route" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium">ask about me</p>
              <p className="meta">answers come from this site, with the source</p>
            </div>
          </div>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-accent">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div ref={log} className="max-h-[50vh] min-h-[180px] space-y-4 overflow-y-auto px-4 py-4" aria-live="polite">
          {turns.length === 0 && (
            <div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                hi, i'm the guide to this site. ask me anything about benedict's work, experience, tools or certificates.
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {STARTERS.map((s) => (
                  <li key={s}>
                    <button type="button" onClick={() => ask(s)} className="min-h-9 rounded-full border px-3 text-xs text-muted-foreground transition-colors hover:border-route/60 hover:text-foreground">
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {turns.map((t, i) =>
            t.from === "you" ? (
              <p key={i} className="guide-turn ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-foreground px-3.5 py-2 text-sm text-background">
                {t.text}
              </p>
            ) : (
              <div key={i} className="guide-turn max-w-[92%]">
                <p className="rounded-2xl rounded-bl-md border bg-card px-3.5 py-2.5 text-sm leading-relaxed">{t.text}</p>
                {t.hits && t.hits.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {t.hits.map((h, j) => (
                      <li key={h.doc.id}>
                        <Link
                          href={h.doc.href}
                          onClick={() => setOpen(false)}
                          className="group inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                        >
                          <span className="meta">{j === 0 ? "source" : "also"}</span>
                          <span className="underline-offset-2 group-hover:underline">{h.doc.title}</span>
                          <ArrowRight className="h-3 w-3" aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ),
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            ask(q)
          }}
          className="flex items-center gap-2 border-t border-foreground/10 p-3"
        >
          <label htmlFor="guide-q" className="sr-only">
            Your question
          </label>
          <input
            id="guide-q"
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ask a question"
            autoComplete="off"
            className="h-11 flex-1 rounded-full border bg-background px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-amber"
          />
          <button type="submit" aria-label="Ask" disabled={!q.trim()} className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-foreground text-background disabled:opacity-40">
            <ArrowUp className="h-4 w-4" />
          </button>
        </form>
      </div>
    </>
  )
}
