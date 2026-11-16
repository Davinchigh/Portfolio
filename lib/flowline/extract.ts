/** Pulls structured details out of free text with plain pattern matching. */

export type Entities = {
  emails: string[]
  phones: string[]
  amounts: { value: number; currency: string }[]
  orderIds: string[]
  dates: string[]
  urgency: string[]
}

const unique = <T>(items: T[]) => [...new Set(items)]

export function extractEntities(text: string): Entities {
  const emails = unique(text.match(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g) ?? []).map((e) => e.toLowerCase())

  // Ghana numbers: +233 or a leading 0, nine more digits, with optional spaces or dashes.
  const phones = unique(
    (text.match(/(?:\+233|\b0)[\s-]?\d{2}[\s-]?\d{3}[\s-]?\d{4}\b/g) ?? []).map((p) => p.replace(/[\s-]/g, "")),
  )

  const amounts: Entities["amounts"] = []
  const money = /(GH₵|GHS|GHC|₵|\$|USD)\s?(\d[\d,]*(?:\.\d{1,2})?)|(\d[\d,]*(?:\.\d{1,2})?)\s?(cedis|dollars)/gi
  for (const m of text.matchAll(money)) {
    const raw = m[2] ?? m[3]
    const unit = (m[1] ?? m[4]).toLowerCase()
    amounts.push({ value: Number(raw.replace(/,/g, "")), currency: unit === "$" || unit === "usd" || unit === "dollars" ? "USD" : "GHS" })
  }

  const orderIds = unique((text.match(/#\d{4,}|\b(?:ORD|INV)-\d{3,}\b/gi) ?? []).map((id) => id.toUpperCase()))

  const dates = unique(
    text.match(
      /\b\d{4}-\d{2}-\d{2}\b|\b\d{1,2}\/\d{1,2}\/\d{2,4}\b|\b\d{1,2}(?:st|nd|rd|th)?\s(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\b/gi,
    ) ?? [],
  )

  const urgency: string[] = []
  const lower = text.toLowerCase()
  for (const word of ["urgent", "asap", "immediately", "today", "tomorrow", "right now"]) if (lower.includes(word)) urgency.push(word)
  if (/\b(second|third|fourth|2nd|3rd|4th) time\b/.test(lower)) urgency.push("repeat contact")
  if (/!{2,}/.test(text)) urgency.push("!!")

  return { emails, phones, amounts, orderIds, dates, urgency }
}

export type Invoice = {
  number: string | null
  vendor: string | null
  date: string | null
  due: string | null
  lines: { description: string; quantity: number; unitPrice: number; amount: number }[]
  subtotal: number | null
  tax: number | null
  total: number | null
}

const cents = (n: number) => Math.round(n * 100) / 100

export function parseInvoice(text: string): Invoice {
  const field = (pattern: RegExp) => text.match(pattern)?.[1]?.trim() ?? null
  const amount = (pattern: RegExp) => {
    const raw = field(pattern)
    return raw === null ? null : Number(raw.replace(/,/g, ""))
  }
  const lines: Invoice["lines"] = []
  for (const m of text.matchAll(/^(.+?)\s+(\d+(?:\.\d+)?)\s*x\s*(\d[\d,]*(?:\.\d{1,2})?)\s*$/gim)) {
    const quantity = Number(m[2])
    const unitPrice = Number(m[3].replace(/,/g, ""))
    lines.push({ description: m[1].trim(), quantity, unitPrice, amount: cents(quantity * unitPrice) })
  }
  return {
    number: field(/\b(INV-\d+)\b/i)?.toUpperCase() ?? null,
    vendor: field(/^vendor:\s*(.+)$/im),
    date: field(/^date:\s*(\d{4}-\d{2}-\d{2})/im),
    due: field(/^due:\s*(\d{4}-\d{2}-\d{2})/im),
    lines,
    subtotal: amount(/^subtotal:\s*([\d,.]+)/im),
    tax: amount(/^tax:\s*([\d,.]+)/im),
    total: amount(/^total:\s*([\d,.]+)/im),
  }
}

/** Every problem found with an invoice's numbers. An empty list means it adds up. */
export function invoiceProblems(invoice: Invoice): string[] {
  const problems: string[] = []
  if (!invoice.number) problems.push("no invoice number")
  if (!invoice.vendor) problems.push("no vendor")
  if (invoice.lines.length === 0) problems.push("no line items")
  if (invoice.subtotal === null || invoice.total === null) problems.push("subtotal or total missing")
  if (problems.length) return problems

  const sum = cents(invoice.lines.reduce((total, line) => total + line.amount, 0))
  if (sum !== invoice.subtotal) problems.push(`line items add up to ${sum.toFixed(2)}, but the subtotal says ${invoice.subtotal!.toFixed(2)}`)
  const expected = cents(invoice.subtotal! + (invoice.tax ?? 0))
  if (expected !== invoice.total) problems.push(`subtotal plus tax is ${expected.toFixed(2)}, but the total says ${invoice.total!.toFixed(2)}`)
  return problems
}
