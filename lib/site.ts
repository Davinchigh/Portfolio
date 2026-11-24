/**
 * Everything the site says, in one place. Edit here, not in the components.
 */

export const person = {
  name: "benedict frimpong",
  fullName: "Benedict Frimpong Boateng",
  nickname: "or just bfb",
  role: "ai engineer, prompt engineer and software developer",
  bio: "i build with claude, test things properly and ship fast. before that i was an sap consultant and course builder, so i like software that people can actually learn to use.",
  location: "accra, ghana",
  timeZone: "Africa/Accra",
  email: "frimpongboatengbenedict@gmail.com",
  status: "open to full time and freelance work",
  cv: "/Benedict_Frimpong_Boateng_CV.pdf",
  photo: "/images/benedict-frimpong-boateng.jpeg",
}

export const socials = [
  { label: "GitHub", href: "https://github.com/Davinchigh" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/benedict-frimpong-boateng-552490249/" },
  { label: "X", href: "https://x.com/DavinchiMax" },
]

// ---------- Experience ----------

export type Role = {
  id: string
  company: string
  role: string
  start: string // YYYY or YYYY-MM
  end: string | "present"
  kind: "work" | "volunteer" | "leadership"
  logo?: string
  summary?: string
  bullets?: string[]
}

export const roles: Role[] = [
  {
    id: "coderaccoon",
    logo: "/logos/coderaccoon.png",
    company: "CodeRaccoon",
    role: "SAP Consultant & Educational Content Creator, Team Lead",
    start: "2025-11",
    end: "2026-08",
    kind: "work",
    summary: "Combined SAP S/4HANA Cloud consulting with instructional design for internal and client training, and led the team.",
    bullets: [
      "Built e-learning courses, interactive simulations and training content in Rise 360, Articulate and Assima.",
      "Led software, AI, UI/UX and beta testing for the AmbionCraft platform, writing up defects and feedback.",
      "Earned a prompt engineering certification, then trained the team on prompt engineering practice.",
      "Ran team timesheets and status reporting with Excel automation.",
    ],
  },
  {
    id: "nextgen",
    logo: "/logos/nextgen.png",
    company: "NextGen Youth Movement",
    role: "Facilitator, Teens Conference 2026",
    start: "2026",
    end: "2026",
    kind: "volunteer",
    summary: "Led the AI and Coding session for teenagers.",
    bullets: ["Received a Certificate of Appreciation from the Executive Director."],
  },
  {
    id: "rbf",
    logo: "/logos/rbf.png",
    company: "Raising Beautiful Flowers (RBF)",
    role: "Liaison",
    start: "2025-01",
    end: "2026-04",
    kind: "leadership",
  },
  {
    id: "nextit",
    logo: "/logos/nextit.png",
    company: "NextIT Consult",
    role: "Database Management Intern (Odoo)",
    start: "2025-05",
    end: "2025-08",
    kind: "work",
    summary: "Managed the company's business database in Odoo, including data entry and warehousing.",
    bullets: ["Supported daily operations and digital tasks."],
  },
  {
    id: "upwork",
    company: "Upwork",
    role: "Freelance Web Developer",
    start: "2023",
    end: "2024",
    kind: "work",
    summary: "Pitched for client website projects and built sites to each client's brief.",
  },
  {
    id: "kng",
    logo: "/logos/kng.png",
    company: "KNG (Knowledge Network Group)",
    role: "IT Intern",
    start: "2023-10",
    end: "2023-11",
    kind: "work",
    summary: "Trained in Java with a focus on object-oriented programming.",
    bullets: ["Assisted with software development and collaborated on team projects."],
  },
  {
    id: "ideal-market",
    logo: "/logos/ideal-market.png",
    company: "Ideal Market",
    role: "Volunteer Database Assistant",
    start: "2022-09",
    end: "2022-12",
    kind: "volunteer",
    summary: "Set up and managed the supermarket's store databases in Odoo.",
    bullets: ["Supported inventory tracking and data organisation."],
  },
]

// ---------- Education ----------

export const degree = { school: "University of Ghana, Legon", detail: "BSc Statistics with Computer Science", dates: "2022 to 2026" }

// ---------- Selected work ----------

export type Work = {
  slug: string
  org: string
  title: string
  hook: string
  problem: string
  role: string
  outcome: string
  tags: string[]
  image: string
  /** The app's dark-mode screen, when it has one. Shown in dark mode, with a switch to compare. */
  imageDark?: string
  imageAlt: string
  contain?: boolean
  links: { label: string; href: string }[]
}

export const work: Work[] = [
  {
    slug: "cravebox",
    org: "client project, bakery ordering site",
    title: "CraveBox",
    hook: "an ordering site for an accra bakery, where you design your cake in live 3d before you pay for it.",
    problem: "a custom cake is hard to describe in a message. size, tiers, colour and price take rounds of back and forth before anyone starts baking, and company orders need their own pricing.",
    role: "built it end to end in next.js and postgres: a menu with options, basket and checkout with delivery zones and time slots, a cake builder in react three fiber with tiers, finishes, toppings and a cut-a-slice view, and a staff order book with email, whatsapp and sms replies.",
    outcome: "live for the bakery. every price, option and discount is recalculated on the server, payments are wired to paystack for momo, cards and bank transfer, companies verify a work email for 10 to 15% off, and an optional claude assistant answers only from the menu.",
    tags: ["next.js", "react three fiber", "postgres", "paystack", "claude api", "netlify"],
    image: "/images/cravebox.webp",
    imageDark: "/images/cravebox-dark.webp",
    imageAlt: "CraveBox cake builder: a two-tier white cake with pearl borders and berries in a 3D view, beside controls for shape, tiers, width and height",
    links: [{ label: "visit the bakery", href: "https://cravebox-sxfx.netlify.app" }],
  },
  {
    slug: "shoptally",
    org: "personal project, full stack",
    title: "ShopTally",
    hook: "stock, sales and mobile money reconciliation for small shops.",
    problem: "a shop can take dozens of momo payments a day, and owners check them against their sales by hand, so short payments and forgotten sales slip through.",
    role: "built a react and typescript app on a fastapi rest api with mysql: sales that can never oversell, a forgiving momo statement reader and a matcher that pairs every payment with a sale.",
    outcome: "flags missing, short, duplicate and unexplained payments in plain language. 39 api tests run against mysql in github actions, and the whole stack starts with one docker compose command.",
    tags: ["react", "typescript", "fastapi", "mysql", "docker", "ci"],
    image: "/images/shoptally.webp",
    imageAlt: "ShopTally reconciliation screen comparing recorded MoMo sales with the statement, listing a wrong amount, a missing payment and an unrecorded payment",
    links: [{ label: "code", href: "https://github.com/Davinchigh/shoptally" }],
  },
  {
    slug: "studyflow",
    org: "personal project, full stack",
    title: "StudyFlow",
    hook: "a study planner that turns deadlines and a class timetable into a week you can actually get through.",
    problem: "a task list shows what is due but not whether the week is manageable, and students lose track of how much work is left against how much they have really done.",
    role: "built a react app with a lazy-loaded three.js background on a fastapi api. it imports .ics timetables, plans study sessions before each test, runs a focus timer and takes plain-language changes such as 'move sql practice to monday', with undo.",
    outcome: "live for testers: every browser gets a private workspace stored as its own postgres schema on neon, with optional sign-in through neon auth to open a plan on any device. progress keeps planned effort and recorded focus time apart.",
    tags: ["react", "three.js", "fastapi", "postgres", "neon auth", "docker"],
    image: "/images/studyflow.webp",
    imageAlt: "StudyFlow's Now view: the next class, an overdue statistics problem set with planned and studied time, a 25 minute focus timer, and a summary of overdue, due today and studied this week",
    links: [
      { label: "open the app", href: "https://studyflow-kappa-ashen.vercel.app" },
      { label: "code", href: "https://github.com/Davinchigh/studyflow" },
    ],
  },
  {
    slug: "ai-test-case-generator",
    org: "personal project, ai product",
    title: "AI Test Case Generator",
    hook: "paste code, a bug report or a requirement and get a structured test plan back.",
    problem: "writing test plans by hand is slow, so edge cases, security checks and regression tests are the first things to get skipped.",
    role: "built a next.js app on the vercel ai sdk with eight workflows, from 'bug to tests' to code review. each has its own prompt, and the model's answer must pass a zod schema before anyone sees it.",
    outcome: "returns prioritised unit, integration, edge, negative and security cases with test code for vitest, jest, pytest, junit, playwright or cypress, downloadable as a file named for your framework or copied as markdown, with a coverage map that shows which kinds of test are missing and a checklist that tracks which cases you have written. plans are saved to postgres through prisma with sign-in and history, and the export and api code have their own tests.",
    tags: ["next.js", "vercel ai sdk", "zod", "prisma", "postgres", "vitest"],
    image: "/images/ai-test-case-generator.webp",
    imageAlt: "AI Test Case Generator: a discount function pasted in on the left; on the right its finished plan, with a priority bar, a download button for generated.test.ts, tabs for unit, integration, edge, negative and security cases, and the first four unit cases",
    links: [{ label: "open the app", href: "https://ai-test-case-generator-one.vercel.app" }],
  },
  {
    slug: "flowline",
    org: "personal project, workflow automation",
    title: "Flowline",
    hook: "a workflow engine you can watch work: it triages a support inbox or an invoice, step by step.",
    problem: "automations fail quietly. a step times out or a total does not add up, and nobody can say what ran, what was skipped or why.",
    role: "wrote a dependency-free typescript engine: steps declare what they need, independent steps run in parallel, failures retry with backoff and every state change is an event. on top sit a naive bayes intent classifier, an entity extractor and two full workflows.",
    outcome: "runs live in your browser with nothing sent to a server. 18 tests cover the engine, the classifier and both workflows, and the classifier labels all 25 held-out demo messages correctly.",
    tags: ["typescript", "workflow automation", "text classification", "vitest"],
    image: "/images/flowline.webp",
    imageAlt: "Flowline run view: a support message on the left and eight workflow steps on the right, each marked done with its timing, including a customer lookup that succeeded on its second attempt",
    links: [
      { label: "try it live", href: "/projects/flowline" },
      { label: "code", href: "https://github.com/Davinchigh/Portfolio/tree/main/lib/flowline" },
    ],
  },
  {
    slug: "bfb-mcp",
    org: "personal project, ai agents and mcp",
    title: "BFB MCP Server",
    hook: "this portfolio as an mcp server: connect claude or any agent and it can search my work, open projects and find how to reach me.",
    problem: "agents are becoming how people look things up, but a portfolio is a page made for eyes. an assistant asked about a candidate has to scrape and guess.",
    role: "implemented the model context protocol by hand (stateless json-rpc 2.0 over streamable http, version negotiation, notifications, batches) with six read-only tools on top of recall, the site's own search engine.",
    outcome: "live at /api/mcp and checked with the official mcp sdk client. six tests cover the protocol and the tools, and the project page sends real requests so you can watch what an agent sees.",
    tags: ["mcp", "ai agents", "json-rpc", "typescript", "next.js"],
    image: "/images/mcp.webp",
    imageDark: "/images/mcp-dark.webp",
    imageAlt: "The MCP server's console: a tools/call request to search_portfolio for 'has he led a team?' beside the JSON-RPC response with the matching passage and its source link",
    links: [
      { label: "connect and try it", href: "/projects/mcp" },
      { label: "code", href: "https://github.com/Davinchigh/Portfolio/tree/main/lib/mcp" },
    ],
  },
  {
    slug: "recall",
    org: "personal project, search and evaluation",
    title: "Recall",
    hook: "ask this portfolio a question and get the passage that answers it, with its source.",
    problem: "a portfolio makes the reader hunt. a recruiter with one question, such as 'has he led a team?', should not have to scroll for it.",
    role: "built the retrieval half of a rag system from scratch: a bm25 index over everything on this site, with stemming, synonyms and title weighting, plus an evaluation set that scores it.",
    outcome: "answers from this site's own content, in your browser. its page shows a live score on 32 test questions, recomputed on every build with the misses listed, and 9 tests cover the ranking.",
    tags: ["typescript", "information retrieval", "bm25", "evaluation"],
    image: "/images/recall.webp",
    imageAlt: "Recall search page: the question 'has he led a team?' with the matching passage from the CodeRaccoon role highlighted, its source link, and the evaluation scores below",
    links: [
      { label: "try it live", href: "/projects/recall" },
      { label: "code", href: "https://github.com/Davinchigh/Portfolio/tree/main/lib/recall" },
    ],
  },
  {
    slug: "class-planner",
    org: "personal project, rebuilt from college",
    title: "Class Planner",
    hook: "upload your timetable once, always know where your next class is.",
    problem: "statistics students juggle timetables in spreadsheets and group chats, and assignments slip through.",
    role: "designed and built it end to end in react and typescript, including a forgiving excel and csv importer.",
    outcome: "live app with a next class countdown ring, the week in numbers, free time between classes, an assignment tracker and a one-click export to google, outlook or apple calendar. light and dark themes, and 31 tests on the parser, the schedule and the calendar file.",
    tags: ["react", "typescript", "data parsing", "ui design"],
    image: "/images/class-planner.webp",
    imageDark: "/images/class-planner-dark.webp",
    imageAlt: "Class Planner dashboard: four numbers for the week, the next class with a countdown ring, today's classes with a four hour free gap, and assignments grouped by overdue and due this week",
    links: [
      { label: "try it live", href: "https://class-planner-stats.vercel.app" },
      { label: "code", href: "https://github.com/Davinchigh/stats-student-dashboard" },
    ],
  },
  {
    slug: "covid-time-series",
    org: "university of ghana, final year project",
    title: "Forecasting COVID-19 cases in Ghana",
    hook: "a reproducible pipeline that forecasts daily cases four weeks out.",
    problem: "noisy daily case data made simple trend lines misleading for planning.",
    role: "data cleaning, EDA, STL decomposition, stationarity tests, then Holt-Winters and autoregressive models in python.",
    outcome: "28-day forecasts with prediction intervals, checked with rolling-origin cross-validation.",
    tags: ["python", "time series", "statistics"],
    image: "/images/covid-time-series.png",
    imageAlt: "Chart of Ghana's daily COVID-19 cases with a 28-day forecast and prediction interval",
    contain: true,
    links: [
      {
        label: "code",
        href: "https://github.com/Davinchigh/Time-Series-Analysis-of-COVID-19-Cases-Using-Holt-Winters-and-Autoregressive-Models-For-Ghana-",
      },
    ],
  },
  {
    slug: "java-inventory",
    org: "college project, rebuilt",
    title: "Java Inventory System",
    hook: "a desktop stock manager for a small shop.",
    problem: "small shops track stock on paper and only notice shortages when a customer asks.",
    role: "built in java and swing with clear OOP layers: model, service, storage and ui.",
    outcome: "stock in and out with history, stock bars and status pills, value by category, and a reorder report that works out what to buy and what it costs. light and dark themes drawn by hand, 12 tests, no dependencies.",
    tags: ["java", "swing", "oop", "java2d", "testing"],
    image: "/images/java-inventory.webp",
    imageDark: "/images/java-inventory-dark.webp",
    imageAlt: "Inventory window: summary cards, a stock table with green, amber and red stock bars and status pills, and a side panel with stock value by category and the latest movements",
    links: [{ label: "code", href: "https://github.com/Davinchigh/java-inventory-system" }],
  },
  {
    slug: "lizab-house-of-fashion",
    org: "family business, brand and website",
    title: "Lizab House of Fashion",
    hook: "the brand and a three.js website for my mom's fashion house, where a silk scarf carries you through the collection.",
    problem: "a tailor's best work lives in photos on a phone. customers had no way to browse pieces, check stock or book a fitting without calling.",
    role: "designed the brand and built the site in next.js with a three.js silk scarf, a shop with live stock from supabase, a staff studio, and esi: an ai sales assistant that answers by chat through n8n and by voice through livekit and gemini live.",
    outcome: "live as a preview with sample pieces while her real photos come in. every channel shares one back office, so a phone order shows up in the studio straight away.",
    tags: ["next.js", "three.js", "supabase", "n8n", "voice ai", "branding"],
    image: "/images/lizab.webp",
    imageAlt: "Lizab House of Fashion home page: a model in a black blazer holding a gold silk scarf in front of the word LIZAB in large gold letters",
    links: [{ label: "visit the site", href: "https://lizab-house-of-fashion.vercel.app" }],
  },
  {
    slug: "zero",
    org: "original game, in progress",
    title: "ZERO, The Architect's Edition",
    hook: "a card game where information is a weapon and every favour becomes a debt.",
    problem: "fast shedding card games reward luck. i wanted one where reading people and planning ahead decide who wins.",
    role: "designed the rules, the full deck, influence tokens and the brand, then built the game's site with claude code.",
    outcome: "12 laws, 6 special cards and 4 wild types, shared with a group of players and now heading to print.",
    tags: ["game design", "systems design", "branding"],
    image: "/images/zero/zero-mark.webp",
    imageAlt: "The ZERO mark: a gold omega on a card inside a ringed dial on a black background",
    links: [{ label: "see the full game", href: "/projects/zero" }],
  },
]

// ---------- Builds you can try ----------

/**
 * Personal learning apps first built for one person. These public copies are anonymised:
 * they greet whoever opens them, using a name the visitor types (kept in their browser only).
 */
export const builds = [
  {
    slug: "masterclass",
    title: "AI & Prompt Engineering Masterclass",
    line: "12 units from zero to agents, with illustrated lessons you can listen to, hands-on activities, quick checks that unlock each lesson, a prompt coach and a certificate.",
    detail: "react, built with claude code. narrated with kokoro-82m, an open-source voice model. this preview uses pre-written lessons.",
    href: "/builds/masterclass.html",
  },
  {
    slug: "promptmastery",
    title: "PromptMastery",
    line: "a hands-on prompt course with narrated sessions, playgrounds, quizzes that unlock each session, a journal and a certificate with your name on it.",
    detail: "vanilla javascript single-page app, saves progress in your browser.",
    href: "/builds/promptmastery.html",
  },
  {
    slug: "the-climb",
    title: "The Climb",
    line: "a personal training app: answer five questions for a four-week plan, check in each day, and follow a guided workout that adapts to how it felt.",
    detail: "readiness check-ins, rings, streaks and achievements. everything stays on your device.",
    href: "/builds/the-climb.html",
  },
]

// ---------- Design work ----------

export const designs = [
  {
    slug: "elizabeth-sey-hall",
    title: "Elizabeth Sey Hall",
    note: "university of ghana",
    summary: "a site for the hall bringing tours, how to apply, maintenance requests and contact into one place.",
    image: "/images/elizabeth-sey-hall.webp",
    imageAlt: "Elizabeth Sey Hall website home page with the headline 'Your home away from home'",
    href: "https://www.figma.com/design/ZwUFDBPZLJhf5XUMHLfz8g/Group-56?m=auto&t=UIMTuwtGlRWXeWXV-6",
  },
  {
    slug: "glee-garden",
    title: "Glee Garden",
    note: "brand, logo and website",
    summary: "a concept garden care business for accra, from brand to business plan: care plans and project pricing, a 90-day plant guarantee, a planting guide for southern ghana, and a plan builder where a little garden grows as you choose.",
    image: "/images/glee-garden.webp",
    imageAlt: "Glee Garden plan builder: an illustrated garden with a house, lawn, flower bed, trees and a kitchen garden beside choices for space, size, sun and needs, recommending the Home plan",
    href: "https://glee-garden.vercel.app",
    linkLabel: "live site",
  },
  {
    slug: "jean-nelson-aka-hall",
    title: "Jean Nelson Aka Hall",
    note: "unofficial hall guide",
    summary: "a guide to my old hall for freshers, parents and old royals, with a scroll-through 3d clay model of the hall: the way in, the namesake, a room, hall week and the conference room, with every fact sourced.",
    image: "/images/jean-nelson-aka-hall.webp",
    imageAlt: "Walking through a clay model of Jean Nelson Aka Hall: a room with bunk beds, desks and a ceiling fan, beside a glass caption card reading 'Four to a room, with its own bathroom'",
    href: "https://jean-nelson-aka-hall.vercel.app",
    linkLabel: "live site",
  },
]

// ---------- Things I started ----------

export const ventures = [
  {
    title: "AI tutoring apps",
    summary: "three personal learning apps i built for a friend with claude code. try them yourself in the builds section.",
    status: "built",
    tags: ["claude api", "claude code"],
    href: "/#builds",
  },
  {
    title: "ZERO, an original card game",
    summary: "twelve laws, influence tokens and six special cards. designed and branded by me, heading to print.",
    status: "in progress",
    tags: ["game design", "branding", "claude code"],
    href: "/projects/zero",
  },
  {
    title: "Lizab House of Fashion",
    summary: "the brand, flyer and a three.js website for my mom's fashion house, where a silk scarf carries you through the collection.",
    status: "in progress",
    tags: ["branding", "three.js", "next.js"],
    href: "https://lizab-house-of-fashion.vercel.app",
  },
] as const

// ---------- Stack ----------

export type Tool = { name: string; icon: string }
export const stack: { label: string; tools: Tool[] }[] = [
  {
    label: "languages and frontend",
    tools: [
      { name: "Python", icon: "python" },
      { name: "TypeScript", icon: "typescript" },
      { name: "JavaScript", icon: "javascript" },
      { name: "Java", icon: "java" },
      { name: "HTML", icon: "html" },
      { name: "CSS", icon: "css" },
      { name: "React", icon: "react" },
      { name: "Next.js", icon: "nextjs" },
      { name: "Tailwind CSS", icon: "tailwind" },
      { name: "Three.js", icon: "threejs" },
      { name: "Vite", icon: "vite" },
    ],
  },
  {
    label: "backend and data",
    tools: [
      { name: "Node.js", icon: "nodejs" },
      { name: "FastAPI", icon: "fastapi" },
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "MySQL", icon: "mysql" },
      { name: "SQLite", icon: "sqlite" },
      { name: "MongoDB", icon: "mongodb" },
      { name: "Prisma", icon: "prisma" },
      { name: "Supabase", icon: "supabase" },
      { name: "Neon", icon: "neon" },
      { name: "Zod", icon: "zod" },
    ],
  },
  {
    label: "testing and shipping",
    tools: [
      { name: "Vitest", icon: "vitest" },
      { name: "Playwright", icon: "playwright" },
      { name: "Git", icon: "git" },
      { name: "GitHub", icon: "github" },
      { name: "GitHub Actions", icon: "githubactions" },
      { name: "Docker", icon: "docker" },
      { name: "Vercel", icon: "vercel" },
      { name: "Netlify", icon: "netlify" },
      { name: "Railway", icon: "railway" },
    ],
  },
  {
    label: "ai and automation",
    tools: [
      { name: "Claude", icon: "claude" },
      { name: "Claude Code", icon: "claudecode" },
      { name: "Anthropic API", icon: "anthropic" },
      { name: "MCP", icon: "mcp" },
      { name: "ChatGPT", icon: "openai" },
      { name: "Codex", icon: "codex" },
      { name: "Gemini", icon: "gemini" },
      { name: "n8n", icon: "n8n" },
      { name: "LiveKit", icon: "livekit" },
      { name: "v0", icon: "v0" },
      { name: "GitHub Copilot", icon: "copilot" },
      { name: "Perplexity", icon: "perplexity" },
    ],
  },
  {
    label: "sap, learning and design",
    tools: [
      { name: "SAP S/4HANA Cloud", icon: "sap" },
      { name: "Articulate Rise 360", icon: "rise" },
      { name: "Figma", icon: "figma" },
      { name: "Excel", icon: "excel" },
      { name: "Odoo", icon: "odoo" },
    ],
  },
]

