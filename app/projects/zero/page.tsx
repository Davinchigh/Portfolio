import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import "@fontsource/cinzel/400.css"
import "@fontsource/cinzel/700.css"
import "@fontsource/eb-garamond/400.css"
import "@fontsource/eb-garamond/400-italic.css"
import { madeWith, phases, philosophy, specials, suits, tokenTiers, wilds, zeroStats, type Tag, type ZeroCard } from "@/lib/zero"
import "./zero.css"

export const metadata: Metadata = {
  title: "ZERO, The Architect's Edition | Benedict Frimpong Boateng",
  description:
    "ZERO is an original psychological card game by Benedict Frimpong Boateng. Seven seats, twelve laws, six special cards and an influence token economy.",
}

const tagLabel: Record<Tag, string> = {
  psychology: "psychology",
  information: "information",
  power: "power",
  punishment: "punishment",
  chaos: "chaos",
}

function Card({ card, size = "md" }: { card: ZeroCard; size?: "md" | "sm" }) {
  return (
    <figure className={`zcard zcard-${card.tone} ${size === "sm" ? "zcard-sm" : ""}`}>
      <div className="zcard-face" aria-hidden="true">
        <span className="zcard-corner tl">{card.symbol}</span>
        <span className="zcard-symbol">{card.symbol}</span>
        <span className="zcard-label">{card.name}</span>
        <span className="zcard-corner br">{card.symbol}</span>
        <span className="zcard-band">ZERO · Ω</span>
      </div>
      <figcaption>
        <span className="zcard-name">{card.name}</span>
        <span className="zcard-effect">{card.effect}</span>
      </figcaption>
    </figure>
  )
}

