import * as THREE from "three"

/**
 * A clay model of the hall, built from boxes in code (no downloaded models, no photos).
 * Block shapes and placements are illustrative. The camera rides a CatmullRom path; a second curve says where it looks.
 * Time of day moves from dusk to night as you go, and the windows light up: "Light in darkness".
 */

const CLAY = 0xefebe3
const CLAY_DARK = 0xd9d3c7
const LAMP = 0xf2c879

export type WalkScene = {
  render: (p: number, yaw: number) => { x: number; z: number }
  resize: (w: number, h: number) => void
  dispose: () => void
  stopT: number[]
}

// Camera path and where it looks. Indices marked as stops line up with lib/walk.ts.
const PATH: { at: [number, number, number]; look: [number, number, number]; stop?: number }[] = [
  { at: [0, 2.2, 56], look: [0, 5, 18], stop: 0 },
  { at: [0, 1.7, 30], look: [0, 2, 10] },
  { at: [2.6, 1.6, 17.5], look: [0, 1.6, 13], stop: 1 },
  { at: [7, 1.7, 7], look: [16, 1.6, 2] },
  { at: [14.2, 1.6, 2.4], look: [21, 1.0, 1.6], stop: 2 },
  { at: [7, 1.8, 3], look: [-2, 2, -6] },
  { at: [-3, 1.8, 5.5], look: [0, 2.4, -9], stop: 3 },
  { at: [-11, 1.7, -3], look: [-24, 1.6, -3] },
  { at: [-15.2, 1.75, -3], look: [-25, 1.4, -3], stop: 4 },
  { at: [-4, 16, 20], look: [0, 2, 0] },
  { at: [34, 40, 44], look: [0, 0, -2], stop: 5 },
]

