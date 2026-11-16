// MRAMU diorama: three service stations (Get found / Get trusted / Get chosen) plus a data hall and the HQ.
// The belts carry content cards (search results, ads, posts, press, pages), staff carry tablets, and pins label each service.
// Palette comes from the MRAMU brand guidelines.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'

export const Q = {
  bg: 0xFFFBEB, ground: 0xF4EAD0, ground2: 0xE9DDBE, floorF: 0xF8E8C9, floorT: 0xE8E3DA, floorC: 0xF3EEE2, floorD: 0x3a3a3a,
  orange: 0xEDA941, orangeL: 0xF5C877, orangeD: 0x9A591C, soft: 0xF8E8C9, stone: 0xD9D3C9,
  grey: 0x848484, greyD: 0x5d5d5d, ink: 0x252525, ink2: 0x3b3b3b, white: 0xFFFFFF, road: 0x4b4846, wood: 0xB98A55,
  skin: 0xF0C9A0, hair: 0x3a2a20,
}
export const dS = 0.7 // station floor height

const mats = new Map()
export function mat(color, o = {}) {
  const k = [color, o.metal || 0, o.rough ?? 0.8, o.emissive || 0, o.ei || 0].join('|')
  if (!mats.has(k)) mats.set(k, new THREE.MeshStandardMaterial({ color, roughness: o.rough ?? 0.8, metalness: o.metal || 0, emissive: o.emissive ?? 0, emissiveIntensity: o.ei || 0 }))
  return mats.get(k)
}
const geos = new Map()
function rbox(w, h, d, r) {
  const k = [w, h, d, r].join()
  if (!geos.has(k)) geos.set(k, new RoundedBoxGeometry(w, h, d, 2, Math.max(0.001, Math.min(r, w / 2 - 0.001, h / 2 - 0.001, d / 2 - 0.001))))
  return geos.get(k)
}
export function box(p, w, h, d, color, x = 0, y = 0, z = 0, { r = 0.05, cast = true, material } = {}) {
  const m = new THREE.Mesh(rbox(w, h, d, r), material || mat(color))
  m.position.set(x, y + h / 2, z); m.castShadow = cast; m.receiveShadow = true; p.add(m); return m
}
function cyl(p, rt, rb, h, color, x, y, z, { seg = 20, metal = 0, rough = 0.6, material } = {}) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), material || mat(color, { metal, rough }))
  m.position.set(x, y + h / 2, z); m.castShadow = true; m.receiveShadow = true; p.add(m); return m
}
function ball(p, r, color, x, y, z, { cast = true, material } = {}) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 12), material || mat(color))
  m.position.set(x, y, z); m.castShadow = cast; p.add(m); return m
}

// ---------- canvas textures ----------
const cv = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')] }
const tex = (c, rep) => { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...rep) } return t }
const rr = (c, x, y, w, h, r) => { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath() }
const hex = (n) => '#' + n.toString(16).padStart(6, '0')
const SERIF = '"Playfair Display", Georgia, serif'
const BODY = '"Newsreader", Georgia, serif'

