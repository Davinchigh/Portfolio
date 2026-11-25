import * as THREE from "three"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
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
const wall = pbr("plaster", [1, 1], { color: 0xffffff, normalScale: new THREE.Vector2(0.25, 0.25), roughness: 0.92 })
const roof = pbr("roof", [1, 1], { color: 0xd6806a })
const pavers = pbr("pavers", [1, 1], { color: 0xd8b6a0 })
const concrete = pbr("concrete", [1, 1], { color: 0xbdbab2 })
const grass = pbr("grass", [1, 1], { color: 0x86b25e })
const wood = pbr("wood", [1, 1], { color: 0xb5774a })
const glassDark = new THREE.MeshStandardMaterial({ color: 0x1d242c, roughness: 0.08, metalness: 0.6, envMapIntensity: 1.4 })
const frame = new THREE.MeshStandardMaterial({ color: 0xf8f6f1, roughness: 0.5 })
const darkRecess = new THREE.MeshStandardMaterial({ color: 0x2c2a27, roughness: 0.95 })
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
slab(8, 220, concrete, HX + 46, 0, 3, 0.02) // service road

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
const instances = { door: [], glass: [], frameH: [], frameV: [], vent: [], recess: [], railTop: [], railPost: [], slabEdge: [], breeze: [] }
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
      if (side === "court") {
        // Window opening: a dark reveal with a white frame, mullions and a sill (photo 3).
        put(instances.recess, origin, along, out, a, y0 + 1.6, 0.05, 2.7, 1.55, 0.02)
        put(instances.glass, origin, along, out, a, y0 + 1.6, 0.08, 2.5, 1.35, 0.02)
        put(instances.frameH, origin, along, out, a, y0 + 0.84, 0.08, 2.9, 0.1, 0.16)
        put(instances.frameH, origin, along, out, a, y0 + 2.36, 0.05, 2.75, 0.07, 0.08)
        for (const dx of [-1.35, -0.45, 0.45, 1.35]) put(instances.frameV, origin, along, out, a + dx, y0 + 1.6, 0.05, 0.06, 1.5, 0.08)
      } else {
        // Recessed balcony: a deep shadowed opening, a white solid parapet in front, a window and door behind (photo 1).
        put(instances.recess, origin, along, out, a, y0 + 1.55, 0.06, BAY * 0.8, 2.45, 0.02)
        put(instances.glass, origin, along, out, a - 0.35, y0 + 1.75, 0.1, 1.4, 1.3, 0.02)
        put(instances.door, origin, along, out, a + 0.75, y0 + 1.45, 0.1, 0.8, 2.0, 0.02)
        put(instances.railPost, origin, along, out, a, y0 + 0.5, 0.2, BAY * 0.84, 1.0, 0.2)
        put(instances.railTop, origin, along, out, a, y0 + 1.03, 0.22, BAY * 0.86, 0.08, 0.28)
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

// ---------- courtyard ----------
// Grass and crossing paths.
slab(2 * IX, 2 * IZ, grass, 0, 0, 4, 0.03)
slab(3, 2 * IZ, pavers, 0, 0, 2.2, 0.05)
slab(2 * IX, 3, pavers, 0, -2, 2.2, 0.05)
// Raised basketball court on a platform with rubble-stone retaining walls and steps (Limann and JN photos).
const stoneMat = (() => {
  const c = document.createElement("canvas")
  c.width = c.height = 256
  const g = c.getContext("2d")
  g.fillStyle = "#5d5a55"
  g.fillRect(0, 0, 256, 256)
  let seed = 7
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
  for (let i = 0; i < 70; i++) {
    const w = 30 + rnd() * 40, h = 16 + rnd() * 22, x = rnd() * 256, y = rnd() * 256
    const t = 150 + rnd() * 70
    g.fillStyle = `rgb(${t},${t - 8},${t - 18})`
    g.beginPath()
    g.ellipse(x, y, w / 2, h / 2, rnd(), 0, Math.PI * 2)
    g.fill()
  }
  const tx = new THREE.CanvasTexture(c)
  tx.wrapS = tx.wrapT = THREE.RepeatWrapping
  tx.colorSpace = THREE.SRGBColorSpace
  return new THREE.MeshStandardMaterial({ map: tx, roughness: 0.95 })
})()
const BC = { x: -IX + 12, z: -IZ + 22 }
const RISE = 0.75
{
  const pw = 19, pl = 32
  const plat = new THREE.Mesh(new THREE.BoxGeometry(pw, RISE, pl), [stoneMat, stoneMat, sized(concrete, pw, pl, 3), stoneMat, stoneMat, stoneMat])
  for (const i of [0, 1, 4, 5]) {
    const m = plat.material[i].clone()
    m.map = stoneMat.map.clone()
    m.map.repeat.set((i < 2 ? pl : pw) / 2.2, RISE / 0.9)
    m.map.needsUpdate = true
    plat.material[i] = m
  }
  plat.position.set(BC.x, RISE / 2, BC.z)
  plat.castShadow = plat.receiveShadow = true
  scene.add(plat)
  // Steps up from the courtyard path on the east side.
  for (let k = 0; k < 3; k++) box(1.2 - 0.0, (RISE / 3) * (k + 1), 4, sized(concrete, 1, 4, 2), BC.x + pw / 2 + 1.8 - k * 0.6, ((RISE / 3) * (k + 1)) / 2, BC.z)
}
function court(cx, cz, w, l, inner, outer, lines, y = 0) {
  slab(w + 3, l + 3, concrete, cx, cz, 3, y + 0.06).material = outer
  const c = slab(w, l, concrete, cx, cz, 3, y + 0.07)
  c.material = inner
  for (const [lw, ll, lx, lz] of lines) slab(lw, ll, concrete, cx + lx, cz + lz, 3, y + 0.08).material = lineWhite
}
court(BC.x, BC.z, 15, 28, courtGreen, courtRed, [
  [15, 0.08, 0, -14], [15, 0.08, 0, 14], [0.08, 28, -7.5, 0], [0.08, 28, 7.5, 0], [15, 0.08, 0, 0],
], RISE)
for (const s of [-1, 1]) {
  box(0.2, 3.2, 0.2, courtGreen, BC.x, RISE + 1.6, BC.z + s * 15.1)
  box(1.8, 1.05, 0.05, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, transparent: true, opacity: 0.85 }), BC.x, RISE + 3.35, BC.z + s * 14.6)
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.23, 0.02, 8, 24), new THREE.MeshStandardMaterial({ color: 0xd24b1c }))
  rim.rotation.x = Math.PI / 2
  rim.position.set(BC.x, RISE + 3.05, BC.z + s * 14.3)
  scene.add(rim)
}
// Central fountain bed: a raised ring with a small monument, radial paved paths and flower beds (Limann photo).
{
  const cz = -2
  const ringWall = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.4, 0.6, 64, 1, true), new THREE.MeshStandardMaterial({ color: 0xf3f1ec, roughness: 0.7, side: THREE.DoubleSide }))
  ringWall.position.set(0, 0.3, cz)
  scene.add(ringWall)
  const top = new THREE.Mesh(new THREE.RingGeometry(3.1, 3.5, 64), frame)
  top.rotation.x = -Math.PI / 2
  top.position.set(0, 0.61, cz)
  scene.add(top)
  const soil = new THREE.Mesh(new THREE.CircleGeometry(3.15, 48), new THREE.MeshStandardMaterial({ color: 0x5b8f4a, roughness: 1 }))
  soil.rotation.x = -Math.PI / 2
  soil.position.set(0, 0.5, cz)
  scene.add(soil)
  box(0.7, 1.4, 0.7, frame, 0, 1.2, cz)
  box(0.5, 0.6, 0.5, new THREE.MeshStandardMaterial({ color: 0x8a6a2a, roughness: 0.35, metalness: 0.7 }), 0, 2.2, cz)
  for (let k = 0; k < 8; k++) {
    const ang = (k / 8) * Math.PI * 2
    const pth = slab(2.4, 14, pavers, Math.cos(ang) * 10, cz + Math.sin(ang) * 10, 2.2, 0.05)
    pth.rotation.z = -ang + Math.PI / 2
  }
  // Flower beds between the paths.
  const flowers = [0xf2c14e, 0xe0607e, 0xf4f1e6, 0xd94f2b]
  for (let k = 0; k < 40; k++) {
    const ang = (k / 40) * Math.PI * 2 + 0.2, r = 4.6 + (k % 3) * 0.6
    const f = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 6), new THREE.MeshStandardMaterial({ color: flowers[k % 4], roughness: 0.8 }))
    f.position.set(Math.cos(ang) * r, 0.25, cz + Math.sin(ang) * r)
    scene.add(f)
  }
}
// Tennis court further south (green court with red surround on the satellite image).
const TC = { x: IX - 11, z: IZ - 34 }
court(TC.x, TC.z, 11, 23.8, new THREE.MeshStandardMaterial({ color: 0x4f8a64, roughness: 0.8 }), courtRed, [
  [11, 0.06, 0, -11.9], [11, 0.06, 0, 11.9], [0.06, 23.8, -5.5, 0], [0.06, 23.8, 5.5, 0], [0.06, 12.8, 0, 0], [8.2, 0.06, 0, -6.4], [8.2, 0.06, 0, 6.4],
])
box(12, 1.0, 0.04, new THREE.MeshStandardMaterial({ color: 0x222222, transparent: true, opacity: 0.55 }), TC.x, 0.55, TC.z)
// Kiosk gazebo with a red hipped roof beside the court (photo 3).
{
  const gx = BC.x + 16, gz = BC.z + 9
  box(5.6, 0.25, 5.6, sized(pavers, 6, 6, 2.2), gx, 0.12, gz)
  for (const [dx, dz] of [[-2.4, -2.4], [2.4, -2.4], [-2.4, 2.4], [2.4, 2.4]]) box(0.25, 2.6, 0.25, wood, gx + dx, 1.4, gz + dz)
  const hip = new THREE.Mesh(new THREE.ConeGeometry(4.6, 2.2, 4, 1), sized(roof, 6, 3, 2.2))
  hip.rotation.y = Math.PI / 4
  hip.position.set(gx, 3.8, gz)
  hip.castShadow = true
  scene.add(hip)
  box(4.6, 1.0, 0.6, wood, gx, 0.75, gz - 1.9)
  box(4.0, 0.7, 0.05, new THREE.MeshStandardMaterial({ color: 0xc23b2e, roughness: 0.7 }), gx, 2.45, gz - 2.5)
}