export function createWalkScene(canvas: HTMLCanvasElement, opts: { small: boolean }): WalkScene {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !opts.small, powerPreference: "high-performance" })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, opts.small ? 1.5 : 1.75))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.shadowMap.enabled = !opts.small
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  const scene = new THREE.Scene()
  const dusk = new THREE.Color(0xe9dfcf)
  const night = new THREE.Color(0x141821)
  scene.background = dusk.clone()
  scene.fog = new THREE.Fog(dusk.clone(), 40, 140)

  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 400)

  const hemi = new THREE.HemisphereLight(0xfff6e8, 0x8a8170, 1.1)
  scene.add(hemi)
  const sun = new THREE.DirectionalLight(0xffe2b8, 1.6)
  sun.position.set(-30, 40, 25)
  sun.castShadow = !opts.small
  sun.shadow.mapSize.set(2048, 2048)
  Object.assign(sun.shadow.camera, { left: -45, right: 45, top: 45, bottom: -45, near: 1, far: 140 })
  scene.add(sun)

  const clay = new THREE.MeshStandardMaterial({ color: CLAY, roughness: 0.92 })
  const clayDark = new THREE.MeshStandardMaterial({ color: CLAY_DARK, roughness: 0.95 })
  const glass = new THREE.MeshStandardMaterial({ color: 0x3a3f48, roughness: 0.4, metalness: 0.1 })
  const lit = new THREE.MeshStandardMaterial({ color: LAMP, emissive: LAMP, emissiveIntensity: 0 })
  const wood = new THREE.MeshStandardMaterial({ color: 0xc9a77a, roughness: 0.8 })
  const fabric = new THREE.MeshStandardMaterial({ color: 0xb9b2a6, roughness: 1 })
  const disposables: { dispose: () => void }[] = [clay, clayDark, glass, lit, wood, fabric]

  const box = (w: number, h: number, d: number, mat: THREE.Material, x: number, y: number, z: number, cast = true) => {
    const g = new THREE.BoxGeometry(w, h, d)
    disposables.push(g)
    const m = new THREE.Mesh(g, mat)
    m.position.set(x, y, z)
    m.castShadow = cast && !opts.small
    m.receiveShadow = !opts.small
    scene.add(m)
    return m
  }

  // Ground, paths and the road in from the south.
  box(260, 0.2, 260, clayDark, 0, -0.1, 0, false)
  box(6, 0.04, 60, clay, 0, 0.02, 44, false)
  box(26, 0.04, 26, clay, 0, 0.02, 0, false)

  // Four storeys of rooms around a courtyard (illustrative massing). Openings on the courtyard side
  // of the east block (the room) and the west block (the conference room).
  const FLOOR = 3.2
  const STOREYS = 4
  const windows: THREE.Vector3[] = []
  const windowRot: number[] = []
  // gap: a ground-floor opening along an x-facing block (z0..z1), so the camera can walk into a room.
  const block = (cx: number, cz: number, w: number, d: number, face: "x+" | "x-" | "z+" | "z-", gap?: [number, number]) => {
    if (gap) {
      const z0 = cz - d / 2
      const z1 = cz + d / 2
      box(w, FLOOR * (STOREYS - 1), d, clay, cx, FLOOR + (FLOOR * (STOREYS - 1)) / 2, cz)
      box(w, FLOOR, gap[0] - z0, clay, cx, FLOOR / 2, (z0 + gap[0]) / 2)
      box(w, FLOOR, z1 - gap[1], clay, cx, FLOOR / 2, (gap[1] + z1) / 2)
    } else {
      box(w, FLOOR * STOREYS, d, clay, cx, (FLOOR * STOREYS) / 2, cz)
    }
    box(w + 0.6, 0.3, d + 0.6, clayDark, cx, FLOOR * STOREYS + 0.15, cz)
    const along = face === "z+" || face === "z-" ? w : d
    const n = Math.floor(along / 3)
    for (let s = 0; s < STOREYS; s++)
      for (let i = 0; i < n; i++) {
        const o = -along / 2 + 1.5 + i * 3
        const y = s * FLOOR + 1.7
        if (gap && s === 0 && cz + o > gap[0] - 0.8 && cz + o < gap[1] + 0.8) continue
        for (const sign of [1, -1]) {
          if (face === "z+" || face === "z-") windows.push(new THREE.Vector3(cx + o, y, cz + sign * (d / 2 + 0.02)))
          else windows.push(new THREE.Vector3(cx + sign * (w / 2 + 0.02), y, cz + o))
          windowRot.push(face === "z+" || face === "z-" ? 0 : Math.PI / 2)
        }
      }
  }
  block(0, -19, 34, 8, "z+") // north
  block(-21, -1, 8, 28, "x+", [-6.5, 0.5]) // west, open for the conference room
  block(21, -1, 8, 28, "x-", [-1.4, 4.6]) // east, open for the room
  block(-11, 17, 12, 8, "z-") // south, either side of the way in
  block(11, 17, 12, 8, "z-")

  // Windows as one instanced mesh; some light up as night falls.
  const winGeo = new THREE.PlaneGeometry(1.3, 1.5)
  disposables.push(winGeo)
  const winMesh = new THREE.InstancedMesh(winGeo, glass, windows.length)
  const litIdx: number[] = []
  const m4 = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  windows.forEach((p, i) => {
    q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), windowRot[i])
    m4.compose(p, q, new THREE.Vector3(1, 1, 1))
    winMesh.setMatrixAt(i, m4)
    if ((i * 7919) % 5 < 2) litIdx.push(i)
  })
  scene.add(winMesh)
  const litMesh = new THREE.InstancedMesh(winGeo, lit, litIdx.length)
  litIdx.forEach((wi, k) => {
    q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), windowRot[wi])
    const p = windows[wi].clone()
    p.x += Math.sign(p.x) * 0.01
    p.z += Math.sign(p.z) * 0.01
    m4.compose(p, q, new THREE.Vector3(1, 1, 1))
    litMesh.setMatrixAt(k, m4)
  })
  scene.add(litMesh)

  // Stop 1: a stone plinth with a small lamp, just inside the way in.
  box(1.6, 1.1, 0.5, clayDark, 0, 0.55, 13)
  box(1.2, 0.5, 0.06, wood, 0, 1.25, 13.26)
  const plinthLamp = new THREE.PointLight(LAMP, 0, 6, 1.6)
  plinthLamp.position.set(0, 2.2, 14)
  scene.add(plinthLamp)

  // Stop 2: a cut-away room on the courtyard side of the east block (illustrative 4-in-1 with its own bathroom).
  const rx = 21
  const roomFloor = box(6.8, 0.1, 6, wood, rx, 0.06, 1.6, false)
  roomFloor.receiveShadow = true
  // Inside walls: a box seen from within (back faces), open toward the courtyard through the gap.
  box(7.9, FLOOR - 0.05, 6, new THREE.MeshStandardMaterial({ color: 0xf7f3ec, side: THREE.BackSide, roughness: 1 }), rx, FLOOR / 2, 1.6, false)
  for (const [bx, bz] of [[rx - 2, -0.6], [rx + 2.2, -0.6]] as const) {
    // bunk beds
    box(1, 0.35, 2, fabric, bx, 0.55, bz)
    box(1, 0.35, 2, fabric, bx, 1.75, bz)
    for (const px of [-0.45, 0.45]) for (const pz of [-0.95, 0.95]) box(0.06, 2.1, 0.06, wood, bx + px, 1.05, bz + pz)
  }
  for (let i = 0; i < 4; i++) {
    // desks and chairs along the window wall
    const dx = rx - 2.4 + i * 1.6
    box(1.2, 0.06, 0.6, wood, dx, 0.75, 4.1)
    box(0.5, 0.45, 0.5, clayDark, dx, 0.45, 3.4)
  }
  box(1.5, 2.2, 0.6, wood, rx + 2.9, 1.1, 2.2) // wardrobes
  box(0.9, 2.1, 0.08, clayDark, rx - 3.3, 1.05, 3.2) // bathroom door
  const fan = new THREE.Group()
  for (let i = 0; i < 3; i++) {
    const g = new THREE.BoxGeometry(1.1, 0.03, 0.16)
    disposables.push(g)
    const blade = new THREE.Mesh(g, wood)
    blade.rotation.y = (i * Math.PI * 2) / 3
    blade.position.set(Math.cos((i * Math.PI * 2) / 3) * 0.5, 0, -Math.sin((i * Math.PI * 2) / 3) * 0.5)
    fan.add(blade)
  }
  fan.position.set(rx, FLOOR - 0.35, 1.6)
  scene.add(fan)
  const roomLamp = new THREE.PointLight(0xffe6bf, 0, 9, 1.4)
  roomLamp.position.set(rx, 2.6, 1.6)
  scene.add(roomLamp)

  // Stop 3: Hall Week in the courtyard: a stage, bunting and strings of lights.
  box(9, 0.8, 4, clayDark, 0, 0.4, -10)
  box(9, 4, 0.2, clay, 0, 2.8, -11.9)
  const bulbs: THREE.Mesh[] = []
  const bulbGeo = new THREE.SphereGeometry(0.09, 8, 8)
  disposables.push(bulbGeo)
  for (let r = 0; r < 3; r++)
    for (let i = 0; i < 24; i++) {
      const t = i / 23
      const x = -11 + t * 22
      const z = -6 + r * 5
      const y = 5.2 - Math.sin(t * Math.PI) * 1.1
      const b = new THREE.Mesh(bulbGeo, lit)
      b.position.set(x, y, z)
      scene.add(b)
      bulbs.push(b)
    }
  const flagColors = [0xd4b26a, 0x7a5a17, 0xf3e6c4]
  const flagGeo = new THREE.ConeGeometry(0.22, 0.45, 3)
  disposables.push(flagGeo)
  const flagMats = flagColors.map((c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.9, side: THREE.DoubleSide }))
  disposables.push(...flagMats)
  for (let i = 0; i < 18; i++) {
    const t = i / 17
    const f = new THREE.Mesh(flagGeo, flagMats[i % 3])
    f.position.set(-9 + t * 18, 4.4 - Math.sin(t * Math.PI) * 0.9, -2)
    f.rotation.x = Math.PI
    scene.add(f)
  }
  const stageLamp = new THREE.PointLight(LAMP, 0, 22, 1.2)
  stageLamp.position.set(0, 5, -6)
  scene.add(stageLamp)

  // Stop 4: the conference room in the west block: ten rows of ten seats and a large screen.
  const cx = -21
  box(7.9, FLOOR - 0.05, 7, new THREE.MeshStandardMaterial({ color: 0xf4f1ea, side: THREE.BackSide, roughness: 1 }), cx, FLOOR / 2, -3, false)
  box(7.4, 0.1, 7, clayDark, cx, 0.06, -3, false)
  const seatGeo = new THREE.BoxGeometry(0.42, 0.45, 0.42)
  disposables.push(seatGeo)
  const seats = new THREE.InstancedMesh(seatGeo, fabric, 100)
  let k = 0
  for (let r = 0; r < 10; r++)
    for (let c = 0; c < 10; c++) {
      m4.makeTranslation(cx + 2.8 - r * 0.6, 0.35, -3 - 2.7 + c * 0.6)
      seats.setMatrixAt(k++, m4)
    }
  scene.add(seats)
  const screenMat = new THREE.MeshStandardMaterial({ color: 0x0f1115, emissive: 0x2a3550, emissiveIntensity: 0.6 })
  disposables.push(screenMat)
  box(0.08, 1.2, 2.1, screenMat, cx - 3.55, 1.7, -3, false)
  const confLamp = new THREE.PointLight(0xfff1dc, 0, 10, 1.4)
  confLamp.position.set(cx, 2.7, -3)
  scene.add(confLamp)

  // Trees for scale around the edge.
  const trunkGeo = new THREE.CylinderGeometry(0.15, 0.2, 2.2, 6)
  const crownGeo = new THREE.IcosahedronGeometry(1.4, 0)
  disposables.push(trunkGeo, crownGeo)
  const leaf = new THREE.MeshStandardMaterial({ color: 0xcfd3bf, roughness: 1, flatShading: true })
  disposables.push(leaf)
  const treeAt = [[-6, 30], [6, 34], [-7, 42], [7, 48], [-30, 10], [30, 12], [-28, -24], [28, -26], [14, 28], [-15, 28]]
  for (const [x, z] of treeAt) {
    const t = new THREE.Mesh(trunkGeo, wood)
    t.position.set(x, 1.1, z)
    const c = new THREE.Mesh(crownGeo, leaf)
    c.position.set(x, 3, z)
    c.castShadow = !opts.small
    scene.add(t, c)
  }

  // Curves.
  const path = new THREE.CatmullRomCurve3(PATH.map((s) => new THREE.Vector3(...s.at)), false, "centripetal")
  const look = new THREE.CatmullRomCurve3(PATH.map((s) => new THREE.Vector3(...s.look)), false, "centripetal")
  // Where each stop falls along the path (0..1), found by sampling: CatmullRom points are not evenly spaced in t.
  const samples = path.getSpacedPoints(800)
  const stopT = PATH.filter((s) => s.stop !== undefined).map((s) => {
    const target = new THREE.Vector3(...s.at)
    let best = 0
    let bestD = Infinity
    samples.forEach((pt, i) => {
      const d = pt.distanceToSquared(target)
      if (d < bestD) {
        bestD = d
        best = i
      }
    })
    return best / 800
  })

  const tmpLook = new THREE.Vector3()
  const bg = new THREE.Color()
  let last = performance.now()

  const render = (p: number, yaw: number) => {
    const now = performance.now()
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    const t = THREE.MathUtils.clamp(p, 0, 1)
    camera.position.copy(path.getPointAt(t))
    // Map position-t to look-t through the nearest stop segment so the gaze leads the walk a little.
    tmpLook.copy(look.getPointAt(Math.min(t + 0.015, 1)))
    // "Look" drag: turn the head up to 15 degrees.
    const dir = tmpLook.clone().sub(camera.position)
    dir.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw)
    camera.lookAt(camera.position.clone().add(dir))

    // Dusk to night across the walk; lights come up through it.
    const night01 = THREE.MathUtils.smoothstep(t, 0.15, 0.62)
    bg.copy(dusk).lerp(night, night01)
    ;(scene.background as THREE.Color).copy(bg)
    ;(scene.fog as THREE.Fog).color.copy(bg)
    hemi.intensity = 1.1 - night01 * 0.82
    sun.intensity = 1.6 - night01 * 1.45
    lit.emissiveIntensity = 0.2 + night01 * 2.2
    plinthLamp.intensity = night01 * 8 + 1.5
    roomLamp.intensity = 6 + night01 * 6
    stageLamp.intensity = night01 * 40
    confLamp.intensity = 5 + night01 * 5
    fan.rotation.y += dt * 4.2

    renderer.render(scene, camera)
    return { x: camera.position.x, z: camera.position.z }
  }

  const resize = (w: number, h: number) => {
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.fov = w < 640 ? 68 : 55
    camera.updateProjectionMatrix()
  }

  const dispose = () => {
    disposables.forEach((d) => d.dispose())
    winMesh.dispose()
    litMesh.dispose()
    seats.dispose()
    renderer.dispose()
  }

  return { render, resize, dispose, stopT }
}
