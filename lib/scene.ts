/**
 * The Lizab home experience in three.js.
 *
 *  - A "stage" plane shows the current look. The figure sways a little (wind in the fabric, not the face).
 *  - A 3D satin ribbon floats beside her. Between sections it twists ("the fabric turns") and sweeps down the
 *    screen ("glides to the next section"); the next look is revealed exactly where the ribbon has passed.
 *  - Everything is driven by one number: scroll progress through the sections (e.g. 1.7 = 70% through look 1).
 *
 * Loaded only on capable devices, after the page is interactive. All text and links are HTML.
 */
import * as THREE from "three"

export type Look = { src: string; silk: string; side: "right" | "left" }

const stageVertex = /* glsl */ `
uniform float uTime;
uniform vec2 uPointer;
varying vec2 vUv;
void main() {
  vUv = uv;
  vec3 p = position;
  // breathing depth: the plane bows very slightly, like a print on fabric
  p.z += sin(uv.y * 3.1416) * 0.04 + uPointer.x * (uv.x - 0.5) * 0.12;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}`

const stageFragment = /* glsl */ `
precision highp float;
uniform sampler2D uA;
uniform sampler2D uB;
uniform float uMix;     // 0 = look A, 1 = look B; the wipe edge runs top to bottom
uniform float uTime;
uniform float uAspectA; // image width / height
uniform float uAspectB;
uniform float uPlane;   // plane width / height
uniform vec3 uBg;
uniform vec3 uEdgeGlow;
varying vec2 vUv;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  float a = hash(i), b = hash(i + vec2(1.0, 0.0)), c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

vec2 cover(vec2 uv, float imgAspect) {
  // object-fit: cover, anchored to the top so heads are never cropped
  if (uPlane > imgAspect) { float s = imgAspect / uPlane; uv.y = 1.0 - (1.0 - uv.y) * s; }
  else { float s = uPlane / imgAspect; uv.x = (uv.x - 0.5) * s + 0.5; }
  return uv;
}

vec3 look(sampler2D t, vec2 uv, float aspect) {
  vec2 c = cover(uv, aspect);
  // wind: only the lower and outer parts of the frame (skirts, scarves), never the face
  float m = smoothstep(0.55, 0.0, uv.y) + smoothstep(0.55, 1.0, uv.x) * smoothstep(0.25, 0.6, uv.y) * 0.6;
  c.x += sin(c.y * 14.0 + uTime * 1.6) * 0.0035 * m;
  c.y += sin(c.x * 11.0 + uTime * 1.2) * 0.002 * m;
  return texture2D(t, c).rgb;
}

void main() {
  float n = noise(vUv * vec2(6.0, 3.0) + uTime * 0.05) * 0.08;
  float edge = (1.0 - vUv.y) - (uMix * 1.16 - 0.08) + n;  // < 0 where the ribbon has passed
  float reveal = smoothstep(0.02, -0.02, edge);
  vec3 a = look(uA, vUv, uAspectA);
  vec3 b = look(uB, vUv, uAspectB);
  vec3 col = mix(a, b, reveal);
  // a thin warm glow along the wipe edge, like light catching the fabric
  col += uEdgeGlow * smoothstep(0.05, 0.0, abs(edge)) * step(0.001, uMix) * step(uMix, 0.999) * 0.6;
  // melt the frame into the page
  float vx = smoothstep(0.0, 0.3, vUv.x) * smoothstep(1.0, 0.8, vUv.x);
  float vy = smoothstep(0.0, 0.18, vUv.y) * smoothstep(1.0, 0.9, vUv.y);
  gl_FragColor = vec4(mix(uBg, col, vx * vy), 1.0);
  #include <colorspace_fragment>
}`