function gridTex() { const [c, x] = cv(256, 256); x.fillStyle = hex(Q.ground); x.fillRect(0, 0, 256, 256); x.strokeStyle = 'rgba(37,37,37,.06)'; x.lineWidth = 2; x.strokeRect(0, 0, 256, 256); return tex(c) }
function beltTex() {
  const [c, x] = cv(128, 256); x.fillStyle = '#3b3b3b'; x.fillRect(0, 0, 128, 256)
  x.fillStyle = '#4a4a4a'; for (let i = 0; i < 4; i++) x.fillRect(0, i * 64 + 52, 128, 12)
  x.fillStyle = '#2c2c2c'; x.fillRect(0, 0, 8, 256); x.fillRect(120, 0, 8, 256); return tex(c)
}
function windowsTex() {
  const [c, x] = cv(256, 512); x.fillStyle = '#EDE6D6'; x.fillRect(0, 0, 256, 512); let s = 3; const r = () => (s = (s * 16807) % 2147483647) / 2147483647
  for (let i = 0; i < 8; i++) for (let j = 0; j < 4; j++) { x.fillStyle = r() < .16 ? '#EDA941' : '#B9B2A6'; rr(x, j * 64 + 11, i * 64 + 13, 42, 40, 8); x.fill(); x.fillStyle = 'rgba(255,255,255,.45)'; rr(x, j * 64 + 15, i * 64 + 17, 12, 6, 3); x.fill() }
  return tex(c, [1, 1])
}
function chartTex(kind) {
  const [c, x] = cv(1024, 640)
  x.fillStyle = '#FFFBEB'; x.fillRect(0, 0, 1024, 640); x.fillStyle = '#D9D3C9'; x.fillRect(0, 0, 1024, 70)
  x.fillStyle = '#848484'; for (let i = 0; i < 3; i++) { x.beginPath(); x.arc(40 + i * 34, 35, 10, 0, 7); x.fill() }
  x.fillStyle = '#252525'; rr(x, 190, 24, 260, 22, 10); x.fill()
  x.strokeStyle = 'rgba(37,37,37,.1)'; x.lineWidth = 2; for (let i = 0; i < 5; i++) { x.beginPath(); x.moveTo(60, 170 + i * 90); x.lineTo(964, 170 + i * 90); x.stroke() }
  if (kind === 0) { // growth bars
    const h = [90, 130, 120, 190, 170, 250, 230, 330, 300, 400]
    h.forEach((v, i) => { x.fillStyle = i > 6 ? '#EDA941' : '#D9D3C9'; x.fillRect(80 + i * 88, 560 - v, 64, v) })
  } else if (kind === 1) { // line
    x.strokeStyle = '#EDA941'; x.lineWidth = 12; x.lineJoin = x.lineCap = 'round'; x.beginPath()
    ;[420, 380, 400, 320, 340, 250, 210, 150, 120].forEach((v, i) => i ? x.lineTo(80 + i * 105, 150 + v) : x.moveTo(80, 150 + v)); x.stroke()
    x.strokeStyle = '#848484'; x.lineWidth = 8; x.beginPath()
    ;[450, 440, 430, 420, 400, 390, 370, 360, 340].forEach((v, i) => i ? x.lineTo(80 + i * 105, 150 + v) : x.moveTo(80, 150 + v)); x.stroke()
  } else { // wireframe site
    x.fillStyle = '#252525'; rr(x, 70, 110, 520, 52, 10); x.fill(); x.fillStyle = '#EDA941'; rr(x, 70, 190, 360, 44, 10); x.fill()
    x.fillStyle = '#D9D3C9'; for (let i = 0; i < 3; i++) { rr(x, 70, 270 + i * 40, 520 - i * 90, 20, 8); x.fill() }
    x.fillStyle = '#EDA941'; rr(x, 70, 410, 180, 54, 27); x.fill(); x.fillStyle = '#D9D3C9'; rr(x, 640, 110, 300, 360, 18); x.fill()
    x.fillStyle = '#848484'; for (let i = 0; i < 3; i++) { x.fillRect(80 + i * 190, 500, 160, 60) }
  }
  return tex(c)
}
function cardTex(kind) {
  const [c, x] = cv(320, 256); x.textAlign = 'center'; x.textBaseline = 'middle'
  x.fillStyle = kind === 'ad' ? '#EDA941' : kind === 'quote' ? '#252525' : '#FFFBEB'; x.fillRect(0, 0, 320, 256)
  const ln = (px, py, w, h, col) => { x.fillStyle = col; rr(x, px, py, w, h, h / 2); x.fill() }
  if (kind === 'serp') {
    ln(22, 24, 140, 20, '#EDA941'); ln(22, 54, 80, 10, '#9A591C'); ln(22, 76, 250, 10, '#D9D3C9'); ln(22, 94, 210, 10, '#D9D3C9')
    x.fillStyle = '#252525'; rr(x, 236, 20, 62, 30, 15); x.fill(); x.fillStyle = '#FFFBEB'; x.font = `800 20px ${SERIF}`; x.fillText('#1', 267, 36)
    ln(22, 140, 120, 16, '#848484'); ln(22, 166, 70, 9, '#D9D3C9'); ln(22, 186, 240, 9, '#D9D3C9'); ln(22, 204, 190, 9, '#D9D3C9')
  } else if (kind === 'ad') {
    x.fillStyle = '#FFFBEB'; rr(x, 22, 26, 150, 18, 9); x.fill(); ln(22, 60, 210, 36, '#252525'); ln(22, 108, 130, 14, 'rgba(255,251,235,.85)')
    x.fillStyle = '#252525'; rr(x, 22, 170, 120, 44, 22); x.fill(); x.fillStyle = '#FFFBEB'; x.font = `800 22px ${SERIF}`; x.fillText('Go', 82, 192)
    x.fillStyle = '#FFFBEB'; x.beginPath(); x.moveTo(232, 150); x.lineTo(296, 120); x.lineTo(296, 220); x.closePath(); x.fill()
  } else if (kind === 'report') {
    const h = [60, 90, 80, 130, 110, 170]; h.forEach((v, i) => { x.fillStyle = i > 3 ? '#EDA941' : '#D9D3C9'; x.fillRect(26 + i * 46, 220 - v, 34, v) })
    ln(22, 24, 120, 14, '#252525'); ln(22, 46, 70, 9, '#D9D3C9')
  } else if (kind === 'post') {
    x.fillStyle = '#EDA941'; x.beginPath(); x.arc(52, 52, 24, 0, 7); x.fill(); ln(88, 38, 120, 14, '#252525'); ln(88, 60, 70, 9, '#D9D3C9')
    x.fillStyle = '#F8E8C9'; rr(x, 22, 96, 276, 96, 14); x.fill(); ln(22, 206, 150, 10, '#D9D3C9')
    x.fillStyle = '#EDA941'; x.beginPath(); x.arc(262, 212, 12, 0, 7); x.fill()
  } else if (kind === 'press') {
    ln(22, 22, 276, 26, '#252525'); x.fillStyle = '#D9D3C9'; rr(x, 22, 64, 128, 92, 8); x.fill()
    for (let i = 0; i < 4; i++) ln(166, 66 + i * 24, 132, 10, '#848484')
    for (let i = 0; i < 4; i++) ln(22, 172 + i * 20, 276 - (i % 2) * 60, 9, '#D9D3C9')
  } else if (kind === 'quote') {
    x.fillStyle = '#EDA941'; x.font = `800 150px ${SERIF}`; x.fillText('\u201C', 70, 110); ln(120, 70, 150, 14, '#FFFBEB'); ln(120, 96, 110, 14, '#FFFBEB')
    ln(30, 170, 250, 10, '#848484'); ln(30, 192, 190, 10, '#848484')
  } else { // lead
    x.fillStyle = '#D9D3C9'; x.beginPath(); x.arc(58, 66, 28, 0, 7); x.fill(); ln(104, 48, 130, 16, '#252525'); ln(104, 74, 90, 10, '#848484')
    ln(22, 130, 270, 10, '#D9D3C9'); ln(22, 152, 220, 10, '#D9D3C9'); x.fillStyle = '#EDA941'; rr(x, 22, 190, 130, 40, 20); x.fill(); ln(52, 206, 70, 8, '#FFFBEB')
  }
  return tex(c)
}
function racksTex() {
  const [c, x] = cv(256, 512); x.fillStyle = '#2d2d2d'; x.fillRect(0, 0, 256, 512); let s = 11; const r = () => (s = (s * 16807) % 2147483647) / 2147483647
  for (let i = 0; i < 9; i++) { x.fillStyle = '#3b3b3b'; rr(x, 14, 16 + i * 54, 228, 42, 6); x.fill(); for (let j = 0; j < 6; j++) { x.fillStyle = r() < .3 ? '#EDA941' : r() < .5 ? '#F8E8C9' : '#5d5d5d'; x.beginPath(); x.arc(34 + j * 14, 37 + i * 54, 4, 0, 7); x.fill() } x.fillStyle = '#252525'; rr(x, 150, 28 + i * 54, 80, 18, 4); x.fill() }
  return tex(c)
}
function phoneTex() {
  const [c, x] = cv(256, 512); x.fillStyle = '#FFFBEB'; x.fillRect(0, 0, 256, 512)
  const cols = ['#EDA941', '#D9D3C9', '#848484', '#F8E8C9', '#252525']; let s = 5; const r = () => (s = (s * 16807) % 2147483647) / 2147483647
  for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) { x.fillStyle = cols[Math.floor(r() * cols.length)]; rr(x, 14 + j * 80, 40 + i * 110, 72, 100, 8); x.fill() }
  return tex(c)
}
// sign: returns a plane mesh with 1-2 lines of text
function sign(p, lines, w, h, x, y, z, { ry = 0, tw = 1536, th } = {}) {
  th = th || Math.round(tw * h / w)
  const [c, g] = cv(tw, th); g.textAlign = 'center'; g.textBaseline = 'middle'
  const total = lines.reduce((a, l) => a + l.size * 1.15, 0); let yy = (th - total) / 2
  lines.forEach((l) => { g.font = `${l.weight || 800} ${l.size}px ${l.body ? BODY : SERIF}`; g.fillStyle = l.color; if (g.letterSpacing !== undefined) g.letterSpacing = l.spacing || '0px'; g.fillText(l.text, tw / 2, yy + l.size * .58); yy += l.size * 1.15 })
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex(c), transparent: true, toneMapped: false }))
  m.position.set(x, y, z); m.rotation.y = ry; p.add(m); return m
}
function picture(p, w, h, texture, x, y, z, { ry = 0, basic = true } = {}) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), basic ? new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }) : new THREE.MeshStandardMaterial({ map: texture, roughness: .8 }))
  m.position.set(x, y, z); m.rotation.y = ry; p.add(m); return m
}

