import * as THREE from "three"
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js"
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { GTAOPass } from "three/examples/jsm/postprocessing/GTAOPass.js"
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js"

/*
 * Jean Nelson Aka Hall interiors, reconstructed from resident photos and the
 * shared diaspora-hall design (Elizabeth Sey, Hilla Limann, Alex Kwapong).
 * One scene per view: ?v=corridor | room | reading | mart | restaurant | shop | stairs
 * Units are metres. y is up.
 */

const VIEW = new URLSearchParams(location.search).get("v") || "room"
RectAreaLightUniformsLib.init()

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
renderer.setSize(innerWidth, innerHeight)
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.15
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x222222)
const pm = new THREE.PMREMGenerator(renderer)
scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture
scene.environmentIntensity = 0.55
const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.05, 200)

// ---------- materials ----------
const tl = new THREE.TextureLoader()
function pbr(name, rep, extra = {}) {
  const load = (k, srgb) => {
    const t = tl.load(`tex/${name}_${k}.jpg`)
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.repeat.set(rep[0], rep[1])
    t.anisotropy = 8
    if (srgb) t.colorSpace = THREE.SRGBColorSpace
    return t
  }
  return new THREE.MeshStandardMaterial({ map: load("diff", true), normalMap: load("nor"), roughnessMap: load("rough"), ...extra })
}
const std = (color, roughness = 0.6, metalness = 0, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness, metalness, ...extra })

// Canvas texture helper.
function canvasTex(w, h, draw, rep = [1, 1]) {
  const c = document.createElement("canvas")
  c.width = w; c.height = h
  draw(c.getContext("2d"), w, h)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(rep[0], rep[1])
  t.anisotropy = 8
  return t
}
// Square ceramic floor tiles with thin grout, slight per-tile tone variation.
function tileTex(base, grout, n = 8, jitter = 10) {
  return (ctx, w, h) => {
    const s = w / n
    ctx.fillStyle = grout; ctx.fillRect(0, 0, w, h)
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const v = (Math.random() - 0.5) * jitter
      const [r, g, b] = base
      ctx.fillStyle = `rgb(${r + v},${g + v},${b + v})`
      ctx.fillRect(i * s + 2, j * s + 2, s - 4, s - 4)
      // faint speckle
      for (let k = 0; k < 30; k++) {
        ctx.fillStyle = `rgba(120,100,80,${Math.random() * 0.08})`
        ctx.fillRect(i * s + Math.random() * s, j * s + Math.random() * s, 2, 2)
      }
    }
  }
}
const floorTileMat = (w, d, size = 0.6, base = [222, 206, 178]) =>
  new THREE.MeshStandardMaterial({ map: canvasTex(512, 512, tileTex(base, "#b9ab94"), [w / (size * 8), d / (size * 8)]), roughness: 0.35, metalness: 0, envMapIntensity: 0.9 })
const plasterNor = tl.load("tex/plaster_nor.jpg"); plasterNor.wrapS = plasterNor.wrapT = THREE.RepeatWrapping; plasterNor.repeat.set(2, 2)
const paint = (color) => new THREE.MeshStandardMaterial({ color, roughness: 0.88, normalMap: plasterNor, normalScale: new THREE.Vector2(0.12, 0.12) })
const creamWall = paint(0xf3e9cf)
const whiteWall = paint(0xf7f4ec)
const ceilingMat = std(0xfbfaf6, 0.95, 0, { emissive: 0xffffff, emissiveIntensity: 0.06 })
const darkWood = pbr("wood", [1, 1], { color: 0x5a3a26, roughness: 0.55 })
const midWood = pbr("wood", [1, 1], { color: 0xa0683e, roughness: 0.5 })
const paleWood = pbr("wood", [1, 1], { color: 0xd9b88a, roughness: 0.55 })
const doorWood = pbr("wood", [1, 2], { color: 0x8a5634, roughness: 0.45 })
const frameDark = std(0x3b2a20, 0.5)
const steelBlue = std(0x86a3b0, 0.35, 0.6)
const bunkYellow = std(0xf0b90b, 0.45)
const sheetBlue = std(0xcdd8ea, 0.85)
const glass = new THREE.MeshPhysicalMaterial({ color: 0xdfe8ea, roughness: 0.05, transmission: 0.85, thickness: 0.004, transparent: true, opacity: 0.35 })
const aluminium = std(0xc8cbcd, 0.35, 0.8)
const plasticWhite = std(0xf1f1ee, 0.4)
const black = std(0x161616, 0.4)
const skyGlow = new THREE.MeshBasicMaterial({ color: 0xffffff })
const skyGlowWarm = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.6, 1.55, 1.4) })

