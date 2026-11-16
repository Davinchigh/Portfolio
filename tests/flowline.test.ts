import { describe, expect, it } from "vitest"
import { accuracy, predict, train } from "../lib/flowline/classifier"
import { HELD_OUT, SAMPLE_INVOICES, SAMPLE_MESSAGES, TRAINING } from "../lib/flowline/data"
import { order, runWorkflow, validate, type RunEvent, type Workflow } from "../lib/flowline/engine"
import { extractEntities, invoiceProblems, parseInvoice } from "../lib/flowline/extract"
import { invoiceIntake, supportTriage } from "../lib/flowline/workflows"

const instant = { sleep: async () => {} }

describe("engine", () => {
  it("runs steps in dependency order and passes outputs along", async () => {
    const wf: Workflow<number> = {
      id: "sum",
      name: "sum",
      steps: [
        { id: "c", name: "c", needs: ["a", "b"], run: ({ outputs }) => (outputs.a as number) + (outputs.b as number) },
        { id: "a", name: "a", run: ({ input }) => input + 1 },
        { id: "b", name: "b", run: ({ input }) => input * 10 },
      ],
    }
    const result = await runWorkflow(wf, 2, instant)
    expect(result.status).toBe("succeeded")
    expect(result.outputs).toEqual({ a: 3, b: 20, c: 23 })
  })

  it("groups independent steps into the same wave", () => {
    const wf: Workflow = {
      id: "w",
      name: "w",
      steps: [
        { id: "a", name: "a", run: () => 1 },
        { id: "b", name: "b", needs: ["a"], run: () => 1 },
        { id: "c", name: "c", needs: ["a"], run: () => 1 },
        { id: "d", name: "d", needs: ["b", "c"], run: () => 1 },
      ],
    }
    expect(order(wf)).toEqual([["a"], ["b", "c"], ["d"]])
  })

  it("runs steps in the same wave at the same time", async () => {
    let running = 0
    let peak = 0
    const slow = async () => {
      running++
      peak = Math.max(peak, running)
      await new Promise((r) => setTimeout(r, 5))
      running--
    }
    const wf: Workflow = { id: "p", name: "p", steps: [{ id: "a", name: "a", run: slow }, { id: "b", name: "b", run: slow }] }
    await runWorkflow(wf, null)
    expect(peak).toBe(2)
  })

  it("retries a failing step with exponential backoff", async () => {
    const waits: number[] = []
    const wf: Workflow = {
      id: "r",
      name: "r",
      steps: [
        {
          id: "flaky",
          name: "flaky",
          retry: { attempts: 4, backoffMs: 100 },
          run: ({ attempt }) => {
            if (attempt < 4) throw new Error("not yet")
            return "done"
          },
        },
      ],
    }
    const result = await runWorkflow(wf, null, { sleep: async (ms) => void waits.push(ms) })
    expect(result.steps.flaky).toMatchObject({ status: "succeeded", attempts: 4, output: "done" })
    expect(waits).toEqual([100, 200, 400])
  })

  it("fails after the last attempt and skips everything downstream", async () => {
    const wf: Workflow = {
      id: "f",
      name: "f",
      steps: [
        { id: "a", name: "a", retry: { attempts: 2, backoffMs: 1 }, run: () => { throw new Error("boom") } },
        { id: "b", name: "b", needs: ["a"], run: () => 1 },
        { id: "c", name: "c", needs: ["b"], run: () => 1 },
        { id: "d", name: "d", run: () => "independent" },
      ],
    }
    const result = await runWorkflow(wf, null, instant)
    expect(result.status).toBe("failed")
    expect(result.steps.a).toMatchObject({ status: "failed", attempts: 2, error: "boom" })
    expect(result.steps.b.status).toBe("skipped")
    expect(result.steps.c.status).toBe("skipped")
    expect(result.steps.d.status).toBe("succeeded")
  })

  it("skips a step whose condition is false, without failing the run", async () => {
    const wf: Workflow<number> = {
      id: "s",
      name: "s",
      steps: [
        { id: "a", name: "a", run: ({ input }) => input },
        { id: "big", name: "big", needs: ["a"], when: ({ outputs }) => (outputs.a as number) > 10, run: () => "big" },
      ],
    }
    expect((await runWorkflow(wf, 3, instant)).steps.big).toMatchObject({ status: "skipped", reason: "condition not met" })
    expect((await runWorkflow(wf, 30, instant)).steps.big.status).toBe("succeeded")
    expect((await runWorkflow(wf, 3, instant)).status).toBe("succeeded")
  })

  it("emits events in a sensible order", async () => {
    const events: RunEvent["type"][] = []
    const wf: Workflow = { id: "e", name: "e", steps: [{ id: "a", name: "a", run: () => 1 }] }
    await runWorkflow(wf, null, { onEvent: (e) => events.push(e.type) })
    expect(events).toEqual(["run:start", "step:start", "step:success", "run:end"])
  })

  it("rejects cycles, duplicate ids and unknown dependencies", () => {
    const step = (id: string, needs?: string[]) => ({ id, name: id, needs, run: () => 1 })
    expect(() => validate({ id: "x", name: "x", steps: [step("a", ["b"]), step("b", ["a"])] })).toThrow(/cycle/)
    expect(() => validate({ id: "x", name: "x", steps: [step("a"), step("a")] })).toThrow(/Duplicate/)
    expect(() => validate({ id: "x", name: "x", steps: [step("a", ["nope"])] })).toThrow(/unknown step/)
  })
})

