import * as THREE from "three"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { GTAOPass } from "three/examples/jsm/postprocessing/GTAOPass.js"
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js"

/*
 * Jean Nelson Aka Hall, reconstructed.
 * Footprint and courtyard layout measured from satellite imagery (about 157 x 79 m ring block, 14 m deep wings).
 * Facade, entrance tower, courtyard court, kiosk gazebo and lamps follow the published UGEL photos.
 * x = across the hall (short side), z = along it (long side), y = up, metres.
 */

const W = 79, L = 157, DEPTH = 14, FLOOR = 3.25, STOREYS = 4
const H = FLOOR * STOREYS + 0.6 // wall top
const HX = W / 2, HZ = L / 2
const IX = HX - DEPTH, IZ = HZ - DEPTH // courtyard half sizes
const BAY = 3.4

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" })
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
renderer.setSize(innerWidth, innerHeight)
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.2
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.5, 1500)

// ---------- materials (CC0 Poly Haven textures) ----------
const tl = new THREE.TextureLoader()
function pbr(name, repeat, extra = {}) {
  const load = (k, srgb) => {
    const t = tl.load(`tex/${name}_${k}.jpg`)
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.repeat.set(repeat[0], repeat[1])
    t.anisotropy = 8
    if (srgb) t.colorSpace = THREE.SRGBColorSpace
    return t
  }
  return new THREE.MeshStandardMaterial({ map: load("diff", true), normalMap: load("nor"), roughnessMap: load("rough"), ...extra })
}
// Walls: painted plaster, tinted to the hall's warm white.
const wall = pbr("plaster", [1, 1], { color: 0xfff8ee, normalScale: new THREE.Vector2(0.25, 0.25), roughness: 0.92 })
const roof = pbr("roof", [1, 1], { color: 0xd6806a })
const pavers = pbr("pavers", [1, 1], { color: 0xb3aba2 })
const concrete = pbr("concrete", [1, 1], { color: 0xbdbab2 })
const grass = pbr("grass", [1, 1], { color: 0x86b25e })
const wood = pbr("wood", [1, 1], { color: 0xb5774a })
const glassDark = new THREE.MeshStandardMaterial({ color: 0x1d242c, roughness: 0.08, metalness: 0.6, envMapIntensity: 1.4 })
const frame = new THREE.MeshStandardMaterial({ color: 0xf8f6f1, roughness: 0.5 })
const darkRecess = new THREE.MeshStandardMaterial({ color: 0xd9cdb6, roughness: 0.95 })
const rail = new THREE.MeshStandardMaterial({ color: 0xf2efe8, roughness: 0.6 })
const fascia = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.55 })
const courtGreen = new THREE.MeshStandardMaterial({ color: 0x3f7a5c, roughness: 0.75 })
const courtRed = new THREE.MeshStandardMaterial({ color: 0xa64437, roughness: 0.8 })
const lineWhite = new THREE.MeshStandardMaterial({ color: 0xf6f6f0, roughness: 0.6 })
const steel = new THREE.MeshStandardMaterial({ color: 0x7f8388, roughness: 0.4, metalness: 0.8 })
const signBlue = new THREE.MeshStandardMaterial({ color: 0x1f3f8f, roughness: 0.5 })

// Texture scale helper: set UV repeat by real size (metres per tile).
function sized(mat, w, h, tile) {
  const m = mat.clone()
  for (const k of ["map", "normalMap", "roughnessMap"]) {
    if (!m[k]) continue
    m[k] = m[k].clone()
    m[k].repeat.set(w / tile, h / tile)
    m[k].needsUpdate = true
  }
  return m
}

function box(w, h, d, mat, x, y, z, { cast = true, recv = true, ry = 0 } = {}) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
  m.position.set(x, y, z)
  m.rotation.y = ry
  m.castShadow = cast
  m.receiveShadow = recv
  scene.add(m)
  return m
}

// ---------- ground ----------
const ground = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), sized(grass, 600, 600, 4))
ground.rotation.x = -Math.PI / 2
ground.receiveShadow = true
scene.add(ground)
// Paved apron around the building and the forecourt on the east side (photo 1).
function slab(w, d, mat, x, z, tile, y = 0.02) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), sized(mat, w, d, tile))
  m.rotation.x = -Math.PI / 2
  m.position.set(x, y, z)
  m.receiveShadow = true
  scene.add(m)
  return m
}
slab(W + 8, L + 8, pavers, 0, 0, 2.2, 0.015)
slab(40, 70, pavers, HX + 22, -6, 2.2, 0.018) // forecourt and car park
slab(8, 220, concrete, HX + 46, 0, 3, 0.02).material = new THREE.MeshStandardMaterial({ color: 0x3b3b3a, roughness: 0.9 }) // asphalt road

// ---------- the ring block ----------
// Walls: four solid wings, open courtyard in the middle.
box(W, H, DEPTH, wall, 0, H / 2, -HZ + DEPTH / 2) // north wing
box(W, H, DEPTH, wall, 0, H / 2, HZ - DEPTH / 2) // south wing
box(DEPTH, H, L - 2 * DEPTH, wall, -HX + DEPTH / 2, H / 2, 0) // west wing
box(DEPTH, H, L - 2 * DEPTH, wall, HX - DEPTH / 2, H / 2, 0) // east wing
// Walls get a proper plaster scale.
scene.traverse((o) => {
  if (o.isMesh && o.material === wall) {
    const p = o.geometry.parameters
    o.material = sized(wall, Math.max(p.width, p.depth), p.height, 3)
  }
})

