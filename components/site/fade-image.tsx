"use client"

import { useEffect, useRef, type ImgHTMLAttributes } from "react"

/**
 * An image that settles into focus when it finishes loading.
 * It is only ever hidden by script, and only while still loading, so it shows normally
 * without JavaScript, from cache, or with reduced motion.
 */
export function FadeImage(props: ImgHTMLAttributes<HTMLImageElement>) {
  const ref = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const img = ref.current
    if (!img || img.complete || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    img.dataset.loading = ""
    const done = () => delete img.dataset.loading
    img.addEventListener("load", done, { once: true })
    img.addEventListener("error", done, { once: true })
    return () => {
      img.removeEventListener("load", done)
      img.removeEventListener("error", done)
    }
  }, [])

  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  return <img ref={ref} {...props} className={`fade-image ${props.className ?? ""}`} />
}
