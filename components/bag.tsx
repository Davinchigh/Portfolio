"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { ShoppingBag, X } from "lucide-react"
import { ghs, whatsappLink, type OrderLine } from "@/lib/store"

/** A small bag kept in this browser only. It sends one WhatsApp message with every item. */
type Bag = { lines: OrderLine[]; add: (l: OrderLine) => void; remove: (i: number) => void; open: () => void }
const BagContext = createContext<Bag>({ lines: [], add: () => {}, remove: () => {}, open: () => {} })
const KEY = "lizab-bag-v1"

export function BagProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<OrderLine[]>([])
  const dialog = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "[]")
      if (Array.isArray(saved)) setLines(saved)
    } catch {
      /* start empty */
    }
  }, [])
  const save = (next: OrderLine[]) => {
    setLines(next)
    try {
      localStorage.setItem(KEY, JSON.stringify(next))
    } catch {
      /* fine */
    }
  }
  const add = useCallback((l: OrderLine) => setLines((cur) => { const next = [...cur, l]; try { localStorage.setItem(KEY, JSON.stringify(next)) } catch {} return next }), [])
  const remove = (i: number) => save(lines.filter((_, j) => j !== i))
  const open = useCallback(() => dialog.current?.showModal(), [])
  const value = useMemo(() => ({ lines, add, remove, open }), [lines, add, open]) // eslint-disable-line react-hooks/exhaustive-deps
  const total = lines.reduce((n, l) => n + l.price, 0)

  return (
    <BagContext.Provider value={value}>
      {children}
      <dialog
        ref={dialog}
        aria-label="Your bag"
        onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
        className="m-0 ml-auto h-full max-h-none w-full max-w-md bg-onyx p-0 text-champagne backdrop:bg-black/70"
      >
        <div className="flex h-full flex-col border-l border-gold/20">
          <div className="flex items-center justify-between border-b border-gold/20 px-6 py-4">
            <h2 className="font-display text-2xl">Your bag</h2>
            <button type="button" aria-label="Close bag" onClick={() => dialog.current?.close()} className="grid h-12 w-12 place-items-center rounded-full hover:bg-espresso">
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          {lines.length === 0 ? (
            <p className="px-6 py-10 text-ash">Your bag is empty. Add pieces from any product page, then send them in one WhatsApp message.</p>
          ) : (
            <ul className="flex-1 divide-y divide-gold/10 overflow-auto px-6">
              {lines.map((l, i) => (
                <li key={`${l.code}-${i}`} className="flex items-start justify-between gap-4 py-4">
                  <div>
                    <p className="font-medium">{l.name}</p>
                    <p className="text-sm text-ash">
                      {l.code}, {l.colour}, {l.size}
                    </p>
                    <p className="mt-1 text-sm">{ghs(l.price)}</p>
                  </div>
                  <button type="button" onClick={() => remove(i)} className="min-h-11 px-2 text-sm text-ash underline underline-offset-4 hover:text-champagne">
                    remove<span className="sr-only"> {l.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {lines.length > 0 && (
            <div className="border-t border-gold/20 px-6 py-5">
              <p className="flex justify-between text-sm">
                <span className="text-ash">Subtotal</span>
                <span>{ghs(total)}</span>
              </p>
              <p className="mt-1 text-xs text-ash">Delivery is confirmed with you on WhatsApp.</p>
              <a href={whatsappLink(lines)} target="_blank" rel="noopener noreferrer" className="btn-gold mt-4 w-full">
                Send my bag on WhatsApp
              </a>
            </div>
          )}
        </div>
      </dialog>
    </BagContext.Provider>
  )
}

export const useBag = () => useContext(BagContext)

export function BagButton() {
  const { lines, open } = useBag()
  return (
    <button type="button" onClick={open} className="relative grid h-12 w-12 place-items-center rounded-full text-champagne hover:bg-espresso" aria-label={`Open bag, ${lines.length} item${lines.length === 1 ? "" : "s"}`}>
      <ShoppingBag className="h-5 w-5" aria-hidden="true" />
      {lines.length > 0 && (
        <span aria-hidden="true" className="absolute right-1.5 top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[11px] font-semibold text-onyx">
          {lines.length}
        </span>
      )}
    </button>
  )
}
