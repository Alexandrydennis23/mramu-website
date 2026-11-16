<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import SceneCanvas from './components/SceneCanvas.vue'

const B = import.meta.env.BASE_URL
const WA = 'https://wa.me/6285111327919?text=Hi%20MRAMU%2C%20I%27d%20like%20to%20discuss%20a%20project.'
const EMAIL = '' // add the public email here to show the email button (hidden by Cloudflare on the old site)

const links = [['Services', '#services'], ['About', '#about'], ['Process', '#process'], ['Insights', '#insights'], ['Contact', '#contact']]
const menu = ref(false), scrolled = ref(false)
const onScroll = () => { scrolled.value = scrollY > 12 }

const stats = [['5+', 'Years of experience'], ['100+', 'Customers'], ['600+', 'Projects completed']]

const workflow = ['Positioning that reflects market reality', 'Campaign systems built for clearer attribution', 'Content operations that scale consistency', 'Reporting focused on decision usefulness']

// real service copy from mramu.com
const found = [
  ['SEO Services', 'Search visibility built around technical health, commercial content, and better-fit organic demand.'],
  ['Digital Marketing', 'Performance campaigns planned around pipeline growth, clearer attribution, and controllable spend.'],
]
const trusted = [
  ['Social Media Management', 'Content systems that keep your brand visible, credible, and consistent across the platforms that matter.'],
  ['Media Placement', 'Coverage planning that extends reach while adding the outside validation your message needs.'],
  ['Public Relations', 'Narrative support that helps your business communicate with more clarity, control, and authority.'],
]
const chosen = [
  ['Website Development', 'Web experiences designed to support campaigns, reinforce credibility, and reduce conversion friction.'],
  ['Data Services', 'Dashboards, customer analytics, and data foundations built around your business, so decisions rest on numbers your team trusts.'],
]
const pillars = [
  ['Cross-channel thinking', 'We plan with the full customer journey in mind so no single channel has to carry the entire growth burden alone.'],
  ['Execution discipline', 'From briefs to rollout, we keep message clarity and delivery quality stable while campaigns move at speed.'],
  ['Commercial awareness', 'We optimize toward decisions that improve trust, demand quality, and conversion momentum, not just platform metrics.'],
]
const articles = [
  { tag: 'Digital Marketing', t: 'Tren Digital Marketing 2026: Mana yang Layak Dicoba?', u: 'https://www.mramu.com/news/tren-digital-marketing-2026-mana-yang-layak-dicoba' },
  { tag: 'Website', t: 'Perbedaan Landing Page dan Website: Jangan Salah Pilih!', u: 'https://www.mramu.com/news/perbedaan-landing-page-dan-website-jangan-salah-pilih' },
  { tag: 'Website', t: 'Harga Jasa Pembuatan Website 2026: Cek Biaya Aslinya', u: 'https://www.mramu.com/news/harga-jasa-pembuatan-website-2026-cek-biaya-aslinya' },
]
const faqs = [
  ['What is MRAMU Digital Agency?', 'MRAMU is a digital agency that helps brands grow through visibility, strategy, campaigns, websites and brand communications.'],
  ['What services can MRAMU Digital Agency support?', 'SEO, digital marketing, social media management, website development, media placement, public relations and data services. Each one is tied to visibility, trust and conversions.'],
  ['When is it better to work with an agency instead of building in-house?', 'When you need specialist execution, faster campaigns, or cross-channel support without building a full internal team for each discipline.'],
  ['What should we prepare before starting a project with MRAMU?', 'Clear business goals, current challenges, your target audience, existing assets, and the channels already affecting performance.'],
  ['How does MRAMU structure engagements and pricing?', 'It depends on the scope of work, delivery needs, and the level of strategic support, whether that is a focused campaign, an ongoing retainer, or a defined project.'],
]
const open = ref(0)

let io
onMounted(() => {
  addEventListener('scroll', onScroll, { passive: true }); onScroll()
  io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: 0.1, rootMargin: '0px 0px -6% 0px' })
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el))
})
onBeforeUnmount(() => { removeEventListener('scroll', onScroll); io?.disconnect() })
</script>