// ---------- people ----------
function person({ shirt = Q.orange, pants = Q.ink, hair = Q.hair, skin = Q.skin, carry = false } = {}) {
  const g = new THREE.Group(), body = new THREE.Group(); g.add(body)
  const part = (geo, m, x, y, z, parent = body) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = true; parent.add(o); return o }
  const legG = rbox(.17, .5, .2, .05), armG = rbox(.12, .46, .13, .04)
  const legL = new THREE.Group(); legL.position.set(-.12, .5, 0); const legR = new THREE.Group(); legR.position.set(.12, .5, 0); body.add(legL, legR)
  part(legG, mat(pants), 0, -.25, 0, legL); part(legG, mat(pants), 0, -.25, 0, legR)
  part(rbox(.46, .56, .28, .1), mat(shirt), 0, .78, 0)
  part(new THREE.SphereGeometry(.19, 14, 10), mat(skin), 0, 1.3, 0)
  part(new THREE.SphereGeometry(.2, 14, 10), mat(hair), 0, 1.36, -.03).scale.set(1, .7, 1)
  const armL = new THREE.Group(); armL.position.set(-.31, 1.03, 0); const armR = new THREE.Group(); armR.position.set(.31, 1.03, 0); body.add(armL, armR)
  part(armG, mat(shirt), 0, -.2, 0, armL); part(armG, mat(shirt), 0, -.2, 0, armR)
  if (carry) { // a tablet held out front
    const b = new THREE.Group(); b.position.set(0, 1.0, .4); b.rotation.set(-.5, .15, 0); body.add(b)
    const base = new THREE.Mesh(rbox(.54, .05, .4, .03), mat(Q.white)); base.castShadow = true; b.add(base)
    const scr = new THREE.Mesh(rbox(.46, .03, .32, .02), mat(Q.orange, { emissive: Q.orange, ei: .25, rough: .4 })); scr.position.y = .04; b.add(scr)
    armL.rotation.x = armR.rotation.x = -1.2
  }
  g.userData = { body, legL, legR, armL, armR, carry }; g.scale.setScalar(1.25); return g
}
function placePerson(parent, o, x, y, z, ry = 0) { const p = person(o); p.position.set(x, y, z); p.rotation.y = ry; parent.add(p); return p }
function pingpong(ctx, obj, { a, b, y = 0, speed = 1, phase = 0, walk = true }) {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, yaw = Math.atan2(b[0] - a[0], b[1] - a[1])
  ctx.updates.push((t) => {
    const k = (t * speed / len + phase) % 2, n = k < 1 ? k : 2 - k
    obj.position.set(a[0] + (b[0] - a[0]) * n, y, a[1] + (b[1] - a[1]) * n); obj.rotation.y = k < 1 ? yaw : yaw + Math.PI
    if (walk) { const u = obj.userData, d = Math.sin(t * speed * 5 + phase * 9); u.legL.rotation.x = d * .6; u.legR.rotation.x = -d * .6; if (!u.carry) { u.armL.rotation.x = -d * .5; u.armR.rotation.x = d * .5 } u.body.position.y = Math.abs(d) * .045 }
  })
}
function walker(ctx, parent, route, look) { const p = person(look); parent.add(p); pingpong(ctx, p, route); return p }