const silkVertex = /* glsl */ `
uniform float uTime;
uniform vec3 uStart;
uniform vec3 uEnd;
uniform float uWidth;
uniform float uTwist;
uniform float uWave;
varying vec3 vNormal;
varying vec3 vTangent;
varying vec3 vPos;
varying vec2 vUv;

vec3 ribbon(float u, float v) {
  vec3 dir = uEnd - uStart;
  vec3 side = normalize(vec3(-dir.y, dir.x, 0.0));
  float t = uTime * 0.6;
  vec3 c = uStart + dir * u
    + side * (sin(u * 6.2832 * 1.1 + t) * 0.32 + sin(u * 17.0 - t * 1.7) * 0.05) * uWave
    + vec3(0.0, 0.0, cos(u * 9.0 + t * 1.3) * 0.35 * uWave);
  float theta = uTwist * u * 3.1416 + sin(u * 5.0 + t) * 0.7;
  vec3 w = cos(theta) * side + sin(theta) * vec3(0.0, 0.0, 1.0);
  float taper = smoothstep(0.0, 0.12, u) * smoothstep(1.0, 0.82, u);
  return c + w * (v - 0.5) * uWidth * (0.35 + 0.65 * taper);
}

void main() {
  vUv = uv;
  vec3 p = ribbon(uv.x, uv.y);
  vec3 pu = ribbon(uv.x + 0.002, uv.y) - p;
  vec3 pv = ribbon(uv.x, uv.y + 0.01) - p;
  vTangent = normalize(pu);
  vNormal = normalize(cross(pu, pv));
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vPos = mv.xyz;
  gl_Position = projectionMatrix * mv;
}`

const silkFragment = /* glsl */ `
precision highp float;
uniform vec3 uColor;
uniform float uOpacity;
varying vec3 vNormal;
varying vec3 vTangent;
varying vec3 vPos;
varying vec2 vUv;
void main() {
  vec3 N = normalize(vNormal);
  if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(-vPos);
  vec3 L = normalize(vec3(-0.5, 0.7, 0.6));
  vec3 H = normalize(L + V);
  vec3 T = normalize(vTangent);
  float diff = max(dot(N, L), 0.0);
  // Kajiya-Kay style anisotropic sheen: the long satin highlight
  float th = dot(T, H);
  float aniso = pow(sqrt(max(1.0 - th * th, 0.0)), 70.0);
  float rim = pow(1.0 - max(dot(N, V), 0.0), 3.0);
  vec3 warm = vec3(1.0, 0.82, 0.55);
  vec3 col = uColor * (0.18 + 0.75 * diff) + warm * aniso * 0.85 + uColor * rim * 0.35;
  if (!gl_FrontFacing) col *= 0.7;
  float ends = smoothstep(0.0, 0.06, vUv.x) * smoothstep(1.0, 0.94, vUv.x);
  gl_FragColor = vec4(col, uOpacity * ends);
  #include <colorspace_fragment>
}`