<template>
  <a class="skip" href="#main">Skip to content</a>
  <SceneCanvas />
  <div class="veil" aria-hidden="true" />

  <header class="nav" :class="{ solid: scrolled || menu }">
    <div class="wrap nav__in">
      <a href="#top" class="nav__logo" aria-label="MRAMU home"><img :src="B + 'mramu-logo.png'" alt="MRAMU" width="125" height="36" /></a>
      <nav class="nav__links" :class="{ open: menu }" aria-label="Primary">
        <a v-for="l in links" :key="l[0]" :href="l[1]" @click="menu = false">{{ l[0] }}</a>
        <a class="btn btn--solid nav__cta-m" :href="WA" @click="menu = false">Get in touch <span class="arrow">→</span></a>
      </nav>
      <a class="btn btn--solid nav__cta" :href="WA" target="_blank" rel="noopener">Get in touch <span class="arrow">→</span></a>
      <button class="nav__burger" :aria-expanded="menu" aria-label="Menu" @click="menu = !menu"><span /><span /></button>
    </div>
  </header>

  <main id="main">
    <!-- HERO -->
    <section id="top" class="hero" data-cam="0">
      <div class="wrap">
        <div class="hero__copy">
          <p class="eyebrow reveal">MRAMU Digital Agency · Jakarta</p>
          <h1 class="h-edit hero__h reveal" style="--d:.08s">Grow your business to the <em>next level</em></h1>
          <p class="hero__p reveal" style="--d:.16s">Starting a business can be daunting, but you can make it easier with us. We help brands build stronger visibility, clearer positioning, and more dependable conversion paths.</p>
          <div class="hero__cta reveal" style="--d:.24s">
            <a class="btn btn--solid" href="#services">View Services <span class="arrow">→</span></a>
            <a class="btn btn--line" :href="WA" target="_blank" rel="noopener">Get a free quote</a>
          </div>
        </div>
      </div>
    </section>

    <!-- STATS -->
    <section class="stats" data-cam="0" aria-label="MRAMU in numbers">
      <div class="wrap stats__in glass">
        <div v-for="(s, i) in stats" :key="s[1]" class="stat reveal" :style="`--d:${i * .08}s`"><b class="h-display">{{ s[0] }}</b><span>{{ s[1] }}</span></div>
      </div>
    </section>

    <!-- ABOUT -->
    <section id="about" class="stage" data-cam="0">
      <div class="wrap">
        <div class="panel glass reveal">
          <p class="eyebrow">About MRAMU</p>
          <h2 class="h-edit big">We connect strategy, creative execution, and <em>channel performance</em></h2>
          <p>We help brands build stronger visibility, clearer positioning, and more dependable conversion paths across search, campaigns, content, websites, and reputation work.</p>
          <p>Instead of treating each channel like a separate project, we align message, media, and digital experience so your market sees one coherent brand with a stronger reason to trust and act.</p>
          <ul class="ticks"><li v-for="w in workflow" :key="w">{{ w }}</li></ul>
        </div>
      </div>
    </section>

    <!-- SERVICES: three stations -->
    <section id="services" class="stage stage--intro" data-cam="0">
      <div class="wrap">
        <div class="panel glass reveal">
          <p class="eyebrow">Our services</p>
          <h2 class="h-edit big">Services that strengthen growth from <em>multiple angles</em></h2>
          <p>From search visibility and paid acquisition to reputation and website performance, each service is designed to help brands <b>get found</b>, <b>get trusted</b>, and <b>get chosen</b>.</p>
          <p class="hint">Scroll to follow the work through each station →</p>
        </div>
      </div>
    </section>

    <section class="stage" data-cam="1">
      <div class="wrap"><div class="panel glass reveal">
        <p class="eyebrow">01 · Get found</p>
        <h2 class="h-edit big">Get <em>found.</em></h2>
        <ul class="svc"><li v-for="s in found" :key="s[0]"><h3>{{ s[0] }}</h3><p>{{ s[1] }}</p></li></ul>
      </div></div>
    </section>
    <section class="stage" data-cam="2">
      <div class="wrap"><div class="panel glass reveal">
        <p class="eyebrow">02 · Get trusted</p>
        <h2 class="h-edit big">Get <em>trusted.</em></h2>
        <ul class="svc"><li v-for="s in trusted" :key="s[0]"><h3>{{ s[0] }}</h3><p>{{ s[1] }}</p></li></ul>
      </div></div>
    </section>
    <section class="stage" data-cam="3">
      <div class="wrap"><div class="panel glass reveal">
        <p class="eyebrow">03 · Get chosen</p>
        <h2 class="h-edit big">Get <em>chosen.</em></h2>
        <ul class="svc"><li v-for="s in chosen" :key="s[0]"><h3>{{ s[0] }}</h3><p>{{ s[1] }}</p></li></ul>
      </div></div>
    </section>

    <!-- WHY + PROCESS -->
    <section id="process" class="stage stage--tall" data-cam="5">
      <div class="wrap"><div class="panel glass reveal">
        <p class="eyebrow">Why choose us</p>
        <ul class="svc"><li v-for="p in pillars" :key="p[0]"><h3>{{ p[0] }}</h3><p>{{ p[1] }}</p></li></ul>
      </div>
      <div class="panel glass reveal">
        <p class="eyebrow">Our process</p>
        <h2 class="h-edit big">Simple, powerful &amp; <em>efficient</em></h2>
        <p>We follow the best yet official and simple working process to maximize your business growth. We'll cover everything from strategy, marketing and growth.</p>
        <a class="btn btn--solid" :href="WA" target="_blank" rel="noopener">Get Started <span class="arrow">→</span></a>
      </div></div>
    </section>

    <div class="solid">
      <!-- QUOTE BANNER -->
      <section class="marq" aria-label="Free quote">
        <div class="marq__t"><span v-for="n in 6" :key="n">Got a project idea? Use our free quote now! <i /></span></div>
      </section>

      <!-- INSIGHTS -->
      <section id="insights" class="sec">
        <div class="wrap">
          <div class="head">
            <div><p class="eyebrow reveal">Insights &amp; News</p><h2 class="h-edit big reveal" style="--d:.06s">Latest from <em>MRAMU</em></h2></div>
            <a class="btn btn--line reveal" href="https://www.mramu.com/news" style="--d:.12s">View all articles <span class="arrow">→</span></a>
          </div>
          <div class="posts">
            <a v-for="(a, i) in articles" :key="a.u" :href="a.u" class="post reveal" :style="`--d:${i * .08}s`">
              <div class="post__px" aria-hidden="true"><i v-for="k in 18" :key="k" /></div>
              <span class="post__tag">{{ a.tag }}</span><h3>{{ a.t }}</h3><span class="arrow">→</span>
            </a>
          </div>
        </div>
      </section>

      <!-- FAQ -->
      <section class="sec faq">
        <div class="wrap faq__in">
          <div><p class="eyebrow reveal">FAQ</p><h2 class="h-edit big reveal" style="--d:.06s">Frequently asked <em>questions</em></h2></div>
          <div class="acc reveal" style="--d:.1s">
            <div v-for="(f, i) in faqs" :key="f[0]" class="acc__i" :class="{ on: open === i }">
              <button :id="'q' + i" :aria-expanded="open === i" :aria-controls="'a' + i" @click="open = open === i ? -1 : i"><span>{{ f[0] }}</span><i aria-hidden="true" /></button>
              <div :id="'a' + i" role="region" :aria-labelledby="'q' + i" class="acc__a"><p>{{ f[1] }}</p></div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section id="contact" class="cta on-dark">
        <img class="cta__px" :src="B + 'pixel-corner.png'" alt="" aria-hidden="true" />
        <div class="wrap cta__in">
          <h2 class="h-edit big reveal">Contact us today to get a free <em>consultation!</em></h2>
          <div class="cta__r reveal" style="--d:.1s">
            <p>Send us a message to get answers to any of your questions &amp; we'll get back to you within 24-48 hours or as soon as possible.</p>
            <div class="cta__b">
              <a class="btn btn--solid" :href="WA" target="_blank" rel="noopener">Chat on WhatsApp <span class="arrow">→</span></a>
              <a v-if="EMAIL" class="btn btn--line" :href="'mailto:' + EMAIL">Send an Email <span class="arrow">→</span></a>
            </div>
          </div>
        </div>
      </section>

      <footer class="foot">
        <div class="wrap foot__in">
          <div class="foot__brand">
            <img :src="B + 'mramu-logo.png'" alt="MRAMU" width="125" height="36" />
            <address>Wisma MRA, Jl. TB Simatupang No. 19<br />Jakarta 12430, Indonesia<br /><a :href="WA" target="_blank" rel="noopener">+62 851-1132-7919</a></address>
          </div>
          <nav class="foot__col" aria-label="Services"><b>Services</b><a href="#services">SEO</a><a href="#services">Digital Marketing</a><a href="#services">Social Media Management</a><a href="#services">Website Development</a><a href="#services">Media Placement</a><a href="#services">Public Relations</a><a href="#services">Data Services</a></nav>
          <nav class="foot__col" aria-label="Company"><b>Company</b><a href="#about">About</a><a href="#process">Process</a><a href="#insights">Insights</a><a href="#contact">Contact</a></nav>
        </div>
        <div class="wrap"><div class="foot__legal">
          <span>© 2026 MRAMU. All rights reserved.</span>
          <span><a href="#">Privacy Policy</a><a href="#">Terms &amp; Conditions</a><a href="#">Disclaimer</a><a href="#">Cookie Policy</a></span>
        </div></div>
      </footer>
    </div>
  </main>
