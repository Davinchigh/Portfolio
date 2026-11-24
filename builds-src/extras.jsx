// ═══════════════════════════════════════════════════════════════════════════════
// LESSON EXTRAS: illustrations, interactive activities and a quick check per lesson.
// Built like Rise 360 blocks: every lesson asks the learner to do something before moving on.
// Concatenated into masterclass.jsx by build.mjs (it shares React and the helpers above).
// ═══════════════════════════════════════════════════════════════════════════════

// ---------- Illustrations (inline SVG, self-contained, each with a text alternative) ----------
const FIG_TEXT = "#E8E6E1", FIG_MUTED = "#8A8A8A", FIG_LINE = "rgba(255,255,255,0.14)";

function Figure({ alt, caption, children, color }) {
  return (
    <figure style={{ margin: "22px 0", padding: 18, borderRadius: 14, background: "rgba(255,255,255,0.025)", border: `1px solid ${color}26` }}>
      <svg viewBox="0 0 640 240" role="img" aria-label={alt} style={{ width: "100%", height: "auto", display: "block" }}>
        <title>{alt}</title>
        {children}
      </svg>
      {caption && <figcaption style={{ marginTop: 10, fontSize: 12, color: FIG_MUTED, lineHeight: 1.6 }}>{caption}</figcaption>}
    </figure>
  );
}
const Box = ({ x, y, w, h, label, sub, color, filled }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx="12" fill={filled ? color + "26" : "rgba(255,255,255,0.03)"} stroke={filled ? color : FIG_LINE} />
    <text x={x + w / 2} y={y + h / 2 + (sub ? -4 : 5)} textAnchor="middle" fill={FIG_TEXT} fontSize="14" fontWeight="700">{label}</text>
    {sub && <text x={x + w / 2} y={y + h / 2 + 15} textAnchor="middle" fill={FIG_MUTED} fontSize="11">{sub}</text>}
  </g>
);
const Arrow = ({ x1, y1, x2, y2, color }) => (
  <g stroke={color} strokeWidth="2" fill="none">
    <line x1={x1} y1={y1} x2={x2} y2={y2} />
    <path d={`M${x2 - 8} ${y2 - 5} L${x2} ${y2} L${x2 - 8} ${y2 + 5}`} />
  </g>
);