// ---------- builders ----------
function box(w, h, d, mat, x = 0, y = 0, z = 0, parent = scene, shadows = true) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
  m.position.set(x, y, z)
  m.castShadow = shadows
  m.receiveShadow = true
  parent.add(m)
  return m
}
function cyl(r, h, mat, x, y, z, rot = null, seg = 16, parent = scene) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, seg), mat)
  m.position.set(x, y, z)
  if (rot) m.rotation.set(rot[0], rot[1], rot[2])
  m.castShadow = true; m.receiveShadow = true
  parent.add(m)
  return m
}
// Tube between two points.
function tube(a, b, r, mat, parent = scene) {
  const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b)
  const len = A.distanceTo(B)
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 10), mat)
  m.position.copy(A).add(B).multiplyScalar(0.5)
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize())
  m.castShadow = true; m.receiveShadow = true
  parent.add(m)
  return m
}
// A wall in the XY plane (normal +z) with rectangular holes, then placed.
function wallWithHoles(width, height, holes, mat, thick = 0.2) {
  const s = new THREE.Shape()
  s.moveTo(-width / 2, 0); s.lineTo(width / 2, 0); s.lineTo(width / 2, height); s.lineTo(-width / 2, height); s.lineTo(-width / 2, 0)
  for (const h of holes) {
    const p = new THREE.Path()
    p.moveTo(h.x - h.w / 2, h.y); p.lineTo(h.x - h.w / 2, h.y + h.h); p.lineTo(h.x + h.w / 2, h.y + h.h); p.lineTo(h.x + h.w / 2, h.y); p.lineTo(h.x - h.w / 2, h.y)
    s.holes.push(p)
  }
  const g = new THREE.ExtrudeGeometry(s, { depth: thick, bevelEnabled: false })
  g.translate(0, 0, -thick / 2)
  // planar UVs in metres for the plaster
  const uv = g.attributes.uv, pos = g.attributes.position
  for (let i = 0; i < uv.count; i++) uv.setXY(i, (pos.getX(i) + pos.getZ(i)) / 2, pos.getY(i) / 2)
  const m = new THREE.Mesh(g, mat)
  m.castShadow = true; m.receiveShadow = true
  return m
}
// Room shell: floor, ceiling and four walls. Walls: {n,s,e,w}: list of holes. Room spans x∈[-w/2,w/2], z∈[-d/2,d/2].
function shell(w, d, h, opts = {}) {
  const g = new THREE.Group()
  const fm = opts.floor || floorTileMat(w, d)
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(w, d), fm)
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; g.add(floor)
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(w, d), opts.ceiling || ceilingMat)
  ceil.rotation.x = Math.PI / 2; ceil.position.y = h; ceil.receiveShadow = true; g.add(ceil)
  const wm = opts.wall || creamWall
  const walls = opts.walls || {}
  const mk = (len, holes, mat) => wallWithHoles(len + 0.4, h, holes || [], mat)
  const n = mk(w, walls.n, opts.nMat || wm); n.position.set(0, 0, -d / 2 - 0.1); g.add(n)
  const s = mk(w, walls.s, opts.sMat || wm); s.position.set(0, 0, d / 2 + 0.1); s.rotation.y = Math.PI; g.add(s)
  const e = mk(d, walls.e, opts.eMat || wm); e.position.set(w / 2 + 0.1, 0, 0); e.rotation.y = -Math.PI / 2; g.add(e)
  const ww = mk(d, walls.w, opts.wMat || wm); ww.position.set(-w / 2 - 0.1, 0, 0); ww.rotation.y = Math.PI / 2; g.add(ww)
  // skirting
  const sk = opts.skirt === false ? null : std(0x8b6a4c, 0.5)
  if (sk) {
    box(w, 0.1, 0.02, sk, 0, 0.05, -d / 2 + 0.01, g, false)
    box(w, 0.1, 0.02, sk, 0, 0.05, d / 2 - 0.01, g, false)
    box(0.02, 0.1, d, sk, -w / 2 + 0.01, 0.05, 0, g, false)
    box(0.02, 0.1, d, sk, w / 2 - 0.01, 0.05, 0, g, false)
  }
  scene.add(g)
  return g
}
// Daylight beyond a window: a bright plane plus a sun casting shadows through the opening.
function daylight(pos, target, intensity = 3) {
  const sun = new THREE.DirectionalLight(0xfff1dc, intensity)
  sun.position.set(...pos); sun.target.position.set(...target)
  sun.castShadow = true
  sun.shadow.mapSize.set(2048, 2048)
  sun.shadow.camera.left = -12; sun.shadow.camera.right = 12; sun.shadow.camera.top = 12; sun.shadow.camera.bottom = -12
  sun.shadow.camera.far = 60
  sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.02
  scene.add(sun, sun.target)
  return sun
}
function sky(w, h, x, y, z, ry = 0, mat = skyGlow) {
  // outdoor backdrop: soft gradient sky over greenery
  const t = canvasTex(256, 256, (c, W, H) => {
    const g = c.createLinearGradient(0, 0, 0, H)
    g.addColorStop(0, "#cfe3f3"); g.addColorStop(0.55, "#eef4f4"); g.addColorStop(0.62, "#8fae78"); g.addColorStop(1, "#5d7f4c")
    c.fillStyle = g; c.fillRect(0, 0, W, H)
    for (let i = 0; i < 60; i++) { c.fillStyle = `rgba(70,110,60,${0.3 + Math.random() * 0.4})`; c.beginPath(); c.arc(Math.random() * W, H * 0.6 + Math.random() * 20, 8 + Math.random() * 18, 0, 7); c.fill() }
  })
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: t, color: new THREE.Color(1.35, 1.35, 1.35) }))
  m.position.set(x, y, z); m.rotation.y = ry
  scene.add(m)
  return m
}
// Glass louvre window (the halls use aluminium-framed louvres). Built facing +z, centred at its bottom middle.
function louvre(w, h, parent) {
  const g = new THREE.Group()
  const fr = aluminium
  box(w, 0.04, 0.08, fr, 0, 0, 0, g); box(w, 0.04, 0.08, fr, 0, h, 0, g)
  box(0.04, h, 0.08, fr, -w / 2, h / 2, 0, g); box(0.04, h, 0.08, fr, w / 2, h / 2, 0, g)
  const cols = w > 1.2 ? 2 : 1
  if (cols === 2) box(0.04, h, 0.08, fr, 0, h / 2, 0, g)
  const n = Math.round(h / 0.11)
  const bladeW = w / cols - 0.06
  for (let c = 0; c < cols; c++) for (let i = 0; i < n; i++) {
    const b = new THREE.Mesh(new THREE.BoxGeometry(bladeW, 0.1, 0.006), glass)
    b.position.set(cols === 2 ? (c - 0.5) * w / 2 : 0, 0.07 + i * (h - 0.1) / n, 0)
    b.rotation.x = -0.5
    g.add(b)
  }
  // burglar-proof bars outside
  for (let i = 1; i < 6; i++) box(0.015, h, 0.015, std(0x2b2b2b, 0.5, 0.4), -w / 2 + (i * w) / 6, h / 2, 0.09, g, false)
  parent.add(g)
  return g
}
// Draped curtain: a plane with folds, hanging from y=top.
function curtain(w, h, color, x, top, z, ry = 0, folds = 7) {
  const geo = new THREE.PlaneGeometry(w, h, folds * 8, 4)
  const p = geo.attributes.position
  for (let i = 0; i < p.count; i++) p.setZ(i, Math.sin((p.getX(i) / w) * folds * Math.PI * 2) * 0.05)
  geo.computeVertexNormals()
  const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color, roughness: 0.9, side: THREE.DoubleSide }))
  m.position.set(x, top - h / 2, z); m.rotation.y = ry
  m.castShadow = true; m.receiveShadow = true
  scene.add(m)
  // rod
  tube([x - (w / 2 + 0.1) * Math.cos(ry), top + 0.03, z + (w / 2 + 0.1) * Math.sin(ry)], [x + (w / 2 + 0.1) * Math.cos(ry), top + 0.03, z - (w / 2 + 0.1) * Math.sin(ry)], 0.012, aluminium)
  return m
}
// Fluorescent tube fitting with an area light.
function tubeLight(x, y, z, len = 1.2, ry = 0, intensity = 6) {
  const g = new THREE.Group()
  box(len + 0.06, 0.04, 0.1, plasticWhite, 0, 0.02, 0, g, false)
  const t = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, len, 10), new THREE.MeshBasicMaterial({ color: new THREE.Color(3, 3, 3) }))
  t.rotation.z = Math.PI / 2; t.position.y = -0.02; g.add(t)
  const L = new THREE.RectAreaLight(0xf4f7ff, intensity, len, 0.12)
  L.position.y = -0.04; L.lookAt(0, -10, 0); g.add(L)
  g.position.set(x, y, z); g.rotation.y = ry
  scene.add(g)
}
// Round ceiling light (corridors).
function roundLight(x, y, z, intensity = 3) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.19, 0.06, 24), new THREE.MeshBasicMaterial({ color: new THREE.Color(2.2, 2.1, 1.9) }))
  m.position.set(x, y - 0.03, z); scene.add(m)
  const L = new THREE.PointLight(0xfff0d8, intensity, 9, 1.6)
  L.position.set(x, y - 0.2, z); scene.add(L)
}
function ceilingFan(x, y, z) {
  const g = new THREE.Group()
  cyl(0.012, 0.45, plasticWhite, 0, -0.22, 0, null, 8, g)
  cyl(0.11, 0.12, plasticWhite, 0, -0.5, 0, null, 20, g)
  for (let i = 0; i < 3; i++) {
    const b = box(0.62, 0.008, 0.11, std(0xf1efe8, 0.4), 0.38, -0.52, 0, new THREE.Group(), true)
    const arm = new THREE.Group(); arm.add(b); arm.rotation.y = (i * Math.PI * 2) / 3 + 0.4; b.rotation.x = 0.12
    g.add(arm)
  }
  g.position.set(x, y, z); scene.add(g)
}
// Wall-mounted split air conditioner. Faces +z at the given point.
function splitAC(x, y, z, ry = 0) {
  const g = new THREE.Group()
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.29, 0.21, 4, 2, 2), plasticWhite)
  body.castShadow = true; g.add(body)
  box(0.86, 0.03, 0.02, std(0xdadad6, 0.3), 0, -0.12, 0.1, g, false)
  box(0.04, 0.012, 0.005, std(0x30c0ff, 0.2, 0, { emissive: 0x30c0ff, emissiveIntensity: 1.5 }), 0.3, -0.06, 0.106, g, false)
  g.position.set(x, y, z); g.rotation.y = ry
  scene.add(g)
}
// Light switch plate.
function switchPlate(x, y, z, ry = 0) {
  const g = new THREE.Group()
  box(0.09, 0.14, 0.012, plasticWhite, 0, 0, 0, g, false)
  box(0.03, 0.05, 0.01, std(0xdedbd2, 0.4), -0.015, 0, 0.008, g, false)
  box(0.03, 0.05, 0.01, std(0xdedbd2, 0.4), 0.017, 0, 0.008, g, false)
  g.position.set(x, y, z); g.rotation.y = ry; scene.add(g)
}
// Door leaf in a dark frame. Faces +z, bottom centre at origin.
function door(w = 0.9, h = 2.1, open = 0, label = null) {
  const g = new THREE.Group()
  box(0.06, h + 0.06, 0.14, frameDark, -w / 2 - 0.03, (h + 0.06) / 2, 0, g)
  box(0.06, h + 0.06, 0.14, frameDark, w / 2 + 0.03, (h + 0.06) / 2, 0, g)
  box(w + 0.12, 0.06, 0.14, frameDark, 0, h + 0.03, 0, g)
  const leaf = new THREE.Group()
  box(w, h, 0.045, doorWood, w / 2, h / 2, 0, leaf)
  // panel grooves
  box(w * 0.7, 0.01, 0.05, std(0x5e3a22, 0.6), w / 2, h * 0.55, 0.002, leaf, false)
  const hnd = std(0xc9c4b6, 0.25, 0.9)
  box(0.12, 0.02, 0.03, hnd, w - 0.12, 1.02, 0.04, leaf)
  box(0.04, 0.16, 0.01, hnd, w - 0.09, 1.0, 0.026, leaf, false)
  leaf.position.x = -w / 2; leaf.rotation.y = -open
  g.add(leaf)
  if (label) {
    const t = canvasTex(256, 96, (c, W, H) => { c.fillStyle = "#e9e2cf"; c.fillRect(0, 0, W, H); c.fillStyle = "#222"; c.font = "bold 56px sans-serif"; c.textAlign = "center"; c.fillText(label, W / 2, 68) })
    const p = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.075), new THREE.MeshStandardMaterial({ map: t, roughness: 0.4 }))
    p.position.set(w / 2, 1.65, 0.026); leaf.add(p)
  }
  scene.add(g)
  return g
}
// Simple chair (school style: pale wood seat/back on blue-grey tube frame).
function schoolChair(x, z, ry = 0, seatMat = paleWood, frameMat = steelBlue) {
  const g = new THREE.Group()
  box(0.42, 0.025, 0.4, seatMat, 0, 0.45, 0, g)
  const back = box(0.42, 0.22, 0.02, seatMat, 0, 0.72, -0.2, g)
  back.rotation.x = -0.08
  for (const [a, b] of [[-0.19, -0.18], [0.19, -0.18], [-0.19, 0.18], [0.19, 0.18]]) tube([a, 0, b], [a, 0.45, b], 0.011, frameMat, g)
  tube([-0.19, 0.45, -0.19], [-0.19, 0.84, -0.21], 0.011, frameMat, g)
  tube([0.19, 0.45, -0.19], [0.19, 0.84, -0.21], 0.011, frameMat, g)
  g.position.set(x, 0, z); g.rotation.y = ry; scene.add(g)
  return g
}
// Plastic chair (restaurant).
function plasticChair(x, z, ry = 0, color = 0xe2661f) {
  const g = new THREE.Group(), m = std(color, 0.45)
  box(0.44, 0.04, 0.42, m, 0, 0.44, 0, g)
  const back = box(0.44, 0.4, 0.03, m, 0, 0.68, -0.21, g); back.rotation.x = -0.12
  for (const [a, b] of [[-0.2, -0.19], [0.2, -0.19], [-0.2, 0.19], [0.2, 0.19]]) {
    const l = box(0.04, 0.44, 0.04, m, a, 0.22, b, g); l.rotation.z = a * 0.15
  }
  g.position.set(x, 0, z); g.rotation.y = ry; scene.add(g)
}
// Products on a shelf: random packets, tins and bottles.
const prodColors = [0xd7262e, 0xf4c20d, 0x1d63b8, 0x2a9d47, 0xf07b1d, 0xffffff, 0x7c2b8f, 0xe8e0c8, 0x0d0d0d, 0xc71f63]
function stock(x0, x1, y, z, depth, rnd = Math.random, parent = scene) {
  let x = x0
  while (x < x1 - 0.05) {
    const kind = rnd()
    const col = prodColors[Math.floor(rnd() * prodColors.length)]
    const m = std(col, 0.35 + rnd() * 0.3)
    if (kind < 0.35) { // bottle
      const r = 0.03 + rnd() * 0.015, h = 0.2 + rnd() * 0.12
      for (let k = 0; k < Math.floor(depth / (r * 2.2)); k++) {
        cyl(r, h, kind < 0.15 ? new THREE.MeshPhysicalMaterial({ color: col, roughness: 0.1, transmission: 0.4, transparent: true, opacity: 0.85 }) : m, x + r, y + h / 2, z - depth / 2 + r + k * r * 2.2, null, 10, parent)
        cyl(r * 0.4, 0.04, std(0xdddddd, 0.3, 0.7), x + r, y + h + 0.02, z - depth / 2 + r + k * r * 2.2, null, 8, parent)
      }
      x += r * 2 + 0.01
    } else if (kind < 0.55) { // tins
      const r = 0.035 + rnd() * 0.02, h = 0.08 + rnd() * 0.06
      for (let s = 0; s < 2; s++) cyl(r, h, m, x + r, y + h / 2 + s * h, z, null, 14, parent)
      x += r * 2 + 0.01
    } else { // boxes / packets
      const w = 0.07 + rnd() * 0.12, h = 0.1 + rnd() * 0.18, d = Math.min(depth - 0.02, 0.08 + rnd() * 0.18)
      const b = box(w, h, d, m, x + w / 2, y + h / 2, z, parent)
      // label band
      box(w * 1.002, h * 0.3, d * 1.002, std(prodColors[Math.floor(rnd() * prodColors.length)], 0.4), x + w / 2, y + h * 0.55, z, parent, false)
      x += w + 0.008
    }
  }
}
let seed = 7
const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646 }