export default function ZeroPage() {
  return (
    <main className="zero">
      <div className="wrap pt-24 sm:pt-28">
        <Link href="/projects" className="inline-flex items-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> all projects
        </Link>
      </div>

      {/* Hero */}
      <header className="zero-hero">
        <img src="/images/zero/zero-mark.webp" alt="" aria-hidden="true" className="zero-hero-art" />
        <p className="zero-eyebrow">an original card game · designed by benedict frimpong boateng · 2026</p>
        <h1 className="zero-title">ZERO</h1>
        <p className="zero-sub">The Architect&apos;s Edition, a game of controlled chaos</p>
        <div className="zero-divider" aria-hidden="true">
          <span />
          <i />
          <span />
        </div>
        <p className="zero-lede">
          Seven seats. Twelve laws. No luck. A psychological card game where information is a weapon, every alliance
          creates debt, and the winner decided the outcome before the first card was drawn.
        </p>
        <dl className="zero-stats">
          {zeroStats.map((s) => (
            <div key={s.label}>
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      {/* About the project */}
      <section className="wrap py-16" aria-labelledby="zero-about">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="eyebrow">the project</p>
            <h2 id="zero-about" className="mt-3 text-3xl">
              what i made
            </h2>
          </div>
          <div className="space-y-4 text-muted-foreground md:col-span-8">
            <p className="text-lg text-foreground">
              ZERO is a card game built to reward reading people instead of luck.
            </p>
            <p>
              I designed the full ruleset, six new special cards, a reworked deck with its own suit names, and an influence token
              economy that makes power visible to the whole table. Then I built the brand around it: a dark, classified-file look
              in black, gold and crimson, plus card faces, group artwork for the players and a website to teach the rules.
            </p>
            <p>I&apos;m now taking it toward a printed edition in Ghana, with the intellectual property protected first.</p>
            <p className="meta pt-2">{madeWith.join(", ")}</p>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="wrap" aria-labelledby="zero-philosophy">
        <h2 id="zero-philosophy" className="sr-only">
          Core philosophy
        </h2>
        <blockquote className="zero-verdict">
          <p>{philosophy}</p>
          <p className="zero-verdict-foot">Seven players maximum. Any more and the web becomes unmanageable. Any fewer and there is no web to weave.</p>
        </blockquote>
      </section>

      {/* Rules */}
      <section className="wrap py-20" aria-labelledby="zero-rules">
        <p className="eyebrow">the ruleset</p>
        <h2 id="zero-rules" className="mt-3 text-3xl sm:text-4xl">
          twelve laws
        </h2>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Twelve laws sit on top of a classic four-colour deck. Here&apos;s what each one does to the table. The full rulebook comes
          with the printed edition.
        </p>

        <div className="mt-12 space-y-14">
          {phases.map((phase, i) => (
            <div key={phase.title}>
              <h3 className="zero-phase">
                <span className="zero-roman">{["I", "II", "III"][i]}</span>
                {phase.title}
                <span className="zero-phase-tag">{phase.tag}</span>
              </h3>
              <ol className="zero-rules">
                {phase.rules.map((r) => (
                  <li key={r.n} className="zero-rule">
                    <span className="zero-rule-n" aria-hidden="true">
                      {r.n}
                    </span>
                    <div>
                      <h4 className="zero-rule-name">{r.name}</h4>
                      <p className="zero-rule-text">{r.line}</p>
                      <span className={`zero-tag zero-tag-${r.tag}`}>{tagLabel[r.tag]}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      {/* Special cards */}
      <section className="wrap py-10" aria-labelledby="zero-specials">
        <p className="eyebrow">the Ω arsenal</p>
        <h2 id="zero-specials" className="mt-3 text-3xl sm:text-4xl">
          six new cards
        </h2>
        <p className="mt-3 max-w-xl text-muted-foreground">Two of each are shuffled into the deck.</p>
        <div className="zero-card-grid mt-10">
          {specials.map((c) => (
            <Card key={c.name} card={c} />
          ))}
        </div>
      </section>

      {/* Deck */}
      <section className="wrap py-20" aria-labelledby="zero-deck">
        <p className="eyebrow">the deck</p>
        <h2 id="zero-deck" className="mt-3 text-3xl sm:text-4xl">
          the full system
        </h2>
        <div className="mt-10 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h3 className="font-medium">Four renamed suits</h3>
            <p className="mt-2 text-sm text-muted-foreground">Numbers 0 to 9, plus Reverse, Skip and Draw Two in each.</p>
            <ul className="mt-5 space-y-3">
              {suits.map((s) => (
                <li key={s.name} className="flex items-center gap-4">
                  <span className="zero-suit" style={{ "--suit": s.color } as React.CSSProperties} aria-hidden="true">
                    7
                  </span>
                  <span>
                    <span className="block font-medium">{s.name}</span>
                    <span className="block text-sm text-muted-foreground">{s.subtitle}</span>
                  </span>
                </li>
              ))}
            </ul>

            <h3 className="mt-10 font-medium">Influence tokens</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              A three-tier currency that powers the Veto, the Dossier and the Confession. Holdings are always on show, so the
              whole table can see who is rich and who is desperate.
            </p>
            <ul className="mt-6 grid grid-cols-3 gap-4">
              {tokenTiers.map((t) => (
                <li key={t.name} className="text-center">
                  <img src={t.image} alt={`${t.name} influence token, worth ${t.value}`} loading="lazy" className="mx-auto w-full max-w-[120px]" />
                  <p className="mt-2 text-sm font-medium">{t.name}</p>
                  <p className="meta">
                    tier {t.tier}, worth {t.value}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7">
            <h3 className="font-medium">Four wild types</h3>
            <div className="zero-card-grid zero-card-grid-sm mt-5">
              {wilds.map((c) => (
                <Card key={c.name} card={c} size="sm" />
              ))}
            </div>
            <h3 className="mt-10 font-medium">The reverse face</h3>
            <div className="mt-5 flex items-center gap-6">
              <div className="zcard zcard-back zcard-sm" aria-hidden="true">
                <div className="zcard-face">
                  <span className="zcard-pattern" />
                  <span className="zcard-symbol">Ω</span>
                  <span className="zcard-label">Z E R O</span>
                  <span className="zcard-band">THE ARCHITECT&apos;S EDITION</span>
                </div>
              </div>
              <p className="max-w-xs text-sm text-muted-foreground">
                Every card shares one back: the Ω mark of the Architect on a gold-lined black field.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="wrap pb-24" aria-labelledby="zero-closing">
        <h2 id="zero-closing" className="sr-only">
          Closing doctrine
        </h2>
        <blockquote className="zero-verdict">
          <p>
            There is no luck in ZERO. <em>The rules are not a cage. They are a map, and only some players know how to read
            maps.</em>
          </p>
        </blockquote>
        <div className="zero-seal" aria-hidden="true">
          <span>Ω</span>
          <p>ZERO · The Architect&apos;s Edition · © 2026 Benedict Frimpong Boateng</p>
        </div>
        <p className="mt-10 text-center text-sm text-muted-foreground">
          Want the full rules, a playtest, or to publish or stock ZERO?{" "}
          <Link href="/#contact" className="link text-foreground">
            get in touch
          </Link>
          .
        </p>
      </section>
    </main>
  )
}