// Hipped roof over the ring: an outer and an inner slope meeting at a ridge over the middle of each wing.
function ringRoof() {
  const OV = 0.9, rise = Math.tan(THREE.MathUtils.degToRad(24)) * (DEPTH / 2 + OV)
  const rect = (hx, hz, y) => [new THREE.Vector3(-hx, y, -hz), new THREE.Vector3(hx, y, -hz), new THREE.Vector3(hx, y, hz), new THREE.Vector3(-hx, y, hz)]
  const outer = rect(HX + OV, HZ + OV, H)
  const ridge = rect(HX - DEPTH / 2, HZ - DEPTH / 2, H + rise)
  const inner = rect(IX - OV, IZ - OV, H)
  const pos = [], uv = []
  const quad = (a, b, c, d) => {
    for (const p of [a, b, c, a, c, d]) {
      pos.push(p.x, p.y, p.z)
      // planar UVs: along the eave and up the slope, 2 m per tile
      uv.push((p.x + p.z) / 2.2, p.y / 1.1 + Math.hypot(p.x, p.z) / 2.2)
    }
  }
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    quad(outer[i], outer[j], ridge[j], ridge[i])
    quad(ridge[i], ridge[j], inner[j], inner[i])
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2))
  g.computeVertexNormals()
  const r = roof.clone()
  for (const k of ["map", "normalMap", "roughnessMap"]) {
    r[k] = r[k].clone()
    r[k].repeat.set(1, 1)
  }
  r.side = THREE.DoubleSide
  const m = new THREE.Mesh(g, r)
  m.castShadow = m.receiveShadow = true
  scene.add(m)
  // White fascia boards under both eaves.
  for (const [hx, hz] of [[HX + OV, HZ + OV], [IX - OV, IZ - OV]]) {
    box(2 * hx, 0.32, 0.12, fascia, 0, H - 0.1, -hz)
    box(2 * hx, 0.32, 0.12, fascia, 0, H - 0.1, hz)
    box(0.12, 0.32, 2 * hz, fascia, -hx, H - 0.1, 0)
    box(0.12, 0.32, 2 * hz, fascia, hx, H - 0.1, 0)
  }
  // Soffits.
  const soffit = new THREE.MeshStandardMaterial({ color: 0xeeeae2, roughness: 0.9 })
  box(2 * (HX + OV), 0.05, OV, soffit, 0, H - 0.25, -HZ - OV / 2, { cast: false })
  box(2 * (HX + OV), 0.05, OV, soffit, 0, H - 0.25, HZ + OV / 2, { cast: false })
  box(OV, 0.05, 2 * HZ, soffit, -HX - OV / 2, H - 0.25, 0, { cast: false })
  box(OV, 0.05, 2 * HZ, soffit, HX + OV / 2, H - 0.25, 0, { cast: false })
}
ringRoof()

// Breeze-block texture: a grid of square openings, drawn once.
function breezeTexture() {
  const c = document.createElement("canvas")
  c.width = c.height = 256
  const g = c.getContext("2d")
  g.fillStyle = "#efe9dc"
  g.fillRect(0, 0, 256, 256)
  g.fillStyle = "#1b1a18"
  g.fillRect(40, 40, 176, 176)
  g.fillStyle = "#efe9dc"
  g.fillRect(118, 40, 20, 176)
  g.fillRect(40, 118, 176, 20)
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(2, 2)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}
const breeze = new THREE.MeshStandardMaterial({ map: breezeTexture(), roughness: 0.95 })