describe("classifier", () => {
  const model = train(TRAINING)

  it("learns five intents from the training set", () => {
    expect(model.labels).toEqual(["account", "billing", "delivery", "sales", "technical"])
  })

  it("labels at least 90% of held-out messages correctly", () => {
    expect(accuracy(model, HELD_OUT)).toBeGreaterThanOrEqual(0.9)
  })

  it("returns probabilities that sum to one, and evidence words", () => {
    const p = predict(model, "I was charged twice, please refund my payment")
    expect(p.label).toBe("billing")
    expect(p.scores.reduce((t, s) => t + s.probability, 0)).toBeCloseTo(1, 6)
    expect(p.evidence.length).toBeGreaterThan(0)
  })
})

describe("extraction", () => {
  it("finds emails, phones, amounts, ids, dates and urgency", () => {
    const e = extractEntities("URGENT!! Charged GH₵ 1,480.50 on 3 Nov, order #48213. Call 024 555 0142 or ama@adomstores.com. Third time I'm asking.")
    expect(e.emails).toEqual(["ama@adomstores.com"])
    expect(e.phones).toEqual(["0245550142"])
    expect(e.amounts).toEqual([{ value: 1480.5, currency: "GHS" }])
    expect(e.orderIds).toEqual(["#48213"])
    expect(e.dates).toEqual(["3 Nov"])
    expect(e.urgency).toEqual(expect.arrayContaining(["urgent", "repeat contact", "!!"]))
  })

  it("parses an invoice and checks its arithmetic", () => {
    const clean = parseInvoice(SAMPLE_INVOICES[0].text)
    expect(clean).toMatchObject({ number: "INV-2118", vendor: "Kasapa Packaging Ltd", due: "2026-11-24", subtotal: 645, total: 741.75 })
    expect(clean.lines).toHaveLength(3)
    expect(invoiceProblems(clean)).toEqual([])
    expect(invoiceProblems(parseInvoice(SAMPLE_INVOICES[1].text))[0]).toMatch(/total says 1618.00/)
  })
})

describe("workflows", () => {
  it("triages an urgent double charge to billing, escalates it and drafts a reply", async () => {
    const result = await runWorkflow(supportTriage(), SAMPLE_MESSAGES[0].text, instant)
    expect(result.status).toBe("succeeded")
    expect(result.outputs.classify).toMatchObject({ label: "billing" })
    expect(result.steps.customer.attempts).toBe(2)
    expect(result.outputs.priority).toMatchObject({ level: "high" })
    expect(result.outputs.route).toMatchObject({ team: "billing", slaHours: 2 })
    expect(result.steps.escalate.status).toBe("succeeded")
    expect((result.outputs.draft as { body: string }).body).toContain("Hello Ama,")
  })

  it("does not escalate a routine pricing question", async () => {
    const result = await runWorkflow(supportTriage(), SAMPLE_MESSAGES[2].text, instant)
    expect(result.outputs.classify).toMatchObject({ label: "sales" })
    expect(result.steps.escalate.status).toBe("skipped")
    expect(result.status).toBe("succeeded")
  })

  it("auto-approves and schedules a small clean invoice", async () => {
    const result = await runWorkflow(invoiceIntake(), SAMPLE_INVOICES[0].text, instant)
    expect(result.outputs.approve).toMatchObject({ decision: "auto-approved" })
    expect(result.outputs.schedule).toMatchObject({ payOn: "2026-11-22", amount: 741.75 })
  })

  it("stops an invoice whose totals do not add up", async () => {
    const result = await runWorkflow(invoiceIntake(), SAMPLE_INVOICES[1].text, instant)
    expect(result.status).toBe("failed")
    expect(result.steps.check.status).toBe("failed")
    expect(result.steps.approve.status).toBe("skipped")
    expect(result.steps.notify.status).toBe("skipped")
  })

  it("stops a duplicate and sends a large invoice for sign-off without scheduling it", async () => {
    const duplicate = await runWorkflow(invoiceIntake(), SAMPLE_INVOICES[2].text, instant)
    expect(duplicate.steps.duplicate.error).toMatch(/already been paid/)
    const large = await runWorkflow(invoiceIntake(), SAMPLE_INVOICES[3].text, instant)
    expect(large.outputs.approve).toMatchObject({ decision: "needs finance director" })
    expect(large.steps.schedule.status).toBe("skipped")
    expect(large.outputs.notify).toMatchObject({ to: "finance director" })
  })
})
