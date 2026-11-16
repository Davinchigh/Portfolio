"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Check, Minus, Play, RotateCw, X } from "lucide-react"
import { accuracy, type Prediction } from "@/lib/flowline/classifier"
import { HELD_OUT, SAMPLE_INVOICES, SAMPLE_MESSAGES } from "@/lib/flowline/data"
import { order, runWorkflow, type RunEvent, type StepRecord, type StepStatus } from "@/lib/flowline/engine"
import { classifierModel, invoiceIntake, supportTriage } from "@/lib/flowline/workflows"

type Kind = "support" | "invoice"

const KINDS: { id: Kind; label: string; samples: { label: string; text: string }[]; hint: string }[] = [
  { id: "support", label: "support inbox", samples: SAMPLE_MESSAGES, hint: "paste any customer message, or pick one" },
  { id: "invoice", label: "invoice intake", samples: SAMPLE_INVOICES, hint: "edit the numbers and watch the check catch it" },
]

const ms = (n: number) => (n < 1000 ? `${Math.round(n)} ms` : `${(n / 1000).toFixed(1)} s`)

function StatusDot({ status }: { status: StepStatus }) {
  const base = "relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-300"
  if (status === "succeeded")
    return (
      <span className={`${base} border-route bg-route text-background`}>
        <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
      </span>
    )
  if (status === "failed")
    return (
      <span className={`${base} border-destructive bg-destructive text-destructive-foreground`}>
        <X className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
      </span>
    )
  if (status === "skipped")
    return (
      <span className={`${base} border-dashed border-input bg-background text-subtle`}>
        <Minus className="h-3.5 w-3.5" aria-hidden="true" />
      </span>
    )
  if (status === "running")
    return (
      <span className={`${base} border-route bg-background`}>
        <span className="h-2 w-2 animate-pulse rounded-full bg-route motion-reduce:animate-none" />
      </span>
    )
  return <span className={`${base} border-input bg-background`} />
}

/** A compact, readable view of what a step produced. */
function Output({ id, value }: { id: string; value: unknown }) {
  if (id === "classify") {
    const p = value as Prediction
    return (
      <div className="space-y-2">
        {p.scores.slice(0, 3).map((s) => (
          <div key={s.label} className="flex items-center gap-3">
            <span className="w-20 text-foreground">{s.label}</span>
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
              <span className="block h-full rounded-full bg-route transition-[width] duration-700" style={{ width: `${Math.max(2, s.probability * 100)}%` }} />
            </span>
            <span className="w-10 text-right tabular-nums">{Math.round(s.probability * 100)}%</span>
          </div>
        ))}
        {p.evidence.length > 0 && <p>because of: {p.evidence.join(", ")}</p>}
      </div>
    )
  }
  if (id === "draft") {
    const d = value as { to: string; body: string }
    return (
      <div>
        <p>to: {d.to}</p>
        <p className="mt-2 whitespace-pre-line font-sans text-sm leading-relaxed text-foreground">{d.body}</p>
      </div>
    )
  }
  return <pre className="whitespace-pre-wrap break-words">{JSON.stringify(value, null, 2)}</pre>
}

