<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { Scene3D } from '../engine/Scene3D.js'
import { PINS } from '../engine/world.js'

const B = import.meta.env.BASE_URL
const canvas = ref(null), wash = ref(null), pinsEl = ref(null)
const stage = ref(-1)
const labels = [
  { c: '#EDA941', t: 'Get found' }, { c: '#848484', t: 'Get trusted' }, { c: '#9A591C', t: 'Get chosen' },
]
const show = ref(false), active = ref(0)

const st = { s: 0 }
let sc = null, marks = [], raf = 0, dead = false
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const smooth = (a, b, v) => { const r = clamp((v - a) / (b - a), 0, 1); return r * r * (3 - 2 * r) }

function measure() {
  marks = [...document.querySelectorAll('[data-cam]')].map((e) => { const r = e.getBoundingClientRect(); return { y: r.top + scrollY + r.height / 2, cam: parseFloat(e.dataset.cam) } }).sort((a, b) => a.y - b.y)
}
function update() {
  raf = 0; if (!marks.length) return
  const y = scrollY + innerHeight * .5; let cam = marks[0].cam, w = 0
  if (y >= marks[marks.length - 1].y) cam = marks[marks.length - 1].cam
  else if (y > marks[0].y) {
    let i = 0; while (i < marks.length - 2 && y >= marks[i + 1].y) i++
    const a = marks[i], b = marks[i + 1], k = smooth(.2, .8, (y - a.y) / Math.max(1, b.y - a.y))
    cam = a.cam + (b.cam - a.cam) * k; if (a.cam !== b.cam) w = Math.sin(k * Math.PI) ** 2 * .3
  }
  st.s = cam; if (wash.value) wash.value.style.opacity = w.toFixed(3); sc?.nudge()
}
const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
const onResize = () => { measure(); onScroll() }
let ro

onMounted(async () => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches, narrow = matchMedia('(max-width: 900px)').matches
  measure(); update(); addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onResize)
  ro = new ResizeObserver(onResize); ro.observe(document.body)
  if (document.fonts?.load) await Promise.race([Promise.allSettled([document.fonts.load('800 100px "Playfair Display"'), document.fonts.load('700 40px "Newsreader"')]), new Promise((r) => setTimeout(r, 1500))])
  if (dead) return; onResize()
  try {
    sc = new Scene3D(canvas.value, { reduced, narrow, getState: () => st, logo: B + 'mramu-logo.png', onStage: (n) => { stage.value = n; show.value = n >= 0 && n < 10; if (n >= 0 && n < 10) active.value = n } })
  } catch { document.documentElement.classList.add('no-webgl'); window.__sceneReady = true; window.dispatchEvent(new Event('scene:ready')); return }
  sc.setPins([...pinsEl.value.children].map((el, i) => ({ el, st: PINS[i].st, p: PINS[i].p })))
  try { await sc.start() } catch { canvas.value?.classList.add('is-ready'); window.__sceneReady = true }
})
onBeforeUnmount(() => { dead = true; removeEventListener('scroll', onScroll); removeEventListener('resize', onResize); ro?.disconnect(); cancelAnimationFrame(raf); sc?.dispose() })
</script>

<template>
  <canvas ref="canvas" class="scene" aria-hidden="true" />
  <div ref="pinsEl" class="pins" aria-hidden="true"><span v-for="p in PINS" :key="p.label" class="pin"><b>{{ p.label }}</b><i /></span></div>
  <div ref="wash" class="wash" aria-hidden="true" />
  <div class="railx" :class="{ on: show }" aria-hidden="true">
    <i v-for="(l, i) in labels" :key="l.t" :class="{ on: active === i }" :style="{ '--c': l.c }" />
    <span :style="{ color: '#9A591C' }">{{ labels[active].t }}</span>
  </div>
</template>

<style>
.scene { position: fixed; inset: 0; width: 100vw; height: 100vh; z-index: 0; opacity: 0; transition: opacity 1.1s ease; display: block; }
.scene.is-ready { opacity: 1; }
.wash { position: fixed; inset: 0; z-index: 1; pointer-events: none; background: var(--bg); opacity: 0; }
.no-webgl .scene { display: none; }
.no-webgl body { background: var(--bg) url('/pixel-corner.png') no-repeat right top / min(60vw, 700px); }
.pins { position: fixed; inset: 0; z-index: 1; pointer-events: none; overflow: hidden; }
.pin { position: absolute; left: 0; top: 0; opacity: 0; display: flex; flex-direction: column; align-items: center; will-change: transform, opacity; }
.pin b { font-family: var(--f-body); font-weight: 500; font-size: 12px; letter-spacing: .14em; text-transform: uppercase; background: var(--charcoal); color: var(--bg); padding: 7px 12px 6px; border-radius: 999px; white-space: nowrap; box-shadow: 0 6px 16px rgba(37, 37, 37, .22); }
.pin i { width: 2px; height: 14px; background: var(--charcoal); }
.pin i::after { content: ""; position: absolute; bottom: -3px; left: 50%; width: 9px; height: 9px; margin-left: -4.5px; background: var(--orange); border: 2px solid var(--charcoal); border-radius: 2px; transform: rotate(45deg); }
.pin { padding-bottom: 8px; }
@media (max-width: 600px) { .pin b { font-size: 10px; padding: 5px 9px 4px; letter-spacing: .1em; } .pin i { height: 10px; } }
.railx { position: fixed; right: clamp(14px, 2.4vw, 34px); top: 50%; transform: translateY(-50%); z-index: 5; display: flex; flex-direction: column; align-items: center; gap: 10px; opacity: 0; transition: opacity .5s; pointer-events: none; }
.railx.on { opacity: 1; }
.railx i { width: 10px; height: 10px; border-radius: 2px; background: var(--c); opacity: .35; transition: opacity .3s, transform .3s; }
.railx i.on { opacity: 1; transform: scale(1.35); }
.railx span { writing-mode: vertical-rl; font-size: 11px; letter-spacing: .26em; text-transform: uppercase; margin-top: 8px; }
@media (max-width: 900px) { .railx { display: none; } }
</style>