// Glass-door drinks fridge. Faces +z, bottom centre at x,z.
function fridge(x, z, ry = 0, brand = null, w = 0.9) {
  const g = new THREE.Group()
  const h = 2.0, d = 0.7
  const bm = std(brand ? 0x1a4aa8 : 0x9aa0a3, 0.35, brand ? 0 : 0.6)
  box(w, h, 0.04, bm, 0, h / 2, -d / 2 + 0.02, g) // back
  box(0.05, h, d, bm, -w / 2 + 0.025, h / 2, 0, g); box(0.05, h, d, bm, w / 2 - 0.025, h / 2, 0, g)
  box(w, 0.2, d, bm, 0, 0.1, 0, g) // plinth
  box(0.04, h - 0.3, 0.04, bm, -w / 2 + 0.04, h / 2, d / 2 - 0.02, g); box(0.04, h - 0.3, 0.04, bm, w / 2 - 0.04, h / 2, d / 2 - 0.02, g)
  const inner = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.12, h - 0.45), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.4, 1.45, 1.5) }))
  inner.position.set(0, h / 2 - 0.08, -d / 2 + 0.06); g.add(inner)
  const rows = 5
  for (let r = 0; r < rows; r++) {
    const y = 0.25 + r * 0.3
    box(w - 0.12, 0.012, d - 0.12, std(0xbfc6cc, 0.3, 0.5), 0, y, -0.03, g, false)
    // bottles in rows
    for (let c = 0; c < Math.floor((w - 0.14) / 0.075); c++) {
      const col = [0xc00d0d, 0x101010, 0x0a7a3a, 0xf3a712, 0x1f4fa3][(r + c) % 5]
      const b = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.033, 0.24, 10), new THREE.MeshPhysicalMaterial({ color: col, roughness: 0.15, transmission: 0.3, transparent: true, opacity: 0.9 }))
      b.position.set(-w / 2 + 0.11 + c * 0.075, y + 0.13, -0.05); g.add(b)
    }
  }
  const L = new THREE.PointLight(0xeaf2ff, 0.6, 1.6, 2); L.position.set(0, h - 0.4, 0); g.add(L)
  // glass door
  const gd = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.06, h - 0.35), new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.03, transparent: true, opacity: 0.12, metalness: 0.2 }))
  gd.position.set(0, h / 2 - 0.06, d / 2 + 0.005); g.add(gd)
  box(0.03, 0.6, 0.03, aluminium, w / 2 - 0.08, 1.1, d / 2 + 0.03, g)
  // header panel
  const hdr = box(w, 0.28, d + 0.02, brand ? std(0xffffff, 0.3) : std(0xe9edef, 0.3), 0, h - 0.14, 0, g)
  if (brand) {
    const t = canvasTex(512, 160, (c, W, H) => {
      const gr = c.createLinearGradient(0, 0, W, 0); gr.addColorStop(0, "#0d3a8a"); gr.addColorStop(1, "#1a64d2")
      c.fillStyle = gr; c.fillRect(0, 0, W, H)
      c.fillStyle = "#fff"; c.font = "bold 78px sans-serif"; c.textAlign = "center"; c.fillText(brand, W / 2, 108)
    })
    const p = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.02, 0.26), new THREE.MeshBasicMaterial({ map: t }))
    p.position.set(0, h - 0.14, d / 2 + 0.012); g.add(p)
  }
  g.position.set(x, 0, z); g.rotation.y = ry
  scene.add(g)
  return g
}
// Open shelving unit (pale melamine), stocked. Faces +z.
function shelfUnit(x, z, w = 1.2, h = 2.0, d = 0.4, ry = 0, levels = 5) {
  const g = new THREE.Group(), m = std(0xeee4d2, 0.55)
  box(w, 0.02, d, m, 0, h, 0, g)
  box(0.02, h, d, m, -w / 2, h / 2, 0, g); box(0.02, h, d, m, w / 2, h / 2, 0, g)
  box(w, h, 0.01, m, 0, h / 2, -d / 2, g)
  for (let i = 0; i < levels; i++) {
    const y = 0.08 + (i * (h - 0.1)) / levels
    box(w, 0.02, d, m, 0, y, 0, g)
    stock(-w / 2 + 0.03, w / 2 - 0.03, y + 0.01, 0, d - 0.04, rand, g)
  }
  g.position.set(x, 0, z); g.rotation.y = ry
  scene.add(g)
  return g
}
function tv(x, y, z, ry = 0, w = 0.9, img = null) {
  const g = new THREE.Group()
  box(w, w * 0.58, 0.05, black, 0, 0, 0, g)
  const t = img || canvasTex(256, 150, (c, W, H) => {
    const gr = c.createLinearGradient(0, 0, W, H); gr.addColorStop(0, "#2d5aa0"); gr.addColorStop(1, "#c25a3a")
    c.fillStyle = gr; c.fillRect(0, 0, W, H)
    c.fillStyle = "rgba(255,230,200,.8)"; c.beginPath(); c.ellipse(W * 0.6, H * 0.45, 30, 38, 0, 0, 7); c.fill()
    c.fillStyle = "#132"; c.fillRect(0, H - 26, W, 26)
  })
  const s = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.04, w * 0.58 - 0.04), new THREE.MeshBasicMaterial({ map: t, color: new THREE.Color(1.2, 1.2, 1.2) }))
  s.position.z = 0.027; g.add(s)
  g.position.set(x, y, z); g.rotation.y = ry; scene.add(g)
}
// Text sign on a board. Faces +z.
function sign(text, x, y, z, w, h, bg = "#f5d24a", fg = "#1a1a1a", ry = 0, font = "bold") {
  const t = canvasTex(1024, Math.round((1024 * h) / w), (c, W, H) => {
    c.fillStyle = bg; c.fillRect(0, 0, W, H)
    c.fillStyle = fg; c.textAlign = "center"; c.textBaseline = "middle"
    let fs = H * 0.6; c.font = `${font} ${fs}px sans-serif`
    while (c.measureText(text).width > W * 0.92) { fs *= 0.9; c.font = `${font} ${fs}px sans-serif` }
    c.fillText(text, W / 2, H / 2)
  })
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.02), [std(0xdddddd), std(0xdddddd), std(0xdddddd), std(0xdddddd), new THREE.MeshStandardMaterial({ map: t, roughness: 0.5 }), std(0xdddddd)])
  m.position.set(x, y, z); m.rotation.y = ry; scene.add(m)
  return m
}