// ---------- Certifications ----------

/** A certificate a recruiter can open: preview image (and `-thumb`), the original PDF and an online check where one exists. */
export type CertificateDoc = { image: string; pdf?: string; verify?: string; label: string }

/** "professional": technical and industry certificates. "other": languages, appreciation and volunteer recognition. */
export type CertGroup = "professional" | "other"

export const certifications: { issuer: string; year: string; items: string[]; group: CertGroup; doc?: CertificateDoc }[] = [
  {
    issuer: "Claude Academy by Anthropic", group: "professional",
    year: "2026",
    items: [
      "Claude Code 101",
      "Claude Code in Action",
      "Introduction to MCP",
      "AI Fluency",
      "Claude 101",
      "AI Capabilities and Limitations",
      "Introduction to Claude Cowork",
      "Building Effective Human Agent Teams",
    ],
  },
  {
    issuer: "Brandenburg University of Applied Sciences", group: "professional",
    year: "2026",
    items: ["SAP S/4HANA Cloud End-to-End Business Processes (IEE2E)"],
    doc: {
      label: "SAP S/4HANA Cloud IEE2E certificate, Brandenburg University of Applied Sciences, June 2026",
      image: "/certificates/sap-iee2e",
      pdf: "/certificates/sap-iee2e.pdf",
      verify: "https://e-zertifikat.th-brandenburg.de/koaga-luggo-onenm-ucoej-dirip",
    },
  },
  {
    issuer: "CodeRaccoon, Ambylon and Dicebridge Training", group: "professional",
    year: "2026",
    items: ["Professional Achievement: Mathematics Curriculum, Stages 1 to 12"],
    doc: {
      label: "Certificate of Professional Achievement for a Mathematics Curriculum on the Ambylon learning platform, April 2026",
      image: "/certificates/coderaccoon-curriculum",
      pdf: "/certificates/coderaccoon-curriculum.pdf",
    },
  },
  {
    issuer: "NextGen Youth Movement", group: "other",
    year: "2026",
    items: ["Certificate of Appreciation, facilitator at Teens Conference 2026"],
    doc: {
      label: "Certificate of Appreciation from NextGen Youth Movement, Teens Conference 2026",
      image: "/certificates/nextgen-appreciation",
      pdf: "/certificates/nextgen-appreciation.pdf",
    },
  },
  {
    issuer: "AHK, German Industry and Commerce in Ghana", group: "professional",
    year: "2026",
    items: ["Intercultural Training for IT Professionals"],
    doc: {
      label: "AHK certificate of successful participation, Intercultural Training for IT Professionals, January 2026",
      image: "/certificates/ahk-intercultural",
      pdf: "/certificates/ahk-intercultural.pdf",
    },
  },
  { issuer: "Udemy", group: "professional", year: "2025", items: ["Prompt Engineering"] },
  { issuer: "Ambylon", group: "other", year: "2025", items: ["German A1 and A2"] },
  {
    issuer: "ALX Ghana", group: "professional",
    year: "2025",
    items: ["AI Starter Kit"],
    doc: {
      label: "ALX AI Starter Kit certificate of achievement, May 2025",
      image: "/certificates/alx-ai-starter-kit",
      verify: "https://savanna.alxafrica.com/certificates/sneTcR3yN8",
    },
  },
]