// ---------- facades ----------
// Each facade is described by a line (start, direction along it, outward normal) and a pattern of bays.
const instances = { door: [], glass: [], frameH: [], frameV: [], vent: [], recess: [], railTop: [], railPost: [], slabEdge: [], breeze: [], fin: [], slab: [] }
const up = new THREE.Vector3(0, 1, 0)
function put(list, origin, along, out, a, y, d, sx, sy, sz) {
  // a: distance along the facade, y: height, d: offset out of the wall
  const p = origin.clone().addScaledVector(along, a).addScaledVector(out, d)
  p.y = y
  const m = new THREE.Matrix4()
  const basis = new THREE.Matrix4().makeBasis(along, up, out)
  m.compose(p, new THREE.Quaternion().setFromRotationMatrix(basis), new THREE.Vector3(sx, sy, sz))
  list.push(m)
}
function facade(origin, along, out, length, side, skip = []) {
  const bays = Math.floor(length / BAY)
  const start = (length - bays * BAY) / 2
  for (let b = 0; b < bays; b++) {
    const a = start + (b + 0.5) * BAY
    if (skip.some(([s, e]) => a > s && a < e)) continue
    // A breeze-block stair tower every 11 bays on the courtyard side, rising above the eaves (UGEL courtyard photo).
    const stair = side === "court" && b % 11 === 5
    if (stair) {
      const p = origin.clone().addScaledVector(along, a).addScaledVector(out, 0.35)
      const tw = 2.4, th = H + 2.2
      const mat = breeze.clone()
      mat.map = breeze.map.clone()
      mat.map.repeat.set(tw / 0.42, th / 0.42)
      mat.map.needsUpdate = true
      const t = new THREE.Mesh(new THREE.BoxGeometry(tw, th, 0.7), [sized(wall, 0.7, th, 3), sized(wall, 0.7, th, 3), sized(wall, tw, 0.7, 3), sized(wall, tw, 0.7, 3), mat, mat])
      t.position.set(p.x, th / 2, p.z)
      t.lookAt(p.x + out.x, th / 2, p.z + out.z)
      t.castShadow = t.receiveShadow = true
      scene.add(t)
      // A small cap like the photo's chimney top.
      const cap = new THREE.Mesh(new THREE.BoxGeometry(tw + 0.3, 0.25, 1.0), frame)
      cap.position.set(p.x, th + 0.12, p.z)
      cap.lookAt(p.x + out.x, th + 0.12, p.z + out.z)
      scene.add(cap)
      continue
    }
    // Pattern: two openings, then a solid pier with small square vents.
    const pier = b % 3 === 2
    for (let s = 0; s < STOREYS; s++) {
      const y0 = s * FLOOR
      if (pier) {
        for (const dx of [-0.75, -0.25, 0.25, 0.75]) put(instances.vent, origin, along, out, a + dx, y0 + 2.45, 0.015, 0.26, 0.26, 0.03)
        continue
      }
      {
        // Balcony bay built out from the wall face (resident photos: both faces have balconies).
        // Side fins and a floor slab give it real depth and shadow; window and door sit on the wall behind.
        const BD = 1.3 // balcony depth
        put(instances.recess, origin, along, out, a, y0 + 1.55, 0.02, BAY - 0.2, 2.6, 0.02)
        put(instances.glass, origin, along, out, a - 0.45, y0 + 1.75, 0.05, 1.3, 1.25, 0.02)
        for (const dx of [-1.1, -0.45, 0.2]) put(instances.frameV, origin, along, out, a + dx, y0 + 1.75, 0.06, 0.06, 1.3, 0.06)
        put(instances.door, origin, along, out, a + 0.85, y0 + 1.1, 0.05, 0.85, 2.1, 0.02)
        put(instances.fin, origin, along, out, a - BAY / 2 + 0.1, y0 + FLOOR / 2, BD / 2, 0.2, FLOOR, BD)
        put(instances.fin, origin, along, out, a + BAY / 2 - 0.1, y0 + FLOOR / 2, BD / 2, 0.2, FLOOR, BD)
        put(instances.slab, origin, along, out, a, y0 + 0.1, BD / 2, BAY, 0.2, BD)
        if (s === STOREYS - 1) put(instances.slab, origin, along, out, a, y0 + FLOOR - 0.1, BD / 2, BAY, 0.2, BD)
        if (s > 0) {
          put(instances.railPost, origin, along, out, a, y0 + 0.65, BD - 0.08, BAY - 0.4, 1.0, 0.14)
          put(instances.railTop, origin, along, out, a, y0 + 1.17, BD - 0.06, BAY - 0.38, 0.07, 0.24)
        }
      }
    }
  }
}
const V = (x, y, z) => new THREE.Vector3(x, y, z)
// Outer faces
facade(V(-HX, 0, -HZ), V(1, 0, 0), V(0, 0, -1), W, "out")
facade(V(HX, 0, HZ), V(-1, 0, 0), V(0, 0, 1), W, "out")
facade(V(-HX, 0, HZ), V(0, 0, -1), V(-1, 0, 0), L, "out")
const ENTRY_Z = -6
facade(V(HX, 0, -HZ), V(0, 0, 1), V(1, 0, 0), L, "out", [[HZ + ENTRY_Z - 6.5, HZ + ENTRY_Z + 6.5]])
// Courtyard faces
facade(V(-IX, 0, -IZ), V(1, 0, 0), V(0, 0, 1), 2 * IX, "court")
facade(V(IX, 0, IZ), V(-1, 0, 0), V(0, 0, -1), 2 * IX, "court")
facade(V(-IX, 0, IZ), V(0, 0, -1), V(1, 0, 0), 2 * IZ, "court")
facade(V(IX, 0, -IZ), V(0, 0, 1), V(-1, 0, 0), 2 * IZ, "court")



const unit = new THREE.BoxGeometry(1, 1, 1)
function instanced(list, mat, cast = true) {
  const m = new THREE.InstancedMesh(unit, mat, list.length)
  list.forEach((mx, i) => m.setMatrixAt(i, mx))
  m.castShadow = cast
  m.receiveShadow = true
  scene.add(m)
}
instanced(instances.glass, glassDark, false)
instanced(instances.door, new THREE.MeshStandardMaterial({ color: 0x5a3a24, roughness: 0.6 }), false)
instanced(instances.frameH, frame)
instanced(instances.frameV, frame)
instanced(instances.vent, new THREE.MeshStandardMaterial({ color: 0x24221f, roughness: 0.9 }), false)
instanced(instances.recess, darkRecess, false)
instanced(instances.railTop, rail)
instanced(instances.railPost, sized(wall, 2, 1, 3))
instanced(instances.slabEdge, frame)
instanced(instances.fin, sized(wall, 1.3, 3.2, 3))
instanced(instances.slab, sized(wall, 3.4, 1.3, 3))
instanced(instances.breeze, breeze)

// ---------- entrance tower (east side, photo 1) ----------
{
  const x = HX, z = ENTRY_Z, TW = 11, TD = 3.2, TH = H + 2.4
  box(TD, TH, TW, sized(wall, TW, TH, 3), x + TD / 2, TH / 2, z)
  // Gable: a triangular prism on top of the tower.
  const tri = new THREE.Shape([new THREE.Vector2(-TW / 2 - 0.5, 0), new THREE.Vector2(TW / 2 + 0.5, 0), new THREE.Vector2(0, 3.6)])
  const gable = new THREE.Mesh(new THREE.ExtrudeGeometry(tri, { depth: TD + 1.4, bevelEnabled: false }), sized(wall, TW, 4, 3))
  gable.rotation.y = Math.PI / 2
  gable.position.set(x - 0.7, TH, z)
  gable.castShadow = true
  scene.add(gable)
  // Gable roof: two sloped planes.
  const slope = Math.hypot(TW / 2 + 1.1, 3.9)
  for (const s of [-1, 1]) {
    const r = box(TD + 2.2, 0.22, slope, sized(roof, TD + 2.2, slope, 2.2), x + TD / 2, TH + 1.95, z + (s * (TW / 2 + 1.1)) / 2)
    r.rotation.x = s * Math.atan2(3.9, TW / 2 + 1.1)
  }
  // Tall arched window of dark glass with white surround.
  const arch = new THREE.Shape()
  arch.moveTo(-2.1, 0)
  arch.lineTo(2.1, 0)
  arch.lineTo(2.1, 8.6)
  arch.absarc(0, 8.6, 2.1, 0, Math.PI, false)
  arch.lineTo(-2.1, 0)
  const archGlass = new THREE.Mesh(new THREE.ShapeGeometry(arch, 24), glassDark)
  archGlass.rotation.y = Math.PI / 2
  archGlass.position.set(x + TD + 0.03, 4.6, z)
  scene.add(archGlass)
  for (let i = 1; i < 6; i++) box(0.08, 0.08, 4.2, frame, x + TD + 0.07, 4.6 + i * 1.6, z)
  box(0.08, 10.7, 0.08, frame, x + TD + 0.07, 4.6 + 5.35, z)
  // Canopy on two columns, and the sign band.
  box(5.5, 0.4, 8.6, sized(wall, 8, 1, 3), x + TD + 2.6, 4.2, z)
  for (const dz of [-3.6, 3.6]) {
    const c = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 4, 20), sized(wall, 2, 4, 3))
    c.position.set(x + TD + 4.9, 2, z + dz)
    c.castShadow = true
    scene.add(c)
  }
  box(0.12, 0.9, 5.4, signBlue, x + TD + 0.05, 3.25, z)
  // Ground floor doors.
  box(0.1, 2.6, 3.2, glassDark, x + TD + 0.04, 1.3, z)
}