// ---------- models: lamps, trees, shrubs (CC0) ----------
const gltf = new GLTFLoader()
const loadModel = (name) => new Promise((res) => gltf.load(`models/${name}/${name}.gltf`, (g) => res(g.scene), undefined, () => res(null)))
const ready = Promise.all([loadModel("island_tree_01")]).then(([tree]) => {
  const place = (src, x, z, s = 1, ry = 0) => {
    if (!src) return
    const o = src.clone(true)
    o.position.set(x, 0, z)
    o.scale.setScalar(s)
    o.rotation.y = ry
    o.traverse((m) => {
      if (m.isMesh) {
        m.castShadow = true
        m.receiveShadow = true
      }
    })
    scene.add(o)
  }
  // Solar street lamps around the court and along the paths (photo 3): a pole, a tilted panel and a lamp head.
  const solar = (x, z) => {
    box(0.12, 6.2, 0.12, steel, x, 3.1, z)
    const panel = box(1.2, 0.05, 0.7, new THREE.MeshStandardMaterial({ color: 0x1a2a44, roughness: 0.2, metalness: 0.6 }), x, 6.3, z)
    panel.rotation.z = 0.35
    box(0.6, 0.12, 0.25, steel, x + 0.35, 5.7, z)
  }
  for (const dz of [-13, 0, 13]) solar(BC.x - 9.5, BC.z + dz)
  for (const dz of [-30, -10, 10, 30, 50]) solar(2.4, dz)
  // Shrubs: clusters of soft leafy spheres, and conifers like the ones beside the court.
  const leafMat = sized(grass, 2, 2, 1)
  leafMat.color = new THREE.Color(0x3f6a35)
  const bush = (x, z, r) => {
    for (let k = 0; k < 4; k++) {
      const g = new THREE.IcosahedronGeometry(r * (0.7 + (k % 2) * 0.3), 2)
      const pos = g.attributes.position
      for (let i = 0; i < pos.count; i++) {
        const n = 1 + Math.sin(pos.getX(i) * 7 + k) * 0.08 + Math.cos(pos.getZ(i) * 9) * 0.08
        pos.setXYZ(i, pos.getX(i) * n, pos.getY(i) * n * 0.8, pos.getZ(i) * n)
      }
      g.computeVertexNormals()
      const m = new THREE.Mesh(g, leafMat)
      m.position.set(x + Math.cos(k * 2.1) * r * 0.6, r * 0.6, z + Math.sin(k * 2.1) * r * 0.6)
      m.castShadow = m.receiveShadow = true
      scene.add(m)
    }
  }
  const conifer = (x, z) => {
    const m = new THREE.Mesh(new THREE.ConeGeometry(1.1, 3.4, 10), leafMat)
    m.position.set(x, 1.8, z)
    m.castShadow = true
    scene.add(m)
  }
  ;[[-6, -9], [6, -9], [-6, 5], [6, 5], [-10, 20], [12, -24], [18, 10], [-2, 28], [9, 44]].forEach(([x, z], i) => bush(x, z, 0.9 + (i % 3) * 0.3))
  ;[[BC.x + 9, BC.z - 10], [BC.x + 9, BC.z + 8], [BC.x - 9, BC.z + 17], [IX - 3, -30]].forEach(([x, z]) => conifer(x, z))
  const trees = [[-14, 12], [14, 22], [-16, 30], [10, 50], [-12, 52], [17, -12], [-18, -6], [56, -34], [58, 26], [-60, 20], [-55, -60], [54, -60]]
  trees.forEach(([x, z], i) => place(tree, x, z, 0.75 + (i % 3) * 0.12, i * 1.3))
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
  court: { pos: [BC.x + 30, 4.6, BC.z + 4], look: [-IX, 6.4, BC.z + 4] },
  entrance: { pos: [HX + 46, 2.2, ENTRY_Z], look: [HX, 7.8, ENTRY_Z] },
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