</template>

<style>
.skip { position: absolute; left: -999px; top: 8px; background: var(--charcoal); color: var(--bg); padding: 10px 16px; border-radius: 8px; z-index: 100; }
.skip:focus { left: 8px; }
main { position: relative; z-index: 2; }
.veil { position: fixed; inset: 0; z-index: 1; pointer-events: none; background: linear-gradient(90deg, rgba(255,251,235,.92) 0%, rgba(255,251,235,.7) 30%, rgba(255,251,235,0) 58%); }
.glass { background: rgba(255, 251, 235, .8); backdrop-filter: blur(14px) saturate(1.1); -webkit-backdrop-filter: blur(14px) saturate(1.1); border: 1px solid var(--line); border-radius: 22px; }

/* nav */
.nav { position: fixed; inset: 0 0 auto 0; z-index: 50; transition: background .3s, box-shadow .3s; }
.nav.solid { background: rgba(255, 251, 235, .92); backdrop-filter: blur(10px); box-shadow: 0 1px 0 var(--line); }
.nav__in { display: flex; align-items: center; gap: 24px; height: 76px; }
.nav__logo img { height: 36px; width: auto; }
.nav__links { display: flex; gap: 30px; margin-left: auto; font-size: 16px; }
.nav__links a:not(.btn) { position: relative; padding: 6px 0; }
.nav__links a:not(.btn)::after { content: ""; position: absolute; left: 0; bottom: 0; height: 1.5px; width: 100%; background: var(--orange); transform: scaleX(0); transform-origin: left; transition: transform .35s var(--ease); }
.nav__links a:not(.btn):hover::after { transform: scaleX(1); }
.nav__cta-m { display: none; }
.nav__burger { display: none; margin-left: auto; width: 44px; height: 44px; background: none; border: 0; cursor: pointer; position: relative; }
.nav__burger span { position: absolute; left: 10px; right: 10px; height: 1.5px; background: var(--charcoal); transition: transform .3s var(--ease), top .3s var(--ease); }
.nav__burger span:nth-child(1) { top: 18px; } .nav__burger span:nth-child(2) { top: 26px; }
.nav__burger[aria-expanded="true"] span:nth-child(1) { top: 22px; transform: rotate(45deg); }
.nav__burger[aria-expanded="true"] span:nth-child(2) { top: 22px; transform: rotate(-45deg); }

