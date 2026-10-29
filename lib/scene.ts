/**
 * The Lizab home experience in three.js.
 *
 *  - The stage shows the current look, fitted below the header so faces are never cropped.
 *  - In the first look the woman holds a real simulated silk scarf (a Verlet cloth). Wind moves it all the time.
 *  - When you scroll she lets it go: the scarf lifts out of frame, opens up and glides down the screen.
 *    Its top edge is the transition line: above it the next look is revealed, below it the old one remains.
 *  - The same scarf returns for every transition. Scroll back to the top and it comes back to her hand.
 *
 * Driven by one number: scroll progress through the sections (1.7 = 70% through look 1).
 * Loaded only on capable devices, after the page is interactive. All text and links are HTML.
 */
import * as THREE from "three"

export type Look = {
  src: string
  silk: string
  /** where the figure's hand is in the image (0..1, y from the top), if the scarf starts in her hand */
  hand?: [number, number]
  /** a cutout of her fist (PNG with alpha) and its box in the image: x, y from the top, width, height (0..1) */
  handMask?: { src: string; box: [number, number, number, number] }
}

const stageVertex = /* glsl */ `
varying vec2 vWorld;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xy;
  gl_Position = projectionMatrix * viewMatrix * w;
}`

const stageFragment = /* glsl */ `
precision highp float;
uniform sampler2D uA;
uniform sampler2D uB;
uniform vec4 uRectA;   // x0, y0, w, h in world units
uniform vec4 uRectB;
uniform vec3 uBg;
uniform vec4 uLine;    // Y, amplitude, frequency, phase
uniform float uTilt;
uniform float uActive;
uniform float uTime;
varying vec2 vWorld;

vec3 look(sampler2D t, vec4 r, vec2 p) {
  vec2 uv = (p - r.xy) / r.zw;
  vec3 c = texture2D(t, clamp(uv, 0.001, 0.999)).rgb;
  // melt the photo into the page on every side
  float m = smoothstep(0.0, 0.18, uv.x) * smoothstep(1.0, 0.82, uv.x)
          * smoothstep(-0.02, 0.07, uv.y) * smoothstep(1.0, 0.8, uv.y);
  return mix(uBg, c, m);
}

void main() {
  vec3 a = look(uA, uRectA, vWorld);
  vec3 b = look(uB, uRectB, vWorld);
  float edge = vWorld.y - (uLine.x + uLine.y * sin(vWorld.x * uLine.z + uLine.w) + uTilt * vWorld.x);
  float reveal = uActive * smoothstep(-0.015, 0.015, edge);
  vec3 col = mix(a, b, reveal);
  // light catching the edge of the silk
  col += vec3(0.85, 0.7, 0.45) * smoothstep(0.06, 0.0, abs(edge)) * uActive * 0.25;
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}`

const silkVertex = /* glsl */ `
attribute vec3 tangent3;
varying vec3 vNormal;
varying vec3 vTangent;
varying vec3 vPos;
varying vec2 vUv;
void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vTangent = normalize(normalMatrix * tangent3);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vPos = mv.xyz;
  gl_Position = projectionMatrix * mv;
}`

const silkFragment = /* glsl */ `
precision highp float;
uniform vec3 uColor;
varying vec3 vNormal;
varying vec3 vTangent;
varying vec3 vPos;
varying vec2 vUv;

float aniso(vec3 T, vec3 H, float e) { float th = dot(T, H); return pow(sqrt(max(1.0 - th * th, 0.0)), e); }

void main() {
  vec3 N = normalize(vNormal);
  bool back = !gl_FrontFacing;
  if (back) N = -N;
  vec3 V = normalize(-vPos);
  vec3 T = normalize(vTangent);
  vec3 L1 = normalize(vec3(-0.55, 0.75, 0.6));  // warm key, upper left (matches the photos)
  vec3 L2 = normalize(vec3(0.7, -0.2, 0.5));    // soft fill
  float d1 = max(dot(N, L1), 0.0);
  float d2 = max(dot(N, L2), 0.0);
  // satin: a long anisotropic highlight along the weave, plus a broad soft one
  float s = aniso(T, normalize(L1 + V), 90.0) * 0.9 + aniso(T, normalize(L1 + V), 12.0) * 0.18;
  float rim = pow(1.0 - max(dot(N, V), 0.0), 3.0);
  vec3 col = uColor * (0.07 + 0.78 * d1 + 0.14 * d2)
           + vec3(1.0, 0.9, 0.72) * s
           + uColor * rim * 0.25;
  if (back) col *= 0.72;
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}`

