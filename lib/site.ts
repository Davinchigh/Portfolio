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
    id: "kng",
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
  imageAlt: string
  contain?: boolean
  links: { label: string; href: string }[]
}

export const work: Work[] = [
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
  {
    slug: "class-planner",
    org: "personal project, rebuilt from college",
    title: "Class Planner",
    hook: "upload your timetable once, always know where your next class is.",
    problem: "statistics students juggle timetables in spreadsheets and group chats, and assignments slip through.",
    role: "designed and built it end to end in react and typescript, including a forgiving excel and csv importer.",
    outcome: "live app with a next class countdown, week view and assignment tracker. 26 tests on the timetable parser.",
    tags: ["react", "typescript", "data parsing", "ui design"],
    image: "/images/class-planner.jpg",
    imageAlt: "Class Planner dashboard showing the next class, today's classes, assignments and a weekly timetable",
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
    outcome: "stock in and out with history, low stock alerts, autosave to csv. 9 tests, no dependencies.",
    tags: ["java", "swing", "oop", "testing"],
    image: "/images/java-inventory-app.png",
    imageAlt: "Inventory window listing stationery products with stock levels and low stock rows highlighted",
    contain: true,
    links: [{ label: "code", href: "https://github.com/Davinchigh/java-inventory-system" }],
  },
  {
    slug: "alx-ai",
    org: "alx ai starter kit",
    title: "AI Starter Kit work",
    hook: "where prompt engineering clicked for me.",
    problem: "learning to get dependable results from AI tools, not lucky ones.",
    role: "prompt design, AI-assisted workflows and process automation exercises.",
    outcome: "finished the programme with a grade of 100, then taught prompt engineering to my team at CodeRaccoon.",
    tags: ["ai", "prompt engineering", "automation"],
    image: "/images/alx-ai.webp",
    imageAlt: "Illustration of a person with arms raised beneath a glowing globe over a city skyline",
    links: [],
  },
]

// ---------- Design work ----------

export const designs = [
  {
    slug: "elizabeth-sey-hall",
    title: "Elizabeth Sey Hall",
    note: "university of ghana",
    summary: "a site for the hall bringing tours, how to apply, maintenance requests and contact into one place.",
    image: "/images/elizabeth-sey-hall.png",
    imageAlt: "Elizabeth Sey Hall website home page with the headline 'Your home away from home'",
    href: "https://www.figma.com/design/ZwUFDBPZLJhf5XUMHLfz8g/Group-56?m=auto&t=UIMTuwtGlRWXeWXV-6",
  },
  {
    slug: "glee-garden",
    title: "Glee Garden",
    note: "landing page",
    summary: "a landing page for a home gardening service, led by product photography and one clear call to action.",
    image: "/images/gardening-website.png",
    imageAlt: "Glee Garden landing page with the headline 'Gardening in your home' beside potted orchids",
    href: "https://www.figma.com/design/L7RpsFVTDxXhtsFduDBIc7/Gardening-Website?node-id=0-1&t=cXSSNo4etJVdy4xk-1",
  },
]

// ---------- Things I started ----------

export const ventures = [
  {
    title: "AI tutoring app",
    summary: "a full course app for a friend, with claude running live as the tutor.",
    status: "built",
    tags: ["claude api", "claude code"],
  },
  {
    title: "ZERO, an original card game",
    summary: "twelve laws, influence tokens and six special cards. designed and branded by me, heading to print.",
    status: "in progress",
    tags: ["game design", "branding", "claude code"],
    href: "/projects/zero",
  },
  {
    title: "Fashion brand identity",
    summary: "built the brand for my mom's fashion business.",
    status: "built",
    tags: ["branding"],
  },
] as const

// ---------- Stack ----------

export type Tool = { name: string; icon: string }
export const stack: { label: string; tools: Tool[] }[] = [
  {
    label: "build",
    tools: [
      { name: "Python", icon: "python" },
      { name: "TypeScript", icon: "typescript" },
      { name: "JavaScript", icon: "javascript" },
      { name: "Java", icon: "java" },
      { name: "Next.js", icon: "nextjs" },
      { name: "React", icon: "react" },
      { name: "SQL", icon: "mysql" },
      { name: "MongoDB", icon: "mongodb" },
    ],
  },
  {
    label: "ai and automation",
    tools: [
      { name: "Claude", icon: "claude" },
      { name: "Claude Code", icon: "claudecode" },
      { name: "MCP", icon: "mcp" },
      { name: "ChatGPT", icon: "openai" },
      { name: "Gemini", icon: "gemini" },
      { name: "n8n", icon: "n8n" },
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
      { name: "Git", icon: "git" },
    ],
  },
]

// ---------- Certifications ----------

export const certifications = [
  {
    issuer: "Claude Academy by Anthropic",
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
  { issuer: "Brandenburg University of Applied Sciences", year: "2026", items: ["SAP S/4HANA Cloud End-to-End Business Processes (IEE2E)"] },
  { issuer: "AHK, German Industry and Commerce in Ghana", year: "2026", items: ["Intercultural Training for IT Professionals"] },
  { issuer: "CodeRaccoon", year: "2025", items: ["Course Creation"] },
  { issuer: "Udemy", year: "2025", items: ["Prompt Engineering"] },
  { issuer: "Ambylon", year: "2025", items: ["German A1 and A2"] },
  { issuer: "ALX Ghana", year: "2025", items: ["AI Starter Kit"] },
  { issuer: "SoloLearn", year: "2022", items: ["Front-End Development Fundamentals"] },
]

// ---------- Stats (all countable from the lists above or the CV) ----------

const certificateCount = certifications.reduce((n, c) => n + c.items.length, 0)
const shippedCount = work.length + designs.length + ventures.filter((v) => v.status === "built").length

export const stats = [
  { value: new Date().getFullYear() - 2022, suffix: "+", label: "years building things" },
  { value: shippedCount, suffix: "", label: "projects shipped" },
  { value: certificateCount, suffix: "", label: "certifications earned" },
  { value: roles.length, suffix: "", label: "roles, internships and volunteer posts" },
]
