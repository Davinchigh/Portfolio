import type { ComponentType } from "react"
import { Briefcase, Users } from "lucide-react"

export type VolunteerItem = { organization: string; role: string; dates: string; description?: string }

export const volunteerExperience: VolunteerItem[] = [
  { organization: "NextGen Youth Movement", role: "Facilitator, Teens Conference 2026", dates: "2026 · Ghana", description: "Led the AI and Coding session for teenagers and received a Certificate of Appreciation from the Executive Director." },
  { organization: "Ideal Market (Supermarket)", role: "Volunteer Database Assistant", dates: "Sept – Dec 2022 · Accra", description: "Set up and managed store databases in Odoo and supported inventory tracking and data organization." },
]
export const leadership: VolunteerItem[] = [
  { organization: "CodeRaccoon", role: "Team Lead", dates: "Nov 2025 – Aug 2026" },
  { organization: "Raising Beautiful Flowers (RBF)", role: "Liaison", dates: "Jan 2025 – Apr 2026" },
]
export const timeSeriesProject = { title: "Time Series Analysis of COVID-19 Cases in Ghana", description: "Reproducible Python pipeline that forecasts Ghana's daily COVID-19 cases using WHO data. It covers data cleaning, EDA, STL decomposition, ADF/KPSS stationarity tests, and Holt-Winters and Autoregressive models with rolling-origin cross-validation, diagnostics and 28-day forecasts with prediction intervals.", image: "/images/covid-time-series.png", tags: ["Python", "Time Series", "Statistics", "Forecasting"], link: "https://github.com/Davinchigh/Time-Series-Analysis-of-COVID-19-Cases-Using-Holt-Winters-and-Autoregressive-Models-For-Ghana-" }

export function VolunteerCard({ item, icon: Icon }: { item: VolunteerItem; icon: ComponentType<{ className?: string }> }) { return <article className="flex min-w-0 h-full flex-col rounded-xl border border-slate-200 bg-slate-50 p-5 transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800"><div className="mb-4 flex items-start justify-between gap-3"><Icon className="h-5 w-5 shrink-0 text-slate-700 dark:text-slate-300" /><span className="max-w-full break-words rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-200">{item.dates}</span></div><h4 className="break-words text-lg font-semibold text-slate-900 dark:text-white">{item.organization}</h4><p className="mt-1 break-words font-medium text-slate-700 dark:text-slate-300">{item.role}</p>{item.description && <p className="mt-3 break-words text-sm leading-6 text-slate-600 dark:text-slate-400">{item.description}</p>}</article> }

export function VolunteerGroups({ compact = false }: { compact?: boolean }) { const groups = [{ title: "Volunteer experience", intro: "Community-focused roles where I supported learning, systems and data organization.", items: volunteerExperience, icon: Users }, { title: "Leadership", intro: "Leadership roles built around coordination, ownership and helping teams move forward.", items: leadership, icon: Briefcase }]; return <div className="space-y-10">{groups.map(({ title, intro, items, icon: Icon }, index) => <section key={title}><h3 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h3><p className="mt-2 max-w-2xl break-words text-slate-600 dark:text-slate-400">{intro}</p><div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">{items.map((item) => <VolunteerCard key={`${item.organization}-${item.role}`} item={compact && index === 1 ? { ...item, description: undefined } : item} icon={Icon} />)}</div></section>)}</div> }
