"use client"

import type React from "react"
import { useState } from "react"
import { Check, Copy } from "lucide-react"
import PageHeader from "@/components/page-header"
import { EMAIL, GITHUB, LINKEDIN, X_URL } from "@/components/social-icons"

const fieldClass =
  "mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-base placeholder:text-muted-foreground/70 focus-visible:border-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [copied, setCopied] = useState(false)

  const update = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const body = `${form.message}\n\n${form.name}\n${form.email}`
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(body)}`
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <main>
      <PageHeader title="Contact">
        I&apos;m open to full-time, contract and freelance work, remote or hybrid, from Accra, Ghana. Recruiters and teams are
        welcome to get in touch.
      </PageHeader>

      <section className="page">
        <div className="grid gap-16 border-t border-border pt-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <h2 className="text-sm text-muted-foreground">Email</h2>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <a href={`mailto:${EMAIL}`} className="text-link break-all text-lg font-medium lg:text-xl">
                {EMAIL}
              </a>
              <button
                type="button"
                onClick={copyEmail}
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-3 text-sm transition-colors hover:bg-accent"
              >
                {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                {copied ? "Copied" : "Copy"}
              </button>
              <span className="sr-only" role="status">
                {copied ? "Email address copied" : ""}
              </span>
            </div>

            <h2 className="mt-10 text-sm text-muted-foreground">Elsewhere</h2>
            <ul className="mt-2 space-y-2 text-lg">
              {[
                ["LinkedIn", LINKEDIN],
                ["GitHub", GITHUB],
                ["X", X_URL],
              ].map(([label, href]) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="text-link">
                    {label}
                  </a>
                </li>
              ))}
            </ul>

            <h2 className="mt-10 text-sm text-muted-foreground">Location</h2>
            <p className="mt-2 text-lg">Weja, Accra, Ghana (GMT)</p>
            <p className="mt-1 text-muted-foreground">I usually reply within one or two working days.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 md:col-span-7" aria-labelledby="form-heading">
            <div>
              <h2 id="form-heading" className="text-3xl font-semibold tracking-tight">
                Write a message
              </h2>
              <p className="mt-2 text-muted-foreground">This opens your email app with your message ready to send.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block text-sm font-medium">
                Your name
                <input name="name" value={form.name} onChange={update} required autoComplete="name" className={fieldClass} />
              </label>
              <label className="block text-sm font-medium">
                Your email
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={update}
                  required
                  autoComplete="email"
                  className={fieldClass}
                />
              </label>
            </div>
            <label className="block text-sm font-medium">
              Subject
              <input name="subject" value={form.subject} onChange={update} required className={fieldClass} />
            </label>
            <label className="block text-sm font-medium">
              Message
              <textarea name="message" value={form.message} onChange={update} required rows={6} className={fieldClass} />
            </label>
            <button
              type="submit"
              className="inline-flex h-11 items-center rounded-md bg-foreground px-6 text-sm font-medium text-background transition-opacity hover:opacity-85"
            >
              Open in email app
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}