// ---------- Stats (all countable from the lists above or the CV) ----------

const certificateCount = certifications.reduce((n, c) => n + c.items.length, 0)
// Only finished, working things count as shipped: work still in progress (like ZERO) is left out.
const shippedCount =
  work.filter((w) => !w.org.includes("in progress")).length + designs.length + ventures.filter((v) => v.status === "built").length

export const stats = [
  { value: new Date().getFullYear() - 2022, suffix: "+", label: "years building things" },
  { value: shippedCount, suffix: "", label: "projects shipped" },
  { value: certificateCount, suffix: "", label: "certificates earned" },
  { value: roles.length, suffix: "", label: "roles, internships and volunteer posts" },
]

// ---------- Personalisation ----------

/**
 * Tailored links: /?for=<slug> greets that company by name and opens the recruiter view.
 * Add the companies you apply to here so their names are spelled properly.
 * Unknown slugs still work and are title-cased (zof-ai becomes "Zof AI").
 */
export const companies: Record<string, string> = {
  "zof-ai": "Zof AI",
  finnest: "Finnest Technologies",
  "sao-pay": "Sao Pay",
  "elidel-prestige": "Elidel Prestige",
  "micro-labs": "Micro Labs",
  remotown: "Remotown",
  fruum: "Fruum",
  "generation-ghana": "Generation Ghana",
}