// ---------- courtyard (resident photo: lawns, grey square-tile walkways, teal courts, flamboyant trees) ----------
function canvasMat(w, h, draw, rep, extra = {}) {
  const c = document.createElement("canvas")
  c.width = w; c.height = h
  draw(c.getContext("2d"), w, h)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(rep[0], rep[1])
  t.anisotropy = 8
  return new THREE.MeshStandardMaterial({ map: t, roughness: 0.85, ...extra })
}
let rs = 11
const rnd = () => { rs = (rs * 16807) % 2147483647; return (rs - 1) / 2147483646 }
// 40 cm grey concrete tiles: 8 x 8 per texture = 3.2 m.
const tileDraw = (c, w, h) => {
  const n = 8, s = w / n
  c.fillStyle = "#7f7a72"; c.fillRect(0, 0, w, h)
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const v = 150 + rnd() * 30
    c.fillStyle = `rgb(${v},${v - 6},${v - 14})`
    c.fillRect(i * s + 2, j * s + 2, s - 4, s - 4)
    for (let k = 0; k < 40; k++) { c.fillStyle = `rgba(60,55,50,${rnd() * 0.12})`; c.fillRect(i * s + rnd() * s, j * s + rnd() * s, 2, 2) }
  }
}
function walk(w, d, x, z, ry = 0) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), canvasMat(256, 256, tileDraw, [w / 3.2, d / 3.2]))
  m.rotation.x = -Math.PI / 2; m.rotation.z = ry
  m.position.set(x, 0.05, z); m.receiveShadow = true
  scene.add(m)
  // concrete edging kerbs both sides
  const e = new THREE.MeshStandardMaterial({ color: 0xb8b2a6, roughness: 0.9 })
  for (const s of [-1, 1]) {
    const k = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.12, d), e)
    k.position.set(x + Math.cos(ry) * s * (w / 2 + 0.07), 0.06, z - Math.sin(ry) * s * (w / 2 + 0.07))
    k.rotation.y = ry; k.receiveShadow = true; k.castShadow = true
    scene.add(k)
  }
  return m
}
slab(2 * IX, 2 * IZ, grass, 0, 0, 4, 0.03)
// perimeter walkway along the courtyard faces, and the long central spine with cross paths
walk(3, 2 * IZ - 4, -IX + 3.2, 0); walk(3, 2 * IZ - 4, IX - 3.2, 0)
walk(3, 2 * IX - 4, 0, -IZ + 3.2, Math.PI / 2); walk(3, 2 * IX - 4, 0, IZ - 3.2, Math.PI / 2)
walk(3.2, 2 * IZ - 8, 0, 0)
for (const z of [-34, -2, 30]) walk(3, 2 * IX - 8, 0, z, Math.PI / 2)

