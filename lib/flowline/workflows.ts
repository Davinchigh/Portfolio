import { predict, train, type Prediction } from "./classifier"
import { CUSTOMERS, PAID_INVOICES, TEAMS, TRAINING } from "./data"
import type { Step, Workflow } from "./engine"
import { extractEntities, invoiceProblems, parseInvoice, type Entities, type Invoice } from "./extract"

/** `pause` lets a UI slow the steps down enough to watch. Tests pass nothing and run instantly. */
type Pace = { pause?: (ms: number) => Promise<void> }

const model = train(TRAINING)

type Customer = { known: boolean; name?: string; plan?: string; since?: number; openTickets?: number }
type Priority = { level: "low" | "normal" | "high"; score: number; reasons: string[] }
type Route = { team: string; slaHours: number; needsHuman: boolean }

const REPLIES: Record<string, string> = {
  billing: "I'm sorry about the trouble with your payment. I've passed this to our billing team with the details below, and they will check the charge and put it right.",
  technical: "Thanks for reporting this. I've logged it with our support engineers along with the details below so they can reproduce it.",
  account: "I can help you get back into your account. I've sent this to the team that handles access, and they will confirm it's you before changing anything.",
  sales: "Thanks for your interest. I've asked our sales team to send you pricing for what you described.",
  delivery: "I'm sorry your order hasn't gone to plan. I've asked our logistics team to trace it using the reference below.",
}

export function supportTriage({ pause = async () => {} }: Pace = {}): Workflow<string> {
  const steps: Step<string>[] = [
    {
      id: "clean",
      name: "clean the message",
      about: "trim it, collapse whitespace, count the words",
      run: async ({ input }) => {
        await pause(350)
        const text = input.replace(/\s+/g, " ").trim()
        if (!text) throw new Error("the message is empty")
        return { text, words: text.split(" ").length }
      },
    },
    {
      id: "classify",
      name: "classify the intent",
      about: `naive bayes model trained on ${model.examples} labelled messages`,
      needs: ["clean"],
      run: async ({ outputs }) => {
        await pause(700)
        return predict(model, (outputs.clean as { text: string }).text)
      },
    },
    {
      id: "extract",
      name: "extract the details",
      about: "emails, phone numbers, amounts, order ids, dates, urgency",
      needs: ["clean"],
      run: async ({ outputs }) => {
        await pause(500)
        return extractEntities((outputs.clean as { text: string }).text)
      },
    },
    {
      id: "customer",
      name: "look up the customer",
      about: "a stand-in for a CRM call that times out on its first try",
      needs: ["extract"],
      retry: { attempts: 3, backoffMs: 400 },
      run: async ({ outputs, attempt }): Promise<Customer> => {
        await pause(450)
        if (attempt === 1) throw new Error("customer directory timed out")
        const email = (outputs.extract as Entities).emails[0]
        const found = email ? CUSTOMERS[email] : undefined
        return found ? { known: true, ...found } : { known: false }
      },
    },
    {
      id: "priority",
      name: "score the priority",
      about: "urgency words, repeat contact, plan and money at stake",
      needs: ["classify", "extract", "customer"],
      run: async ({ outputs }): Promise<Priority> => {
        await pause(400)
        const entities = outputs.extract as Entities
        const customer = outputs.customer as Customer
        const intent = outputs.classify as Prediction
        const reasons: string[] = []
        let score = 0
        if (entities.urgency.length) {
          score += Math.min(3, entities.urgency.length)
          reasons.push(`urgent wording: ${entities.urgency.join(", ")}`)
        }
        if (customer.plan === "business") {
          score += 2
          reasons.push("business plan customer")
        } else if (customer.plan === "pro") {
          score += 1
          reasons.push("pro plan customer")
        }
        if ((customer.openTickets ?? 0) > 0) {
          score += 1
          reasons.push(`${customer.openTickets} tickets already open`)
        }
        if (intent.label === "billing" && entities.amounts.length) {
          score += 1
          reasons.push("money already taken")
        }
        const level = score >= 4 ? "high" : score >= 2 ? "normal" : "low"
        return { level, score, reasons }
      },
    },
    {
      id: "route",
      name: "route to a team",
      about: "by intent, with a response target; unsure cases go to a person",
      needs: ["classify", "priority"],
      run: async ({ outputs }): Promise<Route> => {
        await pause(350)
        const intent = outputs.classify as Prediction
        const priority = outputs.priority as Priority
        const base = TEAMS[intent.label]
        const needsHuman = intent.confidence < 0.6
        return {
          team: needsHuman ? "triage desk (a person decides)" : base.team,
          slaHours: priority.level === "high" ? Math.ceil(base.slaHours / 4) : base.slaHours,
          needsHuman,
        }
      },
    },
    {
      id: "escalate",
      name: "page the duty lead",
      about: "only runs when the priority is high",
      needs: ["priority", "route"],
      when: ({ outputs }) => (outputs.priority as Priority | undefined)?.level === "high",
      run: async ({ outputs }) => {
        await pause(350)
        const route = outputs.route as Route
        return { paged: `${route.team} duty lead`, channel: "on-call" }
      },
    },
    {
      id: "draft",
      name: "draft the reply",
      about: "a template filled with what was found, for a person to send",
      needs: ["classify", "extract", "customer", "route"],
      run: async ({ outputs }) => {
        await pause(500)
        const intent = outputs.classify as Prediction
        const entities = outputs.extract as Entities
        const customer = outputs.customer as Customer
        const route = outputs.route as Route
        const greeting = customer.name ? `Hello ${customer.name.split(" ")[0]},` : "Hello,"
        const details = [
          entities.orderIds.length ? `reference ${entities.orderIds.join(", ")}` : null,
          entities.amounts.length ? `amount ${entities.amounts.map((a) => `${a.currency} ${a.value.toFixed(2)}`).join(", ")}` : null,
          entities.dates.length ? `date ${entities.dates.join(", ")}` : null,
        ].filter(Boolean)
        return {
          to: entities.emails[0] ?? "(no email found, reply in the original channel)",
          body: [
            greeting,
            REPLIES[intent.label],
            details.length ? `What I've noted: ${details.join("; ")}.` : null,
            `You'll hear from us within ${route.slaHours} working hour${route.slaHours === 1 ? "" : "s"}.`,
          ]
            .filter(Boolean)
            .join("\n\n"),
        }
      },
    },
  ]
  return { id: "support-triage", name: "support inbox triage", steps }
}