/** The road so far, in one line per stop. Shown in the hero for anyone who wants the story. */
export const road = [
  { year: "2022", place: "legon", line: "started statistics with computer science at the university of ghana" },
  { year: "2022", place: "a supermarket", line: "volunteered to set up its store databases in odoo" },
  { year: "2023", place: "kng", line: "learned java and object-oriented programming as an intern" },
  { year: "2025", place: "alx", line: "finished the ai starter kit with a grade of 100" },
  { year: "2025", place: "coderaccoon", line: "sap consultant, course builder, tester, then team lead" },
  { year: "now", place: "accra", line: "building with claude and looking for the next stop" },
]

/** For recruiters: the skills to scan for, each backed by a project on the page. */
export const coreSkills = [
  "LLM apps with Claude and the Anthropic API",
  "Retrieval and evaluation (RAG)",
  "Workflow automation and agents (n8n, MCP)",
  "TypeScript, React and Next.js",
  "Python and FastAPI",
  "PostgreSQL and SQL",
  "Testing with Vitest and Playwright",
  "SAP S/4HANA Cloud",
]

/** For recruiters: what you get, backed by the work further down the page. */
export const proof = [
  { title: "i ship working things", line: "live apps, tested code and a card game heading to print, all linked below." },
  { title: "i test properly", line: "led software, ai and beta testing on a learning platform, and write tests for my own code." },
  { title: "i make tech learnable", line: "built sap courses and simulations, then taught my team prompt engineering." },
]

/** For everyone else: things the road taught me. All true, all from the stops above. */
export const lessons = [
  {
    title: "start before you feel ready",
    line: "my first database job was a volunteer post at a supermarket. three years later i was leading a team.",
  },
  {
    title: "rebuild what you lose",
    line: "i lost my laptop and every college project on it. so i rebuilt them, and they came back better.",
  },
  {
    title: "teach what you learn",
    line: "after earning a prompt engineering certificate, i trained my team on it. you learn a thing twice when you teach it.",
  },
]