// ================= VIEWS =================
const views = {}

// ---- Student room: 4 to a room, two bunks, desks, wall shelves, louvre window with curtains. ----
views.room = () => {
  const W = 3.6, D = 4.6, H = 2.9
  // window wall at -z (north), door at +z
  shell(W, D, H, { walls: { n: [{ x: 0.2, y: 0.95, w: 1.5, h: 1.35 }], s: [{ x: -1.1, y: 0, w: 0.9, h: 2.1 }] }, floor: floorTileMat(W, D, 0.4, [226, 214, 190]) })
  const win = new THREE.Group(); win.position.set(0.2, 0.95, -D / 2 - 0.1); scene.add(win); louvre(1.5, 1.35, win)
  sky(8, 5, 0.2, 1.6, -D / 2 - 3)
  daylight([3, 7, -12], [0, 0, 0.6], 2.4)
  curtain(1.05, 1.9, 0x3a5fa8, -0.55, 2.5, -D / 2 + 0.06, 0, 6)
  curtain(0.6, 1.9, 0x3a5fa8, 1.25, 2.5, -D / 2 + 0.06, 0, 4)
  // bunks: one along each side wall
  const bunk = (x, ry) => {
    const g = new THREE.Group()
    const L = 1.95, Wb = 0.92
    for (const lvl of [0.38, 1.55]) {
      box(Wb, 0.03, L, std(0x6d7a80, 0.5, 0.5), 0, lvl, 0, g)
      box(Wb - 0.04, 0.12, L - 0.05, sheetBlue, 0, lvl + 0.075, 0, g) // mattress
      box(0.035, 0.22, L, bunkYellow, Wb / 2, lvl + 0.06, 0, g) // yellow side rail panel
      const pil = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 10), std(0xe6ecf6, 0.9)); pil.scale.set(1.5, 0.45, 0.85); pil.position.set(0, lvl + 0.2, -L / 2 + 0.25); pil.castShadow = true; g.add(pil)
      box(Wb, 0.32, 0.03, bunkYellow, 0, lvl + 0.18, -L / 2, g) // head panel
      box(Wb, 0.25, 0.03, bunkYellow, 0, lvl + 0.15, L / 2, g) // foot panel
    }
    for (const [a, b] of [[-Wb / 2, -1], [Wb / 2, -1], [-Wb / 2, 1], [Wb / 2, 1]]) tube([a, 0, (b * L) / 2], [a, 2.05, (b * L) / 2], 0.022, steelBlue, g)
    // guard rail top bunk
    tube([Wb / 2, 1.85, -L / 2], [Wb / 2, 1.85, L * 0.15], 0.018, steelBlue, g)
    tube([Wb / 2, 1.6, L * 0.15], [Wb / 2, 1.85, L * 0.15], 0.018, steelBlue, g)
    // ladder
    for (let i = 0; i < 4; i++) tube([Wb / 2 + 0.01, 0.5 + i * 0.32, L / 2 - 0.35], [Wb / 2 + 0.01, 0.5 + i * 0.32, L / 2 - 0.02], 0.012, steelBlue, g)
    tube([Wb / 2 + 0.01, 0, L / 2 - 0.35], [Wb / 2 + 0.01, 1.85, L / 2 - 0.35], 0.014, steelBlue, g)
    g.position.set(x, 0, -0.75); g.rotation.y = ry
    scene.add(g)
    // blanket on lower bunk
    const bl = box(0.86, 0.04, 1.0, std(0xa8322d, 0.95), 0, 0.53, 0.25, g); bl.rotation.z = 0.02
  }
  bunk(-W / 2 + 0.5, 0)
  bunk(W / 2 - 0.5, Math.PI)
  // desks under the window side and chairs
  const desk = (x, z, ry) => {
    const g = new THREE.Group()
    box(1.0, 0.03, 0.55, paleWood, 0, 0.74, 0, g)
    box(0.96, 0.14, 0.02, paleWood, 0, 0.64, -0.26, g)
    for (const [a, b] of [[-0.47, -0.25], [0.47, -0.25], [-0.47, 0.25], [0.47, 0.25]]) tube([a, 0, b], [a, 0.74, b], 0.014, steelBlue, g)
    g.position.set(x, 0, z); g.rotation.y = ry; scene.add(g)
    // things on the desk
    box(0.3, 0.02, 0.22, std(0x2c2c2c, 0.3, 0.3), 0.15, 0.765, 0.02, g) // laptop base
    const lid = box(0.3, 0.2, 0.01, std(0x2c2c2c, 0.3, 0.3), 0.15, 0.86, -0.09, g); lid.rotation.x = -0.25
    for (let i = 0; i < 4; i++) box(0.17, 0.025, 0.24, std(prodColors[i + 1], 0.6), -0.28, 0.765 + i * 0.026, 0, g)
  }
  desk(-0.35, 1.45, Math.PI / 2)
  schoolChair(0.15, 1.2, -Math.PI / 2)
  schoolChair(0.1, 1.85, -Math.PI / 2 + 0.3)
  // dark wood wall shelves (cubbies) above the desks on the east wall
  const cubby = (x, y, z, ry) => {
    const g = new THREE.Group()
    box(1.3, 0.03, 0.3, darkWood, 0, 0, 0, g); box(1.3, 0.03, 0.3, darkWood, 0, 0.42, 0, g)
    for (const a of [-0.65, -0.22, 0.22, 0.65]) box(0.03, 0.45, 0.3, darkWood, a, 0.21, 0, g)
    stock(-0.6, -0.26, 0.02, 0, 0.2, rand, g)
    g.position.set(x, y, z); g.rotation.y = ry; scene.add(g)
  }
  cubby(-W / 2 + 0.17, 2.1, 1.15, Math.PI / 2)
  cubby(W / 2 - 0.17, 2.1, 1.15, -Math.PI / 2)
  // small fridge with microwave, by the door
  const fr = box(0.5, 0.85, 0.5, std(0xd7d9da, 0.35, 0.3), W / 2 - 0.35, 0.425, 1.85)
  box(0.48, 0.28, 0.36, std(0x1b1b1b, 0.3, 0.4), W / 2 - 0.35, 1.0, 1.85)
  box(0.3, 0.2, 0.01, std(0x0c0c0c, 0.05, 0.5), W / 2 - 0.4, 1.0, 1.67)
  splitAC(0, 2.55, D / 2 - 0.12, Math.PI)
  ceilingFan(0, H, 0.2)
  tubeLight(0, H - 0.02, -0.6, 1.2, 0, 2.5)
  switchPlate(W / 2 - 0.02, 1.3, 2.0, -Math.PI / 2)
  door(0.9, 2.1, 0.0).position.set(1.1, 0, D / 2 + 0.03)
  // rug
  const rug = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.6), new THREE.MeshStandardMaterial({ map: canvasTex(256, 256, (c, w, h) => { c.fillStyle = "#7a2f3a"; c.fillRect(0, 0, w, h); c.strokeStyle = "#e3c27a"; c.lineWidth = 10; c.strokeRect(14, 14, w - 28, h - 28); c.fillStyle = "#2e4a74"; c.fillRect(60, 60, w - 120, h - 120) }), roughness: 1 }))
  rug.rotation.x = -Math.PI / 2; rug.position.set(0, 0.005, 0.9); rug.receiveShadow = true; scene.add(rug)
  // slippers and a bucket (every hall room has one)
  cyl(0.15, 0.3, std(0x2f6fd0, 0.5), 1.0, 0.15, 1.95)
  camera.position.set(0.9, 1.55, 2.05)
  camera.lookAt(-0.1, 1.1, -1.2)
  camera.fov = 68
}

