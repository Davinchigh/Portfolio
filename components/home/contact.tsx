"use client"

import { useState } from "react"
import { ArrowUpRight, Check, Copy } from "lucide-react"
import { HandNote } from "@/components/site/hand-note"
import { person, socials } from "@/lib/site"
import { useVisitor } from "@/lib/visitor"

export function Contact() {
  const [copied, setCopied] = useState(false)
  const { mode, company } = useVisitor()

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(person.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section id="contact" aria-labelledby="contact-title" className="wrap scroll-mt-20 border-t py-24 sm:py-32">
      <p className="eyebrow">{mode === "recruiter" ? "your move" : "say hello"}</p>
      <h2 id="contact-title" className="mt-4 max-w-4xl text-4xl leading-[1.02] sm:text-7xl">
        {mode === "recruiter" ? "you've seen my story. i'd like to be part of yours." : "building something with ai? i'd like to help ship it."}
      </h2>
      <p className="mt-6 max-w-xl text-lg text-muted-foreground">
        {mode === "recruiter"
          ? `open to full time roles and freelance projects, remote or in accra, and i can start right away.${company ? ` i'd love to hear what ${company} is building.` : ""}`
          : "a question about ai, a project you're stuck on, or just to say hi. i read everything and reply within a day or two."}
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <a href={`mailto:${person.email}`} className="pill-button">
          email me <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
        <button type="button" onClick={copy} className="ghost-button">
          {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
          {copied ? "copied" : "copy email"}
        </button>
        <a href={person.cv} download className="ghost-button">
          download cv
        </a>
        <span className="sr-only" role="status">
          {copied ? "Email address copied" : ""}
        </span>
      </div>
      <p className="mt-4 break-all text-sm text-muted-foreground">{person.email}</p>

      <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2">
        {socials.map((s) => (
          <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="link inline-flex items-center gap-1 py-2 text-sm">
            {s.label.toLowerCase()} <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        ))}
        <HandNote arrow="left" className="-rotate-2 text-xl">
          say hi, i don&apos;t bite
        </HandNote>
      </div>
    </section>
  )
}
