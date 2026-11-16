// Scroll-driven camera over the MRAMU diorama. One fixed canvas; sections declare data-cam
// and the camera flies a Catmull-Rom path through the named stations.
import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { buildWorld, Q, STATIONS } from './world.js'

const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const easeOut = (t) => 1 - Math.pow(1 - t, 3)
const SUN = new THREE.Vector3(-30, 52, 34)

export class Scene3D {
  constructor(canvas, { reduced = false, narrow = false, getState, onStage, logo } = {}) {
    this.canvas = canvas; this.reduced = reduced; this.narrow = narrow; this.getState = getState; this.onStage = onStage
    this.stage = -1; this.s = getState ? getState().s : 0; this.introK = 0; this.t = reduced ? 4 : 0; this.last = 0; this.raf = 0
    this.dead = false; this.frameNo = 0; this.tweens = []; this.pointer = { x: 0, y: 0, sx: 0, sy: 0 }; this.debugS = null

    const r = this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, narrow ? 1.5 : 2))
    r.shadowMap.enabled = true; r.shadowMap.autoUpdate = false; r.shadowMap.type = THREE.PCFShadowMap
    r.toneMapping = THREE.NeutralToneMapping; r.toneMappingExposure = 1

    const sc = this.scene = new THREE.Scene()
    sc.background = new THREE.Color(Q.bg); sc.fog = new THREE.Fog(Q.bg, 150, 360)
    const pm = new THREE.PMREMGenerator(r); this.envTex = pm.fromScene(new RoomEnvironment(), 0.04).texture; sc.environment = this.envTex; sc.environmentIntensity = 0.42; pm.dispose()
    sc.add(new THREE.HemisphereLight(0xffffff, 0xE9DDBE, 0.75))
    const sun = this.sun = new THREE.DirectionalLight(0xFFF2D6, 2.5); sun.castShadow = true
    const ms = narrow ? 1024 : 2048; sun.shadow.mapSize.set(ms, ms); Object.assign(sun.shadow.camera, { near: 1, far: 220 })
    sun.shadow.bias = -4e-4; sun.shadow.normalBias = 0.05; sun.shadow.radius = 3; sc.add(sun, sun.target)

    this.camera = new THREE.PerspectiveCamera(34, 1, 0.5, 600)
    this.world = new THREE.Group(); sc.add(this.world)
    this.ctx = buildWorld(this.world, { mobile: narrow, logo })
    this.P = new THREE.Vector3(); this.L = new THREE.Vector3(); this.curveK = 0; this.buildCurves(1)

    this.onResize = () => this.resize(); window.addEventListener('resize', this.onResize)
    this.onPointer = (e) => { this.pointer.x = (e.clientX / innerWidth - .5) * 2; this.pointer.y = (e.clientY / innerHeight - .5) * 2 }
    if (!narrow) window.addEventListener('pointermove', this.onPointer, { passive: true })
    this.onVis = () => { if (!document.hidden) this.last = 0 }; document.addEventListener('visibilitychange', this.onVis)
    if (location.search.includes('debug')) window.__scene = this
    this.resize()
  }

  buildCurves(k) {
    const pts = STATIONS.map((st) => { const l = new THREE.Vector3(...st.l), p = new THREE.Vector3(...st.p); return { l, p: l.clone().add(p.sub(l).multiplyScalar(k)) } })
    this.posCurve = new THREE.CatmullRomCurve3(pts.map((q) => q.p), false, 'centripetal'); this.lookCurve = new THREE.CatmullRomCurve3(pts.map((q) => q.l), false, 'centripetal'); this.curveK = k
  }
  tween(obj, key, to, dur, delay = 0) { this.tweens.push({ obj, key, from: obj[key], to, dur, delay, t: 0 }) }
  pop() {
    this.ctx.pops.forEach(({ obj, delay }) => { obj.position.y = -52; this.tween(obj.position, 'y', 0, 1.6, .15 + delay * .8) })
    this.introK = 1; this.tween(this, 'introK', 0, 3.4, .1)
  }
  finishIntro() { this.tweens.length = 0; this.introK = 0; this.ctx.pops.forEach(({ obj }) => { obj.position.y = 0 }) }

  resize() {
    const w = innerWidth, h = innerHeight; this.renderer.setSize(w, h, false)
    const a = w / h, small = w <= 900, tall = a < 1
    this.camera.aspect = a; this.camera.fov = tall ? 50 : small ? 40 : 34
    const k = tall ? 1.5 : small ? 1.25 : a < 1.5 ? 1.18 : 1
    if (Math.abs(k - this.curveK) > .001) this.buildCurves(k)
    // desktop: scene sits right of the copy; mobile: scene sits lower
    if (small) this.camera.setViewOffset(w, h, 0, -h * .2, w, h); else this.camera.setViewOffset(w, h, -w * .24, 0, w, h)
    this.camera.updateProjectionMatrix(); if (this.reduced) this.frame(0)
  }

  async start() {
    try { await Promise.race([this.renderer.compileAsync(this.scene, this.camera), new Promise((r) => setTimeout(r, 2500))]) } catch { /* ignore */ }
    this.ctx.disposables.forEach((t) => { try { this.renderer.initTexture(t) } catch { /* ignore */ } })
    if (this.dead) return
    const s0 = this.getState().s; this.s = s0
    if (!this.reduced && s0 < .6 && scrollY < innerHeight * .6) this.pop()
    this.frame(0); this.canvas.classList.add('is-ready'); window.__sceneReady = true; window.dispatchEvent(new Event('scene:ready'))
    if (this.reduced) return
    const loop = (now) => {
      if (this.dead) return; this.raf = requestAnimationFrame(loop); if (document.hidden) return
      const dt = this.last ? Math.min(.05, (now - this.last) / 1000) : .016; this.last = now; this.frame(dt)
    }
    this.raf = requestAnimationFrame(loop)
  }
  setPins(list) { this.pins = list.map((o) => ({ el: o.el, st: o.st, pos: new THREE.Vector3(...o.p), on: false })); this.pv = new THREE.Vector3() }
  nudge() { if (this.reduced && !this.raf) this.raf = requestAnimationFrame(() => { this.raf = 0; this.frame(0) }) }

  frame(dt) {
    const target = this.debugS ?? this.getState().s
    this.s = this.reduced ? target : this.s + (target - this.s) * (1 - Math.exp(-dt * 4.2))
    this.t += dt
    for (let i = this.tweens.length - 1; i >= 0; i--) { const w = this.tweens[i]; w.t += dt; const k = clamp((w.t - w.delay) / w.dur, 0, 1); w.obj[w.key] = w.from + (w.to - w.from) * easeOut(k); if (k >= 1) this.tweens.splice(i, 1) }
    this.ctx.updates.forEach((u) => u(this.t, dt))

    const stage = this.s < .6 ? -1 : this.s > 3.5 ? 10 : clamp(Math.round(this.s) - 1, 0, 2)
    if (stage !== this.stage) { this.stage = stage; this.onStage?.(stage) }

    const r = clamp(this.s / (STATIONS.length - 1), 0, 1)
    this.posCurve.getPoint(r, this.P); this.lookCurve.getPoint(r, this.L)
    if (this.introK > .001) { const k = this.introK; this.P.x += 40 * k; this.P.y += 70 * k; this.P.z += 90 * k }
    const p = this.pointer; p.sx += (p.x - p.sx) * .05; p.sy += (p.y - p.sy) * .05
    const c = this.camera; c.position.copy(this.P); c.lookAt(this.L); c.translateX(p.sx * 1.2); c.translateY(-p.sy * .7); c.lookAt(this.L)

    if (this.frameNo++ % (this.narrow ? 3 : 2) === 0) {
      const e = clamp(this.P.distanceTo(this.L) * .62, 30, 66), sc = this.sun.shadow.camera
      if (Math.abs(sc.right - e) > .5) { sc.left = -e; sc.right = e; sc.top = e; sc.bottom = -e; sc.updateProjectionMatrix() }
      this.sun.target.position.set(this.L.x, 0, this.L.z); this.sun.position.copy(this.sun.target.position).add(SUN); this.sun.target.updateMatrixWorld()
      this.renderer.shadowMap.needsUpdate = true
    }
    this.renderer.render(this.scene, c)
    if (this.pins) this.updatePins()
  }

  updatePins() {
    const w = this.canvas.clientWidth, h = this.canvas.clientHeight, c = this.camera, v = this.pv; c.updateMatrixWorld()
    for (const p of this.pins) {
      const a = this.introK > .05 ? 0 : clamp(1.15 - Math.abs(this.s - p.st) * 2.2, 0, 1)
      if (a < .02) { if (p.on) { p.el.style.opacity = 0; p.on = false } continue }
      v.copy(p.pos).project(c)
      p.el.style.opacity = a.toFixed(2); p.on = true
      p.el.style.transform = `translate3d(${((v.x + 1) / 2 * w).toFixed(1)}px, ${((1 - v.y) / 2 * h).toFixed(1)}px, 0) translate(-50%, -100%)`
    }
  }

  dispose() {
    this.dead = true; cancelAnimationFrame(this.raf); removeEventListener('resize', this.onResize); removeEventListener('pointermove', this.onPointer); document.removeEventListener('visibilitychange', this.onVis)
    this.scene.traverse((o) => { o.geometry && o.geometry.dispose() }); this.ctx.disposables.forEach((t) => t.dispose()); this.envTex.dispose(); this.renderer.dispose()
  }
}
