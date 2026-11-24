import { buildIndex, search, type Doc } from "./search"

/**
 * Questions a visitor might ask, each with the passage that should answer it.
 * Scoring the search against these is what tells me whether a change made it better or worse.
 */
export const QUESTIONS: { question: string; expect: string[] }[] = [
  { question: "has he led a team?", expect: ["role:coderaccoon"] },
  { question: "what did he do at CodeRaccoon?", expect: ["role:coderaccoon"] },
  { question: "any SAP experience?", expect: ["role:coderaccoon", "cert:brandenburg-university-of-applied-sciences"] },
  { question: "does he have testing experience?", expect: ["role:coderaccoon", "work:ai-test-case-generator"] },
  { question: "where did he learn Java?", expect: ["role:kng"] },
  { question: "has he worked with Odoo?", expect: ["role:nextit", "role:ideal-market"] },
  { question: "any freelance work?", expect: ["role:upwork"] },
  { question: "what volunteering has he done?", expect: ["role:ideal-market", "role:rbf", "role:nextgen"] },
  { question: "how can I contact him?", expect: ["contact"] },
  { question: "is he available for hire?", expect: ["contact", "about"] },
  { question: "what is ShopTally?", expect: ["work:shoptally"] },
  { question: "study planner with a focus timer", expect: ["work:studyflow"] },
  { question: "has he built an MCP server?", expect: ["work:bfb-mcp"] },
  { question: "where did he study?", expect: ["road"] },
  { question: "mobile money reconciliation", expect: ["work:shoptally"] },
  { question: "has he built anything with FastAPI and MySQL?", expect: ["work:shoptally"] },
  { question: "projects using an LLM to generate tests", expect: ["work:ai-test-case-generator"] },
  { question: "show me workflow automation work", expect: ["work:flowline"] },
  { question: "does he know retries and backoff?", expect: ["work:flowline"] },
  { question: "has he built a search engine or RAG?", expect: ["work:recall"] },
  { question: "time series forecasting", expect: ["work:covid-time-series"] },
  { question: "what was his final year project?", expect: ["work:covid-time-series"] },
  { question: "desktop app in Java", expect: ["work:java-inventory"] },
  { question: "timetable app for students", expect: ["work:class-planner"] },
  { question: "tell me about the card game", expect: ["work:zero", "side:zero-an-original-card-game"] },
  { question: "what certificates does he have from Anthropic?", expect: ["cert:claude-academy-by-anthropic"] },
  { question: "prompt engineering certification", expect: ["cert:udemy", "cert:alx-ghana", "role:coderaccoon", "cert:claude-academy-by-anthropic"] },
  { question: "does he speak German?", expect: ["cert:ambylon", "cert:ahk-german-industry-and-commerce-in-ghana"] },
  { question: "which design tools does he use?", expect: ["stack:sap-learning-and-design"] },
  { question: "what languages and frameworks does he build with?", expect: ["stack:languages-and-frontend"] },
  { question: "apps I can try right now", expect: ["build:masterclass", "build:promptmastery", "build:the-climb"] },
  { question: "fashion brand website", expect: ["side:lizab-house-of-fashion"] },
  { question: "gardening website he designed", expect: ["design:glee-garden"] },
  { question: "university hall website", expect: ["design:elizabeth-sey-hall", "design:jean-nelson-aka-hall"] },
  { question: "what has the road taught him?", expect: ["lesson:start-before-you-feel-ready", "lesson:rebuild-what-you-lose", "lesson:teach-what-you-learn"] },
]

export type Evaluation = {
  questions: number
  /** Questions whose first result is a correct passage. */
  top1: number
  /** Questions with a correct passage in the first three results. */
  top3: number
  /** Mean reciprocal rank: 1 if always first, lower the further down the right passage sits. */
  mrr: number
  misses: { question: string; got: string[] }[]
}

export function evaluate(docs: Doc[]): Evaluation {
  const index = buildIndex(docs)
  let top1 = 0
  let top3 = 0
  let reciprocal = 0
  const misses: Evaluation["misses"] = []
  for (const { question, expect } of QUESTIONS) {
    const ids = search(index, question, 10).map((h) => h.doc.id)
    const rank = ids.findIndex((id) => expect.includes(id))
    if (rank === 0) top1++
    if (rank >= 0 && rank < 3) top3++
    else misses.push({ question, got: ids.slice(0, 3) })
    if (rank >= 0) reciprocal += 1 / (rank + 1)
  }
  return { questions: QUESTIONS.length, top1, top3, mrr: reciprocal / QUESTIONS.length, misses }
}
