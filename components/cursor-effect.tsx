"use client"

import { useEffect, useState } from "react"

export default function CursorEffect() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number; size: number }[]>([])
  const [rippleId, setRippleId] = useState(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)

      // Create a new ripple occasionally
      if (Math.random() > 0.92) {
        const newId = rippleId + 1
        setRippleId(newId)
        setRipples((prev) => [...prev, { id: newId, x: e.clientX, y: e.clientY, size: 0 }])
      }
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
      setRipples([])
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [rippleId])

  // Animate ripples
  useEffect(() => {
    if (ripples.length === 0) return

    const interval = setInterval(() => {
      setRipples((prev) =>
        prev
          .map((ripple) => ({
            ...ripple,
            size: ripple.size + 2,
          }))
          .filter((ripple) => ripple.size < 100),
      )
    }, 20)

    return () => clearInterval(interval)
  }, [ripples])

  return (
    <>
      {/* Main cursor circle */}
      <div
        className="cursor-effect fixed pointer-events-none z-30 transition-opacity duration-300"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: "translate(-50%, -50%)",
          opacity: isVisible ? 0.45 : 0,
        }}
      >
        <div className="w-6 h-6 rounded-full bg-slate-500/20 backdrop-blur-sm border border-slate-400/30"></div>
      </div>

      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="cursor-effect fixed pointer-events-none z-30 rounded-full border border-slate-400/20"
          style={{
            left: `${ripple.x}px`,
            top: `${ripple.y}px`,
            width: `${ripple.size}px`,
            height: `${ripple.size}px`,
            transform: "translate(-50%, -50%)",
            opacity: 1 - ripple.size / 100,
          }}
        ></div>
      ))}
    </>
  )
}
