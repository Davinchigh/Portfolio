export type ProjectLink = { label: string; href: string }

export type Project = {
  slug: string
  title: string
  summary: string
  image: string
  imageAlt: string
  tags: string[]
  links?: ProjectLink[]
  featured?: boolean
  /** Charts and screenshots that must not be cropped */
  contain?: boolean
}

export const projects: Project[] = [
  {
    slug: "covid-time-series",
    title: "Time Series Analysis of COVID-19 Cases in Ghana",
    summary:
      "My final year project. A reproducible Python pipeline that forecasts Ghana's daily COVID-19 cases from WHO data, covering cleaning, EDA, STL decomposition, ADF and KPSS stationarity tests, and Holt-Winters and autoregressive models with rolling-origin cross-validation and 28-day forecasts with prediction intervals.",
    image: "/images/covid-time-series.png",
    imageAlt: "Chart of Ghana's daily COVID-19 cases with a 28-day forecast and prediction interval",
    tags: ["Python", "Time series", "Statistics", "Forecasting"],
    links: [
      {
        label: "View code on GitHub",
        href: "https://github.com/Davinchigh/Time-Series-Analysis-of-COVID-19-Cases-Using-Holt-Winters-and-Autoregressive-Models-For-Ghana-",
      },
    ],
    featured: true,
    contain: true,
  },
  {
    slug: "elizabeth-sey-hall",
    title: "Elizabeth Sey Hall Website",
    summary:
      "A responsive website design for Elizabeth Frances Sey Hall at the University of Ghana, giving residents and applicants one place for facilities, events, tours and community resources.",
    image: "/images/elizabeth-sey-hall.png",
    imageAlt: "Home page design for the Elizabeth Sey Hall website, headed 'Your home away from home'",
    tags: ["UI/UX", "Figma", "Web design"],
    links: [
      {
        label: "Open in Figma",
        href: "https://www.figma.com/design/ZwUFDBPZLJhf5XUMHLfz8g/Group-56?m=auto&t=UIMTuwtGlRWXeWXV-6",
      },
    ],
  },
  {
    slug: "alx-ai",
    title: "ALX AI Starter Kit Project",
    summary:
      "Work from the ALX AI Starter Kit programme, where I practised prompt engineering, AI-assisted workflows and process automation.",
    image: "/images/alx-ai.webp",
    imageAlt: "Illustration of a person with arms raised beneath a glowing globe over a city skyline",
    tags: ["AI", "Prompt engineering", "Automation"],
  },
]

export const designs = [
  {
    slug: "elizabeth-sey-hall",
    title: "Elizabeth Sey Hall Website",
    summary:
      "A website for Elizabeth Frances Sey Hall at the University of Ghana. It brings the hall's tour booking, how to apply, maintenance requests and contact details into one simple site for current and future residents.",
    image: "/images/elizabeth-sey-hall.png",
    imageAlt: "Home page design for the Elizabeth Sey Hall website",
    secondaryImage: "/images/elizabeth-sey-hall.jpeg",
    secondaryAlt: "Aerial photo of the Elizabeth Sey Hall grounds and surrounding campus",
    tags: ["Figma", "Responsive", "Information architecture"],
    href: "https://www.figma.com/design/ZwUFDBPZLJhf5XUMHLfz8g/Group-56?m=auto&t=UIMTuwtGlRWXeWXV-6",
  },
  {
    slug: "glee-garden",
    title: "Glee Garden",
    summary:
      "A landing page for a home gardening service, built around strong product photography and a single clear call to get started.",
    image: "/images/gardening-website.png",
    imageAlt: "Glee Garden landing page with the headline 'Gardening in your home' beside potted orchids",
    tags: ["Figma", "Landing page", "Visual design"],
    href: "https://www.figma.com/design/L7RpsFVTDxXhtsFduDBIc7/Gardening-Website?node-id=0-1&t=cXSSNo4etJVdy4xk-1",
  },
]