const FIGURES = {
  prediction: (c) => (
    <Figure color={c} alt="Diagram: the words 'Write a warm welcome for' go into an AI model, which ranks possible next words by likelihood: 'our' 62 percent, 'new' 21 percent, 'the' 11 percent, 'customers' 6 percent." caption="AI writes by predicting the most likely next word, again and again. Your prompt decides which words look likely.">
      <Box x={20} y={88} w={190} h={64} label="Your prompt" sub="“Write a warm welcome for…”" color={c} />
      <Arrow x1={214} y1={120} x2={262} y2={120} color={c} />
      <Box x={266} y={80} w={120} h={80} label="AI model" sub="patterns from text" color={c} filled />
      <Arrow x1={390} y1={120} x2={430} y2={120} color={c} />
      {[["our", 62], ["new", 21], ["the", 11], ["customers", 6]].map(([w, p], i) => (
        <g key={w}>
          <text x={440} y={62 + i * 40} fill={FIG_TEXT} fontSize="13">{w}</text>
          <rect x={520} y={50 + i * 40} width={100} height={14} rx="7" fill="rgba(255,255,255,0.06)" />
          <rect x={520} y={50 + i * 40} width={p} height={14} rx="7" fill={c} opacity={1 - i * 0.2} />
          <text x={620} y={62 + i * 40} textAnchor="end" fill={FIG_MUTED} fontSize="10">{p}%</text>
        </g>
      ))}
    </Figure>
  ),
  ingredients: (c) => (
    <Figure color={c} alt="Diagram: six prompt ingredients in a row, Role, Task, Context, Format, Tone and Constraints, combining into one complete prompt." caption="The six ingredients. Task is the only one you always need; each extra one makes the answer more yours.">
      {["Role", "Task", "Context", "Format", "Tone", "Limits"].map((t, i) => (
        <Box key={t} x={14 + i * 104} y={40} w={92} h={56} label={t} color={c} filled={t === "Task"} />
      ))}
      {[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={60 + i * 104} y1={100} x2={320} y2={160} stroke={FIG_LINE} />)}
      <Box x={200} y={160} w={240} h={56} label="A prompt that works" sub="specific, shaped, on brand" color={c} filled />
    </Figure>
  ),
  imageFormula: (c) => (
    <Figure color={c} alt="Diagram: the image prompt formula as six blocks, Subject, Style, Setting, Lighting, Mood and Technical specs, each with an example." caption="Fill each block and the image stops being random.">
      {[["Subject", "a straw handbag"], ["Style", "editorial"], ["Setting", "cream linen"], ["Lighting", "soft morning"], ["Mood", "calm, premium"], ["Specs", "4:5, sharp"]].map(([t, e], i) => (
        <Box key={t} x={10 + i * 105} y={80} w={95} h={72} label={t} sub={e} color={c} filled={i === 0} />
      ))}
    </Figure>
  ),
  automation: (c) => (
    <Figure color={c} alt="Diagram: an automation in three steps. A trigger, a new form submission, starts an AI step that scores and summarises it, which leads to an action, adding a row to a sheet and alerting you." caption="Every automation is a trigger, an AI step and an action.">
      <Box x={20} y={84} w={170} h={72} label="Trigger" sub="a form is submitted" color={c} />
      <Arrow x1={194} y1={120} x2={232} y2={120} color={c} />
      <Box x={236} y={84} w={170} h={72} label="AI step" sub="score + summarise (JSON)" color={c} filled />
      <Arrow x1={410} y1={120} x2={448} y2={120} color={c} />
      <Box x={452} y={84} w={170} h={72} label="Action" sub="add to sheet, alert you" color={c} />
    </Figure>
  ),
  agentLoop: (c) => (
    <Figure color={c} alt="Diagram: the agent loop. A goal leads to a plan, the agent acts with tools, checks the result, and loops back to plan again until the goal is met, then reports back." caption="A chatbot answers once. An agent loops: plan, act, check, until the goal is met.">
      <Box x={14} y={90} w={110} h={60} label="Goal" color={c} />
      <Arrow x1={128} y1={120} x2={168} y2={120} color={c} />
      <Box x={172} y={40} w={120} h={56} label="Plan" color={c} filled />
      <Box x={332} y={40} w={130} h={56} label="Act" sub="search, email, book" color={c} filled />
      <Box x={252} y={150} w={130} h={56} label="Check" sub="is it done?" color={c} filled />
      <Arrow x1={296} y1={68} x2={328} y2={68} color={c} />
      <Arrow x1={400} y1={100} x2={360} y2={146} color={c} />
      <Arrow x1={252} y1={170} x2={230} y2={100} color={c} />
      <Arrow x1={386} y1={178} x2={500} y2={178} color={c} />
      <Box x={504} y={150} w={120} h={56} label="Report back" color={c} />
    </Figure>
  ),
  rag: (c) => (
    <Figure color={c} alt="Diagram: retrieval augmented generation. A question searches your own documents, the most relevant passages are passed to the AI, and it answers using only those passages, with sources." caption="RAG is an open-book exam: the AI answers from your documents, and can show which page it used.">
      <Box x={10} y={90} w={120} h={60} label="Question" color={c} />
      <Arrow x1={134} y1={120} x2={164} y2={120} color={c} />
      <Box x={168} y={70} w={140} h={100} label="Your files" sub="search, find 3 passages" color={c} />
      <Arrow x1={312} y1={120} x2={342} y2={120} color={c} />
      <Box x={346} y={80} w={120} h={80} label="AI" sub="reads the passages" color={c} filled />
      <Arrow x1={470} y1={120} x2={500} y2={120} color={c} />
      <Box x={504} y={80} w={126} h={80} label="Answer" sub="with its sources" color={c} />
    </Figure>
  ),
  verify: (c) => (
    <Figure color={c} alt="Diagram: the verification habit. AI draft, then check facts, numbers and names against a source, then publish. A warning marks skipping the check." caption="Draft with AI. Check anything you will publish, send or act on. Then ship.">
      <Box x={20} y={90} w={160} h={64} label="AI draft" color={c} />
      <Arrow x1={184} y1={122} x2={232} y2={122} color={c} />
      <Box x={236} y={80} w={170} h={84} label="You check" sub="facts · numbers · names" color={c} filled />
      <Arrow x1={410} y1={122} x2={458} y2={122} color={c} />
      <Box x={462} y={90} w={160} h={64} label="Publish" color={c} />
    </Figure>
  ),
};

