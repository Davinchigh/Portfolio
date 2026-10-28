"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function FigmaDesignsPage() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <main className="pt-20 min-h-screen">
      {/* Header */}
      <section className="bg-slate-900 text-white py-20">
        <div className="container max-w-5xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Figma Designs</h1>
          <p className="text-xl text-slate-300 max-w-2xl">
            Explore my UI/UX design work and prototypes created in Figma.
          </p>
        </div>
      </section>

      {/* Figma Design Showcase */}
      <section className="py-16 px-4 bg-white dark:bg-slate-900">
        <div className="container max-w-5xl mx-auto">
          <div className="grid grid-cols-1 gap-12">
            {/* Gardening Website Design */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl overflow-hidden shadow-md border border-slate-100 dark:border-slate-700">
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  onHoverStart={() => setIsHovered(true)}
                  onHoverEnd={() => setIsHovered(false)}
                  className="relative overflow-hidden"
                >
                  <img src="/images/gardening-website.png" alt="Gardening Website Design" className="w-full h-auto" />
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-slate-900/70 flex items-center justify-center"
                  >
                    <Button asChild size="lg" className="rounded-full">
                      <a
                        href="https://www.figma.com/design/L7RpsFVTDxXhtsFduDBIc7/Gardening-Website?node-id=0-1&t=cXSSNo4etJVdy4xk-1"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View in Figma <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Gardening Website Design</h2>
                <p className="text-slate-700 dark:text-slate-300 mb-4">
                  A modern, responsive website design for a gardening service. This project showcases my UI/UX skills
                  and attention to detail in creating visually appealing and functional interfaces.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-full">
                    UI Design
                  </span>
                  <span className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-full">
                    Figma
                  </span>
                  <span className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-full">
                    Responsive
                  </span>
                  <span className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-full">
                    Web Design
                  </span>
                </div>
                <Button asChild variant="outline" className="w-full">
                  <a
                    href="https://www.figma.com/design/L7RpsFVTDxXhtsFduDBIc7/Gardening-Website?node-id=0-1&t=cXSSNo4etJVdy4xk-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open Figma Design <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Design Process Section */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
                My Design Process
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700">
                  <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">Research & Discovery</h3>
                  <p className="text-slate-700 dark:text-slate-300">
                    I begin each design project with thorough research to understand user needs, market trends, and
                    client requirements. This foundation ensures that the final design is both functional and
                    user-centered.
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700">
                  <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">
                    Wireframing & Prototyping
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300">
                    Creating low and high-fidelity wireframes allows me to iterate quickly and test different layouts
                    before committing to a final design. Interactive prototypes help visualize the user journey.
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700">
                  <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">Visual Design & Handoff</h3>
                  <p className="text-slate-700 dark:text-slate-300">
                    The final stage involves creating polished visual designs with attention to typography, color
                    theory, and accessibility. I prepare detailed documentation for developers to ensure accurate
                    implementation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-slate-100 dark:bg-slate-800">
        <div className="container max-w-5xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Interested in Working Together?</h2>
          <p className="text-slate-700 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            I'm always open to new design projects and collaborations. Let's create something amazing together!
          </p>
          <Button asChild size="lg" className="rounded-full">
            <a href="/contact">Get in Touch</a>
          </Button>
        </div>
      </section>
    </main>
  )
}
