import type { Metadata } from "next"
import { Callout, PageHead, Ph, Section } from "@/components/ui"
import { isPlaceholder, site } from "@/lib/site"

export const metadata: Metadata = {
  title: "Alumni memories",
  description: "Stories from former residents of Jean Nelson Aka Hall, and how to share yours.",
}

const prompt =
  "Hi! I'm a former resident of Jean Nelson Aka Hall and I'd like to share a memory for the site.\n\nMy name (or how I'd like to be credited):\nYears in hall:\nMy memory:\n\nI'm happy for this to be published on the unofficial hall site: yes / no"

export default function MemoriesPage() {
  const waReady = !isPlaceholder(site.whatsapp)
  const mailReady = !isPlaceholder(site.email)
  const wa = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(prompt)}`
  const mail = `mailto:${site.email}?subject=${encodeURIComponent("My Jean Nelson Aka Hall memory")}&body=${encodeURIComponent(prompt)}`

  return (
    <>
      <PageHead
        eyebrow="Memories"
        title="Once a Royal, always a Royal"
        intro="This page grows one story at a time. Every story here is real and shared with permission. Nothing is made up."
      />

      <section className="wrap py-12 sm:py-16" aria-labelledby="stories-h">
        <h2 id="stories-h" className="text-3xl sm:text-4xl">
          Stories
        </h2>
        <ul className="mt-8 grid gap-5 md:grid-cols-2">
          <li>
            <figure className="h-full on-night rounded-2xl bg-night p-7 text-mist">
              <blockquote className="font-display text-xl leading-snug sm:text-2xl">
                <Ph value={site.benMemory} />
              </blockquote>
              <figcaption className="mt-5 text-mist-muted">
                {site.maker}, resident <Ph value={site.benYears} />
              </figcaption>
            </figure>
          </li>
          <li className="flex items-center justify-center rounded-2xl border border-dashed border-ink/20 p-7 text-center text-ink-muted">
            <p>Your story could go here.</p>
          </li>
        </ul>
      </section>

      <section className="bg-paper-2">
        <div className="wrap py-14">
          <h2 className="text-3xl sm:text-4xl">Share yours</h2>
          <p className="mt-3 max-w-prose text-lg">
            Hall Week, late nights, the basketball court, your roommates, your first day. Tap a button and your message app
            opens with a short template. Nothing is sent until you press send yourself.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            {waReady ? (
              <a href={wa} className="btn-ink" target="_blank" rel="noopener noreferrer">
                Share on WhatsApp<span className="sr-only"> (opens WhatsApp)</span>
              </a>
            ) : (
              <p className="rounded-2xl bg-white px-5 py-3">
                WhatsApp: <Ph value={site.whatsapp} />
              </p>
            )}
            {mailReady ? (
              <a href={mail} className="btn-ink">
                Share by email
              </a>
            ) : (
              <p className="rounded-2xl bg-white px-5 py-3">
                Email: <Ph value={site.email} />
              </p>
            )}
          </div>
        </div>
      </section>

      <Section title="A few ground rules" id="rules">
        <p>We only publish stories with your clear permission. You can ask us to take yours down at any time.</p>
        <p>
          Please don't share other people's private details, or photos of people who haven't agreed. Keep it kind. This is
          a place for good memories.
        </p>
        <div className="mt-6">
          <Callout title="Got old photos?">
            <p>
              If you took photos of the hall yourself and you're happy for them to be used, send them along with how you'd
              like to be credited. Photos you didn't take, we can't use.
            </p>
          </Callout>
        </div>
      </Section>
    </>
  )
}
