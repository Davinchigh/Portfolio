"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { timeSeriesProject } from "@/lib/profile-data"

const figmaUrl = "https://www.figma.com/design/ZwUFDBPZLJhf5XUMHLfz8g/Group-56?m=auto&t=UIMTuwtGlRWXeWXV-6"

const projects = [
  timeSeriesProject,
  {
    title: "Elizabeth Sey Hall Website",
    figmaUrl,
    description: "Responsive website design for a university residence hall with modern UI/UX principles, featuring information about facilities, events, and community resources.",
    image: "/images/elizabeth-sey-hall.png",
    categories: ["Web Development", "UI/UX"],
  },
  {
    title: "ALX AI Project",
    description: "Machine learning implementation from the ALX AI Starter Kit program, focusing on predictive analytics and pattern recognition in large datasets.",
    image: "/images/alx-ai.webp",
    categories: ["AI", "Python", "Machine Learning"],
  },
]

const allCategories = ["All", ...Array.from(new Set(projects.flatMap((project) => "categories" in project ? project.categories : project.tags)))]

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState("All")
  const filtered = activeCategory === "All" ? projects : projects.filter((project) => ("categories" in project ? project.categories : project.tags).includes(activeCategory))

  return (
    <main className="min-w-0 overflow-x-hidden pt-20">
      <section className="bg-slate-900 py-20 text-white"><div className="container mx-auto max-w-5xl px-4"><h1 className="mb-6 break-words text-4xl font-bold md:text-5xl">My Projects</h1><p className="max-w-2xl break-words text-xl text-slate-300">A showcase of my academic projects, technical implementations, and creative work.</p></div></section>
      <section className="bg-white px-4 py-16 dark:bg-slate-900"><div className="container mx-auto max-w-5xl">
        <h2 className="mb-6 border-b border-slate-200 pb-2 text-2xl font-bold text-slate-900 dark:border-slate-700 dark:text-white">Filter by Category</h2>
        <Tabs value={activeCategory} onValueChange={setActiveCategory}><TabsList className="mb-8 flex h-auto flex-wrap bg-slate-100 p-2 dark:bg-slate-800">{allCategories.map((category) => <TabsTrigger key={category} value={category} className="m-1 px-4 py-2 data-[state=active]:bg-slate-900 data-[state=active]:text-white dark:data-[state=active]:bg-slate-200 dark:data-[state=active]:text-slate-900">{category}</TabsTrigger>)}</TabsList></Tabs>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">{filtered.map((project, index) => <motion.article key={project.title} whileHover={{ y: -5 }} className="flex min-w-0 flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg dark:bg-slate-800"><div className="relative aspect-video bg-slate-200 dark:bg-slate-700"><img src={project.image} alt={project.title} className="h-full w-full object-cover" />{index === 0 && <span className="absolute left-3 top-3 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">Featured</span>}</div><div className="flex flex-1 flex-col p-6"><h3 className="break-words text-xl font-bold text-slate-900 dark:text-white">{"figmaUrl" in project ? <a href={project.figmaUrl} target="_blank" rel="noreferrer" className="underline decoration-slate-300 underline-offset-4 transition-colors hover:text-blue-600 dark:decoration-slate-600 dark:hover:text-blue-400">{project.title}</a> : project.title}</h3><p className="mt-3 flex-1 break-words text-slate-600 dark:text-slate-300">{project.description}</p><div className="mt-4 flex flex-wrap gap-2">{("categories" in project ? project.categories : project.tags).map((tag) => <span key={tag} className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700 dark:bg-slate-700 dark:text-slate-300">{tag}</span>)}</div>{"figmaUrl" in project && <Button asChild variant="outline" className="mt-5 w-full"><a href={project.figmaUrl} target="_blank" rel="noreferrer">View Figma design <ExternalLink className="ml-2 h-4 w-4" /></a></Button>}</div></motion.article>)}</div>
      </div></section>
    </main>
  )
}
