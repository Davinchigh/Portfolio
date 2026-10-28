"use client"

import { useEffect, useState } from "react"
import { person } from "@/lib/site"

/** Live local time in Accra, updated each minute. Renders a placeholder until mounted to avoid hydration mismatch. */
export function Clock({ className = "" }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null)

  useEffect(() => {
    const format = () =>
      new Date().toLocaleTimeString("en-GB", { timeZone: person.timeZone, hour: "2-digit", minute: "2-digit", hour12: false })
    setTime(format())
    const id = window.setInterval(() => setTime(format()), 15_000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <span className={className}>
      <time suppressHydrationWarning>{time ?? "--:--"}</time> gmt
    </span>
  )
}
