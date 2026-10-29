"use client"

import { useState } from "react"
import { Check } from "lucide-react"

/** A concept booking form. It never sends or stores anything, and says so. */
export function VisitForm() {
  const [done, setDone] = useState(false)
  if (done)
    return (
      <div role="status" className="grid place-items-center gap-4 rounded-[28px] bg-white p-10 text-center shadow-[0_20px_50px_-30px_rgba(24,58,44,0.5)]">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-leaf-soft text-forest"><Check className="h-7 w-7" aria-hidden="true" /></span>
        <p className="font-display text-3xl text-forest">Lovely, thank you.</p>
        <p className="max-w-sm text-stone">This is a concept site, so nothing was sent. On the real site this is where a gardener would call you back.</p>
        <button type="button" className="btn-light" onClick={() => setDone(false)}>Fill it in again</button>
      </div>
    )
  const field = "mt-2 block w-full rounded-2xl border border-forest/15 bg-cream/60 px-4 py-3.5 text-base text-ink placeholder:text-stone/70 focus:border-moss focus:bg-white focus:outline-none"
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        setDone(true)
      }}
      className="grid gap-5 rounded-[28px] bg-white p-6 shadow-[0_20px_50px_-30px_rgba(24,58,44,0.5)] sm:p-9"
    >
      <p className="rounded-xl bg-sun/20 px-4 py-3 text-sm text-ink">Concept site: this form doesn&apos;t send or save anything.</p>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-semibold text-forest">
          First name
          <input name="name" autoComplete="given-name" required className={field} />
        </label>
        <label className="text-sm font-semibold text-forest">
          Email
          <input name="email" type="email" autoComplete="email" required className={field} />
        </label>
      </div>
      <label className="text-sm font-semibold text-forest">
        What would you like help with?
        <select name="need" className={field} defaultValue="">
          <option value="" disabled>Choose one</option>
          <option>A new garden or landscape</option>
          <option>Lawn care</option>
          <option>Planting and pots</option>
          <option>Regular maintenance</option>
          <option>Not sure yet</option>
        </select>
      </label>
      <label className="text-sm font-semibold text-forest">
        Tell us about your space
        <textarea name="message" rows={4} placeholder="Size, sun, what you dream it could be" className={field} />
      </label>
      <button type="submit" className="btn-primary justify-self-start">Request my free visit</button>
    </form>
  )
}