// ---- Reading room: rows of dark wood study carrels, louvres with curtains, fans and tubes. ----
views.reading = () => {
  const W = 12, D = 16, H = 3.4
  const holes = []
  for (let i = -2; i <= 2; i++) holes.push({ x: i * 2.8, y: 0.9, w: 1.6, h: 1.6 })
  shell(W, D, H, { walls: { w: holes, e: holes, s: [{ x: 0, y: 0, w: 1.6, h: 2.2 }] }, wall: paint(0xf0e6cf), floor: floorTileMat(W, D, 0.6, [214, 196, 168]) })
  for (const side of [-1, 1]) for (let i = -2; i <= 2; i++) {
    const z = i * 2.8
    const g = new THREE.Group(); g.position.set(side * (W / 2 + 0.1), 0.9, -z); g.rotation.y = side * -Math.PI / 2; scene.add(g); louvre(1.6, 1.6, g)
    curtain(0.7, 2.25, 0xe9e0c8, side * (W / 2 - 0.06), 2.85, -z - 0.85, side * -Math.PI / 2, 4)
    curtain(0.7, 2.25, 0xe9e0c8, side * (W / 2 - 0.06), 2.85, -z + 0.85, side * -Math.PI / 2, 4)
  }
  sky(40, 8, -W / 2 - 6, 2, 0, Math.PI / 2); sky(40, 8, W / 2 + 6, 2, 0, -Math.PI / 2)
  daylight([-20, 9, -4], [0, 0, 0], 2.6)
  // beam across the middle
  box(W, 0.45, 0.35, paint(0xf0e6cf), 0, H - 0.22, 0)
  // carrels: two long rows of back-to-back desks with dividers
  const carrelRow = (x, z0, z1) => {
    const n = Math.round((z1 - z0) / 0.95)
    const len = n * 0.95
    const zc = (z0 + z1) / 2
    box(1.5, 0.04, len, darkWood, x, 0.76, zc) // top
    box(0.04, 0.42, len, darkWood, x, 1.0, zc) // centre spine
    box(1.5, 0.72, 0.04, darkWood, x, 0.37, zc - len / 2)
    box(1.5, 0.72, 0.04, darkWood, x, 0.37, zc + len / 2)
    for (let i = 0; i <= n; i++) {
      const z = zc - len / 2 + i * 0.95
      box(1.5, 0.42, 0.025, darkWood, x, 1.0, z) // dividers
      if (i < n) {
        box(0.02, 0.6, 0.9, darkWood, x - 0.74, 0.43, z + 0.475) // modesty
        box(0.02, 0.6, 0.9, darkWood, x + 0.74, 0.43, z + 0.475)
      }
    }
    for (let i = 0; i < n; i++) {
      const z = zc - len / 2 + 0.475 + i * 0.95
      if (rand() > 0.25) schoolChair(x - 1.05, z, Math.PI / 2 + (rand() - 0.5) * 0.4, midWood, std(0x2b2b2b, 0.4, 0.5))
      if (rand() > 0.25) schoolChair(x + 1.05, z, -Math.PI / 2 + (rand() - 0.5) * 0.4, midWood, std(0x2b2b2b, 0.4, 0.5))
      if (rand() > 0.6) { const b = box(0.22, 0.04, 0.3, std(prodColors[Math.floor(rand() * 9)], 0.6), x - 0.4, 0.8, z); b.rotation.y = rand() }
      if (rand() > 0.7) { const b = box(0.22, 0.04, 0.3, std(0xf4f1e8, 0.8), x + 0.4, 0.8, z); b.rotation.y = rand() }
    }
  }
  carrelRow(-2.6, -6.8, 6.8)
  carrelRow(2.6, -6.8, 6.8)
  for (let i = -3; i <= 3; i++) for (const x of [-3.4, 0, 3.4]) if (i % 2 === 0) tubeLight(x, H - 0.02, i * 2.2, 1.2, Math.PI / 2, 3)
  for (const z of [-5, 3.5]) for (const x of [-2.6, 2.6]) ceilingFan(x, H, z)
  splitAC(-W / 2 + 0.15, 2.65, 6.5, Math.PI / 2)
  splitAC(W / 2 - 0.15, 2.65, -6.5, -Math.PI / 2)
  sign("SILENCE PLEASE", 0, 2.55, -D / 2 + 0.03, 1.6, 0.3, "#f7f3e8", "#7a1f1f")
  camera.position.set(0.1, 1.6, 7.4)
  camera.lookAt(-0.2, 1.15, -4)
  camera.fov = 62
}