/* hero + stage panels (text sits left, the scene flies on the right) */
.hero { min-height: 100svh; display: flex; align-items: center; padding: 96px 0 40px; }
.hero__copy { max-width: min(600px, 52vw); }
.hero__h { font-size: clamp(50px, 6.6vw, 104px); }
.hero__p { max-width: 28em; font-size: clamp(18px, 1.5vw, 21px); margin: 26px 0 32px; color: #3d3d3d; }
.hero__cta { display: flex; flex-wrap: wrap; gap: 12px; }
.stats { padding: 0 0 8vh; }
.stats__in { display: grid; grid-template-columns: repeat(3, 1fr); max-width: 620px; margin-left: var(--pad); margin-right: auto; padding: 8px clamp(14px, 2vw, 26px); }
.stat { padding: 16px 0; display: flex; flex-direction: column; }
.stat + .stat { border-left: 1px solid var(--line); padding-left: clamp(12px, 2vw, 24px); }
.stat b { font-size: clamp(32px, 3.6vw, 48px); line-height: 1; }
.stat span { font-size: 14px; color: #555; letter-spacing: .03em; margin-top: 4px; }
.stats .wrap { padding-left: 0; padding-right: 0; }

.stage { min-height: 100svh; display: flex; align-items: center; padding: 14vh 0; }
.stage--intro { min-height: 80svh; }
.stage--tall { flex-direction: column; justify-content: center; gap: 0; }
.stage--tall .wrap { display: grid; gap: 28px; }
.panel { max-width: 540px; padding: clamp(22px, 3vw, 40px); }
.panel > p { margin: 0 0 16px; }
.panel .eyebrow { margin-bottom: 14px; }
.panel .btn { margin-top: 8px; }
.big { font-size: clamp(34px, 4.6vw, 62px); margin-bottom: 20px; }
.hint { font-size: 14px; color: var(--amber); letter-spacing: .06em; }
.ticks { list-style: none; margin: 8px 0 0; padding: 0; display: grid; gap: 8px; }
.ticks li { position: relative; padding-left: 24px; font-size: 17px; }
.ticks li::before { content: ""; position: absolute; left: 0; top: .5em; width: 10px; height: 10px; background: var(--orange); border-radius: 2px; }
.svc { list-style: none; margin: 0 0 8px; padding: 0; }
.svc li { padding: 16px 0; border-top: 1px solid var(--line); }
.svc li:last-child { border-bottom: 1px solid var(--line); margin-bottom: 8px; }
.svc h3 { font-family: var(--f-display); font-weight: 800; font-size: clamp(20px, 1.8vw, 24px); margin: 0 0 4px; letter-spacing: -.01em; }
.svc p { margin: 0; color: #555; font-size: 17px; }
.panel .svc:last-child { margin-bottom: 0; }

/* opaque tail */
.solid { background: var(--bg); position: relative; }
.marq { background: var(--orange); color: var(--charcoal); overflow: hidden; padding: 22px 0; }
.marq__t { display: flex; gap: 40px; width: max-content; animation: marq 40s linear infinite; font-family: var(--f-edit); font-size: clamp(30px, 4vw, 56px); letter-spacing: -.01em; white-space: nowrap; }
.marq__t span { display: inline-flex; align-items: center; gap: 40px; }
.marq__t i { width: 18px; height: 18px; background: var(--charcoal); display: inline-block; }
@keyframes marq { to { transform: translateX(-50%); } }
.head { display: flex; justify-content: space-between; align-items: flex-end; gap: 32px; margin-bottom: clamp(36px, 5vw, 64px); flex-wrap: wrap; }
.head .big { margin-bottom: 0; }
.posts { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.post { display: flex; flex-direction: column; gap: 12px; background: #fff; border: 1px solid var(--line); border-radius: 18px; padding: 22px; min-height: 340px; transition: transform .4s var(--ease), box-shadow .4s; }
.post:hover { transform: translateY(-4px); box-shadow: 0 18px 40px rgba(37, 37, 37, .08); }
.post__px { height: 130px; border-radius: 12px; background: var(--soft); display: grid; grid-template-columns: repeat(6, 1fr); grid-template-rows: repeat(3, 1fr); gap: 5px; padding: 10px; }
.post__px i { border-radius: 2px; background: var(--stone); }
.post__px i:nth-child(3n+1) { background: var(--orange); } .post__px i:nth-child(5n) { background: var(--grey); } .post__px i:nth-child(7n) { background: var(--charcoal); } .post__px i:nth-child(4n+2) { background: transparent; }
.post:nth-child(2) .post__px i:nth-child(odd) { background: var(--orange); } .post:nth-child(3) .post__px i:nth-child(3n) { background: var(--charcoal); }
.post__tag { font-size: 11px; letter-spacing: .2em; text-transform: uppercase; color: var(--amber); }
.post h3 { font-family: var(--f-display); font-weight: 800; font-size: clamp(20px, 1.8vw, 24px); line-height: 1.18; margin: 0; }
.post .arrow { margin-top: auto; font-size: 22px; }
.post:hover .arrow { transform: translateX(4px); }
.faq { background: #fff; }
.faq__in { display: grid; grid-template-columns: .8fr 1.2fr; gap: clamp(32px, 6vw, 96px); align-items: start; }
.acc__i { border-top: 1px solid var(--line); }
.acc__i:last-child { border-bottom: 1px solid var(--line); }
.acc__i button { width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 24px; background: none; border: 0; padding: 22px 0; text-align: left; cursor: pointer; font-family: var(--f-display); font-weight: 800; font-size: clamp(18px, 1.7vw, 22px); line-height: 1.2; }
.acc__i button i { flex: none; width: 14px; height: 14px; position: relative; }
.acc__i button i::before, .acc__i button i::after { content: ""; position: absolute; background: var(--orange); left: 0; right: 0; top: 6px; height: 2px; transition: transform .3s var(--ease); }
.acc__i button i::after { transform: rotate(90deg); }
.acc__i.on button i::after { transform: rotate(0); }
.acc__a { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .4s var(--ease); }
.acc__a p { overflow: hidden; margin: 0; color: #555; max-width: 36em; }
.acc__i.on .acc__a { grid-template-rows: 1fr; }
.acc__i.on .acc__a p { padding-bottom: 24px; }
.cta { position: relative; overflow: hidden; padding: clamp(72px, 9vw, 130px) 0; }
.cta__px { position: absolute; left: -2%; top: -8%; width: min(30vw, 400px); opacity: .85; pointer-events: none; }
.cta__in { position: relative; display: grid; grid-template-columns: 1.2fr 1fr; gap: clamp(28px, 5vw, 80px); align-items: end; }
.cta .big { margin: 0; }
.cta__r p { margin: 0 0 26px; color: rgba(255, 251, 235, .75); }
.cta__b { display: flex; flex-wrap: wrap; gap: 12px; }
.foot { background: var(--bg); padding: 56px 0 24px; }
.foot__in { display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 40px; padding-bottom: 40px; }
.foot__brand img { height: 36px; width: auto; margin-bottom: 18px; }
.foot address { font-style: normal; font-size: 16px; color: #555; }
.foot__col { display: flex; flex-direction: column; gap: 8px; font-size: 16px; }
.foot__col b { font-size: 12px; letter-spacing: .2em; text-transform: uppercase; color: var(--amber); font-weight: 500; margin-bottom: 6px; }
.foot__col a:hover, .foot address a:hover { color: var(--amber); }
.foot__legal { display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap; border-top: 1px solid var(--line); padding-top: 20px; font-size: 14px; color: #666; }
.foot__legal span a { margin-left: 18px; }
.foot__legal span a:hover { color: var(--amber); }

@media (max-width: 980px) {
  .nav__cta { display: none; } .nav__burger { display: block; }
  .nav__links { position: fixed; inset: 76px 0 auto 0; flex-direction: column; gap: 0; padding: 12px var(--pad) 28px; background: var(--bg); border-bottom: 1px solid var(--line); transform: translateY(-8px); opacity: 0; pointer-events: none; transition: opacity .3s, transform .3s var(--ease); margin: 0; }
  .nav__links.open { opacity: 1; transform: none; pointer-events: auto; }
  .nav__links a:not(.btn) { padding: 16px 0; border-bottom: 1px solid var(--line); font-size: 20px; }
  .nav__cta-m { display: inline-flex; margin-top: 18px; justify-content: center; }
  .veil { background: linear-gradient(180deg, rgba(255,251,235,.9) 0%, rgba(255,251,235,.55) 38%, rgba(255,251,235,0) 62%); }
  .hero { align-items: flex-start; padding-top: 108px; } .hero__copy { max-width: none; }
  .stage { align-items: flex-start; min-height: 90svh; padding: 12vh 0; } .panel { max-width: none; }
  .posts { grid-template-columns: 1fr; } .post { min-height: 0; }
  .faq__in, .cta__in { grid-template-columns: 1fr; }
  .foot__in { grid-template-columns: 1fr 1fr; } .foot__brand { grid-column: 1 / -1; }
  .stats__in { margin: 0 auto; max-width: none; }
}
@media (max-width: 600px) {
  body { font-size: 18px; }
  .stage { padding: 92px 0 24px; min-height: 100svh; }
  .panel { padding: 20px 20px 22px; }
  .panel .big { font-size: clamp(30px, 8.4vw, 40px); margin-bottom: 12px; }
  .panel > p:not(.eyebrow) { font-size: 16px; margin-bottom: 10px; }
  .svc li { padding: 11px 0; } .svc h3 { font-size: 19px; } .svc p { font-size: 15.5px; line-height: 1.4; }
  .stat span { font-size: 12px; }
  .foot__legal span a { margin: 0 14px 0 0; } .foot__legal { flex-direction: column; }
}
@media (prefers-reduced-motion: reduce) { .marq__t { animation: none; } }
</style>
