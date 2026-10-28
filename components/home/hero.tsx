import { ArrowUpRight } from "lucide-react"
import { Clock } from "@/components/site/clock"
import { HandNote } from "@/components/site/hand-note"
import { ToolIcon } from "@/components/site/tool-icon"
import { person, stack } from "@/lib/site"

const heroStack = [...stack[1].tools.slice(0, 4), ...stack[0].tools.slice(0, 3), stack[2].tools[0]]

export function Hero() {
  return (
    <section className="wrap pb-16 pt-32 sm:pt-40" aria-labelledby="hero-name">
      <div className="settle">
        <p className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-60 motion-reduce:hidden" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-live" />
          </span>
          {person.status}
        </p>

        <div className="mt-6 flex flex-wrap items-end gap-x-4 gap-y-1">
          <h1 id="hero-name" className="text-5xl tracking-[-0.05em] sm:text-6xl">
            {person.name}
          </h1>
          <HandNote arrow="left" className="mb-2 -rotate-3">
            {person.nickname}
          </HandNote>
        </div>

        <div className="mt-6 max-w-2xl space-y-1 text-lg leading-relaxed">
          <p>{person.role}.</p>
          <p className="text-muted-foreground">{person.bio}</p>
        </div>

        <p className="meta mt-4">
          {person.location}, <Clock />
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
          <a href="#contact" className="pill-button">
            let&apos;s talk <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <a href={`mailto:${person.email}`} className="link break-all font-mono text-sm text-muted-foreground">
            {person.email}
          </a>
          <HandNote arrow="left" className="-rotate-2 text-xl">
            i reply within a day or two
          </HandNote>
        </div>

        <div className="mt-12">
          <p className="hand text-lg text-subtle" aria-hidden="true">
            my stack
          </p>
          <ul className="mt-2 flex flex-wrap items-center gap-1" aria-label="Tools I use most">
            {heroStack.map((tool) => (
              <li key={tool.name} title={tool.name} className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground">
                <ToolIcon icon={tool.icon} name={tool.name} className="h-[18px] w-[18px]" />
                <span className="sr-only">{tool.name}</span>
              </li>
            ))}
            <li>
              <a href="#stack" className="hand ml-1 text-lg text-subtle hover:text-foreground">
                + more
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