// ---------- Activities ----------
const choiceBtn = (on, color) => ({
  background: on ? color + "22" : "rgba(255,255,255,0.03)",
  border: `1px solid ${on ? color : "rgba(255,255,255,0.1)"}`,
  borderRadius: 10,
  padding: "10px 14px",
  color: "#EDEDED",
  fontSize: 13,
  cursor: "pointer",
  textAlign: "left",
  fontFamily: "inherit",
  transition: "background .2s, border-color .2s, transform .2s",
});

/** Flip cards: turn every card to finish. */
function FlipCards({ data, color, onDone }) {
  const [seen, setSeen] = useState(new Set());
  const flip = (i) => setSeen((s) => { const n = new Set(s); n.add(i); if (n.size === data.cards.length) onDone(); return n; });
  return (
    <div>
      <p style={{ fontSize: 13, color: "#9A9A9A", marginBottom: 12 }}>{data.intro} <span style={{ color }}>{seen.size}/{data.cards.length} turned</span></p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))", gap: 10 }}>
        {data.cards.map(([front, back], i) => (
          <button key={front} type="button" onClick={() => flip(i)} aria-pressed={seen.has(i)} className="flip" style={{ ...choiceBtn(seen.has(i), color), minHeight: 108, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: seen.has(i) ? color : "#fff" }}>{front}</span>
            <span style={{ marginTop: 6, fontSize: 12, lineHeight: 1.5, color: "#C9C9C9", display: seen.has(i) ? "block" : "none" }}>{back}</span>
            {!seen.has(i) && <span style={{ marginTop: 6, fontSize: 11, color: "#666" }}>tap to turn</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Prompt builder: add each ingredient and watch the prompt assemble. */
function Builder({ data, color, onDone }) {
  const [added, setAdded] = useState([]);
  const add = (i) => setAdded((a) => { if (a.includes(i)) return a; const n = [...a, i]; if (n.length === data.parts.length) onDone(); return n; });
  const prompt = data.parts.filter((_, i) => added.includes(i)).map((p) => p[1]).join(" ");
  return (
    <div>
      <p style={{ fontSize: 13, color: "#9A9A9A", marginBottom: 12 }}>{data.intro}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {data.parts.map(([label], i) => (
          <button key={label} type="button" onClick={() => add(i)} disabled={added.includes(i)} style={{ ...choiceBtn(added.includes(i), color), opacity: added.includes(i) ? 0.6 : 1 }}>
            {added.includes(i) ? "✓ " : "+ "}{label}
          </button>
        ))}
      </div>
      <div aria-live="polite" style={{ marginTop: 14, minHeight: 84, padding: 14, borderRadius: 10, background: "rgba(0,0,0,0.25)", border: "1px dashed rgba(255,255,255,0.12)", fontSize: 13.5, lineHeight: 1.7, color: prompt ? "#EDEDED" : "#666" }}>
        {prompt || "Your prompt builds here as you add ingredients."}
      </div>
      {added.length === data.parts.length && <p style={{ marginTop: 10, fontSize: 13, color }}>{data.done}</p>}
    </div>
  );
}

/** Sorter: put each item in the right group. Wrong picks explain themselves. */
function Sorter({ data, color, onDone }) {
  const [placed, setPlaced] = useState({});
  const [note, setNote] = useState("");
  const pick = (i, g) => {
    const [, right, why] = data.items[i];
    if (g !== right) { setNote(`Not quite: ${why}`); return; }
    setNote(`Right: ${why}`);
    setPlaced((p) => { const n = { ...p, [i]: g }; if (Object.keys(n).length === data.items.length) onDone(); return n; });
  };
  return (
    <div>
      <p style={{ fontSize: 13, color: "#9A9A9A", marginBottom: 12 }}>{data.intro} <span style={{ color }}>{Object.keys(placed).length}/{data.items.length} sorted</span></p>
      <div style={{ display: "grid", gap: 8 }}>
        {data.items.map(([text], i) => (
          <div key={text} style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", padding: "10px 12px", borderRadius: 10, background: "rgba(255,255,255,0.025)", border: `1px solid ${placed[i] !== undefined ? color + "55" : "rgba(255,255,255,0.08)"}` }}>
            <span style={{ flex: "1 1 240px", fontSize: 13.5, color: "#E5E5E5" }}>{text}</span>
            {placed[i] !== undefined ? (
              <span style={{ fontSize: 12, color, fontWeight: 700 }}>✓ {data.groups[placed[i]]}</span>
            ) : (
              data.groups.map((g, gi) => (
                <button key={g} type="button" onClick={() => pick(i, gi)} style={{ ...choiceBtn(false, color), padding: "6px 10px", fontSize: 12 }}>{g}</button>
              ))
            )}
          </div>
        ))}
      </div>
      <p aria-live="polite" style={{ marginTop: 10, fontSize: 13, color: note.startsWith("Right") ? color : "#E8A87C", minHeight: 20 }}>{note}</p>
    </div>
  );
}

/** Sequence: tap the steps in the right order. */
function Sequence({ data, color, onDone }) {
  const [order, setOrder] = useState([]);
  const [note, setNote] = useState("");
  const shuffled = useMemo(() => data.steps.map((s, i) => [s, i]).sort((a, b) => ((a[1] * 7 + 3) % data.steps.length) - ((b[1] * 7 + 3) % data.steps.length)), [data]);
  const tap = (i) => {
    if (order.includes(i)) return;
    if (i !== order.length) { setNote(`Not yet: think about what has to happen first.`); return; }
    const n = [...order, i]; setOrder(n); setNote("");
    if (n.length === data.steps.length) { setNote(data.done); onDone(); }
  };
  return (
    <div>
      <p style={{ fontSize: 13, color: "#9A9A9A", marginBottom: 12 }}>{data.intro}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {shuffled.map(([s, i]) => (
          <button key={s} type="button" onClick={() => tap(i)} disabled={order.includes(i)} style={{ ...choiceBtn(order.includes(i), color) }}>
            {order.includes(i) ? `${order.indexOf(i) + 1}. ` : ""}{s}
          </button>
        ))}
      </div>
      <p aria-live="polite" style={{ marginTop: 10, fontSize: 13, color: order.length === data.steps.length ? color : "#E8A87C", minHeight: 20 }}>{note}</p>
    </div>
  );
}

const ACTIVITIES = { flip: FlipCards, build: Builder, sort: Sorter, sequence: Sequence };

/** One multiple-choice question; Next unlocks once it is answered correctly. */
function QuickCheck({ check, color, passed, onPass }) {
  const [pick, setPick] = useState(passed ? check.answer : null);
  const right = pick === check.answer;
  return (
    <div style={{ marginTop: 22, padding: 18, borderRadius: 14, background: "rgba(255,255,255,0.025)", border: `1px solid ${right ? color : color + "30"}` }}>
      <p style={{ fontSize: 10, letterSpacing: "0.14em", color, fontWeight: 700, margin: 0 }}>QUICK CHECK · ANSWER TO UNLOCK THE NEXT LESSON</p>
      <p style={{ fontSize: 15, color: "#fff", margin: "8px 0 12px", lineHeight: 1.5, fontWeight: 600 }}>{check.q}</p>
      <div role="radiogroup" aria-label={check.q} style={{ display: "grid", gap: 8 }}>
        {check.options.map((o, i) => {
          const chosen = pick === i;
          const state = chosen ? (i === check.answer ? color : "#E8A87C") : null;
          return (
            <button key={o} type="button" role="radio" aria-checked={chosen} onClick={() => { setPick(i); if (i === check.answer) onPass(); }}
              style={{ ...choiceBtn(chosen, state || color), borderColor: state || "rgba(255,255,255,0.1)" }}>
              {o}
            </button>
          );
        })}
      </div>
      {pick !== null && (
        <p aria-live="polite" style={{ marginTop: 12, fontSize: 13, lineHeight: 1.6, color: right ? color : "#E8A87C" }}>
          {right ? `Correct. ${check.why}` : "Not quite. Have another look at the lesson and try again."}
        </p>
      )}
    </div>
  );
}

/** Renders a lesson's illustration, activity and quick check. */
function LessonExtras({ lessonId, color, passed, onPass }) {
  const ex = EXTRAS[lessonId];
  const [activityDone, setActivityDone] = useState(passed);
  if (!ex) return null;
  const Act = ex.activity && ACTIVITIES[ex.activity.type];
  return (
    <div>
      {ex.figure && FIGURES[ex.figure](color)}
      {Act && (
        <div style={{ marginTop: 22, padding: 18, borderRadius: 14, background: "rgba(255,255,255,0.02)", border: `1px solid ${activityDone ? color + "66" : "rgba(255,255,255,0.08)"}` }}>
          <p style={{ fontSize: 10, letterSpacing: "0.14em", color, fontWeight: 700, margin: "0 0 8px" }}>TRY IT{activityDone ? " · DONE ✓" : ""}</p>
          <p style={{ fontSize: 16, color: "#fff", margin: "0 0 4px", fontWeight: 700 }}>{ex.activity.title}</p>
          <Act data={ex.activity} color={color} onDone={() => setActivityDone(true)} />
        </div>
      )}
      {ex.check && <QuickCheck check={ex.check} color={color} passed={passed} onPass={onPass} />}
    </div>
  );
}

// ---------- Content: one entry per written lesson ----------
const EXTRAS = {
  "1a": {
    figure: "prediction",
    activity: { type: "flip", title: "Meet the seven kinds of AI", intro: "Turn each card to see what it does and one way to use it.", cards: [
      ["Text", "Chat assistants like Claude and ChatGPT. Draft emails, summarise reports, brainstorm."],
      ["Image", "Pictures from a description. Product shots, social posts, presentation art."],
      ["Video", "Short clips from text or a photo. Adverts, explainers, social shorts."],
      ["Audio", "Natural voiceovers and music. Narrate lessons, podcast intros, jingles."],
      ["Code", "Formulas, scripts and small apps, described in plain words."],
      ["Agents", "AI that takes several steps on its own toward a goal, using tools."],
      ["Automation", "AI wired into your apps so routine work happens by itself."],
    ] },
    check: { q: "What is an AI chat assistant actually doing when it writes an answer?", options: ["Looking the answer up in a database of facts", "Predicting the words most likely to make a good answer, based on patterns it learned", "Copying the closest web page it can find", "Thinking about the question the way a person does"], answer: 1, why: "It predicts from patterns. That is why your wording steers the answer, and why you still check facts." },
  },
  "1c": {
    activity: { type: "sequence", title: "Put a first conversation in order", intro: "Tap the steps in the order you would do them.", steps: ["Say who you are and your situation", "Ask for one clear thing", "Read the answer and give feedback", "Save the version that works"], done: "That's the loop: context, one clear ask, feedback, save." },
    check: { q: "The first answer is close but too formal. What is the best next move?", options: ["Start a new chat and ask the same thing again", "Accept it and edit it yourself", "Tell it what worked and what to change, for example: keep the structure, make it warmer", "Ask a different AI tool"], answer: 2, why: "Feedback in the same conversation keeps all the context and usually fixes it in one turn." },
  },
  "2a": {
    figure: "ingredients",
    activity: { type: "build", title: "Build a prompt, one ingredient at a time", intro: "Add each ingredient and watch a vague request become a usable one.", parts: [
      ["Role", "You are an experienced events planner in Accra."],
      ["Task", "Plan a two-hour product launch"],
      ["Context", "for 40 guests at a small fashion brand, with a budget of GHS 15,000."],
      ["Format", "Give a timeline table with times, activities and who is responsible,"],
      ["Tone", "in a warm, professional voice,"],
      ["Constraints", "and keep it to one page with no more than eight rows."],
    ], done: "Same request, six ingredients: now the AI knows who to be, what to make, for whom, in what shape and within what limits." },
    check: { q: "Which ingredient tells the AI what shape the answer should take, like a table, bullet points or a one-paragraph email?", options: ["Role", "Context", "Format", "Tone"], answer: 2, why: "Format shapes the output. Ask for a table and you get a table instead of an essay." },
  },
  "2d": {
    check: { q: "You need AI's help with a decision but worry it will just agree with you. Which technique fits?", options: ["Prompt chaining", "Devil's advocate prompting", "Persona stacking", "Contextual memory refresh"], answer: 1, why: "Asking it to argue against your plan surfaces the weaknesses it would otherwise be too agreeable to mention." },
  },
  "3a": {
    figure: "imageFormula",
    activity: { type: "build", title: "Build an image prompt", intro: "Add each block of the formula and see the prompt sharpen.", parts: [
      ["Subject", "A woven straw handbag"],
      ["Style", "in a minimal editorial photography style,"],
      ["Setting", "resting on a cream linen surface,"],
      ["Lighting", "soft morning window light,"],
      ["Mood", "calm and premium,"],
      ["Technical specs", "4:5 aspect ratio, sharp focus, high detail."],
    ], done: "Every block removes a guess. That's the difference between a random picture and a usable product shot." },
    check: { q: "In the image formula, where does “soft morning window light” belong?", options: ["Subject", "Style", "Lighting", "Technical specs"], answer: 2, why: "Lighting changes the whole feel of an image, so it gets its own place in the prompt." },
  },
  "3b": {
    check: { q: "Before you publish an AI image for a client, what should you always check?", options: ["The file size", "Hands, any text in the image, and logos", "That it was made with the newest model", "Nothing, if the prompt was detailed"], answer: 1, why: "Hands, lettering and logos are where image AI still slips, so check them every time." },
  },
  "4a": {
    check: { q: "Which part of a video prompt does “slow push-in” describe?", options: ["Style", "Camera movement", "Lighting", "Pacing"], answer: 1, why: "Push-in, pan, tilt and orbit are camera moves. Naming one makes clips feel directed, not random." },
  },
  "5a": {
    activity: { type: "sort", title: "Written for the eye, or for the ear?", intro: "Voice AI reads exactly what you write. Sort each line.", groups: ["For the ear", "For the eye"], items: [
      ["“Here's the good news: it takes five minutes.”", 0, "short, spoken rhythm, easy to say aloud."],
      ["“Refer to Table 3 (p. 14) for the full breakdown.”", 1, "brackets and page numbers make sense on paper, not out loud."],
      ["“First, open the app. Then, tap the plus.”", 0, "clear steps with natural pauses."],
      ["“Q3 rev. ↑ 12% YoY (see appx).”", 1, "abbreviations and symbols get read out awkwardly or not at all."],
    ] },
    check: { q: "When is it acceptable to clone someone's voice?", options: ["When the recording is public online", "When it's only for a demo", "Only your own voice, or with that person's clear written permission", "When you credit them in the description"], answer: 2, why: "A voice is personal. Use your own, or get written permission." },
  },
  "5b": {
    check: { q: "Which of these belongs in a music prompt's formula?", options: ["Your file name", "Tempo, like 105 BPM", "The platform's price", "The video's length in pixels"], answer: 1, why: "Genre, mood, instruments, vocal style, tempo and theme: tempo sets the energy." },
  },
  "6a": {
    check: { q: "You've got a spreadsheet formula from AI. What should you do before using it on your real data?", options: ["Use it straight away, AI code is always tested", "Test it on a copy of your data first", "Ask a second AI if it's right", "Delete your backup to save space"], answer: 1, why: "Always test on a copy. If something goes wrong, your real data is safe." },
  },
  "6b": {
    check: { q: "AI summarised your sales table and says revenue rose 18%. You'll present that to your manager. What now?", options: ["Present it, AI is good at maths", "Check the number against the table yourself first", "Round it to 20% to be safe", "Ask the AI if it's sure"], answer: 1, why: "AI can miscount or misread a table. Check any number you will act on." },
  },
  "7a": {
    figure: "automation",
    activity: { type: "sequence", title: "Assemble an automation", intro: "A customer fills in your order form. Tap the steps in the order the automation runs.", steps: ["Trigger: a new form submission arrives", "AI step: read it and return the order as structured data", "Action: add a row to your sheet", "Action: send you a WhatsApp alert"], done: "Trigger, AI step, action. That shape runs almost every automation you'll build." },
    check: { q: "Why ask the AI step for structured output, like JSON with named fields?", options: ["It looks more professional", "The next app can read each field reliably instead of guessing from a paragraph", "It makes the AI faster", "It's required by law"], answer: 1, why: "Apps need predictable fields. Structured output turns AI text into data the next step can use." },
  },
  "8a": {
    figure: "agentLoop",
    activity: { type: "sort", title: "Chatbot or agent?", intro: "Decide which one each task needs.", groups: ["Chatbot", "Agent"], items: [
      ["Explain what a VAT invoice is", 0, "one question, one answer: a chatbot is enough."],
      ["Find three venues, check prices and email the shortlist", 1, "several steps and tools toward a goal: that's an agent."],
      ["Rewrite this paragraph to sound friendlier", 0, "a single transformation of your text."],
      ["Watch my inbox and file every invoice into the right folder", 1, "ongoing action with tools: an agent's job."],
    ] },
    check: { q: "Which belongs in a good agent prompt but rarely in a chat prompt?", options: ["A polite greeting", "Guardrails: what it must never do without asking you", "A request for emojis", "Your favourite colour"], answer: 1, why: "Agents act, so they need limits: spending, sending and deleting should wait for your OK." },
  },
  "8b": {
    figure: "rag",
    check: { q: "What does RAG add to an AI assistant?", options: ["It makes the model bigger", "It lets the AI answer from your own documents, and show which ones", "It removes the need for prompts", "It makes answers longer"], answer: 1, why: "Retrieval finds the relevant passages in your files, and the AI answers from them: an open-book exam." },
  },
  "10a": {
    figure: "verify",
    check: { q: "An AI answer includes a confident statistic with a source name. What's the professional move?", options: ["Trust it, it named a source", "Check the statistic and the source yourself before using it", "Remove the source and keep the number", "Ask the AI to make it sound more confident"], answer: 1, why: "AI can invent convincing facts and sources. Verify anything you publish, send or act on." },
  },
  "10b": {
    activity: { type: "sort", title: "Safe to paste, or never?", intro: "Apply the public notice board test to each item.", groups: ["Fine to paste", "Never paste"], items: [
      ["A customer's full name, phone number and order history", 1, "personal data about someone else: anonymise it first."],
      ["A blog post you've already published", 0, "it's public already."],
      ["Your bank login or a one-time PIN", 1, "never share credentials with any tool."],
      ["A sales table with names replaced by Customer A, B and C", 0, "anonymised data keeps the insight and drops the risk."],
    ] },
    check: { q: "What's the quickest test for whether something is safe to paste into AI?", options: ["Is it under 1,000 words?", "Would I pin it on a public notice board?", "Did I write it myself?", "Is it in English?"], answer: 1, why: "If you wouldn't pin it up in public, don't paste it." },
  },
  "10c": {
    check: { q: "AI drafted a decision about which staff get a bonus. What should happen next?", options: ["Send it, the AI is neutral", "A person reviews it for fairness and makes the final call", "Ask the AI to pick again", "Share it so staff can complain"], answer: 1, why: "Decisions about people need a human in charge. AI can be biased in ways that are hard to see." },
  },
  "11a": {
    check: { q: "What does “AI skills are additive” mean for your career?", options: ["You must leave your field to work in AI", "AI adds to the expertise you already have, making you more valuable in your own field", "Only programmers benefit", "You need a new degree first"], answer: 1, why: "A nurse, accountant or teacher who uses AI well is worth more in their own field." },
  },
  "11b": {
    check: { q: "Which portfolio piece proves the most to an employer?", options: ["A list of AI tools you've heard of", "A case study: the problem, what you did and a result with a number", "A screenshot of a chat", "Your course enrolment email"], answer: 1, why: "A result with a number, like 'saved four hours a week', turns a claim into evidence." },
  },
  "11c": {
    check: { q: "What's the practice-first rule?", options: ["Read every AI newsletter daily", "For every hour reading about AI, spend two using it", "Only use one AI tool", "Wait for tools to mature before trying them"], answer: 1, why: "Using AI builds the skill. Reading only builds the vocabulary." },
  },
};