const BC = { x: 0, z: -IZ + 24 } // court with the net, at the north end (resident photo)
const TC = { x: 0, z: IZ - 24 } // second court, south end
const RISE = 0
const teal = new THREE.MeshStandardMaterial({ color: 0x109c8b, roughness: 0.6 })
const tealDark = new THREE.MeshStandardMaterial({ color: 0x0c7f74, roughness: 0.7 })
function court(cx, cz, w, l, inner, outer, lines) {
  const o = slab(w + 4, l + 4, concrete, cx, cz, 3, 0.07); o.material = outer
  const c = slab(w, l, concrete, cx, cz, 3, 0.08); c.material = inner
  for (const [lw, ll, lx, lz] of lines) slab(lw, ll, concrete, cx + lx, cz + lz, 3, 0.09).material = lineWhite
}
const tileWide = (cx, cz, w, l) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, l), canvasMat(256, 256, tileDraw, [w / 3.2, l / 3.2])); m.rotation.x = -Math.PI / 2; m.position.set(cx, 0.055, cz); m.receiveShadow = true; scene.add(m) }
tileWide(BC.x, BC.z, 26, 34)
tileWide(TC.x, TC.z, 26, 34)
// volleyball court with net
court(BC.x, BC.z, 9, 18, teal, tealDark, [[9, 0.06, 0, -9], [9, 0.06, 0, 9], [0.06, 18, -4.5, 0], [0.06, 18, 4.5, 0], [9, 0.06, 0, -3], [9, 0.06, 0, 3]])
for (const s of [-1, 1]) box(0.1, 2.5, 0.1, steel, BC.x + s * 5.2, 1.25, BC.z)
{
  const c = document.createElement("canvas"); c.width = 256; c.height = 32
  const g = c.getContext("2d"); g.strokeStyle = "#111"; g.lineWidth = 2
  for (let i = 0; i <= 256; i += 8) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 32); g.stroke() }
  for (let j = 0; j <= 32; j += 8) { g.beginPath(); g.moveTo(0, j); g.lineTo(256, j); g.stroke() }
  g.fillStyle = "#fff"; g.fillRect(0, 0, 256, 4)
  const t = new THREE.CanvasTexture(c); t.wrapS = THREE.RepeatWrapping; t.repeat.set(4, 1)
  const net = new THREE.Mesh(new THREE.PlaneGeometry(10.2, 1), new THREE.MeshStandardMaterial({ map: t, alphaTest: 0.3, transparent: true, side: THREE.DoubleSide }))
  net.material.alphaMap = t
  net.position.set(BC.x, 1.95, BC.z); scene.add(net)
}
// basketball court at the south end
court(TC.x, TC.z, 15, 28, teal, tealDark, [[15, 0.08, 0, -14], [15, 0.08, 0, 14], [0.08, 28, -7.5, 0], [0.08, 28, 7.5, 0], [15, 0.08, 0, 0]])
for (const s of [-1, 1]) {
  box(0.2, 3.2, 0.2, steel, TC.x, 1.6, TC.z + s * 15.1)
  box(1.8, 1.05, 0.05, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 }), TC.x, 3.35, TC.z + s * 14.6)
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.23, 0.02, 8, 24), new THREE.MeshStandardMaterial({ color: 0xd24b1c }))
  rim.rotation.x = Math.PI / 2; rim.position.set(TC.x, 3.05, TC.z + s * 14.3); scene.add(rim)
}
// Central round feature with monument and flower bed (aerial photo and Limann photo).
{
  const cz = -2
  const ringWall = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.4, 0.6, 64, 1, true), new THREE.MeshStandardMaterial({ color: 0xf3f1ec, roughness: 0.7, side: THREE.DoubleSide }))
  ringWall.position.set(0, 0.3, cz); scene.add(ringWall)
  const top = new THREE.Mesh(new THREE.RingGeometry(3.1, 3.5, 64), frame); top.rotation.x = -Math.PI / 2; top.position.set(0, 0.61, cz); scene.add(top)
  const soil = new THREE.Mesh(new THREE.CircleGeometry(3.15, 48), new THREE.MeshStandardMaterial({ color: 0x4f7f3f, roughness: 1 })); soil.rotation.x = -Math.PI / 2; soil.position.set(0, 0.5, cz); scene.add(soil)
  box(0.7, 1.4, 0.7, frame, 0, 1.2, cz)
  box(0.5, 0.6, 0.5, new THREE.MeshStandardMaterial({ color: 0x8a6a2a, roughness: 0.35, metalness: 0.7 }), 0, 2.2, cz)
  const disc = new THREE.Mesh(new THREE.CircleGeometry(7, 48), canvasMat(256, 256, tileDraw, [4, 4])); disc.rotation.x = -Math.PI / 2; disc.position.set(0, 0.052, cz); disc.receiveShadow = true; scene.add(disc)
  const flowers = [0xd9343a, 0xf2c14e, 0xe0607e, 0xf4f1e6]
  for (let k = 0; k < 60; k++) {
    const ang = (k / 60) * Math.PI * 2, r = 2.2 + (k % 3) * 0.35
    const f = new THREE.Mesh(new THREE.IcosahedronGeometry(0.22, 0), new THREE.MeshStandardMaterial({ color: flowers[k % 4], roughness: 0.8 }))
    f.position.set(Math.cos(ang) * r, 0.62, cz + Math.sin(ang) * r); scene.add(f)
  }
}
// Hedge beds along the lawns (low clipped shrubs with red-leaf borders in the photo).
const hedgeMat = new THREE.MeshStandardMaterial({ color: 0x3e6b34, roughness: 0.95 })
const redLeaf = new THREE.MeshStandardMaterial({ color: 0x4d7a2e, roughness: 0.95 })
function hedge(x, z, len, ry, mat = hedgeMat) {
  const g = new THREE.BoxGeometry(len, 0.5, 0.8, Math.ceil(len * 3), 2, 2)
  const p = g.attributes.position
  for (let i = 0; i < p.count; i++) p.setY(i, p.getY(i) + Math.sin(p.getX(i) * 3.1) * 0.05 + Math.cos(p.getZ(i) * 5 + p.getX(i)) * 0.04)
  g.computeVertexNormals()
  const m = new THREE.Mesh(g, mat); m.position.set(x, 0.25, z); m.rotation.y = ry; m.castShadow = m.receiveShadow = true; scene.add(m)
}
hedge(-8, BC.z + 19, 9, 0); hedge(8, BC.z + 19, 9, 0, redLeaf); hedge(-8, TC.z - 19, 9, 0, redLeaf); hedge(8, TC.z - 19, 9, 0)
// Kiosk gazebo with a red hipped roof at the far end (resident photo).
{
  const gx = IX - 10, gz = -IZ + 8
  box(5.6, 0.25, 5.6, sized(pavers, 6, 6, 2.2), gx, 0.12, gz)
  for (const [dx, dz] of [[-2.4, -2.4], [2.4, -2.4], [-2.4, 2.4], [2.4, 2.4]]) box(0.25, 2.6, 0.25, frame, gx + dx, 1.4, gz + dz)
  const hip = new THREE.Mesh(new THREE.ConeGeometry(4.6, 2.2, 4, 1), sized(roof, 6, 3, 2.2))
  hip.rotation.y = Math.PI / 4; hip.position.set(gx, 3.8, gz); hip.castShadow = true; scene.add(hip)
  box(4.6, 1.0, 0.6, wood, gx, 0.75, gz + 1.9)
}
// Laundry: folding drying racks and clothes on the lawn edge, like every hall courtyard.
function rack(x, z, ry) {
  const g = new THREE.Group()
  const m = new THREE.MeshStandardMaterial({ color: 0xdedede, roughness: 0.4, metalness: 0.6 })
  for (const s of [-1, 1]) {
    const a = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.3, 6), m); a.position.set(s * 0.7, 0.6, 0.25); a.rotation.x = 0.4; g.add(a)
    const b = a.clone(); b.position.z = -0.25; b.rotation.x = -0.4; g.add(b)
  }
  for (let i = 0; i < 6; i++) {
    const c = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.5 + rnd() * 0.3, 0.02), new THREE.MeshStandardMaterial({ color: [0xd8344a, 0x2b63c6, 0xffffff, 0xf2c14e, 0x6b3fa0, 0x1f8a5a, 0xff8fb0][Math.floor(rnd() * 7)], roughness: 0.95, side: THREE.DoubleSide }))
    c.position.set(-0.55 + i * 0.22, 0.85, (i % 2 ? 0.12 : -0.12)); c.rotation.x = i % 2 ? 0.35 : -0.35; c.castShadow = true; g.add(c)
  }
  g.position.set(x, 0.05, z); g.rotation.y = ry; scene.add(g)
}
;[[IX - 6, -12], [IX - 6, -16], [IX - 7.5, 8], [-IX + 6, 14], [-IX + 6, 40], [IX - 6, 42]].forEach(([x, z], i) => rack(x, z, Math.PI / 2 + i * 0.2))
for (const [x, z] of [[6, -20], [9, 18], [-7, 46]]) {
  const cloth = slab(2.2, 1.4, concrete, x, z, 3, 0.06)
  cloth.material = new THREE.MeshStandardMaterial({ color: [0xd8344a, 0x2b63c6, 0xf2c14e][Math.floor(rnd() * 3)], roughness: 1 })
}

