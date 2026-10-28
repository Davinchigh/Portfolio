"use client"

import { useState } from "react"
import { actionCards, numberMeanings, specialCards, suits, wildCards, type ZeroCard } from "@/lib/zero"

const numberCards: ZeroCard[] = suits.flatMap((s) =>
  numberMeanings.map((info, n) => ({
    id: `${s.color}-${n}`,
    color: s.color,
    icon: String(n),
    corner: String(n),
    label: `${s.name} ${n}`,
    kind: s.theme,
    info,
  })),
)

const groups: { id: string; title: string; note: string; cards: ZeroCard[] }[] = [
  { id: "special", title: "The Architect's arsenal", note: "six special Ω cards, two of each in the deck", cards: specialCards },
  { id: "wild", title: "The variables", note: "four wild types", cards: wildCards },
  { id: "action", title: "The instruments", note: "action cards in every suit", cards: actionCards },
  { id: "numbers", title: "The four suits", note: suits.map((s) => s.theme.toLowerCase()).join(", "), cards: numberCards },
]

function Card({ card, selected, onSelect }: { card: ZeroCard; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      className={`z-card z-card-${card.color}`}
      aria-pressed={selected}
      aria-label={`${card.label}: ${card.info}`}
      onClick={onSelect}
    >
      <span className="z-card-corner tl" aria-hidden="true">
        {card.corner}
      </span>
      <span className="z-card-corner br" aria-hidden="true">
        {card.corner}
      </span>
      <span className="z-card-center" aria-hidden="true">
        <span className="z-card-icon">{card.icon}</span>
        <span className="z-card-label">{card.label}</span>
      </span>
      <span className="z-card-band" aria-hidden="true">
        ZERO Ω
      </span>
    </button>
  )
}

export function Deck() {
  const [selected, setSelected] = useState<ZeroCard>(specialCards[0])
  const [suit, setSuit] = useState<(typeof suits)[number]["color"]>("red")

  return (
    <div>
      <div className="z-detail mb-10" aria-live="polite">
        <p className="z-eyebrow">{selected.kind}</p>
        <p className="z-caps mt-2 text-2xl font-semibold">{selected.label}</p>
        <p className="z-serif mt-2 text-lg leading-relaxed text-[var(--z-dim)]">{selected.info}</p>
        <p className="z-dim mt-3 text-xs">tap any card to read its doctrine</p>
      </div>

      {groups.map((g) => {
        const cards = g.id === "numbers" ? g.cards.filter((c) => c.color === suit) : g.cards
        return (
          <div key={g.id} className="mb-12">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h3 className="z-caps text-lg font-semibold tracking-wide">{g.title}</h3>
                <p className="z-dim mt-1 text-xs">{g.note}</p>
              </div>
              {g.id === "numbers" && (
                <div role="group" aria-label="Suit" className="flex flex-wrap gap-1">
                  {suits.map((s) => (
                    <button
                      key={s.color}
                      type="button"
                      aria-pressed={suit === s.color}
                      onClick={() => setSuit(s.color)}
                      className={`min-h-9 rounded-full border px-3 text-xs uppercase tracking-[0.18em] ${
                        suit === s.color ? "border-[var(--z-gold)] text-[var(--z-gold)]" : "border-[var(--z-border)] text-[var(--z-dim)]"
                      }`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-4 pt-3">
              {cards.map((c) => (
                <Card key={c.id} card={c} selected={selected.id === c.id} onSelect={() => setSelected(c)} />
              ))}
            </div>
          </div>
        )
      })}

      <div>
        <h3 className="z-caps mb-5 text-lg font-semibold tracking-wide">The reverse face</h3>
        <div className="z-card z-card-back" role="img" aria-label="Card back: a gold Omega on a void black face, The Architect's Edition">
          <span className="z-back-pattern" aria-hidden="true" />
          <span className="z-card-center" aria-hidden="true">
            <span className="z-card-icon" style={{ fontSize: "2.6rem" }}>
              Ω
            </span>
            <span className="z-card-label">Z E R O</span>
          </span>
          <span className="z-card-band" aria-hidden="true">
            THE ARCHITECT&apos;S EDITION
          </span>
        </div>
      </div>
    </div>
  )
}
