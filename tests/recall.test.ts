import { describe, expect, it } from "vitest"
import { corpus } from "../lib/recall/corpus"
import { evaluate, QUESTIONS } from "../lib/recall/eval"
import { buildIndex, highlight, search, stem, tokenize } from "../lib/recall/search"

describe("text handling", () => {
  it("stems regular and irregular forms to the same word", () => {
    expect(["tests", "tested", "testing"].map(stem)).toEqual(["test", "test", "test"])
    expect(stem("taught")).toBe("teach")
    expect(stem("led")).toBe("lead")
  })

  it("drops stop words and punctuation", () => {
    expect(tokenize("What did he do at the supermarket?")).toEqual(["supermarket"])
  })
})

describe("search", () => {
  const docs = [
    { id: "a", kind: "project", title: "Stock app", text: "A desktop stock manager written in Java. It tracks inventory.", href: "/a" },
    { id: "b", kind: "project", title: "Forecasts", text: "Forecasting daily cases with Holt-Winters models in Python.", href: "/b" },
    { id: "c", kind: "role", title: "Team lead", text: "Led a team of course builders. Ran testing for a learning platform.", href: "/c" },
  ]
  const index = buildIndex(docs)

  it("ranks the passage that contains the query terms first", () => {
    expect(search(index, "java inventory")[0].doc.id).toBe("a")
    expect(search(index, "forecasting in python")[0].doc.id).toBe("b")
  })

  it("matches through synonyms and stemming", () => {
    expect(search(index, "has he managed people?")[0].doc.id).toBe("c")
    expect(search(index, "QA experience")[0].doc.id).toBe("c")
  })

  it("picks the sentence that answers, and marks the matching words", () => {
    const [hit] = search(index, "testing")
    expect(hit.snippet).toBe("Ran testing for a learning platform.")
    expect(highlight(hit.snippet, hit.matched).filter((p) => p.hit).map((p) => p.text)).toEqual(["testing"])
  })

  it("returns nothing for an empty or all stop word query", () => {
    expect(search(index, "")).toEqual([])
    expect(search(index, "what is the")).toEqual([])
  })
})

describe("evaluation on the real site content", () => {
  const docs = corpus()
  const result = evaluate(docs)

  it("only expects passages that exist", () => {
    const ids = new Set(docs.map((d) => d.id))
    for (const q of QUESTIONS) for (const id of q.expect) expect(ids, `${q.question} expects ${id}`).toContain(id)
  })

  it("puts a right answer in the top three for at least 90% of questions", () => {
    expect(result.top3 / result.questions).toBeGreaterThanOrEqual(0.9)
  })

  it("puts a right answer first for at least 80% of questions", () => {
    expect(result.top1 / result.questions).toBeGreaterThanOrEqual(0.8)
  })
})
