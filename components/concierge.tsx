"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ArrowUp, X } from "lucide-react"
import { Monogram } from "@/components/logo"
import { LIVE } from "@/lib/live"
import { askLink } from "@/lib/store"

type Msg = { from: "esi" | "you"; text: string; failed?: boolean }

const STARTERS = ["What's new this season?", "Book a fitting", "Do you have the gold-chain bag?", "Track my order"]
const HELLO: Msg = {
  from: "esi",
  text: "Hello, I'm Esi, Lizab's AI assistant. I can check sizes and stock, take an order or pre-order, and book a fitting. What are you shopping for?",
}

/** Opens Esi from anywhere: window.dispatchEvent(new CustomEvent("lizab:chat", { detail: "Book a fitting" })) */
export const openEsi = (message?: string) => window.dispatchEvent(new CustomEvent("lizab:chat", { detail: message }))

function sessionId() {
  let id = ""
  try {
    id = sessionStorage.getItem("lizab-esi") ?? ""
    if (!id) {
      id = crypto.randomUUID()
      sessionStorage.setItem("lizab-esi", id)
    }
  } catch {
    id ||= Math.random().toString(36).slice(2)
  }
  return id
}

/** Esi, the sales assistant, as a small concierge panel. Replies stream in as she writes them. */
export function Concierge() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([HELLO])
  const [text, setText] = useState("")
  const [busy, setBusy] = useState(false)
  const input = useRef<HTMLTextAreaElement>(null)
  const list = useRef<HTMLDivElement>(null)
  const launcher = useRef<HTMLButtonElement>(null)
  const sid = useRef("")

  const send = useCallback(async (raw: string) => {
    const q = raw.trim()
    if (!q || busy) return
    sid.current ||= sessionId()
    setText("")
    setBusy(true)
    setMsgs((m) => [...m, { from: "you", text: q }, { from: "esi", text: "" }])
    const write = (t: string, failed = false) =>
      setMsgs((m) => {
        const next = m.slice()
        next[next.length - 1] = { from: "esi", text: t, failed }
        return next
      })
    try {
      const r = await fetch(LIVE.chat, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sendMessage", sessionId: sid.current, chatInput: q }),
      })
      if (!r.ok || !r.body) throw new Error(String(r.status))
      // n8n streams one JSON object per line ({type:"item", content}); a non-streaming reply is one {output}
      const reader = r.body.getReader()
      const dec = new TextDecoder()
      let buf = ""
      let out = ""
      for (;;) {
        const { value, done } = await reader.read()
        if (done) break
        buf += dec.decode(value, { stream: true })
        const lines = buf.split("\n")
        buf = lines.pop() ?? ""
        for (const line of lines) {
          if (!line.trim()) continue
          try {
            const j = JSON.parse(line)
            if (j.type === "item" && typeof j.content === "string") out += j.content
            else if (typeof j.output === "string") out = j.output
          } catch {
            /* partial line */
          }
        }
        write(out)
      }
      if (buf.trim()) {
        try {
          const j = JSON.parse(buf)
          if (typeof j.output === "string") out = j.output
          else if (j.type === "item") out += j.content ?? ""
        } catch {
          /* ignore */
        }
      }
      if (!out.trim()) throw new Error("empty")
      write(out)
    } catch {
      write("I can't reach the shop system right now. Please message us on WhatsApp and a person will help you straight away.", true)
    } finally {
      setBusy(false)
    }
  }, [busy])

  useEffect(() => {
    const onOpen = (e: Event) => {
      setOpen(true)
      const m = (e as CustomEvent<string | undefined>).detail
      if (m) setTimeout(() => send(m), 250)
    }
    window.addEventListener("lizab:chat", onOpen)
    return () => window.removeEventListener("lizab:chat", onOpen)
  }, [send])

  useEffect(() => {
    if (!open) return
    setTimeout(() => input.current?.focus(), 200)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false)
        launcher.current?.focus()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: "smooth" })
  }, [msgs])

  return (
    <>
      <button
        ref={launcher}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="esi-panel"
        data-cursor={open ? "" : "Ask"}
        className={`fixed bottom-[5.5rem] right-5 z-30 flex h-14 items-center gap-2 rounded-full border border-gold/40 bg-onyx/90 pl-2 pr-5 text-sm font-medium text-champagne shadow-lg shadow-black/40 backdrop-blur-md transition-[opacity,transform] duration-500 hover:border-gold ${open ? "pointer-events-none translate-y-2 opacity-0" : ""}`}
      >
        <span className="grid h-10 w-10 place-items-center rounded-full bg-gold/15">
          <Monogram className="h-7 w-7 text-gold" />
        </span>
        Ask Esi
      </button>

      <div
        id="esi-panel"
        role="dialog"
        aria-label="Chat with Esi, Lizab's AI sales assistant"
        inert={!open}
        className={`fixed inset-x-3 bottom-3 z-50 flex max-h-[min(640px,calc(100svh-1.5rem))] flex-col overflow-hidden rounded-3xl border border-gold/25 bg-espresso/95 shadow-2xl shadow-black/60 backdrop-blur-xl transition-[opacity,transform,clip-path] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:left-auto sm:right-5 sm:w-[400px] ${open ? "translate-y-0 opacity-100 [clip-path:inset(0_round_24px)]" : "translate-y-4 opacity-0 [clip-path:inset(60%_0_0_0_round_24px)]"}`}
      >
        <div className="flex items-center gap-3 border-b border-gold/15 px-5 py-4">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-gold/15">
            <Monogram className="h-7 w-7 text-gold" />
          </span>
          <div className="flex-1">
            <p className="font-display text-lg leading-none text-champagne">Esi</p>
            <p className="mt-1 text-xs text-ash">Lizab&apos;s AI sales assistant</p>
          </div>
          <button type="button" onClick={() => { setOpen(false); launcher.current?.focus() }} className="grid h-11 w-11 place-items-center rounded-full text-champagne hover:bg-onyx">
            <X className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Close chat</span>
          </button>
        </div>

        <div ref={list} aria-live="polite" className="flex-1 space-y-3 overflow-y-auto px-5 py-5" data-lenis-prevent>
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.from === "you" ? "justify-end" : ""}`}>
              <p className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${m.from === "you" ? "rounded-br-md bg-gold text-onyx" : "rounded-bl-md bg-onyx/80 text-champagne"}`}>
                {m.text || <span className="inline-flex gap-1" aria-label="Esi is typing"><span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" /></span>}
                {m.failed && (
                  <a href={askLink()} target="_blank" rel="noopener noreferrer" className="mt-2 block font-medium text-gold underline underline-offset-4">
                    Message us on WhatsApp
                  </a>
                )}
              </p>
            </div>
          ))}
          {msgs.length === 1 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {STARTERS.map((s) => (
                <button key={s} type="button" onClick={() => send(s)} className="rounded-full border border-champagne/25 px-3 py-2 text-sm text-champagne hover:border-gold">
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <form
          className="flex items-end gap-2 border-t border-gold/15 p-3"
          onSubmit={(e) => {
            e.preventDefault()
            send(text)
          }}
        >
          <label htmlFor="esi-input" className="sr-only">Message Esi</label>
          <textarea
            id="esi-input"
            ref={input}
            rows={1}
            value={text}
            maxLength={1000}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                send(text)
              }
            }}
            placeholder="Ask about a piece, a size or a fitting"
            className="max-h-32 min-h-12 flex-1 resize-none rounded-2xl border border-champagne/20 bg-onyx px-4 py-3 text-[15px] text-champagne placeholder:text-ash focus:border-gold focus:outline-none"
          />
          <button type="submit" disabled={busy || !text.trim()} className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gold text-onyx disabled:opacity-40">
            <ArrowUp className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Send</span>
          </button>
        </form>
        <p className="px-5 pb-3 text-[11px] leading-snug text-ash">
          Esi is an AI and can make mistakes. Nothing is charged in chat: Lizab confirms every order on WhatsApp first.
        </p>
      </div>
    </>
  )
}