export function createExperience(canvas: HTMLCanvasElement, looks: Look[], onReady: () => void) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.5 : 1.75))
  renderer.setClearColor(0x0e0b09, 1)
  renderer.outputColorSpace = THREE.SRGBColorSpace

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50)
  camera.position.set(0, 0, 6)

  const bg = new THREE.Color(0x0e0b09)
  const loader = new THREE.TextureLoader()
  const textures: THREE.Texture[] = []
  const aspects: number[] = []
  let loaded = 0

  const stageUniforms = {
    uA: { value: null as THREE.Texture | null },
    uB: { value: null as THREE.Texture | null },
    uMix: { value: 0 },
    uTime: { value: 0 },
    uPointer: { value: new THREE.Vector2() },
    uAspectA: { value: 2 / 3 },
    uAspectB: { value: 2 / 3 },
    uPlane: { value: 2 / 3 },
    uBg: { value: new THREE.Vector3(bg.r, bg.g, bg.b) },
    uEdgeGlow: { value: new THREE.Vector3(0.79, 0.52, 0.18) },
  }
  const stage = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 24, 24),
    new THREE.ShaderMaterial({ vertexShader: stageVertex, fragmentShader: stageFragment, uniforms: stageUniforms }),
  )
  scene.add(stage)

  const silkUniforms = {
    uTime: { value: 0 },
    uStart: { value: new THREE.Vector3() },
    uEnd: { value: new THREE.Vector3() },
    uWidth: { value: 0.55 },
    uTwist: { value: 1.2 },
    uWave: { value: 1 },
    uColor: { value: new THREE.Color(looks[0]?.silk ?? "#C9A45C") },
    uOpacity: { value: 0.95 },
  }
  const silk = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 220, 18),
    new THREE.ShaderMaterial({
      vertexShader: silkVertex,
      fragmentShader: silkFragment,
      uniforms: silkUniforms,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
    }),
  )
  silk.frustumCulled = false
  silk.position.z = 0.6
  scene.add(silk)

  looks.forEach((l, i) => {
    loader.load(l.src, (t) => {
      t.colorSpace = THREE.SRGBColorSpace
      t.minFilter = THREE.LinearFilter
      t.generateMipmaps = false
      textures[i] = t
      aspects[i] = t.image.width / t.image.height
      loaded++
      if (i === 0 || loaded === looks.length) {
        stageUniforms.uA.value ??= textures[0] ?? t
        stageUniforms.uB.value ??= textures[0] ?? t
      }
      if (i === 0) onReady()
    })
  })

  // view size at z = 0
  let viewW = 1
  let viewH = 1
  let mobile = false
  const resize = () => {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    viewH = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
    viewW = viewH * camera.aspect
    mobile = w < 768
    const ph = mobile ? viewH : viewH * 0.96
    const pw = mobile ? viewW : Math.min(viewW * 0.5, ph * 0.72)
    stage.scale.set(pw, ph, 1)
    stage.position.set(mobile ? 0 : viewW * 0.2, 0, 0)
    stageUniforms.uPlane.value = pw / ph
  }
  resize()

  const pointer = new THREE.Vector2()
  const target = new THREE.Vector2()
  const onPointer = (e: PointerEvent) => target.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1)
  window.addEventListener("pointermove", onPointer, { passive: true })

  const colors = looks.map((l) => new THREE.Color(l.silk))
  const tmp = new THREE.Color()
  let progress = 0
  let smooth = 0
  let raf = 0
  let running = true
  const clock = new THREE.Clock()

  const frame = () => {
    raf = requestAnimationFrame(frame)
    if (!running) return
    const t = clock.getElapsedTime()
    smooth += (progress - smooth) * 0.08
    pointer.lerp(target, 0.05)

    const last = looks.length - 1
    const p = Math.min(Math.max(smooth, 0), last)
    const i = Math.min(Math.floor(p), last)
    const f = p - i
    const k = i < last ? THREE.MathUtils.smoothstep(f, 0.5, 0.98) : 0 // transition amount to the next look
    const next = Math.min(i + 1, last)

    if (textures[i]) {
      stageUniforms.uA.value = textures[i]
      stageUniforms.uAspectA.value = aspects[i]
    }
    if (textures[next]) {
      stageUniforms.uB.value = textures[next]
      stageUniforms.uAspectB.value = aspects[next]
    }
    stageUniforms.uMix.value = k
    stageUniforms.uTime.value = t
    stageUniforms.uPointer.value.copy(pointer)
    stage.rotation.y = pointer.x * 0.06
    stage.rotation.x = -pointer.y * 0.03

    // Ribbon: at rest it streams from the figure across the frame; in a transition it sweeps down, twisting.
    const sx = stage.position.x
    const half = stage.scale.y / 2
    const restStart = new THREE.Vector3(sx - stage.scale.x * 0.1, half * 0.45, 0)
    const restEnd = new THREE.Vector3(sx + viewW * 0.55, half * 0.15 + Math.sin(t * 0.4) * 0.15, 0)
    // the sweep line matches the wipe edge in the stage shader
    const edgeV = 1 - (k * 1.16 - 0.08)
    const sweepY = stage.position.y + (edgeV - 0.5) * stage.scale.y
    const sweepStart = new THREE.Vector3(-viewW * 0.65, sweepY + 0.25, 0)
    const sweepEnd = new THREE.Vector3(viewW * 0.65, sweepY - 0.25, 0)
    const sweeping = k > 0 && k < 1 ? Math.sin(k * Math.PI) : 0
    const w = Math.min(1, sweeping * 2.5)
    silkUniforms.uStart.value.copy(restStart).lerp(sweepStart, w)
    silkUniforms.uEnd.value.copy(restEnd).lerp(sweepEnd, w)
    silkUniforms.uTwist.value = 1.2 + sweeping * 2.4
    silkUniforms.uWave.value = 1 - sweeping * 0.55
    silkUniforms.uWidth.value = (mobile ? 0.42 : 0.6) * (1 + sweeping * 0.35)
    silkUniforms.uTime.value = t
    tmp.copy(colors[i]).lerp(colors[next], k)
    silkUniforms.uColor.value.copy(tmp)

    renderer.render(scene, camera)
  }
  frame()

  const onVis = () => (running = !document.hidden)
  document.addEventListener("visibilitychange", onVis)
  window.addEventListener("resize", resize)

  return {
    setProgress: (p: number) => (progress = p),
    destroy: () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("pointermove", onPointer)
      window.removeEventListener("resize", resize)
      document.removeEventListener("visibilitychange", onVis)
      textures.forEach((t) => t?.dispose())
      stage.geometry.dispose()
      silk.geometry.dispose()
      ;(stage.material as THREE.Material).dispose()
      ;(silk.material as THREE.Material).dispose()
      renderer.dispose()
    },
  }
}