// ---- Corridor: long cream corridor, beige tiles, wooden doors in dark frames, round lights, windows to one side. ----
views.corridor = () => {
  const W = 2.4, D = 40, H = 2.95
  const wHoles = [], eHoles = []
  const doors = []
  for (let i = 0; i < 11; i++) {
    const z = -D / 2 + 2 + i * 3.6
    eHoles.push({ x: z, y: 0, w: 0.9, h: 2.1 })
    doors.push(z)
    wHoles.push({ x: -z, y: 1.0, w: 1.2, h: 1.2 })
  }
  shell(W, D, H, { walls: { e: eHoles, w: wHoles }, floor: floorTileMat(W, D, 0.5, [218, 200, 170]), wall: paint(0xefe2c2) })
  doors.forEach((z, i) => {
    const d = door(0.9, 2.1, i === 3 ? 0.9 : 0, `${String(112 + i * 2)}`)
    d.position.set(W / 2 + 0.03, 0, z); d.rotation.y = -Math.PI / 2
  })
  for (const z of doors) {
    const g = new THREE.Group(); g.position.set(-W / 2 - 0.1, 1.0, z); g.rotation.y = Math.PI / 2; scene.add(g); louvre(1.2, 1.2, g)
  }
  sky(60, 8, -W / 2 - 4, 2, 0, Math.PI / 2)
  daylight([-14, 6, -6], [0, 0, 0], 2.2)
  for (let i = 0; i < 8; i++) roundLight(0, H, -D / 2 + 3 + i * 5, 1.2)
  // open door spill light
  const spill = new THREE.PointLight(0xfff0d8, 1.2, 4); spill.position.set(W / 2 + 1, 1.5, doors[3]); scene.add(spill)
  // fire extinguisher and notice board
  cyl(0.08, 0.5, std(0xc61b1b, 0.3), W / 2 - 0.1, 0.55, -6)
  sign("FIRE POINT", W / 2 - 0.02, 1.2, -6, 0.4, 0.14, "#c61b1b", "#fff", -Math.PI / 2)
  const nb = box(0.02, 0.8, 1.2, std(0x8a6a4a, 0.8), W / 2 - 0.02, 1.5, 9)
  for (let i = 0; i < 6; i++) box(0.005, 0.22, 0.17, std([0xffffff, 0xfff4b0, 0xbfe0ff][i % 3], 0.9), W / 2 - 0.035, 1.35 + (i % 2) * 0.3, 8.6 + Math.floor(i / 2) * 0.3)
  camera.position.set(-0.2, 1.6, D / 2 - 1.2)
  camera.lookAt(0.15, 1.35, -8)
  camera.fov = 60
}

// ---- Mart: spacious shop on the second floor, glass-door fridges, stocked shelves, counter, TV. ----
views.mart = () => {
  const W = 8, D = 6.5, H = 3.0
  shell(W, D, H, { walls: { s: [{ x: 0, y: 0, w: 1.8, h: 2.2 }], e: [{ x: 0, y: 1.0, w: 1.5, h: 1.3 }] }, floor: floorTileMat(W, D, 0.6, [230, 220, 200]), wall: paint(0xf4ead4) })
  const g = new THREE.Group(); g.position.set(W / 2 + 0.1, 1.0, 0); g.rotation.y = -Math.PI / 2; scene.add(g); louvre(1.5, 1.3, g)
  sky(20, 8, W / 2 + 5, 2, 0, -Math.PI / 2)
  daylight([14, 7, 4], [0, 0, 0], 1.6)
  // fridges along the back wall
  fridge(-2.9, -D / 2 + 0.4, 0, "TAMASHI")
  fridge(-1.95, -D / 2 + 0.4, 0, null)
  fridge(-1.0, -D / 2 + 0.4, 0, "COLD DRINKS")
  // shelving along back and west walls
  shelfUnit(0.4, -D / 2 + 0.22, 1.4, 2.1, 0.4)
  shelfUnit(1.85, -D / 2 + 0.22, 1.4, 2.1, 0.4)
  shelfUnit(3.2, -D / 2 + 0.22, 1.2, 2.1, 0.4)
  shelfUnit(-W / 2 + 0.22, -1.2, 1.4, 2.1, 0.4, Math.PI / 2)
  shelfUnit(-W / 2 + 0.22, 0.3, 1.4, 2.1, 0.4, Math.PI / 2)
  // central gondola
  shelfUnit(0.6, 0.2, 2.2, 1.3, 0.45, 0, 3)
  shelfUnit(0.6, -0.27, 2.2, 1.3, 0.45, Math.PI, 3)
  // counter by the entrance with bread and a till
  box(2.2, 1.0, 0.6, std(0x8b5a36, 0.55), 2.5, 0.5, 1.8)
  box(2.3, 0.04, 0.68, std(0xf1ece2, 0.3), 2.5, 1.02, 1.8)
  for (let i = 0; i < 5; i++) { const b = new THREE.Mesh(new THREE.CapsuleGeometry(0.05, 0.18, 6, 12), std(0xd79a52, 0.7)); b.rotation.z = Math.PI / 2; b.position.set(1.7 + i * 0.18, 1.1, 1.75); b.castShadow = true; scene.add(b) }
  box(0.35, 0.12, 0.3, black, 3.2, 1.1, 1.75)
  tv(3.1, 2.3, -D / 2 + 0.05, 0, 0.8)
  sign("MART", 0, 2.65, -D / 2 + 0.03, 1.4, 0.36, "#f2b632", "#5a2a0a")
  for (const x of [-2, 1.5]) for (const z of [-1.5, 1.2]) tubeLight(x, H - 0.02, z, 1.2, 0, 3.5)
  ceilingFan(-0.5, H, 1.5)
  // crates of water sachets
  for (let i = 0; i < 3; i++) box(0.55, 0.3, 0.4, std(0x2f7dd1, 0.6), -2.6 + i * 0.6, 0.15 + (i === 1 ? 0.3 : 0), 1.9)
  camera.position.set(-0.6, 1.62, 3.0)
  camera.lookAt(-1.6, 1.15, -2.6)
  camera.fov = 64
}

// ---- Restaurant: cream tiles, stone-veneer dado, glass bain-marie counter, drinks fridge, orange chairs. ----
views.restaurant = () => {
  const W = 9, D = 7, H = 3.0
  const stone = new THREE.MeshStandardMaterial({ map: canvasTex(512, 256, (c, w, h) => {
    c.fillStyle = "#8a7a66"; c.fillRect(0, 0, w, h)
    let y = 0
    while (y < h) { const rh = 18 + Math.random() * 16; let x = -Math.random() * 40; while (x < w) { const rw = 40 + Math.random() * 70, v = Math.random() * 50; c.fillStyle = `rgb(${150 + v},${132 + v},${110 + v * 0.8})`; c.fillRect(x + 2, y + 2, rw - 4, rh - 4); x += rw } y += rh }
  }, [4, 1]), roughness: 0.85 })
  shell(W, D, H, { walls: { e: [{ x: -1, y: 1.0, w: 1.4, h: 1.2 }, { x: 1.8, y: 1.0, w: 1.4, h: 1.2 }], s: [{ x: -2.5, y: 0, w: 1.6, h: 2.2 }] }, floor: floorTileMat(W, D, 0.6, [232, 222, 196]), wall: paint(0xf1e4c6) })
  // stone veneer band on the back and west walls
  box(W, 1.1, 0.03, stone, 0, 0.55, -D / 2 + 0.015)
  box(0.03, 1.1, D, stone, -W / 2 + 0.015, 0.55, 0)
  for (const z of [-1, 1.8]) { const g = new THREE.Group(); g.position.set(W / 2 + 0.1, 1.0, z); g.rotation.y = -Math.PI / 2; scene.add(g); louvre(1.4, 1.2, g) }
  sky(20, 8, W / 2 + 5, 2, 0, -Math.PI / 2)
  daylight([14, 6, -2], [0, 0, 0], 2.0)
  // serving counter with glass bain-marie
  const cz = -D / 2 + 1.1
  box(4.2, 0.95, 0.75, std(0xe9e3d6, 0.4), -1.5, 0.475, cz)
  box(4.2, 0.12, 0.75, stone, -1.5, 0.06, cz + 0.01)
  box(4.3, 0.04, 0.85, std(0x2a2a2a, 0.2, 0.3), -1.5, 0.97, cz)
  const pans = [0xd24a1c, 0xf2d6a2, 0x6f9b3a, 0xb7341b, 0xf5f2e8, 0x8a4f22]
  pans.forEach((c, i) => {
    box(0.6, 0.05, 0.45, std(0xc0c4c6, 0.25, 0.9), -3.2 + i * 0.68, 1.0, cz)
    box(0.54, 0.02, 0.4, std(c, 0.6), -3.2 + i * 0.68, 1.03, cz)
  })
  const sneeze = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.45, 0.01), glass); sneeze.position.set(-1.5, 1.3, cz + 0.35); sneeze.rotation.x = -0.4; scene.add(sneeze)
  for (const x of [-3.55, -1.5, 0.55]) tube([x, 0.99, cz + 0.33], [x, 1.5, cz + 0.2], 0.012, aluminium)
  sign("TODAY: JOLLOF · WAAKYE · BANKU & TILAPIA · FRIED RICE", -1.5, 2.35, -D / 2 + 0.03, 3.6, 0.42, "#fff7e6", "#a3261b")
  fridge(2.2, -D / 2 + 0.4, 0, "PEPSI", 0.8)
  const pf = scene.children[scene.children.length - 1]
  pf.traverse((o) => { if (o.isMesh && o.material.color && o.material.color.getHex() === 0x1a4aa8) o.material = std(0x1d3f9c, 0.35) })
  fridge(3.1, -D / 2 + 0.4, 0, null, 0.8)
  // tables and chairs
  const table = (x, z) => {
    box(1.2, 0.04, 0.8, std(0xf3f0ea, 0.3), x, 0.75, z)
    for (const [a, b] of [[-0.55, -0.35], [0.55, -0.35], [-0.55, 0.35], [0.55, 0.35]]) tube([x + a, 0, z + b], [x + a, 0.75, z + b], 0.016, aluminium)
    plasticChair(x - 0.3, z - 0.6, 0); plasticChair(x + 0.3, z - 0.6, 0)
    plasticChair(x - 0.3, z + 0.6, Math.PI); plasticChair(x + 0.3, z + 0.6, Math.PI)
  }
  table(-2.6, 1.3); table(0.2, 1.3); table(2.9, 1.3); table(1.6, -1.0)
  // plate of food on a table
  cyl(0.12, 0.02, std(0xffffff, 0.3), 0.0, 0.78, 1.25); cyl(0.09, 0.03, std(0xd2601c, 0.7), 0.0, 0.8, 1.25)
  for (const x of [-2.6, 0.5, 3]) for (const z of [-1.4, 1.4]) tubeLight(x, H - 0.02, z, 1.2, 0, 3.5)
  ceilingFan(-1, H, 0.2); ceilingFan(2.2, H, 0.2)
  tv(-W / 2 + 0.05, 2.2, 1.2, Math.PI / 2, 1.0)
  camera.position.set(3.6, 1.6, 3.1)
  camera.lookAt(-1.4, 1.05, -2.2)
  camera.fov = 64
}

