"use client"

import { useEffect, useRef } from "react"
import { canRun3D, runWhileVisible } from "@/lib/gate"

/**
 * Procedural silk in gold over bronze: no image, no downloads. Desktop with a capable GPU only (council ruling),
 * rendered at dpr 1 and slowly. Everyone else sees the CSS gradient underneath. Decorative only.
 */

const vertex = /* glsl */ `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }`

const fragment = /* glsl */ `
precision highp float;
uniform float uTime;
uniform vec2 uRes;
varying vec2 vUv;
float h(vec2 p, float t) {
  return sin(p.x * 2.2 + t * 0.6 + sin(p.y * 1.6 + t * 0.4) * 1.6) * 0.55
       + sin(p.y * 3.1 - t * 0.5 + p.x * 1.1) * 0.3
       + sin((p.x + p.y) * 5.0 + t * 0.7) * 0.08;
}
void main() {
  vec2 p = vUv * vec2(uRes.x / uRes.y, 1.0) * 1.4;
  float t = uTime * 0.35;
  float e = 0.01;
  float a = h(p, t);
  float bx = h(p + vec2(e, 0.0), t) - a;
  float by = h(p + vec2(0.0, e), t) - a;
  vec3 n = normalize(vec3(-bx / e * 0.35, -by / e * 0.35, 1.0));
  vec3 l = normalize(vec3(-0.45, 0.55, 0.7));
  float diff = clamp(dot(n, l), 0.0, 1.0);
  float spec = pow(clamp(dot(n, normalize(l + vec3(0.0, 0.0, 1.0))), 0.0, 1.0), 36.0);
  vec3 onyx = vec3(0.055, 0.043, 0.035);
  vec3 bronze = vec3(0.47, 0.29, 0.13);
  vec3 col = mix(onyx, bronze, pow(diff, 3.0) * 1.1) + vec3(0.79, 0.64, 0.36) * spec * 0.9;
  float edge = smoothstep(0.0, 0.35, vUv.x) * 0.85 + 0.15;
  gl_FragColor = vec4(mix(onyx, col, edge), 1.0);
}`

export function Silk({ className = "" }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = host.current
    if (!el || !canRun3D({ desktopOnly: true })) return
    let cleanup = () => {}
    let cancelled = false
    void import("ogl").then(({ Renderer, Program, Mesh, Triangle }) => {
      if (cancelled) return
      const renderer = new Renderer({ dpr: 1, antialias: false, powerPreference: "low-power" })
      const gl = renderer.gl
      gl.canvas.setAttribute("aria-hidden", "true")
      gl.canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;opacity:0;transition:opacity 1.5s ease"
      el.appendChild(gl.canvas)
      const program = new Program(gl, { vertex, fragment, uniforms: { uTime: { value: 0 }, uRes: { value: [1, 1] } } })
      const mesh = new Mesh(gl, { geometry: new Triangle(gl), program })
      const resize = () => {
        const { width, height } = el.getBoundingClientRect()
        renderer.setSize(width, height)
        program.uniforms.uRes.value = [width, height]
      }
      resize()
      const ro = new ResizeObserver(resize)
      ro.observe(el)
      const stop = runWhileVisible(
        el,
        (t) => {
          program.uniforms.uTime.value = t
          renderer.render({ scene: mesh })
        },
        () => (gl.canvas.style.opacity = "0"),
      )
      requestAnimationFrame(() => (gl.canvas.style.opacity = "1"))
      cleanup = () => {
        stop()
        ro.disconnect()
        gl.getExtension("WEBGL_lose_context")?.loseContext()
        gl.canvas.remove()
      }
    })
    return () => {
      cancelled = true
      cleanup()
    }
  }, [])

  return (
    <div
      ref={host}
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ background: "radial-gradient(80% 120% at 15% 30%, rgba(120,74,33,0.55), transparent 60%), radial-gradient(60% 90% at 85% 80%, rgba(201,133,46,0.18), transparent 70%), #0E0B09" }}
    />
  )
}