// ---------- props ----------
function conveyor(ctx, parent, { x, z, ry = 0, y = dS, len, speed = 2.1, crates = 4, phase = 0, width = 1.5, pick, cards, size = cards ? 1.05 : .8, endFade = .07 }) {
  const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = ry; parent.add(g)
  box(g, width + .4, .5 + y, len, Q.ink2, 0, -y, 0, { r: .08 })
  const bt = ctx.tex.belt.clone(); bt.needsUpdate = true; bt.wrapS = bt.wrapT = THREE.RepeatWrapping; bt.repeat.set(1, len / .7); ctx.disposables.push(bt)
  const belt = new THREE.Mesh(new THREE.PlaneGeometry(width, len), new THREE.MeshStandardMaterial({ map: bt, roughness: .9 }))
  belt.rotation.x = -Math.PI / 2; belt.position.y = .505; belt.receiveShadow = true; g.add(belt)
  const cr = []
  for (let i = 0; i < crates; i++) {
    let m
    if (cards) { // a flat content card: white plate + printed face
      m = new THREE.Group(); const plate = new THREE.Mesh(rbox(size * 1.25, .12, size, .04), mat(Q.white)); plate.castShadow = true; m.add(plate)
      const top = new THREE.Mesh(new THREE.PlaneGeometry(size * 1.15, size * .92), new THREE.MeshBasicMaterial({ map: cards[i % cards.length], toneMapped: false })); top.rotation.x = -Math.PI / 2; top.position.y = .065; m.add(top)
    } else { m = new THREE.Mesh(rbox(size, size, size, .1), pick(0, i)); m.castShadow = true }
    g.add(m); cr.push(m)
  }
  ctx.updates.push((t, dt) => {
    bt.offset.y -= dt * speed / .7
    cr.forEach((m, i) => {
      const r = (((t * speed / len + phase + i / crates) % 1) + 1) % 1, a = Math.min(1, r / .06, (1 - r) / endFade), s = a * a * (3 - 2 * a)
      m.scale.setScalar(Math.max(.001, s)); m.position.set(0, cards ? .5 + .09 * s : .5 + size / 2 * s, len / 2 - r * len); m.rotation.y = Math.sin(i * 2.1) * .12; if (!cards) m.material = pick(r, i)
    })
  })
  return g
}
function cardStack(parent, x, z, texture, n = 5) {
  const g = new THREE.Group(); g.position.set(x, dS, z); parent.add(g); box(g, 2.4, .2, 2, Q.stone, 0, 0, 0, { r: .05 })
  for (let i = 0; i < n; i++) { const m = box(g, 1.9, .16, 1.5, i % 2 ? Q.white : Q.soft, 0, .2 + i * .17, 0, { r: .04 }); m.rotation.y = (i - n / 2) * .08 }
  const top = new THREE.Mesh(new THREE.PlaneGeometry(1.75, 1.35), new THREE.MeshBasicMaterial({ map: texture, toneMapped: false })); top.rotation.x = -Math.PI / 2; top.rotation.z = (n - 1 - n / 2) * .08; top.position.y = .2 + n * .17 + .01; g.add(top)
  return g
}
function kiosk(ctx, parent, x, z, label, build, accent = Q.orange) {
  const a = new THREE.Group(); a.position.set(x, 0, z); parent.add(a)
  box(a, 3.2, 1.2, 3, Q.ink, 0, 0, 0, { r: .1 }); box(a, 3.3, .14, 3.1, accent, 0, 1.2, 0, { r: .04 })
  sign(a, [{ text: label, size: 96, weight: 700, color: hex(Q.soft), spacing: '6px', body: true }], 2.8, .5, 0, .62, 1.51, { tw: 1024, th: 183 })
  const o = new THREE.Group(); o.position.y = 1.4; a.add(o); build(o)
  ctx.updates.push((t) => { o.rotation.y = Math.sin(t * .8 + x) * .28; o.position.y = 1.4 + Math.sin(t * 1.6 + x) * .07 })
  return a
}
function plant(parent, x, z, s = 1) {
  const g = new THREE.Group(); g.position.set(x, dS, z); g.scale.setScalar(s); parent.add(g)
  cyl(g, .62, .46, .95, Q.white, 0, 0, 0, { seg: 16 })
  ;[[0, 1.7, 0, .78, Q.orange], [-.38, 1.35, .15, .55, Q.orangeL], [.4, 1.4, -.1, .52, Q.orange]].forEach(([x, y, z, r, c]) => ball(g, r, c, x, y, z)); return g
}
function boardOnStand(p, x, z, ry, texture, w = 1.55, h = .97) {
  const o = new THREE.Group(); o.position.set(x, dS, z); o.rotation.y = ry; p.add(o)
  box(o, 3.2, .2, 1.6, Q.wood, 0, 1.15, 0, { r: .05 }); for (const e of [-1, 1]) box(o, .2, 1.15, 1.4, Q.ink2, e * 1.4, 0, 0, { r: .04 })
  box(o, 1.7, 1.15, .12, Q.ink, 0, 1.35, -.25, { r: .05 }); picture(o, w, h, texture, 0, 1.94, -.185); return o
}

function hall(ctx, parent, { w, d, h, wall = Q.white, trim, floor, name, sub, nameColor }) {
  const f = new THREE.Group(); parent.add(f); const p = .6, m = dS
  box(f, w + 1.4, .5, d + 1.4, Q.ground2, 0, 0, 0, { r: .15 }); box(f, w, .2, d, floor, 0, .5, 0, { r: .06 })
  box(f, w - 2 * p, h, p, wall, 0, m, -d / 2 + p / 2, { r: .05 }); box(f, p, h, d, wall, -w / 2 + p / 2, m, 0, { r: .1 }); box(f, p, h, d, wall, w / 2 - p / 2, m, 0, { r: .1 })
  box(f, w + .5, .45, 1.1, trim, 0, m + h, -d / 2 + p / 2, { r: .1 }); box(f, 1.1, .45, d + .5, trim, -w / 2 + p / 2, m + h, 0, { r: .1 }); box(f, 1.1, .45, d + .5, trim, w / 2 - p / 2, m + h, 0, { r: .1 })
  for (const e of [-1, 1]) box(f, 1.1, h + .45, 1.1, trim, e * (w / 2 - .5), m, d / 2 - .5, { r: .14 })
  box(f, w - .4, .4, d * .26, trim, 0, m + h - .5, -d / 2 + d * .13, { r: .08 })
  const sw = Math.min(w * .64, 14), g = -d / 2 + p / 2, y0 = m + h + .45
  for (const e of [-1, 1]) box(f, .5, .9, .5, trim, e * (sw / 2 - 1.2), y0, g, { r: .08 })
  box(f, sw, 2.9, .5, Q.ink, 0, y0 + .7, g, { r: .14 })
  sign(f, [{ text: name, size: 150, weight: 800, color: nameColor, spacing: '4px' }, { text: sub, size: 50, weight: 500, color: '#E9E3D6', spacing: '7px', body: true }], sw - .9, 2.1, 0, y0 + .7 + 1.45, g + .27, { tw: 1536 })
  return f
}
function popIn(ctx, o, delay = 0) { ctx.pops.push({ obj: o, delay }) }

// ---------- stations ----------
const SX = [-37.5, -12.5, 12.5, 37.5], SZ = 12, SW = 20.5, SD = 15, SH = 7

