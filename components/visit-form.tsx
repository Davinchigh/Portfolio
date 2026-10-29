"use client"

import { useState } from "react"

/** A concept booking form. It never sends or stores anything, and says so. */
export function VisitForm() {
  const [done, setDone] = useState(false)
  const field =
    "peer mt-1 block w-full border-0 border-b border-white/25 bg-transparent px-0 pb-3 pt-2 text-lg text-white placeholder:text-white/40 focus:border-white focus:outline-none focus:ring-0"
  if (done)
    return (
      <div role="status" className="py-10">
        <p className="font-serif text-5xl italic text-white">Lovely, thank you.</p>
        <p className="mt-4 max-w-md text-white/75">This is a concept site, so nothing was sent. On the real site a gardener would call you back within a day.</p>
        <button type="button" className="btn mt-8 border border-white/30 text-white hover:bg-white hover:text-ink" onClick={() => setDone(false)}>
          Start again
        </button>
      </div>
    )
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        setDone(true)
      }}
      className="grid gap-8"
    >
      <div className="grid gap-8 sm:grid-cols-2">
        <label className="text-sm text-white/70">
          First name
          <input name="name" autoComplete="given-name" required className={field} />
        </label>
        <label className="text-sm text-white/70">
          Email
          <input name="email" type="email" autoComplete="email" required className={field} />
        </label>
      </div>
      <fieldset>
        <legend className="text-sm text-white/70">I need help with</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {["A new garden", "Lawn care", "Planting & pots", "Regular care", "Not sure yet"].map((o, k) => (
            <label key={o} className="cursor-pointer">
              <input type="radio" name="need" value={o} defaultChecked={k === 0} className="peer sr-only" />
              <span className="inline-flex min-h-11 items-center rounded-full border border-white/25 px-4 text-[15px] text-white/85 transition-colors duration-300 hover:border-white/60 peer-checked:border-white peer-checked:bg-white peer-checked:text-ink peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-white">
                {o}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="text-sm text-white/70">
        Tell us about your space
        <textarea name="message" rows={3} placeholder="Size, sun, and what you dream it could be" className={field} />
      </label>
      <div className="flex flex-wrap items-center gap-5">
        <button type="submit" className="btn bg-white text-ink hover:bg-sage">Request my free visit</button>
        <p className="text-sm text-white/60">Concept site: this form doesn&apos;t send or save anything.</p>
      </div>
    </form>
  )
}
