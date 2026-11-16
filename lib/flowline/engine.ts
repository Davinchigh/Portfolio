/**
 * Flowline: a small workflow engine.
 *
 * A workflow is a set of steps with dependencies (a DAG). The engine runs every step whose
 * dependencies are done, in parallel where it can, and gives each step:
 *   - the outputs of the steps it depends on,
 *   - retries with exponential backoff when it throws,
 *   - an optional `when` condition that skips it (and everything that needs it).
 * Every state change is emitted as an event, so a UI or a log can follow the run live.
 *
 * It has no dependencies and no clock of its own: `sleep` and `now` are injected, which is what
 * makes the retry timing testable without waiting.
 */

export type StepStatus = "pending" | "running" | "succeeded" | "failed" | "skipped"

export type Outputs = Record<string, unknown>

export type StepContext<I> = {
  input: I
  /** Outputs of finished steps, by step id. */
  outputs: Outputs
  /** 1 for the first try. */
  attempt: number
}

export type Step<I = unknown> = {
  id: string
  name: string
  /** One line on what the step does, shown in the run view. */
  about?: string
  /** Ids of steps that must succeed first. */
  needs?: string[]
  /** Return false to skip this step. Steps that need a skipped step are skipped too. */
  when?: (ctx: StepContext<I>) => boolean
  retry?: { attempts: number; backoffMs: number }
  run: (ctx: StepContext<I>) => unknown | Promise<unknown>
}

export type Workflow<I = unknown> = {
  id: string
  name: string
  steps: Step<I>[]
}

export type StepRecord = {
  id: string
  status: StepStatus
  attempts: number
  startedAt?: number
  endedAt?: number
  output?: unknown
  error?: string
  /** Why a step was skipped: its own condition, or a step it needed. */
  reason?: string
}

export type RunEvent =
  | { type: "run:start"; at: number }
  | { type: "step:start"; at: number; step: string; attempt: number }
  | { type: "step:retry"; at: number; step: string; attempt: number; error: string; waitMs: number }
  | { type: "step:success"; at: number; step: string; output: unknown }
  | { type: "step:fail"; at: number; step: string; error: string }
  | { type: "step:skip"; at: number; step: string; reason: string }
  | { type: "run:end"; at: number; status: "succeeded" | "failed" }

export type RunResult = {
  status: "succeeded" | "failed"
  steps: Record<string, StepRecord>
  outputs: Outputs
  startedAt: number
  endedAt: number
}

export type RunOptions = {
  onEvent?: (event: RunEvent) => void
  sleep?: (ms: number) => Promise<void>
  now?: () => number
}

/** Throws if the workflow has duplicate ids, unknown dependencies or a cycle. */
export function validate<I>(workflow: Workflow<I>): void {
  const ids = new Set<string>()
  for (const step of workflow.steps) {
    if (ids.has(step.id)) throw new Error(`Duplicate step id "${step.id}"`)
    ids.add(step.id)
  }
  for (const step of workflow.steps) {
    for (const dep of step.needs ?? []) {
      if (!ids.has(dep)) throw new Error(`Step "${step.id}" needs unknown step "${dep}"`)
    }
  }
  order(workflow)
}

/** Steps grouped into waves: every step in a wave only needs steps from earlier waves. */
export function order<I>(workflow: Workflow<I>): string[][] {
  const remaining = new Map(workflow.steps.map((s) => [s.id, new Set(s.needs ?? [])]))
  const waves: string[][] = []
  while (remaining.size > 0) {
    const ready = [...remaining].filter(([, needs]) => needs.size === 0).map(([id]) => id)
    if (ready.length === 0) throw new Error(`Workflow "${workflow.id}" has a dependency cycle`)
    for (const id of ready) remaining.delete(id)
    for (const needs of remaining.values()) for (const id of ready) needs.delete(id)
    waves.push(ready)
  }
  return waves
}

const message = (error: unknown) => (error instanceof Error ? error.message : String(error))

export async function runWorkflow<I>(workflow: Workflow<I>, input: I, options: RunOptions = {}): Promise<RunResult> {
  validate(workflow)
  const now = options.now ?? (() => Date.now())
  const sleep = options.sleep ?? ((ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms)))
  const emit = (event: RunEvent) => options.onEvent?.(event)

  const steps: Record<string, StepRecord> = Object.fromEntries(
    workflow.steps.map((s) => [s.id, { id: s.id, status: "pending", attempts: 0 } satisfies StepRecord]),
  )
  const outputs: Outputs = {}
  const startedAt = now()
  emit({ type: "run:start", at: startedAt })

  const skip = (step: Step<I>, reason: string) => {
    steps[step.id] = { ...steps[step.id], status: "skipped", reason }
    emit({ type: "step:skip", at: now(), step: step.id, reason })
  }

  const execute = async (step: Step<I>) => {
    const blocker = (step.needs ?? []).find((dep) => steps[dep].status !== "succeeded")
    if (blocker) return skip(step, `needs "${blocker}", which ${steps[blocker].status === "failed" ? "failed" : "was skipped"}`)

    const record = steps[step.id]
    if (step.when && !step.when({ input, outputs, attempt: 1 })) return skip(step, "condition not met")

    const maxAttempts = Math.max(1, step.retry?.attempts ?? 1)
    record.startedAt = now()
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      record.status = "running"
      record.attempts = attempt
      emit({ type: "step:start", at: now(), step: step.id, attempt })
      try {
        const output = await step.run({ input, outputs, attempt })
        record.status = "succeeded"
        record.output = output
        record.endedAt = now()
        outputs[step.id] = output
        emit({ type: "step:success", at: record.endedAt, step: step.id, output })
        return
      } catch (error) {
        const text = message(error)
        if (attempt < maxAttempts) {
          const waitMs = (step.retry?.backoffMs ?? 0) * 2 ** (attempt - 1)
          emit({ type: "step:retry", at: now(), step: step.id, attempt, error: text, waitMs })
          await sleep(waitMs)
        } else {
          record.status = "failed"
          record.error = text
          record.endedAt = now()
          emit({ type: "step:fail", at: record.endedAt, step: step.id, error: text })
        }
      }
    }
  }

  const byId = new Map(workflow.steps.map((s) => [s.id, s]))
  for (const wave of order(workflow)) {
    await Promise.all(wave.map((id) => execute(byId.get(id)!)))
  }

  const status = Object.values(steps).some((s) => s.status === "failed") ? "failed" : "succeeded"
  const endedAt = now()
  emit({ type: "run:end", at: endedAt, status })
  return { status, steps, outputs, startedAt, endedAt }
}