function stationFound(ctx) {
  const t = new THREE.Group(); t.position.set(SX[0], 0, SZ); ctx.world.add(t); popIn(ctx, t, .9)
  hall(ctx, t, { w: SW, d: SD, h: SH, floor: Q.floorF, trim: Q.orange, name: 'GET FOUND', sub: 'SEO · DIGITAL MARKETING', nameColor: '#F5C877' })
  const fc = [ctx.tex.cards.serp, ctx.tex.cards.ad, ctx.tex.cards.report]
  ;[-5.4, 0, 5.4].forEach((x, i) => conveyor(ctx, t, { x, z: 4.9, len: 15, speed: 2 + i * .18, crates: 4, phase: i * .31, cards: [fc[i]], endFade: .08 }))
  box(t, 15.6, 2.6, 2.6, Q.orangeD, 0, dS, -4.7, { r: .12 }); box(t, 15.8, .3, 2.9, Q.orange, 0, dS + 2.6, -4.7, { r: .08 })
  ;[-5.4, 0, 5.4].forEach((x) => box(t, 2.1, 1.25, .12, Q.ink, x, dS + .5, -3.35, { r: .04, cast: false }))
  sign(t, [{ text: 'DEMAND LANDS HERE', size: 100, weight: 700, color: '#FBEEDD', spacing: '8px', body: true }], 8.4, .8, 0, dS + 1.95, -3.28, { tw: 1536, th: 146 })
  kiosk(ctx, t, -5.4, 14, 'SEARCH', (o) => { // magnifier
    const ring = new THREE.Mesh(new THREE.TorusGeometry(.7, .13, 10, 28), mat(Q.white)); ring.position.set(-.2, .9, 0); ring.castShadow = true; o.add(ring)
    const h = cyl(o, .12, .12, .9, Q.white, 0, 0, 0); h.position.set(.35, .35, 0); h.rotation.z = Math.PI / 4
    ball(o, .45, Q.orangeL, -.2, .9, -.05).scale.set(1, 1, .15)
  })
  kiosk(ctx, t, 0, 14, 'CAMPAIGNS', (o) => { // megaphone
    const c = new THREE.Mesh(new THREE.CylinderGeometry(.25, .8, 1.3, 20), mat(Q.white)); c.rotation.z = -Math.PI / 2; c.position.set(.2, .85, 0); c.castShadow = true; o.add(c)
    box(o, .5, .6, .5, Q.white, -.65, .55, 0, { r: .1 }); box(o, .3, .5, .3, Q.orange, -.8, .1, 0, { r: .05 })
    for (const s of [-1, 1]) { const w = new THREE.Mesh(new THREE.TorusGeometry(.5 + s * 0 + .15, .04, 6, 16, Math.PI / 2), mat(Q.orange)); w.position.set(1.05, .85, 0); w.rotation.z = -Math.PI / 4 + (s > 0 ? 0 : 0); o.add(w) }
  })
  kiosk(ctx, t, 5.4, 14, 'REPORTS', (o) => {
    box(o, 2.2, 1.9, .2, Q.white, 0, .15, 0, { r: .06 }); for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) box(o, .5, .26, .24, (r + c) % 2 ? Q.orangeL : Q.stone, -.62 + c * .62, .5 + r * .42, 0, { r: .02, cast: false })
    box(o, 2.2, .3, .24, Q.orange, 0, 1.9, 0, { r: .05 })
  })
  cardStack(t, -8.3, 6.4, ctx.tex.cards.serp); cardStack(t, 8.3, 6.4, ctx.tex.cards.report); cardStack(t, 8.3, -.6, ctx.tex.cards.ad, 3)
  walker(ctx, t, { a: [-2.7, 10], b: [-2.7, -2], y: dS, speed: 1.1 }, { shirt: Q.orange, carry: true })
  walker(ctx, t, { a: [2.7, 10], b: [2.7, -2], y: dS, speed: 1, phase: .3 }, { shirt: Q.white })
  if (!ctx.mobile) walker(ctx, t, { a: [-8.3, 2.6], b: [-8.3, -3], y: dS, speed: .9, phase: .6 }, { shirt: Q.grey })
}

function stationTrusted(ctx) {
  const t = new THREE.Group(); t.position.set(SX[1], 0, SZ); ctx.world.add(t); popIn(ctx, t, 1.1)
  hall(ctx, t, { w: SW, d: SD, h: SH, floor: Q.floorT, trim: Q.grey, name: 'GET TRUSTED', sub: 'SOCIAL · MEDIA PLACEMENT · PR', nameColor: '#F1ECE0' })
  const tc = [ctx.tex.cards.post, ctx.tex.cards.press, ctx.tex.cards.quote]
  ;[-6.6, 0, 6.6].forEach((x, i) => conveyor(ctx, t, { x, z: 4.9, len: 15, speed: 2.1 + i * .15, crates: 5, phase: i * .4, cards: [tc[i]], endFade: .06 }))
  box(t, 15.6, 2.4, 2.4, Q.greyD, 0, dS, -4.9, { r: .12 }); box(t, 15.8, .3, 2.7, Q.grey, 0, dS + 2.4, -4.9, { r: .08 })
  sign(t, [{ text: 'CHECKED · CREDIBLE · CONSISTENT', size: 88, weight: 700, color: '#EFEAE0', spacing: '6px', body: true }], 11, .75, 0, dS + 1.45, -3.65, { tw: 1536, th: 105 })
  // trust gate the crates pass through
  const arch = new THREE.Group(); arch.position.set(0, dS, 1.6); t.add(arch)
  for (const e of [-1, 1]) box(arch, .5, 3.4, .7, Q.greyD, e * 8.4, 0, 0, { r: .1 })
  box(arch, 17.3, .8, 1.0, Q.greyD, 0, 3.3, 0, { r: .12 }); box(arch, 17.3, .25, 1.05, Q.orange, 0, 3.0, 0, { r: .05 })
  kiosk(ctx, t, -6.6, 14, 'SOCIAL', (o) => {
    box(o, 1.0, 1.9, .16, Q.ink, 0, 0, 0, { r: .12 }); picture(o, .84, 1.7, ctx.tex.phone, 0, .95, .09)
    ;[[-.7, 1.7, .22], [.75, 1.2, .18]].forEach(([x, y, r]) => ball(o, r, Q.orange, x, y, .1))
  })
  kiosk(ctx, t, 0, 14, 'MEDIA', (o) => {
    for (let i = 0; i < 4; i++) box(o, 1.7 - i * .1, .22, 1.2, i % 2 ? Q.white : Q.stone, 0, i * .24, 0, { r: .03 }).rotation.y = i * .12
    box(o, 1.2, .06, .8, Q.orange, 0, .98, 0, { r: .02 })
  })
  kiosk(ctx, t, 6.6, 14, 'PR', (o) => {
    cyl(o, .5, .6, 1.2, Q.ink2, 0, 0, 0); ball(o, .3, Q.orange, 0, 1.5, 0); cyl(o, .05, .05, .8, Q.stone, 0, 1.2, 0)
  })
  cardStack(t, -8.6, 7, ctx.tex.cards.post); cardStack(t, 8.6, 7, ctx.tex.cards.press, 3)
  walker(ctx, t, { a: [-3.3, 10], b: [-3.3, -2], y: dS, speed: 1 }, { shirt: Q.grey, carry: true })
  walker(ctx, t, { a: [3.3, -2], b: [3.3, 10], y: dS, speed: 1.1, phase: .5 }, { shirt: Q.orange })
  if (!ctx.mobile) walker(ctx, t, { a: [-8.9, -3], b: [-8.9, 2.6], y: dS, speed: .8, phase: .2 }, { shirt: Q.white })
  plant(t, 9, -3.2, 1.1); plant(t, -9, -3.2, 1)
}