// ---------- trees, lamps, cars (all procedural: light enough for the web) ----------
// Feathery leaf card: pinnate fronds like the flamboyant (Delonix) trees in the courtyard photo.
function leafTexture(col) {
  const c = document.createElement("canvas"); c.width = c.height = 128
  const g = c.getContext("2d")
  g.strokeStyle = col; g.fillStyle = col; g.lineWidth = 1.2
  for (let f = 0; f < 5; f++) {
    const x0 = 20 + f * 22, y0 = 120, ang = -Math.PI / 2 + (f - 2) * 0.35
    const len = 90
    for (let t = 0.1; t < 1; t += 0.06) {
      const px = x0 + Math.cos(ang) * len * t, py = y0 + Math.sin(ang) * len * t
      for (const s of [-1, 1]) { g.beginPath(); g.ellipse(px + Math.cos(ang + s * 1.3) * 5, py + Math.sin(ang + s * 1.3) * 5, 4, 1.6, ang + s * 1.3, 0, 7); g.fill() }
    }
    g.beginPath(); g.moveTo(x0, y0); g.lineTo(x0 + Math.cos(ang) * len, y0 + Math.sin(ang) * len); g.stroke()
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace
  return t
}
const leafCard = new THREE.PlaneGeometry(1.6, 1.6)
const bark = new THREE.MeshStandardMaterial({ color: 0x6f6358, roughness: 0.95 })
const leafMats = {
  flame: new THREE.MeshStandardMaterial({ map: leafTexture("#3d6a26"), alphaTest: 0.4, side: THREE.DoubleSide, roughness: 0.9 }),
  dark: new THREE.MeshStandardMaterial({ map: leafTexture("#2f5a2a"), alphaTest: 0.4, side: THREE.DoubleSide, roughness: 0.9 }),
}
const cards = { flame: [], dark: [] }
function branch(a, b, r0, r1) {
  const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b)
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r1, r0, A.distanceTo(B), 8), bark)
  m.position.copy(A).add(B).multiplyScalar(0.5)
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize())
  m.castShadow = true; scene.add(m)
}
// Flamboyant: short trunk, wide branches spreading out, a flat umbrella canopy of fine leaves.
function flamboyant(x, z, s = 1) {
  const h = 3.2 * s
  branch([x, 0, z], [x, h, z], 0.32 * s, 0.24 * s)
  const n = 5
  for (let i = 0; i < n; i++) {
    const ang = (i / n) * Math.PI * 2 + rnd()
    const R = (5 + rnd() * 3) * s, top = h + (2 + rnd() * 1.5) * s
    const ex = x + Math.cos(ang) * R, ez = z + Math.sin(ang) * R
    branch([x, h, z], [x + Math.cos(ang) * R * 0.55, top - 0.6 * s, z + Math.sin(ang) * R * 0.55], 0.2 * s, 0.12 * s)
    branch([x + Math.cos(ang) * R * 0.55, top - 0.6 * s, z + Math.sin(ang) * R * 0.55], [ex, top, ez], 0.12 * s, 0.05 * s)
  }
  // canopy: cards spread in a flattened dome
  for (let k = 0; k < 900 * s; k++) {
    const r = Math.sqrt(rnd()) * 8.5 * s, a = rnd() * Math.PI * 2
    const y = h + (2.4 + (1 - r / (8.5 * s)) * 1.6 + rnd() * 0.8) * s
    const m = new THREE.Matrix4().compose(new THREE.Vector3(x + Math.cos(a) * r, y, z + Math.sin(a) * r), new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2 + (rnd() - 0.5) * 0.9, rnd() * 6.28, (rnd() - 0.5) * 0.9)), new THREE.Vector3(s, s, s))
    cards.flame.push(m)
  }
}
// Rounded shade tree (mango / neem type) for the forecourt and outer edges.
function shadeTree(x, z, s = 1) {
  const h = 2.6 * s
  branch([x, 0, z], [x, h + 1, z], 0.3 * s, 0.15 * s)
  for (let k = 0; k < 900 * s; k++) {
    const v = new THREE.Vector3(rnd() - 0.5, (rnd() - 0.3) * 0.8, rnd() - 0.5).normalize().multiplyScalar(Math.cbrt(rnd()) * 3.6 * s)
    const m = new THREE.Matrix4().compose(new THREE.Vector3(x + v.x, h + 3 * s + v.y, z + v.z), new THREE.Quaternion().setFromEuler(new THREE.Euler(rnd() * 6.28, rnd() * 6.28, rnd() * 6.28)), new THREE.Vector3(s, s, s))
    cards.dark.push(m)
  }
}
const ready = Promise.resolve().then(() => {
  // Flamboyant trees frame the courtyard (resident photo) and line the forecourt.
  ;[[-IX + 9, -IZ + 12], [IX - 9, 20], [-IX + 10, 26], [IX - 8, -44], [-IX + 9, -40], [10, 52], [-12, 58], [IX - 9, 60]].forEach(([x, z], i) => flamboyant(x, z, 0.85 + (i % 3) * 0.12))
  ;[[HX + 18.5, -30], [HX + 18.5, 18], [HX + 26, -18], [HX + 26, 14], [HX + 33.5, -6], [-HX - 12, 30], [-HX - 12, -50], [40, HZ + 14], [-30, -HZ - 14], [0, HZ + 20]].forEach(([x, z], i) => (i % 2 ? shadeTree : flamboyant)(x, z, 0.9 + (i % 3) * 0.1))
  for (const k of ["flame", "dark"]) {
    const im = new THREE.InstancedMesh(leafCard, leafMats[k], cards[k].length)
    cards[k].forEach((m, i) => im.setMatrixAt(i, m))
    im.castShadow = true; im.receiveShadow = true
    scene.add(im)
  }
  // Street lamps along the walkways (resident photo: slim poles with a lantern head).
  const lamp = (x, z) => {
    box(0.1, 4.2, 0.1, new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.5, metalness: 0.6 }), x, 2.1, z)
    box(0.35, 0.45, 0.35, new THREE.MeshStandardMaterial({ color: 0xf6f3ea, roughness: 0.4, emissive: 0xfff1cc, emissiveIntensity: 0.2 }), x, 4.4, z)
    box(0.5, 0.06, 0.5, new THREE.MeshStandardMaterial({ color: 0x2a2a2a }), x, 4.66, z)
  }
  for (const z of [-50, -30, -10, 10, 30, 50]) { lamp(2.3, z); lamp(-2.3, z + 10) }
  for (const z of [-40, 0, 40]) { lamp(-IX + 5.2, z); lamp(IX - 5.2, z) }
  // Cars and taxis in the forecourt car park (resident photos: Ghana taxis are body-colour with yellow corners).
  const car = (x, z, ry, color, taxi = false) => {
    const g = new THREE.Group()
    const paint = new THREE.MeshPhysicalMaterial({ color, roughness: 0.35, metalness: 0.4, clearcoat: 0.8 })
    const prof = (pts, width, mat, bevel = 0.06) => {
      const sh = new THREE.Shape(pts.map(([z, y]) => new THREE.Vector2(z, y)))
      const geo = new THREE.ExtrudeGeometry(sh, { depth: width - 2 * bevel, bevelEnabled: true, bevelSize: bevel, bevelThickness: bevel, bevelSegments: 3, curveSegments: 4 })
      geo.translate(0, 0, -(width - 2 * bevel) / 2)
      geo.rotateY(-Math.PI / 2)
      const m = new THREE.Mesh(geo, mat); g.add(m); return m
    }
    // body: bumper, bonnet, windscreen base, roof, rear screen, boot (z along the car, front at +z)
    prof([[-2.15, 0.28], [2.15, 0.28], [2.2, 0.55], [2.1, 0.78], [1.1, 0.88], [0.55, 0.9], [-0.95, 0.9], [-1.95, 0.85], [-2.18, 0.7]], 1.72, paint)
    prof([[1.05, 0.88], [0.25, 1.38], [-0.85, 1.4], [-1.55, 0.9]], 1.6, paint, 0.05)
    prof([[0.98, 0.92], [0.24, 1.33], [-0.82, 1.35], [-1.48, 0.93]], 1.64, new THREE.MeshStandardMaterial({ color: 0x141a1f, roughness: 0.05, metalness: 0.7 }), 0.02)
    if (taxi) for (const zz of [-1.9, 1.9]) for (const xx of [-0.88, 0.88]) { const c = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.42, 0.7), new THREE.MeshStandardMaterial({ color: 0xf28c00, roughness: 0.4 })); c.position.set(xx * 1.0, 0.56, zz * 1.02); g.add(c) }
    for (const zz of [-1.35, 1.35]) for (const xx of [-0.82, 0.82]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.24, 16), new THREE.MeshStandardMaterial({ color: 0x151515, roughness: 0.9 })); w.rotation.z = Math.PI / 2; w.position.set(xx * 1.02, 0.33, zz); g.add(w) }
    for (const xx of [-0.6, 0.6]) { const l = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.12, 0.04), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.3 })); l.position.set(xx, 0.68, 2.16); g.add(l) }
    g.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true } })
    g.position.set(x, 0.02, z); g.rotation.y = ry; scene.add(g)
  }
  const colors = [0xc9ccd0, 0x1e2a44, 0xf4f4f2, 0x8b1b1b, 0x2b2b2b, 0xb7b9bc, 0x5a6b7a]
  let ci = 0
  for (let i = 0; i < 9; i++) { const z = -32 + i * 3.1; if (i === 4) continue; car(HX + 22, z, Math.PI / 2 + (rnd() - 0.5) * 0.05, i % 3 === 0 ? 0xd0d3d6 : colors[ci++ % colors.length], i % 3 === 0) }
  for (let i = 0; i < 7; i++) { const z = 4 + i * 3.1; car(HX + 30, z, -Math.PI / 2, i % 2 ? colors[ci++ % colors.length] : 0xc4c7ca, i % 2 === 0) }
  car(HX + 12, ENTRY_Z + 6, 0.2, 0xd0d3d6, true)
  // Planted islands with white kerbs between the parking lanes (resident photo of the forecourt).
  const kerb = new THREE.MeshStandardMaterial({ color: 0xf1efe9, roughness: 0.8 })
  const fill = new THREE.MeshStandardMaterial({ color: 0x8fc24a, roughness: 1 })
  const island = (x, z0, z1, w = 2.4) => {
    const l = z1 - z0, zc = (z0 + z1) / 2
    box(w, 0.25, l, kerb, x, 0.125, zc)
    const g = new THREE.BoxGeometry(w - 0.3, 0.6, l - 0.3, 6, 2, Math.ceil(l * 2))
    const p = g.attributes.position
    for (let i = 0; i < p.count; i++) if (p.getY(i) > 0) p.setY(i, p.getY(i) + Math.sin(p.getZ(i) * 4.1 + p.getX(i) * 3) * 0.12)
    g.computeVertexNormals()
    const m = new THREE.Mesh(g, soilMat); m.position.set(x, 0.2, zc); m.scale.y = 0.3; m.receiveShadow = true; scene.add(m)
    for (let k = 0; k < l * 22; k++) {
      const tx = x + (rnd() - 0.5) * (w - 0.4), tz = z0 + 0.2 + rnd() * (l - 0.4), sc = 0.7 + rnd() * 0.6
      for (const r of [0, Math.PI / 2]) tufts.push(new THREE.Matrix4().compose(new THREE.Vector3(tx, 0.3 + 0.4 * sc, tz), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, r + rnd(), 0)), new THREE.Vector3(sc, sc, sc)))
    }
  }
  const soilMat = new THREE.MeshStandardMaterial({ color: 0x6b5338, roughness: 1 })
  const tufts = []
  island(HX + 18.5, -36, -10); island(HX + 18.5, 0, 26); island(HX + 26, -36, 26); island(HX + 33.5, -36, 26)
  {
    const c = document.createElement("canvas"); c.width = 64; c.height = 128
    const gx = c.getContext("2d")
    for (let i = 0; i < 70; i++) {
      const bx = 4 + rnd() * 56, h = 60 + rnd() * 66, lean = (rnd() - 0.5) * 24
      gx.strokeStyle = `hsl(${80 + rnd() * 20},${55 + rnd() * 20}%,${38 + rnd() * 22}%)`; gx.lineWidth = 1.5 + rnd() * 1.5
      gx.beginPath(); gx.moveTo(bx, 128); gx.quadraticCurveTo(bx + lean * 0.3, 128 - h / 2, bx + lean, 128 - h); gx.stroke()
    }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace
    const im = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.7, 0.8), new THREE.MeshStandardMaterial({ map: t, alphaTest: 0.35, side: THREE.DoubleSide, roughness: 0.9 }), tufts.length)
    tufts.forEach((m, i) => im.setMatrixAt(i, m)); im.castShadow = true; im.receiveShadow = true; scene.add(im)
  }
  // parking bay lines
  for (let i = 0; i < 10; i++) { slab(5, 0.1, concrete, HX + 22, -33.5 + i * 3.1, 3, 0.03).material = lineWhite; slab(5, 0.1, concrete, HX + 30, 2.5 + i * 3.1, 3, 0.03).material = lineWhite }
})