export function FlowlineDemo() {
  const [kind, setKind] = useState<Kind>("support")
  const [text, setText] = useState(SAMPLE_MESSAGES[0].text)
  const [records, setRecords] = useState<Record<string, StepRecord>>({})
  const [retries, setRetries] = useState<Record<string, string>>({})
  const [log, setLog] = useState<{ at: number; text: string }[]>([])
  const [state, setState] = useState<"idle" | "running" | "succeeded" | "failed">("idle")
  const [open, setOpen] = useState<string | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const runId = useRef(0)

  const workflow = useMemo(() => {
    const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const pause = (n: number) => new Promise<void>((resolve) => setTimeout(resolve, reduced ? 0 : n))
    return kind === "support" ? supportTriage({ pause }) : invoiceIntake({ pause })
  }, [kind])
  const waves = useMemo(() => order(workflow), [workflow])
  const heldOut = useMemo(() => Math.round(accuracy(classifierModel, HELD_OUT) * HELD_OUT.length), [])
  const config = KINDS.find((k) => k.id === kind)!

  const run = useCallback(
    async (input: string) => {
      const id = ++runId.current
      setRecords({})
      setRetries({})
      setLog([])
      setOpen(null)
      setState("running")
      const started = performance.now()
      const say = (line: string) => setLog((l) => [...l, { at: performance.now() - started, text: line }])
      const onEvent = (event: RunEvent) => {
        if (id !== runId.current) return
        if (event.type === "step:start") {
          setRecords((r) => ({ ...r, [event.step]: { id: event.step, status: "running", attempts: event.attempt } }))
          say(`${event.step}: started${event.attempt > 1 ? ` (attempt ${event.attempt})` : ""}`)
        } else if (event.type === "step:retry") {
          setRetries((r) => ({ ...r, [event.step]: event.error }))
          say(`${event.step}: ${event.error}, retrying in ${event.waitMs} ms`)
        } else if (event.type === "step:fail") say(`${event.step}: failed, ${event.error}`)
        else if (event.type === "step:skip") say(`${event.step}: skipped, ${event.reason}`)
        else if (event.type === "step:success") say(`${event.step}: done`)
      }
      const result = await runWorkflow(workflow, input, { onEvent })
      if (id !== runId.current) return
      setRecords(result.steps)
      setState(result.status)
      setElapsed(performance.now() - started)
      const failed = Object.values(result.steps).find((s) => s.status === "failed")
      const last = [...workflow.steps].reverse().find((s) => result.steps[s.id].status === "succeeded")
      setOpen(failed?.id ?? last?.id ?? null)
    },
    [workflow],
  )

  // Run the first sample once on arrival, so the page shows a finished run instead of an empty one.
  const started = useRef(false)
  useEffect(() => {
    if (started.current) return
    started.current = true
    void run(SAMPLE_MESSAGES[0].text)
  }, [run])

  const choose = (next: Kind) => {
    if (next === kind) return
    runId.current++
    setKind(next)
    setText(KINDS.find((k) => k.id === next)!.samples[0].text)
    setRecords({})
    setRetries({})
    setLog([])
    setState("idle")
    setOpen(null)
  }

  const live = Object.keys(records).length > 0
  const summary =
    state === "running"
      ? "running"
      : state === "idle"
        ? "ready"
        : `${state === "succeeded" ? "finished" : "stopped"} in ${ms(elapsed)}`

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      {/* Input */}
      <div className="rounded-2xl border bg-card p-5 sm:p-6">
        <div role="group" aria-label="Workflow" className="relative grid grid-cols-2 rounded-full border bg-background p-1">
          <span aria-hidden="true" className={`seg-pill inset-y-1 left-1 w-[calc(50%-4px)] ${kind === "invoice" ? "translate-x-full" : ""}`} />
          {KINDS.map((k) => (
            <button
              key={k.id}
              type="button"
              aria-pressed={kind === k.id}
              onClick={() => choose(k.id)}
              className={`relative z-10 min-h-11 rounded-full px-3 text-sm transition-colors duration-300 ${
                kind === k.id ? "text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {k.label}
            </button>
          ))}
        </div>

        <label htmlFor="flow-input" className="eyebrow mt-6 block">
          input
        </label>
        <textarea
          id="flow-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
          rows={kind === "invoice" ? 13 : 8}
          className="mt-2 w-full resize-y rounded-xl border bg-background p-3 font-mono text-[13px] leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-amber"
        />
        <p className="meta mt-2">{config.hint}</p>

        <ul className="mt-3 flex flex-wrap gap-2">
          {config.samples.map((s) => (
            <li key={s.label}>
              <button
                type="button"
                onClick={() => {
                  setText(s.text)
                  void run(s.text)
                }}
                className="min-h-9 rounded-full border px-3 text-xs text-muted-foreground transition-colors hover:border-route/60 hover:text-foreground"
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>

        <button type="button" onClick={() => run(text)} disabled={state === "running"} className="pill-button mt-6 disabled:opacity-60">
          {state === "running" ? <RotateCw className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
          {state === "running" ? "running" : "run the workflow"}
        </button>

        <p className="meta mt-6 leading-relaxed">
          runs in your browser. nothing you type is sent anywhere. the classifier was trained on {classifierModel.examples} labelled messages
          and gets {heldOut} of {HELD_OUT.length} held-out ones right.
        </p>
      </div>

      {/* Run */}
      <div className="rounded-2xl border bg-card p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <p className="eyebrow">{workflow.name}</p>
          <p className="meta" role="status">
            {summary}
          </p>
        </div>

        <ol className="relative mt-5 before:absolute before:bottom-3 before:left-[11px] before:top-3 before:w-px before:bg-border">
          {waves.flat().map((id) => {
            const step = workflow.steps.find((s) => s.id === id)!
            const record = records[id]
            const status: StepStatus = record?.status ?? "pending"
            const isOpen = open === id
            const time = record?.startedAt !== undefined && record?.endedAt !== undefined ? ms(record.endedAt - record.startedAt) : null
            const detail = record?.error ?? record?.reason
            const canOpen = record?.output !== undefined || Boolean(detail)
            return (
              <li key={id} className="relative">
                <button
                  type="button"
                  disabled={!canOpen}
                  aria-expanded={canOpen ? isOpen : undefined}
                  onClick={() => setOpen(isOpen ? null : id)}
                  className={`flex w-full items-start gap-3 rounded-lg py-2 pr-2 text-left transition-colors ${canOpen ? "hover:bg-accent/60" : ""}`}
                >
                  <StatusDot status={status} />
                  <span className="min-w-0 flex-1">
                    <span className={`block text-sm font-medium transition-colors ${status === "pending" && live ? "text-muted-foreground" : ""}`}>{step.name}</span>
                    <span className="meta mt-0.5 block">{step.about}</span>
                  </span>
                  <span className="meta flex shrink-0 flex-col items-end gap-1 pt-0.5">
                    {time && <span className="tabular-nums">{time}</span>}
                    {(record?.attempts ?? 0) > 1 && <span className="rounded-full border border-route/50 px-2 text-route">attempt {record!.attempts}</span>}
                    {status === "skipped" && <span>skipped</span>}
                  </span>
                </button>
                <div className="fold" data-open={isOpen && canOpen ? "" : undefined} inert={!(isOpen && canOpen)}>
                  <div>
                    <div className="mb-2 ml-9 rounded-xl border bg-background p-3 font-mono text-xs leading-relaxed text-muted-foreground">
                      {retries[id] && <p className="mb-2 text-route">first try: {retries[id]}. retried and recovered.</p>}
                      {detail ? <p className={status === "failed" ? "text-destructive" : ""}>{detail}</p> : record?.output !== undefined ? <Output id={id} value={record.output} /> : null}
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ol>

        <details className="mt-4 border-t pt-4">
          <summary className="meta cursor-pointer select-none py-1 hover:text-foreground">event log ({log.length})</summary>
          <ol className="mt-2 max-h-56 space-y-1 overflow-auto font-mono text-xs text-muted-foreground">
            {log.map((line, i) => (
              <li key={i} className="flex gap-3">
                <span className="w-14 shrink-0 text-right tabular-nums text-subtle">{Math.round(line.at)} ms</span>
                <span>{line.text}</span>
              </li>
            ))}
          </ol>
        </details>
      </div>
    </div>
  )
}