function stationChosen(ctx) {
  const t = new THREE.Group(); t.position.set(SX[2], 0, SZ); ctx.world.add(t); popIn(ctx, t, 1.3)
  hall(ctx, t, { w: SW, d: SD, h: SH, floor: Q.floorC, trim: Q.orangeD, name: 'GET CHOSEN', sub: 'WEBSITE · DATA SERVICES', nameColor: '#F5C877' })
  box(t, 15.4, 4.9, .25, Q.ink, 0, dS + 1.5, -6.9, { r: .08, cast: false }); picture(t, 14.8, 4.4, ctx.tex.charts[2], 0, dS + 3.75, -6.76)
  // podium of rising pixel columns
  const pod = new THREE.Group(); pod.position.set(0, dS, -.4); pod.scale.setScalar(1.25); t.add(pod)
  cyl(pod, .9, 1.2, 1, Q.ink2, 0, 0, 0, { seg: 24 }); cyl(pod, 3.4, 3.4, .28, Q.white, 0, 1, 0, { seg: 40 }); cyl(pod, 3.45, 3.45, .12, Q.orange, 0, 1, 0, { seg: 40, rough: .4 })
  const cols = [], glow = mat(Q.orange, { emissive: Q.orange, ei: .25, rough: .4 })
  for (let i = 0; i < 7; i++) cols.push(box(pod, .55, 1, .55, Q.orange, -1.95 + i * .65, 1.28, 0, { material: glow, r: .06 }))
  ctx.updates.push((time) => cols.forEach((c, i) => { const hh = .6 + (i + 1) * .28 + Math.sin(time * 1.3 + i * .9) * .18; c.scale.y = hh; c.position.y = 1.28 + hh / 2 }))
  const cube = box(pod, .7, .7, .7, Q.orangeD, 1.95, 3.6, 0, { r: .1 }); ctx.updates.push((time) => { cube.position.y = 1.28 + cols[6].scale.y + .55 + Math.sin(time * 2.4) * .1; cube.rotation.y = time * .8 })
  const looks = [{ shirt: Q.white }, { shirt: Q.orange }, { shirt: Q.grey }, { shirt: Q.orangeD }, { shirt: Q.white, pants: Q.ink2 }, { shirt: Q.stone }]
  const crowd = looks.map((l, n) => { const a = (80 + n * 40) * Math.PI / 180, x = Math.sin(a) * 6.4, z = -.8 + Math.cos(a) * 4.6; return placePerson(t, l, x, dS, z, Math.atan2(-x, -(z + .8))) })
  ctx.updates.push((time) => crowd.forEach((p, n) => { const u = p.userData; u.body.position.y = Math.abs(Math.sin(time * 1.2 + n)) * .03; u.armR.rotation.x = n === 1 ? -2.4 + Math.sin(time * 3) * .25 : 0; u.armL.rotation.x = n === 4 ? -1.3 + Math.sin(time * 2 + 1) * .2 : 0; u.body.rotation.y = Math.sin(time * .7 + n * 1.7) * .18 }))
  for (const s of [-1, 1]) { box(t, .14, 4, 6.6, Q.ink, s * 9.5, dS + 1.6, .4, { r: .05, cast: false }); picture(t, 6.2, 3.6, ctx.tex.charts[s < 0 ? 1 : 0], s * 9.42, dS + 3.6, .4, { ry: s < 0 ? Math.PI / 2 : -Math.PI / 2 }); plant(t, s * 8.6, 6.4, 1.2) }
  // sparkles
  const n = ctx.mobile ? 40 : 90, geo = new THREE.BufferGeometry(), pos = new Float32Array(n * 3)
  const ps = Array.from({ length: n }, (_, i) => ({ x: Math.sin(i * 12.9) * .5 * 19, z: Math.cos(i * 7.3) * 6.2 - .5, p: i * .618 % 1, s: .4 + i * .37 % 1 * .6 }))
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  const pts = new THREE.Points(geo, new THREE.PointsMaterial({ color: Q.orange, size: .34, transparent: true, opacity: .9, depthWrite: false })); pts.frustumCulled = false; pts.position.y = dS; t.add(pts)
  ctx.updates.push((time) => { ps.forEach((q, i) => { const r = (time * .12 * q.s + q.p) % 1; pos[i * 3] = q.x + Math.sin(time + i) * .3; pos[i * 3 + 1] = 1.2 + r * 6.2; pos[i * 3 + 2] = q.z }); geo.attributes.position.needsUpdate = true })
  const lt = new THREE.PointLight(0xF5C877, 55, 26, 1.8); lt.position.set(0, dS + 6.2, 0); t.add(lt)
  const screen = (o, texture) => { box(o, 2.5, 1.7, .18, Q.white, 0, .2, 0, { r: .06 }); box(o, 2.5, .28, .2, Q.orange, 0, 1.62, 0, { r: .05 }); picture(o, 2.2, 1.3, texture, 0, .85, .1) }
  kiosk(ctx, t, -5.4, 14, 'WEBSITE', (o) => screen(o, ctx.tex.charts[2]), Q.orangeD)
  kiosk(ctx, t, 5.4, 14, 'DATA', (o) => screen(o, ctx.tex.charts[0]), Q.orangeD)
}

