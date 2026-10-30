"use client"

import { useEffect, useState } from "react"
import { useBag } from "@/components/bag"
import { liveStock, type StockInfo } from "@/lib/live"
import { askLink, ghs, usd, whatsappLink, type Product } from "@/lib/store"

const NOT_SURE = "Not sure, please advise"

/** Pick colour and size, then order on WhatsApp. The order link is a real <a href>, so it works without JavaScript too. */
export function OrderPanel({ p }: { p: Product }) {
  const [colour, setColour] = useState(p.colours.length === 1 ? p.colours[0] : "")
  const [size, setSize] = useState(p.sizes.length === 1 ? p.sizes[0] : "")
  const [added, setAdded] = useState(false)
  const { add, open } = useBag()
  const [stock, setStock] = useState<StockInfo | null>(null)
  useEffect(() => {
    const ac = new AbortController()
    liveStock(p.code, ac.signal).then(setStock)
    return () => ac.abort()
  }, [p.code])
  // what the back office says about the chosen colour and size
  const opt = stock?.options.find((o) => (!colour || o.colour === colour) && o.size === size)
  const stockLine = !stock || !size || size === NOT_SURE || !opt
    ? null
    : opt.in_stock > 0
      ? opt.in_stock <= 2 ? `Only ${opt.in_stock} left in ${opt.size}` : `In stock in ${opt.size}`
      : opt.can_make ? `Made for you in ${opt.size}. ${p.leadTime}` : `${opt.size} is sold out`
  const ready = Boolean(colour && size) && p.availability !== "sold-out"
  const line = { code: p.code, name: p.name, colour, size, price: p.price }

  const Chips = ({ label, options, value, set }: { label: string; options: string[]; value: string; set: (v: string) => void }) => (
    <fieldset className="mt-6">
      <legend className="text-xs font-medium tracking-caps text-ash">{label.toUpperCase()}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            aria-pressed={value === o}
            onClick={() => set(o)}
            className={`min-h-12 rounded-full border px-4 text-sm transition-colors ${
              value === o ? "border-gold bg-gold text-onyx" : "border-champagne/25 text-champagne hover:border-gold/70"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </fieldset>
  )

  return (
    <div>
      <p className="text-2xl text-gold">{ghs(p.price)}</p>
      {usd(p.price) && <p className="mt-1 text-sm text-ash">{usd(p.price)}, approximate</p>}
      <p className="mt-2 text-sm text-ash">{p.leadTime}</p>

      {p.colours.length > 1 && <Chips label="Colour" options={p.colours} value={colour} set={setColour} />}
      {p.colours.length === 1 && <p className="mt-6 text-sm"><span className="text-ash">Colour: </span>{p.colours[0]}</p>}
      {p.sizes.length > 1 && <Chips label="Size" options={[...p.sizes, NOT_SURE]} value={size} set={setSize} />}
      <p role="status" className="mt-4 flex min-h-5 items-center gap-2 text-sm text-champagne/85">
        {stockLine && (
          <>
            <span aria-hidden="true" className={`h-2 w-2 rounded-full ${opt && opt.in_stock > 0 ? "bg-[#7BC47F]" : opt?.can_make ? "bg-gold" : "bg-ash"}`} />
            {stockLine}
          </>
        )}
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {ready ? (
          <a href={whatsappLink([line])} target="_blank" rel="noopener noreferrer" className="btn-gold flex-1">
            Order on WhatsApp
          </a>
        ) : (
          <span role="status" className="btn-disabled flex-1">
            {p.availability === "sold-out" ? "Sold out" : !colour ? "Pick a colour" : "Pick a size"}
          </span>
        )}
        <button
          type="button"
          disabled={!ready}
          onClick={() => {
            add(line)
            setAdded(true)
          }}
          className="min-h-12 rounded-full border border-champagne/30 px-6 text-sm font-medium text-champagne enabled:hover:border-gold disabled:opacity-40"
        >
          Add to bag
        </button>
      </div>
      <p role="status" className="mt-3 min-h-5 text-sm text-gold">
        {added && (
          <>
            Added.{" "}
            <button type="button" onClick={open} className="underline underline-offset-4">
              View bag
            </button>
          </>
        )}
      </p>
      <a href={askLink(`${p.name} (${p.code})`)} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block py-2 text-sm text-ash underline underline-offset-4 hover:text-champagne">
        Ask a question about this piece
      </a>
    </div>
  )
}
