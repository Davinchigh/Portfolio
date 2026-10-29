"use client"

import { Fragment } from "react"
import { useVisitor } from "@/lib/visitor"

type Key = "stats" | "experience" | "lessons" | "work" | "ventures" | "builds" | "designs" | "stack" | "certifications" | "now"

/** Recruiters get proof first. Everyone else gets the story first. */
const ORDER: Record<"recruiter" | "explorer", Key[]> = {
  recruiter: ["stats", "work", "builds", "experience", "stack", "certifications", "designs", "ventures", "now"],
  explorer: ["experience", "lessons", "work", "builds", "ventures", "designs", "stats", "stack", "certifications", "now"],
}

export function Flow({ sections }: { sections: Record<Key, React.ReactNode> }) {
  const { mode } = useVisitor()
  const order = ORDER[mode === "recruiter" ? "recruiter" : "explorer"]
  return (
    <>
      {order.map((k) => (
        <Fragment key={k}>{sections[k]}</Fragment>
      ))}
    </>
  )
}
