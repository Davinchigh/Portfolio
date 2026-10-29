/**
 * Should this device get the live WebGL light? Council ruling (round 2):
 * skip on reduced motion, Save-Data, 2G, under 4 GB memory, under 4 cores, or no WebGL2.
 * Unknown values (Safari, Firefox) count as capable. The photo and CSS glow always render first.
 */
type Nav = Navigator & {
  connection?: { saveData?: boolean; effectiveType?: string }
  deviceMemory?: number
}

export function canRun3D({ desktopOnly = false } = {}): boolean {
  if (typeof window === "undefined") return false
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false
  const n = navigator as Nav
  if (n.connection?.saveData) return false
  if (n.connection?.effectiveType && /2g$/.test(n.connection.effectiveType)) return false
  if (n.deviceMemory !== undefined && n.deviceMemory < 4) return false
  if (n.hardwareConcurrency !== undefined && n.hardwareConcurrency < 4) return false
  if (desktopOnly && !window.matchMedia("(pointer: fine) and (min-width: 1024px)").matches) return false
  try {
    const gl = document.createElement("canvas").getContext("webgl2")
    if (!gl) return false
    gl.getExtension("WEBGL_lose_context")?.loseContext()
  } catch {
    return false
  }
  return true
}

/** Runs `draw` at most ~30 times a second while the element is on screen and the tab is visible. */
export function runWhileVisible(el: Element, draw: (t: number) => void, onSlow: () => void) {
  let raf = 0
  let visible = false
  let last = 0
  let slowFrames = 0
  let frames = 0

  const loop = (t: number) => {
    raf = requestAnimationFrame(loop)
    if (t - last < 32) return
    const gap = last ? t - last : 33
    last = t
    frames++
    // If the device can't keep up (gaps over 70 ms for most of the first 60 frames), give up gracefully.
    if (frames < 60 && gap > 70) slowFrames++
    if (frames === 60 && slowFrames > 30) {
      stop()
      onSlow()
      return
    }
    draw(t / 1000)
  }
  const start = () => {
    if (!raf && visible && !document.hidden) raf = requestAnimationFrame(loop)
  }
  const stop = () => {
    cancelAnimationFrame(raf)
    raf = 0
  }
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting
    if (visible) start()
    else stop()
  })
  io.observe(el)
  const onVis = () => (document.hidden ? stop() : start())
  document.addEventListener("visibilitychange", onVis)
  return () => {
    stop()
    io.disconnect()
    document.removeEventListener("visibilitychange", onVis)
  }
}