function stationData(ctx) {
  const t = new THREE.Group(); t.position.set(SX[3], 0, SZ); ctx.world.add(t); popIn(ctx, t, 1.5)
  hall(ctx, t, { w: SW, d: SD, h: SH, wall: Q.ink2, floor: Q.floorD, trim: Q.orange, name: 'DATA SERVICES', sub: 'DASHBOARDS · CRM · WAREHOUSE', nameColor: '#F5C877' })
  picture(t, 9.6, 2.6, ctx.tex.charts[0], 0, dS + 5.35, -6.62, { basic: true }); box(t, 10, 3.0, .12, Q.ink, 0, dS + 3.85, -6.7, { r: .05, cast: false })
  for (let i = 0; i < 6; i++) { const x = -8 + i * 3.2; box(t, 2.2, 3.5, 1.5, Q.ink, x, dS, -5.4, { r: .1 }); picture(t, 1.9, 3.2, ctx.tex.racks, x, dS + 1.75, -4.64, { basic: true }) }
  // stacked database drums with spinning rings
  const db = new THREE.Group(); db.position.set(0, dS, 1.2); t.add(db)
  for (let i = 0; i < 3; i++) { cyl(db, 1.7, 1.7, 1.05, Q.stone, 0, i * 1.2, 0, { seg: 36, metal: .2, rough: .4 }); cyl(db, 1.74, 1.74, .22, Q.orange, 0, i * 1.2 + .42, 0, { seg: 36, rough: .35 }) }
  const rings = [0, 1].map((e) => { const r = new THREE.Mesh(new THREE.TorusGeometry(2.15, .1, 8, 40), mat(Q.orange, { emissive: Q.orange, ei: .35, rough: .35 })); r.rotation.x = Math.PI / 2; r.position.y = 1.0 + e * 1.4; r.castShadow = true; db.add(r); return r })
  ctx.updates.push((time) => rings.forEach((r, i) => r.rotation.z = time * (i ? -1.2 : 1.2)))
  conveyor(ctx, t, { x: -5.9, z: 2.2, ry: -Math.PI / 2, len: 7.6, speed: 2.2, crates: 3, phase: .1, cards: [ctx.tex.cards.report, ctx.tex.cards.lead], endFade: .05, y: dS })
  conveyor(ctx, t, { x: 5.9, z: 2.2, ry: Math.PI / 2, len: 7.6, speed: 2.2, crates: 3, phase: .5, cards: [ctx.tex.cards.lead, ctx.tex.cards.report], endFade: .05, y: dS })
  conveyor(ctx, t, { x: 0, z: 5.4, ry: 0, len: 4.6, speed: 2, crates: 2, phase: .2, cards: [ctx.tex.cards.report], endFade: .1, y: dS, width: 1.3 })
  boardOnStand(t, -8.2, -2.6, 0, ctx.tex.charts[1]); plant(t, 9, 6.6, 1.1)
  walker(ctx, t, { a: [-8.8, 5.6], b: [-3, 5.6], y: dS, speed: 1 }, { shirt: Q.orange, pants: Q.ink })
  if (!ctx.mobile) walker(ctx, t, { a: [8.8, -3.6], b: [2.6, -3.6], y: dS, speed: .9, phase: .4 }, { shirt: Q.stone, carry: true })
}

function hq(ctx) {
  const t = new THREE.Group(); ctx.world.add(t); popIn(ctx, t, 1.9)
  const tower = (x, z, w, h, accent, tiers = [], name) => {
    const g = new THREE.Group(); g.position.set(x, 0, z); t.add(g)
    box(g, w + 2.2, 1, w + 2.2, Q.ground2, 0, 0, 0, { r: .15 }); box(g, w + 1.2, 1.6, w + 1.2, accent, 0, 1, 0, { r: .18 })
    let y = 2.6; const add = (ww, hh) => { const wt = ctx.tex.windows.clone(); wt.needsUpdate = true; wt.wrapS = wt.wrapT = THREE.RepeatWrapping; wt.repeat.set(Math.max(1, Math.round(ww / 6)), Math.max(1, hh / 12)); ctx.disposables.push(wt)
      const m = new THREE.Mesh(new THREE.BoxGeometry(ww, hh, ww), new THREE.MeshStandardMaterial({ map: wt, roughness: .75 })); m.position.y = y + hh / 2; m.castShadow = m.receiveShadow = true; g.add(m); box(g, ww + .5, .45, ww + .5, accent, 0, y + hh, 0, { r: .1 }); y += hh + .45 }
    add(w, h); tiers.forEach(([ww, hh]) => add(ww, hh))
    return { g, top: y, w }
  }
  const main = tower(0, -31, 11, 17, Q.orange, [[7, 5], [4, 3]])
  // logo board on the main tower's front face
  const [c, x] = cv(1024, 360); x.fillStyle = '#FFFBEB'; rr(x, 0, 0, 1024, 360, 36); x.fill(); const board = new THREE.Mesh(new THREE.PlaneGeometry(9.6, 3.4), new THREE.MeshBasicMaterial({ map: tex(c), toneMapped: false })); board.position.set(0, 2.6 + 13.4, -31 + 5.56); t.add(board)
  ctx.logoBoard = { board, c, x }
  const cone = new THREE.Mesh(new THREE.TorusGeometry(2, .2, 10, 32), mat(Q.orange, { emissive: Q.orange, ei: .3, rough: .3, metal: .3 })); cone.rotation.x = Math.PI / 2; cone.position.set(0, main.top + 1.2, -31); cone.castShadow = true; t.add(cone)
  ctx.updates.push((time) => { cone.rotation.z = time * .5 })
  tower(-15.5, -31, 7.4, 11, Q.grey, [[5, 3]]); tower(-26.5, -31, 6.4, 7.5, Q.orangeD, []); tower(15, -31, 7, 12, Q.ink2, [[4.8, 3]]); tower(26, -31, 6.4, 8, Q.stone, [])
  return t
}

// ---------- ground, roads, trees, pixels ----------
const ROADS = [[-58.5, 32, 58.5, 32, 5], [-58.5, 32, -58.5, -8, 4], [58.5, 32, 58.5, -8, 4]]
const ZONES = [...SX.map((x) => [x - SW / 2 - 1.6, SZ - SD / 2 - 1.6, x + SW / 2 + 1.6, SZ + SD / 2 + 1.6]), [-34, -39, 34, -22]]
const hit = (x, z) => ZONES.some(([a, b, c, d]) => x > a && x < c && z > b && z < d) || (z > 27.6 && z < 36.4) || Math.abs(x) > 56
function rng(s) { return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 } }

