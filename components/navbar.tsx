"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "next-themes"

const navLinks = [{ name: "Home", path: "/" }, { name: "About", path: "/about" }, { name: "Projects", path: "/projects" }, { name: "Resume", path: "/resume" }, { name: "Figma Designs", path: "/figma-designs" }, { name: "Contact", path: "/contact" }]

export default function Navbar() { const [isOpen, setIsOpen] = useState(false); const [scrolled, setScrolled] = useState(false); const [mounted, setMounted] = useState(false); const pathname = usePathname(); const { resolvedTheme } = useTheme(); const isDark = mounted && resolvedTheme === "dark"; const isHomePage = pathname === "/"; const isTransparent = isHomePage && !scrolled && !isDark
  useEffect(() => { setMounted(true) }, [])
  useEffect(() => { const handleScroll = () => setScrolled(window.scrollY > 10); window.addEventListener("scroll", handleScroll); return () => window.removeEventListener("scroll", handleScroll) }, [])
  useEffect(() => { setIsOpen(false) }, [pathname])
  return <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm text-slate-900 dark:text-white" : isHomePage ? isDark ? "bg-slate-900 text-white" : "bg-transparent text-white" : "bg-white dark:bg-slate-900 text-slate-900 dark:text-white"}`}><div className="container max-w-6xl mx-auto px-4"><nav className="flex justify-between items-center h-16 md:h-20"><Link href="/" className="font-bold text-xl">Benedict FB</Link><div className="hidden md:flex items-center space-x-1">{navLinks.map((link) => <Link key={link.path} href={link.path} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === link.path ? isTransparent ? "text-white bg-white/20" : "text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800" : isTransparent ? "text-white/80 hover:text-white hover:bg-white/20" : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"}`}>{link.name}</Link>)}<ThemeToggle /></div><div className="flex items-center md:hidden"><ThemeToggle /><Button variant="ghost" size="icon" className="ml-2" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">{isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</Button></div></nav></div><AnimatePresence>{isOpen && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-white dark:bg-slate-900 text-slate-900 dark:text-white"><div className="container max-w-6xl mx-auto px-4 py-4 flex flex-col space-y-2">{navLinks.map((link) => <Link key={link.path} href={link.path} className="px-4 py-3 rounded-md text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">{link.name}</Link>)}</div></motion.div>}</AnimatePresence></header>
}