const handFragment = /* glsl */ `
precision highp float;
uniform sampler2D uTex;
uniform float uOpacity;
varying vec2 vUv;
void main() {
  vec4 c = texture2D(uTex, vUv);
  gl_FragColor = vec4(c.rgb, c.a * uOpacity);
  #include <colorspace_fragment>
}`

const shadowFragment = /* glsl */ `
precision highp float;
uniform float uOpacity;
void main() { gl_FragColor = vec4(0.02, 0.015, 0.01, uOpacity); }`

const basicVertex = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`

const ss = (e0: number, e1: number, x: number) => {
  const t = Math.min(Math.max((x - e0) / (e1 - e0), 0), 1)
  return t * t * (3 - 2 * t)
}
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** A small Verlet cloth: C points across the top edge, R rows down. */
function makeCloth(C: number, R: number) {
  const N = C * R
  const pos = new Float32Array(N * 3)
  const prev = new Float32Array(N * 3)
  const A: number[] = []
  const B: number[] = []
  const K: number[] = [] // 0 across, 1 down, 2 shear
  const id = (c: number, r: number) => r * C + c
  for (let r = 0; r < R; r++)
    for (let c = 0; c < C; c++) {
      if (c < C - 1) (A.push(id(c, r)), B.push(id(c + 1, r)), K.push(0))
      if (r < R - 1) (A.push(id(c, r)), B.push(id(c, r + 1)), K.push(1))
      if (c < C - 1 && r < R - 1) {
        A.push(id(c, r), id(c + 1, r))
        B.push(id(c + 1, r + 1), id(c, r + 1))
        K.push(2, 2)
      }
      // bend springs (every other point) keep silk in long soft folds instead of crumpling
      if (c < C - 2) (A.push(id(c, r)), B.push(id(c + 2, r)), K.push(3))
      if (r < R - 2) (A.push(id(c, r)), B.push(id(c, r + 2)), K.push(4))
    }
  return { C, R, N, pos, prev, a: Int32Array.from(A), b: Int32Array.from(B), k: Uint8Array.from(K), id }
}

export function createExperience(canvas: HTMLCanvasElement, looks: Look[], onReady: () => void) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" })
  const small = window.innerWidth < 768
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.5 : 1.75))
  const BG = 0x0d0c0b
  renderer.setClearColor(BG, 1)
  renderer.outputColorSpace = THREE.SRGBColorSpace

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50)
  camera.position.set(0, 0, 6)

  const bg = new THREE.Color(BG)
  const loader = new THREE.TextureLoader()
  const textures: THREE.Texture[] = []
  const aspects: number[] = looks.map(() => 2 / 3)

  // ---------- stage ----------
  const stageU = {
    uA: { value: null as THREE.Texture | null },
    uB: { value: null as THREE.Texture | null },
    uRectA: { value: new THREE.Vector4() },
    uRectB: { value: new THREE.Vector4() },
    uBg: { value: new THREE.Vector3(bg.r, bg.g, bg.b) },
    uLine: { value: new THREE.Vector4(99, 0, 1, 0) },
    uTilt: { value: 0 },
    uActive: { value: 0 },
    uTime: { value: 0 },
  }
  const stage = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.ShaderMaterial({ vertexShader: stageVertex, fragmentShader: stageFragment, uniforms: stageU, depthWrite: false }),
  )
  stage.renderOrder = 0
  scene.add(stage)

  // ---------- cloth ----------
  const cloth = makeCloth(small ? 18 : 24, small ? 24 : 32)
  const { C, R, N, pos, prev, id } = cloth
  // the simulated grid is coarse; the rendered surface is a smooth Catmull-Rom patch through it
  const SUB = small ? 2 : 3
  const RC = (C - 1) * SUB + 1
  const RR = (R - 1) * SUB + 1
  const RN = RC * RR
  const rpos = new Float32Array(RN * 3)
  const widx = new Int32Array(RN * 16)
  const wval = new Float32Array(RN * 16)
  const cr = (t: number) => {
    const t2 = t * t, t3 = t2 * t
    return [(-t3 + 2 * t2 - t) / 2, (3 * t3 - 5 * t2 + 2) / 2, (-3 * t3 + 4 * t2 + t) / 2, (t3 - t2) / 2]
  }
  for (let rr = 0; rr < RR; rr++)
    for (let rc = 0; rc < RC; rc++) {
      const v = rr * RC + rc
      const u = rc / SUB, w = rr / SUB
      const c0 = Math.min(Math.floor(u), C - 2), r0 = Math.min(Math.floor(w), R - 2)
      const wu = cr(u - c0), wv = cr(w - r0)
      let n = 0
      for (let j = 0; j < 4; j++)
        for (let i = 0; i < 4; i++) {
          const cc = Math.min(Math.max(c0 - 1 + i, 0), C - 1)
          const rw = Math.min(Math.max(r0 - 1 + j, 0), R - 1)
          widx[v * 16 + n] = id(cc, rw)
          wval[v * 16 + n] = wu[i] * wv[j]
          n++
        }
    }
  const geo = new THREE.BufferGeometry()
  const posAttr = new THREE.BufferAttribute(rpos, 3)
  posAttr.setUsage(THREE.DynamicDrawUsage)
  geo.setAttribute("position", posAttr)
  const tan = new Float32Array(RN * 3)
  const tanAttr = new THREE.BufferAttribute(tan, 3)
  tanAttr.setUsage(THREE.DynamicDrawUsage)
  geo.setAttribute("tangent3", tanAttr)
  const uvs = new Float32Array(RN * 2)
  const index: number[] = []
  for (let r = 0; r < RR; r++)
    for (let c = 0; c < RC; c++) {
      const q = r * RC + c
      uvs[q * 2] = c / (RC - 1)
      uvs[q * 2 + 1] = 1 - r / (RR - 1)
      if (c < RC - 1 && r < RR - 1) index.push(q, q + RC, q + 1, q + 1, q + RC, q + RC + 1)
    }
  geo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2))
  geo.setIndex(index)
  const simNormals = new Float32Array(N * 3)

  const silkU = { uColor: { value: new THREE.Color("#CFB283") } }
  const silk = new THREE.Mesh(
    geo,
    new THREE.ShaderMaterial({ vertexShader: silkVertex, fragmentShader: silkFragment, uniforms: silkU, side: THREE.DoubleSide }),
  )
  silk.frustumCulled = false
  silk.renderOrder = 2
  scene.add(silk)

  // a soft contact shadow: the same cloth flattened onto the backdrop, nudged down and right
  const shadowU = { uOpacity: { value: 0.22 } }
  const shadow = new THREE.Mesh(
    geo,
    new THREE.ShaderMaterial({ vertexShader: basicVertex, fragmentShader: shadowFragment, uniforms: shadowU, transparent: true, depthWrite: false, depthTest: false, side: THREE.DoubleSide }),
  )
  shadow.frustumCulled = false
  shadow.scale.z = 0.0001
  shadow.renderOrder = 1
  scene.add(shadow)

  // her fist, drawn again on top of the cloth so the scarf disappears into her grip
  const handU = { uTex: { value: null as THREE.Texture | null }, uOpacity: { value: 1 } }
  const hand = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.ShaderMaterial({ vertexShader: basicVertex, fragmentShader: handFragment, uniforms: handU, transparent: true, depthTest: false, depthWrite: false }),
  )
  hand.renderOrder = 3
  scene.add(hand)

  const mask = looks[0]?.handMask
  if (mask)
    loader.load(mask.src, (t) => {
      t.colorSpace = THREE.SRGBColorSpace
      handU.uTex.value = t
    })
  let loaded = 0
  looks.forEach((l, i) => {
    loader.load(l.src, (t) => {
      t.colorSpace = THREE.SRGBColorSpace
      t.minFilter = THREE.LinearFilter
      t.generateMipmaps = false
      textures[i] = t
      aspects[i] = t.image.width / t.image.height
      loaded++
      if (i === 0) {
        layout()
        resetHeld()
        onReady()
      }
    })
  })

  // ---------- layout ----------
  let viewW = 1
  let viewH = 1
  let mobile = false
  let headerWorld = 0
  const resize = () => {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    viewH = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
    viewW = viewH * camera.aspect
    mobile = w < 768
    const header = document.querySelector("header")
    headerWorld = ((header?.getBoundingClientRect().height ?? 0) / Math.max(h, 1)) * viewH
    stage.scale.set(viewW * 1.25, viewH * 1.25, 1)
    layout()
  }

  /** contain-fit a look below the header: desktop on the right, phones at the top */
  const rectFor = (aspect: number, breathe = 1) => {
    const top = viewH / 2 - headerWorld - viewH * 0.03
    const bottom = -viewH / 2 + viewH * 0.01
    if (mobile) {
      let w = viewW
      let h = w / aspect
      if (h > top - bottom) (h = top - bottom), (w = h * aspect)
      h *= breathe
      w *= breathe
      return new THREE.Vector4(-w / 2, top - h, w, h)
    }
    const x0 = -viewW / 2 + viewW * 0.44
    const x1 = viewW / 2 - viewW * 0.03
    let h = top - bottom
    let w = h * aspect
    if (w > x1 - x0) (w = x1 - x0), (h = w / aspect)
    w *= breathe
    h *= breathe
    return new THREE.Vector4((x0 + x1) / 2 - w / 2, bottom, w, h)
  }

  const handWorld = new THREE.Vector3()
  const handRect = new THREE.Vector4()
  let breathe = 1
  function layout() {
    const r = rectFor(aspects[0], breathe)
    handRect.copy(r)
    const hp = looks[0]?.hand ?? [0.78, 0.215]
    handWorld.set(r.x + hp[0] * r.z, r.y + (1 - hp[1]) * r.w, 0.02)
    // her fist, on the same plane as the photo and drawn last, so it lines up from any camera angle
    const b = looks[0]?.handMask?.box ?? [0, 0, 0, 0]
    hand.scale.set(b[2] * r.z, b[3] * r.w, 1)
    hand.position.set(r.x + (b[0] + b[2] / 2) * r.z, r.y + (1 - b[1] - b[3] / 2) * r.w, 0.001)
  }

  // ---------- cloth simulation ----------
  const held = { dx: small ? 0.055 : 0.05, dy: small ? 0.065 : 0.06 }
  let dx = held.dx
  let dy = held.dy
  const pinned = new Float32Array(N) // weight 0..1
  const target = new Float32Array(N * 3)

  const setP = (i: number, x: number, y: number, z: number) => {
    pos[i * 3] = prev[i * 3] = x
    pos[i * 3 + 1] = prev[i * 3 + 1] = y
    pos[i * 3 + 2] = prev[i * 3 + 2] = z
  }
  function resetHeld() {
    for (let r = 0; r < R; r++)
      for (let c = 0; c < C; c++) setP(id(c, r), handWorld.x + c * dx * 0.8 + r * dx * 0.4, handWorld.y - r * dy * 0.8, 0.05 + c * 0.004)
  }
  function resetLine() {
    for (let r = 0; r < R; r++)
      for (let c = 0; c < C; c++) {
        const t = id(c, 0) * 3
        setP(id(c, r), target[t], target[t + 1] - r * dy, target[t + 2])
      }
  }

  const g = -16
  let windT = 0
  let flat = 1 // how strongly the held scarf is kept facing the camera (a scarf, not a weather vane)
  function step(dt: number, wind: THREE.Vector3, gust: number) {
    const damp = 0.985
    for (let i = 0; i < N; i++) {
      const j = i * 3
      const x = pos[j], y = pos[j + 1], z = pos[j + 2]
      let ax = wind.x, ay = g + wind.y, az = wind.z + (0.18 - z) * 30 * flat
      // flutter: wind pushes on the face of the cloth, varying across it
      {
        const nx = simNormals[j], ny = simNormals[j + 1], nz = simNormals[j + 2]
        const f = (nx * wind.x + ny * wind.y + nz * wind.z) * (0.9 + gust * Math.sin(windT * 3.1 + x * 2.3 + y * 1.7))
        ax += nx * f * 0.9
        ay += ny * f * 0.9
        az += nz * f * 0.9
      }
      const vx = (x - prev[j]) * damp, vy = (y - prev[j + 1]) * damp, vz = (z - prev[j + 2]) * damp
      prev[j] = x
      prev[j + 1] = y
      prev[j + 2] = z
      pos[j] = x + vx + ax * dt * dt
      pos[j + 1] = y + vy + ay * dt * dt
      pos[j + 2] = z + vz + az * dt * dt
    }
    const sh = Math.hypot(dx, dy)
    const { a, b, k } = cloth
    for (let it = 0; it < 10; it++) {
      for (let s = 0; s < a.length; s++) {
        const i1 = a[s] * 3, i2 = b[s] * 3
        const ks = k[s]
        const rest = ks === 0 ? dx : ks === 1 ? dy : ks === 2 ? sh : ks === 3 ? dx * 2 : dy * 2
        const ex = pos[i2] - pos[i1], ey = pos[i2 + 1] - pos[i1 + 1], ez = pos[i2 + 2] - pos[i1 + 2]
        const d = Math.sqrt(ex * ex + ey * ey + ez * ez) || 1e-6
        if (ks > 2 && d >= rest * 0.92) continue // bend springs resist sharp folds, so silk falls in soft wide waves
        const m = ((d - rest) / d) * (ks > 2 ? 0.18 : 0.5)
        pos[i1] += ex * m
        pos[i1 + 1] += ey * m
        pos[i1 + 2] += ez * m
        pos[i2] -= ex * m
        pos[i2 + 1] -= ey * m
        pos[i2 + 2] -= ez * m
      }
      for (let i = 0; i < N; i++) {
        const w = pinned[i]
        if (w <= 0) continue
        const j = i * 3
        pos[j] += (target[j] - pos[j]) * w
        pos[j + 1] += (target[j + 1] - pos[j + 1]) * w
        pos[j + 2] += (target[j + 2] - pos[j + 2]) * w
      }
    }
    // keep the scarf in front of the backdrop
    for (let i = 0; i < N; i++) if (pos[i * 3 + 2] < 0.03) pos[i * 3 + 2] = 0.03
  }

  function updateSurface() {
    for (let v = 0; v < RN; v++) {
      let x = 0, y = 0, z = 0
      const o = v * 16
      for (let n = 0; n < 16; n++) {
        const w = wval[o + n], j = widx[o + n] * 3
        x += pos[j] * w
        y += pos[j + 1] * w
        z += pos[j + 2] * w
      }
      rpos[v * 3] = x
      rpos[v * 3 + 1] = y
      rpos[v * 3 + 2] = z
    }
    posAttr.needsUpdate = true
    geo.computeVertexNormals()
    const nrm = geo.getAttribute("normal").array as Float32Array
    for (let r = 0; r < RR; r++)
      for (let c = 0; c < RC; c++) {
        const i = (r * RC + c) * 3
        const l = (r * RC + Math.max(c - 1, 0)) * 3
        const h = (r * RC + Math.min(c + 1, RC - 1)) * 3
        tan[i] = rpos[h] - rpos[l]
        tan[i + 1] = rpos[h + 1] - rpos[l + 1]
        tan[i + 2] = rpos[h + 2] - rpos[l + 2]
      }
    tanAttr.needsUpdate = true
    for (let r = 0; r < R; r++)
      for (let c = 0; c < C; c++) {
        const j = id(c, r) * 3, q = (r * SUB * RC + c * SUB) * 3
        simNormals[j] = nrm[q]
        simNormals[j + 1] = nrm[q + 1]
        simNormals[j + 2] = nrm[q + 2]
      }
  }

  // ---------- pointer ----------
  const pointer = new THREE.Vector2()
  const aim = new THREE.Vector2()
  const onPointer = (e: PointerEvent) => aim.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1)
  window.addEventListener("pointermove", onPointer, { passive: true })

  // ---------- frame ----------
  let progress = 0
  let smooth = 0
  let raf = 0
  let running = true
  let lastSeg = -1
  let lastT = 0
  const clock = new THREE.Clock()
  const wind = new THREE.Vector3()
  resize()
  resetHeld()

  const frame = () => {
    raf = requestAnimationFrame(frame)
    if (!running) return
    const t = clock.getElapsedTime()
    const dtFrame = Math.min(t - lastT, 1 / 30)
    lastT = t
    smooth += (progress - smooth) * 0.09
    pointer.lerp(aim, 0.04)
    camera.position.x = pointer.x * 0.14
    camera.position.y = pointer.y * 0.08
    camera.lookAt(0, 0, 0)

    const last = looks.length - 1
    const p = Math.min(Math.max(smooth, 0), last)
    const i = Math.min(Math.floor(p), last)
    const f = p - i
    const k = i < last ? ss(0.3, 0.97, f) : 0
    const next = Math.min(i + 1, last)

    // a slow breath in the frame
    breathe = 1 + Math.sin(t * 1.25) * 0.0035
    layout()
    if (textures[i]) (stageU.uA.value = textures[i]), stageU.uRectA.value.copy(rectFor(aspects[i], i === 0 ? breathe : 1))
    if (textures[next]) (stageU.uB.value = textures[next]), stageU.uRectB.value.copy(rectFor(aspects[next], next === 0 ? breathe : 1))
    if (!stageU.uA.value && textures[0]) stageU.uA.value = textures[0]
    if (!stageU.uB.value) stageU.uB.value = stageU.uA.value

    // --- choreography ---
    // release: only in the first look, the first 20% of the transition
    const release = i === 0 ? ss(0, 0.22, k) : 1
    const v = i === 0 ? ss(0.2, 1, k) : ss(0, 1, k)
    const clothLen = viewH * (mobile ? 0.42 : 0.46)
    const yStart = viewH / 2 + clothLen + 0.35
    const yEnd = -viewH / 2 - 0.35
    const lineY = lerp(yStart, yEnd, v)
    const amp = 0.16 + 0.1 * Math.sin(v * Math.PI)
    const freq = 1.25
    const phase = t * 0.5 + v * 5
    const tilt = Math.sin(v * Math.PI) * 0.12
    const span = viewW * 1.3

    dx = lerp(held.dx, span / (C - 1), release)
    dy = lerp(held.dy, clothLen / (R - 1), release)

    // pin targets: the top row, from her hand to the sweep line
    for (let c = 0; c < C; c++) {
      const x = -span / 2 + (c / (C - 1)) * span
      const lx = x
      const ly = lineY + amp * Math.sin(x * freq + phase) + tilt * x
      const lz = 0.45 + 0.3 * Math.cos(x * freq * 0.7 + phase * 1.3)
      const hx = handWorld.x + c * 0.004
      const hy = handWorld.y - c * 0.003
      const j = id(c, 0) * 3
      target[j] = lerp(hx, lx, release)
      target[j + 1] = lerp(hy, ly, release)
      target[j + 2] = lerp(0.05, lz, release)
      // in her hand only the corner is gripped; once released the whole top edge rides the line
      const grip = c < 2 ? 1 : 0
      pinned[id(c, 0)] = i === 0 ? Math.max(grip, ss(0.05, 0.6, release)) : 1
    }
    pinned[id(0, 1)] = i === 0 ? 1 - release : 0
    target[id(0, 1) * 3] = handWorld.x - 0.005
    target[id(0, 1) * 3 + 1] = handWorld.y - 0.02
    target[id(0, 1) * 3 + 2] = 0.05

    // segment changes happen off screen: put the scarf where it should be
    const seg = i === 0 && k === 0 ? -1 : i
    if (seg !== lastSeg) {
      if (seg === -1 && lastSeg !== -1) resetHeld()
      else if (seg !== -1) resetLine()
      lastSeg = seg
    }

    // wind: a steady breeze from the left that lifts the held scarf; calmer once it is sweeping
    windT += dtFrame
    const gust = 0.5 + 0.5 * Math.sin(windT * 0.7) * Math.sin(windT * 1.3 + 1)
    const heldW = 1 - release
    wind.set(
      lerp(4, 2.5, release) + gust * 3.5 * heldW,
      lerp(10, 1.5, release) + gust * 4 * heldW,
      Math.sin(windT * 1.1) * 3.5 + Math.sin(windT * 2.3) * 1.5,
    )

    flat = 1 - release
    const sub = 2
    for (let s = 0; s < sub; s++) step(Math.max(dtFrame, 1 / 120) / sub, wind, 0.6)
    updateSurface()

    const visible = i === 0 || (k > 0 && k < 1)
    silk.visible = shadow.visible = visible
    shadow.position.set(0.09, -0.12, 0)
    shadowU.uOpacity.value = 0.2 * (1 - release * 0.5)
    hand.visible = i === 0 && release < 0.999 && !!handU.uTex.value
    handU.uOpacity.value = 1 - ss(0.3, 0.9, release)

    stageU.uLine.value.set(lineY, amp, freq, phase)
    stageU.uTilt.value = tilt
    stageU.uActive.value = k > 0 ? 1 : 0
    stageU.uTime.value = t

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
      ;[stage, silk, shadow, hand].forEach((m) => (m.material as THREE.Material).dispose())
      stage.geometry.dispose()
      hand.geometry.dispose()
      geo.dispose()
      renderer.dispose()
    },
  }
}