type Approval = { decision: "auto-approved" | "needs manager" | "needs finance director"; limit: string }

export function invoiceIntake({ pause = async () => {} }: Pace = {}): Workflow<string> {
  const steps: Step<string>[] = [
    {
      id: "read",
      name: "read the invoice",
      about: "vendor, number, dates, line items and totals",
      run: async ({ input }): Promise<Invoice> => {
        await pause(600)
        if (!input.trim()) throw new Error("the invoice is empty")
        return parseInvoice(input)
      },
    },
    {
      id: "check",
      name: "check the arithmetic",
      about: "line items against the subtotal, subtotal and tax against the total",
      needs: ["read"],
      run: async ({ outputs }) => {
        await pause(550)
        const problems = invoiceProblems(outputs.read as Invoice)
        if (problems.length) throw new Error(problems.join("; "))
        return { ok: true, lines: (outputs.read as Invoice).lines.length }
      },
    },
    {
      id: "duplicate",
      name: "check for a duplicate",
      about: "against invoice numbers already paid",
      needs: ["read"],
      run: async ({ outputs }) => {
        await pause(450)
        const number = (outputs.read as Invoice).number
        if (number && PAID_INVOICES.includes(number)) throw new Error(`${number} has already been paid`)
        return { duplicate: false }
      },
    },
    {
      id: "approve",
      name: "decide who approves",
      about: "under 1,000 is automatic, under 5,000 a manager, above that finance",
      needs: ["check", "duplicate"],
      run: async ({ outputs }): Promise<Approval> => {
        await pause(400)
        const total = (outputs.read as Invoice).total ?? 0
        if (total < 1000) return { decision: "auto-approved", limit: "under 1,000" }
        if (total < 5000) return { decision: "needs manager", limit: "1,000 to 5,000" }
        return { decision: "needs finance director", limit: "over 5,000" }
      },
    },
    {
      id: "schedule",
      name: "schedule the payment",
      about: "two days before the due date; only for automatic approvals",
      needs: ["approve"],
      when: ({ outputs }) => (outputs.approve as Approval | undefined)?.decision === "auto-approved",
      run: async ({ outputs }) => {
        await pause(400)
        const invoice = outputs.read as Invoice
        const due = invoice.due ? new Date(`${invoice.due}T00:00:00Z`) : null
        const payOn = due ? new Date(due.getTime() - 2 * 86_400_000).toISOString().slice(0, 10) : "on approval"
        return { payOn, amount: invoice.total, vendor: invoice.vendor }
      },
    },
    {
      id: "notify",
      name: "tell the right person",
      about: "a summary for the approver, or a confirmation for accounts",
      needs: ["approve"],
      run: async ({ outputs }) => {
        await pause(350)
        const invoice = outputs.read as Invoice
        const approval = outputs.approve as Approval
        const to = approval.decision === "auto-approved" ? "accounts" : approval.decision === "needs manager" ? "shop manager" : "finance director"
        return { to, message: `${invoice.number} from ${invoice.vendor}, ${invoice.total?.toFixed(2)}: ${approval.decision}.` }
      },
    },
  ]
  return { id: "invoice-intake", name: "invoice intake", steps }
}

export const classifierModel = model