// ---------- light: real sky + sun ----------
const pmrem = new THREE.PMREMGenerator(renderer)
const skyReady = new Promise((res) =>
  new RGBELoader().load("hdri/sky_2k.hdr", (hdr) => {
    hdr.mapping = THREE.EquirectangularReflectionMapping
    scene.background = hdr
    scene.environment = pmrem.fromEquirectangular(hdr).texture
    scene.backgroundIntensity = 1
    scene.environmentIntensity = 1.0
    res()
  }),
)
const sun = new THREE.DirectionalLight(0xfff1dc, 3.2)
sun.position.set(-60, 90, -40)
sun.castShadow = true
sun.shadow.mapSize.set(2048, 2048)
Object.assign(sun.shadow.camera, { left: -110, right: 110, top: 110, bottom: -110, near: 10, far: 400 })
sun.shadow.bias = -0.0004
sun.shadow.normalBias = 0.03
scene.add(sun)
scene.fog = new THREE.Fog(0xd8dde2, 250, 900)

// ---------- post ----------
const composer = new EffectComposer(renderer)
composer.addPass(new RenderPass(scene, camera))
const ao = new GTAOPass(scene, camera, innerWidth, innerHeight)
ao.updateGtaoMaterial({ radius: 0.9, distanceExponent: 1.4, thickness: 1.2, scale: 1.1, samples: 16 })
composer.addPass(ao)
composer.addPass(new OutputPass())

// ---------- views ----------
const VIEWS = {
  court: { pos: [0, 10.5, IZ - 1.5], look: [0, 3, -IZ + 10] },
  courtlow: { pos: [IX - 6, 1.7, BC.z + 22], look: [-IX + 8, 4.5, BC.z - 4] },
  entrance: { pos: [HX + 41.5, 1.7, -52], look: [HX + 4, 7, -4] },
  front: { pos: [HX + 22.3, 1.7, -40], look: [HX + 3, 8, ENTRY_Z] },
  aerial: { pos: [140, 110, 150], look: [0, 0, 0] },
}
window.setView = (name) => {
  const v = VIEWS[name]
  camera.position.set(...v.pos)
  camera.lookAt(new THREE.Vector3(...v.look))
  camera.fov = name === "aerial" ? 35 : 55
  camera.updateProjectionMatrix()
}
window.setView(new URLSearchParams(location.search).get("v") || "court")
Promise.all([ready, skyReady]).then(() => {
  composer.render()
  setTimeout(() => {
    composer.render()
    document.body.dataset.ready = "1"
  }, 400)
})
