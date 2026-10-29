"use client"

import { useEffect, useRef, useState } from "react"
import { canRun3D, runWhileVisible } from "@/lib/gate"

/**
 * "Bronze Spotlight": the real product photo, lit by a warm light that follows the pointer (or drifts slowly),
 * with a gentle cloth breathe. The <img> is the LCP element and the fallback; the canvas reuses it as its
 * texture, so nothing downloads twice. Decorative only: the canvas is hidden from screen readers.
 */

const vertex = /* glsl */ `
attribute vec3 position;
attribute vec2 uv;
uniform float uTime;
uniform vec2 uPointer;
varying vec2 vUv;
varying float vFold;
void main() {
  vUv = uv;
  vec3 p = position;
  float w = sin(p.y * 6.0 + uTime * 0.8) * 0.006 + sin(p.x * 9.0 + p.y * 4.0 + uTime * 1.1) * 0.004;
  float d = distance(uv, uPointer);
  w += exp(-d * d * 40.0) * 0.012;
  vFold = w;
  gl_Position = vec4(p.xy * 2.0, p.z + w, 1.0);
}`

const fragment = /* glsl */ `
precision highp float;
uniform sampler2D tMap;
uniform vec2 uPointer;
uniform vec2 uCover;
uniform float uFade;
varying vec2 vUv;
varying float vFold;
void main() {
  vec2 uv = (vUv - 0.5) * uCover + 0.5;
  vec3 c = texture2D(tMap, uv).rgb;
  float d = distance(vUv, uPointer);
  float spot = smoothstep(0.9, 0.0, d);
  vec3 warm = vec3(0.88, 0.64, 0.35);
  vec3 lit = c * (0.5 + 0.75 * spot) + warm * spot * 0.12 + vFold * 6.0;
  float vig = smoothstep(1.0, 0.25, length((vUv - 0.5) * vec2(1.0, 1.1)));
  vec3 bg = vec3(0.055, 0.043, 0.035);
  gl_FragColor = vec4(mix(bg, lit, vig), uFade);
}`

export function Spotlight({ src, alt, priority = false }: { src: string; alt: string; priority?: boolean }) {
  const wrap = useRef<HTMLDivElement>(null)
  const img = useRef<HTMLImageElement>(null)
  const canvasHost = useRef<HTMLDivElement>(null)
  const [live, setLive] = useState(false)

  useEffect(() => {
    const el = wrap.current
    const image = img.current
    const host = canvasHost.current
    if (!el || !image || !host || !canRun3D()) return
    let cleanup = () => {}
    let cancelled = false

    const begin = async () => {
      const { Renderer, Program, Mesh, Plane, Texture } = await import("ogl")
      if (cancelled) return
      const renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio, 1.5), alpha: true, antialias: false, powerPreference: "low-power" })
      const gl = renderer.gl
      gl.canvas.setAttribute("aria-hidden", "true")
      gl.canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;opacity:0;transition:opacity 1.2s ease"
      host.appendChild(gl.canvas)

      const texture = new Texture(gl, { image, generateMipmaps: false })
      const pointer = { x: 0.35, y: 0.6, tx: 0.35, ty: 0.6, active: false }
      const program = new Program(gl, {
        vertex,
        fragment,
        transparent: true,
        uniforms: {
          tMap: { value: texture },
          uTime: { value: 0 },
          uPointer: { value: [pointer.x, pointer.y] },
          uCover: { value: [1, 1] },
          uFade: { value: 1 },
        },
      })
      const mesh = new Mesh(gl, { geometry: new Plane(gl, { widthSegments: 32, heightSegments: 40 }), program })

      const resize = () => {
        const { width, height } = el.getBoundingClientRect()
        renderer.setSize(width, height)
        // object-fit: cover, in UV space
        const ia = image.naturalWidth / image.naturalHeight
        const ca = width / height
        program.uniforms.uCover.value = ca > ia ? [1, ia / ca] : [ca / ia, 1]
      }
      resize()
      const ro = new ResizeObserver(resize)
      ro.observe(el)

      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect()
        pointer.tx = (e.clientX - r.left) / r.width
        pointer.ty = 1 - (e.clientY - r.top) / r.height
        pointer.active = true
      }
      const onLeave = () => (pointer.active = false)
      el.addEventListener("pointermove", onMove)
      el.addEventListener("pointerleave", onLeave)

      const stop = runWhileVisible(
        el,
        (t) => {
          if (!pointer.active) {
            pointer.tx = 0.5 + Math.sin(t * 0.35) * 0.28
            pointer.ty = 0.6 + Math.cos(t * 0.27) * 0.15
          }
          pointer.x += (pointer.tx - pointer.x) * 0.08
          pointer.y += (pointer.ty - pointer.y) * 0.08
          program.uniforms.uTime.value = t
          program.uniforms.uPointer.value = [pointer.x, pointer.y]
          renderer.render({ scene: mesh })
        },
        () => {
          gl.canvas.style.opacity = "0"
          setLive(false)
        },
      )
      const onLost = (e: Event) => {
        e.preventDefault()
        stop()
        gl.canvas.remove()
        setLive(false)
      }
      gl.canvas.addEventListener("webglcontextlost", onLost)
      requestAnimationFrame(() => {
        gl.canvas.style.opacity = "1"
        setLive(true)
      })

      cleanup = () => {
        stop()
        ro.disconnect()
        el.removeEventListener("pointermove", onMove)
        el.removeEventListener("pointerleave", onLeave)
        gl.canvas.removeEventListener("webglcontextlost", onLost)
        gl.getExtension("WEBGL_lose_context")?.loseContext()
        gl.canvas.remove()
      }
    }

    // Only after the photo has loaded and the browser is idle, so the 3D never delays the page.
    const whenReady = () => {
      const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback
      if (idle) idle(() => void begin())
      else setTimeout(() => void begin(), 300)
    }
    if (image.complete && image.naturalWidth) whenReady()
    else image.addEventListener("load", whenReady, { once: true })

    return () => {
      cancelled = true
      image.removeEventListener("load", whenReady)
      cleanup()
    }
  }, [src])

  return (
    <div ref={wrap} className="relative h-full w-full overflow-hidden bg-onyx" style={{ touchAction: "pan-y" }}>
      <img
        ref={img}
        src={src}
        alt={alt}
        fetchPriority={priority ? "high" : "auto"}
        loading={priority ? "eager" : "lazy"}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${live ? "opacity-0" : "opacity-100"}`}
      />
      {/* The CSS version of the glow: what every phone sees, and the look before WebGL fades in. */}
      <div aria-hidden="true" className={`pointer-events-none absolute inset-0 transition-opacity duration-1000 ${live ? "opacity-0" : "opacity-100"}`} style={{ background: "radial-gradient(60% 55% at 35% 40%, rgba(201,133,46,0.18), transparent 70%), radial-gradient(120% 100% at 50% 50%, transparent 55%, rgba(14,11,9,0.85) 100%)" }} />
      <div ref={canvasHost} aria-hidden="true" className="absolute inset-0" />
    </div>
  )
}