// ---- Shops: ground-floor room units opening onto the corridor, collapsible grille gates, painted signs. ----
views.shop = () => {
  const W = 3.4, D = 30, H = 3.0
  // corridor with shop openings on the east wall
  const shops = [
    { z: 5.5, name: "ULTIMATE UNISEX SALON", bg: "#111111", fg: "#ffffff", open: true },
    { z: 1, name: "FOODSTUFF & PROVISIONS", bg: "#f2c418", fg: "#7a1c12", open: true },
    { z: -3.5, name: "LAUNDRY · WASH & IRON", bg: "#2a6fb8", fg: "#ffffff", open: false },
    { z: -8, name: "PHOTOCOPY & PRINTING", bg: "#e9e3d6", fg: "#1a3d7a", open: true },
  ]
  shell(W, D, H, { walls: { e: shops.map((s) => ({ x: s.z, y: 0, w: 2.6, h: 2.3 })), w: [-9, -4, 1, 6].map((z) => ({ x: -z, y: 1.0, w: 1.3, h: 1.2 })) }, floor: floorTileMat(W, D, 0.5, [214, 198, 172]), wall: paint(0xefe3c6) })
  for (const z of [-9, -4, 1, 6]) { const g = new THREE.Group(); g.position.set(-W / 2 - 0.1, 1.0, z); g.rotation.y = Math.PI / 2; scene.add(g); louvre(1.3, 1.2, g) }
  sky(50, 8, -W / 2 - 4, 2, 0, Math.PI / 2)
  daylight([-14, 6, -3], [0, 0, 0], 2.0)
  for (let i = 0; i < 6; i++) roundLight(-0.3, H, -12 + i * 4.5, 1.3)
  const grille = std(0x3d4246, 0.45, 0.7)
  shops.forEach((s, idx) => {
    // the shop room behind the opening
    const x0 = W / 2 + 0.2
    const rD = 3.2
    const back = box(0.1, H, 2.8, paint(idx === 0 ? 0xe7d8f2 : 0xf3ead4), x0 + rD, H / 2, s.z)
    box(rD, 0.05, 2.8, ceilingMat, x0 + rD / 2, H, s.z)
    box(rD, 0.02, 2.8, floorTileMat(rD, 2.8, 0.4, [230, 222, 204]), x0 + rD / 2, 0.005, s.z)
    box(rD, H, 0.1, paint(0xf3ead4), x0 + rD / 2, H / 2, s.z - 1.45)
    box(rD, H, 0.1, paint(0xf3ead4), x0 + rD / 2, H / 2, s.z + 1.45)
    const L = new THREE.PointLight(0xffffff, 3, 6, 1.5); L.position.set(x0 + 1.6, H - 0.3, s.z); scene.add(L)
    if (idx === 0) { // salon: mirrors, chairs, dryers
      for (const dz of [-0.7, 0.7]) {
        box(0.03, 1.0, 0.7, std(0xe0ecf2, 0.02, 0.95), x0 + rD - 0.07, 1.5, s.z + dz)
        const ch = new THREE.Group(); box(0.5, 0.45, 0.5, std(0x111111, 0.3), 0, 0.5, 0, ch); box(0.08, 0.6, 0.5, std(0x111111, 0.3), 0.22, 0.95, 0, ch); cyl(0.05, 0.3, aluminium, 0, 0.15, 0, null, 10, ch)
        ch.position.set(x0 + rD - 0.6, 0, s.z + dz); scene.add(ch)
      }
      for (let i = 0; i < 6; i++) sign("", x0 + 0.06, 1.2 + (i % 3) * 0.45, s.z - 1.0 + Math.floor(i / 3) * 0.5, 0.36, 0.4, ["#f4c6d4", "#c9e2f5", "#f9e3b1"][i % 3], "#000", Math.PI / 2)
    } else if (idx === 1) { // foodstuff: sacks, shelves, basins
      shelfUnit(x0 + rD - 0.25, s.z, 2.4, 2.1, 0.4, -Math.PI / 2)
      for (let i = 0; i < 4; i++) { const sk = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.6, 12), std([0xe9dfc6, 0xd8c8a2, 0xf0f0ea][i % 3], 0.95)); sk.position.set(x0 + 0.5 + (i % 2) * 0.55, 0.3, s.z - 0.9 + Math.floor(i / 2) * 0.5); sk.castShadow = true; scene.add(sk) }
      for (let i = 0; i < 3; i++) cyl(0.25, 0.12, std([0x2b6ed0, 0xe33b2e, 0x2bb05a][i], 0.4), x0 + 0.5, 0.75 + i * 0.13, s.z + 0.8)
    } else if (idx === 2) { // laundry: machines
      for (let i = 0; i < 3; i++) {
        const z = s.z - 0.85 + i * 0.85
        box(0.6, 0.85, 0.6, plasticWhite, x0 + rD - 0.4, 0.425, z)
        const dr = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.035, 10, 24), std(0xb5b9bc, 0.3, 0.8)); dr.position.set(x0 + rD - 0.71, 0.45, z); dr.rotation.y = Math.PI / 2; scene.add(dr)
      }
      tube([x0 + 0.3, 1.9, s.z - 1.3], [x0 + 0.3, 1.9, s.z + 1.3], 0.012, aluminium)
      for (let i = 0; i < 5; i++) box(0.02, 0.8, 0.45, std(prodColors[i + 2], 0.9), x0 + 0.3, 1.45, s.z - 1.0 + i * 0.5)
    } else { // photocopy
      box(0.7, 1.1, 0.6, std(0xdedfdd, 0.4), x0 + rD - 0.5, 0.55, s.z - 0.5)
      box(1.6, 0.9, 0.5, std(0x8a5634, 0.5), x0 + 0.6, 0.45, s.z + 0.5)
      box(0.4, 0.3, 0.03, black, x0 + 0.6, 1.1, s.z + 0.5)
    }
    // painted sign board above the opening, facing the corridor
    sign(s.name, W / 2 - 0.02, 2.62, s.z, 2.5, 0.42, s.bg, s.fg, -Math.PI / 2)
    // collapsible grille gate: folded to the sides when open, drawn across when closed
    const gate = (zStart, width) => {
      const n = Math.max(3, Math.round(width / 0.11))
      for (let i = 0; i <= n; i++) tube([W / 2 + 0.06, 0.02, zStart + (i * width) / n], [W / 2 + 0.06, 2.28, zStart + (i * width) / n], 0.01, grille)
      for (let i = 0; i < n; i++) {
        const za = zStart + (i * width) / n, zb = zStart + ((i + 1) * width) / n
        tube([W / 2 + 0.07, 0.4, za], [W / 2 + 0.07, 1.0, zb], 0.006, grille)
        tube([W / 2 + 0.07, 1.0, za], [W / 2 + 0.07, 0.4, zb], 0.006, grille)
        tube([W / 2 + 0.07, 1.3, za], [W / 2 + 0.07, 1.9, zb], 0.006, grille)
        tube([W / 2 + 0.07, 1.9, za], [W / 2 + 0.07, 1.3, zb], 0.006, grille)
      }
      box(0.05, 0.05, width + 0.05, grille, W / 2 + 0.06, 2.29, zStart + width / 2)
    }
    if (s.open) { gate(s.z - 1.3, 0.22); gate(s.z + 1.08, 0.22) } else gate(s.z - 1.3, 2.6)
  })
  // a few people-less props: a bench and a bin
  box(1.4, 0.05, 0.4, midWood, -W / 2 + 0.3, 0.45, -6)
  for (const dz of [-0.6, 0.6]) box(0.05, 0.45, 0.35, std(0x2b2b2b, 0.4, 0.5), -W / 2 + 0.3, 0.225, -6 + dz)
  cyl(0.18, 0.55, std(0x2b8a3e, 0.5), -W / 2 + 0.3, 0.275, 3)
  camera.position.set(-1.2, 1.6, 11.5)
  camera.lookAt(1.0, 1.4, -2)
  camera.fov = 62
}