function ground(ctx) {
  const g = new THREE.Group(); ctx.world.add(g)
  box(g, 124, 1.4, 96, Q.ground2, 0, -1.4, 0, { r: .5 }); box(g, 118, 3, 90, Q.ink, 0, -4.4, 0, { r: .6 })
  ctx.tex.grid.repeat.set(124 / 8, 12); ctx.tex.grid.wrapS = ctx.tex.grid.wrapT = THREE.RepeatWrapping
  const p = new THREE.Mesh(new THREE.PlaneGeometry(124, 96), new THREE.MeshStandardMaterial({ map: ctx.tex.grid, roughness: 1 })); p.rotation.x = -Math.PI / 2; p.position.y = .005; p.receiveShadow = true; g.add(p)
  ROADS.forEach(([x1, z1, x2, z2, w]) => { const len = Math.hypot(x2 - x1, z2 - z1); const r = box(g, w, .08, len, Q.road, (x1 + x2) / 2, .01, (z1 + z2) / 2, { r: .03, cast: false }); r.rotation.y = Math.atan2(x2 - x1, z2 - z1); const l = box(g, .18, .02, len - 3, Q.soft, (x1 + x2) / 2, .09, (z1 + z2) / 2, { r: .01, cast: false }); l.rotation.y = r.rotation.y })
  return g
}
function trees(ctx) {
  const g = new THREE.Group(); ctx.world.add(g); popIn(ctx, g, 2.2)
  const r = rng(7), step = ctx.mobile ? 6 : 4.6, list = []
  for (let x = -59; x < 60; x += step) for (let z = -45; z < 46; z += step) { const px = x + (r() - .5) * step * .9, pz = z + (r() - .5) * step * .9; if (r() < .6 && !hit(px, pz) && Math.abs(pz) < 44) list.push([px, pz, 1 + r() * .9, r()]) }
  const mk = (geo, color, yoff) => { const m = new THREE.InstancedMesh(geo, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .9 }), list.length), o = new THREE.Object3D(), c = new THREE.Color(); list.forEach(([x, z, s, k], i) => { o.position.set(x, yoff * s, z); o.scale.setScalar(s); o.updateMatrix(); m.setMatrixAt(i, o.matrix); c.set(color(k)); m.setColorAt(i, c) }); m.castShadow = m.receiveShadow = true; g.add(m) }
  const pick = (k) => (k < .5 ? Q.orange : k < .8 ? Q.orangeL : Q.stone)
  mk(new THREE.CylinderGeometry(.14, .2, 1, 6), () => Q.orangeD, .5)
  mk(new THREE.ConeGeometry(1, 1.7, 7), pick, 1.65); mk(new THREE.ConeGeometry(.78, 1.4, 7), pick, 2.55); mk(new THREE.ConeGeometry(.5, 1, 7), pick, 3.3)
}
function pixels(ctx) { // the brand's scattered squares, laid on the ground
  const g = new THREE.Group(); ctx.world.add(g); popIn(ctx, g, 2.4)
  const r = rng(21), n = ctx.mobile ? 70 : 150, list = []
  const cols = [[Q.orange, 36], [Q.grey, 18], [Q.ink, 14], [Q.soft, 22], [Q.stone, 10]]
  for (let i = 0; i < n; i++) { const x = (r() - .5) * 116, z = (r() - .5) * 88; if (hit(x, z) || Math.abs(x) > 57 || Math.abs(z) > 43) continue; let tt = r() * 100, c = cols[0][0]; for (const [cc, w] of cols) { if ((tt -= w) <= 0) { c = cc; break } } list.push([x, z, .5 + r() * r() * 1.5, c, r() * 1.5]) }
  const m = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .9 }), list.length), o = new THREE.Object3D(), c = new THREE.Color()
  list.forEach(([x, z, s, col, rot], i) => { o.position.set(x, .05, z); o.scale.set(s, .1, s); o.rotation.y = rot; o.updateMatrix(); m.setMatrixAt(i, o.matrix); c.set(col); m.setColorAt(i, c) }); m.receiveShadow = true; g.add(m)
}

export function buildWorld(world, { mobile = false, logo = null } = {}) {
  const tx = { grid: gridTex(), belt: beltTex(), windows: windowsTex(), charts: [chartTex(0), chartTex(1), chartTex(2)], racks: racksTex(), phone: phoneTex(), cards: Object.fromEntries(['serp', 'ad', 'report', 'post', 'press', 'quote', 'lead'].map((k) => [k, cardTex(k)])) }
  const ctx = { world, mobile, tex: tx, pops: [], updates: [], disposables: [tx.grid, tx.belt, tx.windows, ...tx.charts, tx.racks, tx.phone, ...Object.values(tx.cards)] }
  ground(ctx); stationFound(ctx); stationTrusted(ctx); stationChosen(ctx); stationData(ctx); hq(ctx); trees(ctx); pixels(ctx)
  if (logo && ctx.logoBoard) {
    const { board, c, x } = ctx.logoBoard, tl = new THREE.TextureLoader()
    tl.load(logo, (img) => { const im = img.image, s = Math.min(900 / im.width, 300 / im.height); x.drawImage(im, (1024 - im.width * s) / 2, (360 - im.height * s) / 2, im.width * s, im.height * s); board.material.map.needsUpdate = true; img.dispose() })
  }
  return ctx
}

// labels that float over each service's prop (world coords). st = station index (see STATIONS)
const PY = 4.4, PZ = SZ + 14
export const PINS = [
  { label: 'SEO', st: 1, p: [SX[0] - 5.4, PY, PZ] }, { label: 'Digital Marketing', st: 1, p: [SX[0], PY, PZ] }, { label: 'Reporting', st: 1, p: [SX[0] + 5.4, PY, PZ] },
  { label: 'Social Media', st: 2, p: [SX[1] - 6.6, PY, PZ] }, { label: 'Media Placement', st: 2, p: [SX[1], PY, PZ] }, { label: 'Public Relations', st: 2, p: [SX[1] + 6.6, PY, PZ] },
  { label: 'Website Development', st: 3, p: [SX[2] - 5.4, PY, PZ] }, { label: 'Data Services', st: 3, p: [SX[2] + 5.4, PY, PZ] },
]

// camera stations (named, ordered; section [data-cam] values index into this list)
export const STATIONS = [
  { name: 'overview', p: [44, 40, 72], l: [6, 5, 0] },
  { name: 'found', p: [-37.5, 25, 56], l: [-37.5, 3, 12] },
  { name: 'trusted', p: [-12.5, 25, 56], l: [-12.5, 3, 12] },
  { name: 'chosen', p: [12.5, 25, 56], l: [12.5, 3, 12] },
  { name: 'data', p: [37.5, 25, 56], l: [37.5, 3, 12] },
  { name: 'hq', p: [30, 34, 50], l: [6, 10, -30] },
]