// ---- Staircase: concrete flights with dark nosings, steel rails, breeze-block wall letting in patterned light. ----
views.stairs = () => {
  const W = 5.6, D = 6.2, H = 7.0
  // breeze block wall on the west: a canvas alpha pattern so daylight comes through in a pattern
  const bb = canvasTex(256, 256, (c, w, h) => {
    c.fillStyle = "#fff"; c.fillRect(0, 0, w, h)
    c.fillStyle = "#000"
    const n = 4, s = w / n
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { c.beginPath(); c.arc(i * s + s / 2, j * s + s / 2, s * 0.32, 0, 7); c.fill(); c.fillRect(i * s + s * 0.08, j * s + s * 0.08, s * 0.16, s * 0.16); c.fillRect(i * s + s * 0.76, j * s + s * 0.76, s * 0.16, s * 0.16) }
  }, [W * 2.5, H * 2.5])
  const bbMat = new THREE.MeshStandardMaterial({ color: 0xf1ece0, alphaMap: bb, alphaTest: 0.5, roughness: 0.9, side: THREE.DoubleSide })
  const bbWall = new THREE.Mesh(new THREE.PlaneGeometry(D, H), bbMat)
  bbWall.position.set(-W / 2, H / 2, 0); bbWall.rotation.y = Math.PI / 2; bbWall.castShadow = true; bbWall.receiveShadow = true
  bbWall.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, alphaMap: bb, alphaTest: 0.5 })
  scene.add(bbWall)
  // other walls
  box(W, H, 0.2, whiteWall, 0, H / 2, -D / 2 - 0.1)
  box(0.2, H, D, whiteWall, W / 2 + 0.1, H / 2, 0)
  const conc = paint(0x9f998f)
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D + 6), floorTileMat(W, D + 6, 0.5, [205, 190, 165])); floor.rotation.x = -Math.PI / 2; floor.position.z = 3; floor.receiveShadow = true; scene.add(floor)
  sky(30, 16, -W / 2 - 6, 4, 0, Math.PI / 2)
  const sun = daylight([-16, 12, 3], [0, 1, 0], 3.2)
  // dog-leg stair: flight 1 up along -z on the east half, landing at the back, flight 2 back on the west half
  const FH = 3.25, steps = 11, rise = FH / 2 / steps, run = 0.28, sw = 1.35
  const nos = std(0x2a2522, 0.6)
  const flight = (x, z0, dir, y0) => {
    for (let i = 0; i < steps; i++) {
      const y = y0 + (i + 1) * rise
      const z = z0 + dir * (i * run + run / 2)
      const hb = y - y0 + 0.15
      box(sw, hb, run, conc, x, y - hb / 2, z)
      box(sw, 0.02, 0.05, nos, x, y + 0.001, z - dir * (run / 2 - 0.025), scene, false)
    }
  }
  const xE = W / 2 - sw / 2 - 0.05, xW = -W / 2 + sw / 2 + 0.25
  flight(xE, 1.6, -1, 0)
  box(W - 0.2, 0.2, 1.4, conc, 0.1, FH / 2 - 0.1, 1.6 - steps * run - 0.7) // landing
  flight(xW, 1.6 - steps * run, 1, FH / 2)
  box(W - 0.2, 0.2, 2.2, whiteWall, 0.1, FH - 0.1, 1.6 + 1.1) // upper floor slab
  // rails: steel tube balustrade on the inner edges
  const railMat = std(0x2f3336, 0.4, 0.7)
  const r = (x, z0, dir, y0) => {
    const z1 = z0 + dir * steps * run
    tube([x, y0 + 0.95, z0], [x, y0 + FH / 2 + 0.95, z1], 0.025, railMat)
    for (let i = 0; i <= steps; i += 2) { const z = z0 + dir * i * run; tube([x, y0 + i * rise, z], [x, y0 + i * rise + 0.95, z], 0.012, railMat) }
  }
  r(xE - sw / 2 - 0.02, 1.6, -1, 0)
  r(xW + sw / 2 + 0.02, 1.6 - steps * run, 1, FH / 2)
  // floor marker on the wall
  sign("1ST FLOOR", W / 2 - 0.02, FH + 1.6, 2.5, 0.8, 0.22, "#1f3f8f", "#ffffff", -Math.PI / 2)
  sign("G", W / 2 - 0.02, 1.9, 2.5, 0.3, 0.3, "#1f3f8f", "#ffffff", -Math.PI / 2)
  roundLight(0, FH - 0.2, 0, 1.2)
  scene.add(new THREE.HemisphereLight(0xdfe9f2, 0x9a8a74, 0.35))
  camera.position.set(1.2, 1.55, 4.4)
  camera.lookAt(-0.8, 2.3, -1.5)
  camera.fov = 66
}

;(views[VIEW] || views.room)()
camera.aspect = innerWidth / innerHeight
camera.updateProjectionMatrix()
scene.add(new THREE.HemisphereLight(0xf3efe6, 0x8d7b64, 0.25))

const composer = new EffectComposer(renderer)
composer.addPass(new RenderPass(scene, camera))
const ao = new GTAOPass(scene, camera, innerWidth, innerHeight)
ao.updateGtaoMaterial({ radius: 0.5, distanceExponent: 1.5, thickness: 1, scale: 1.2 })
composer.addPass(ao)
composer.addPass(new OutputPass())

addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix()
  renderer.setSize(innerWidth, innerHeight); composer.setSize(innerWidth, innerHeight)
})
THREE.DefaultLoadingManager.onLoad = () => {
  composer.render()
  requestAnimationFrame(() => { composer.render(); document.body.dataset.ready = "1" })
}
// If nothing loads (all-procedural scenes), still render.
setTimeout(() => { if (!document.body.dataset.ready) { composer.render(); document.body.dataset.ready = "1" } }, 8000)
