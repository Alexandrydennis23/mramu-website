# MRAMU — website revamp (v2)

Vue 3 + Vite + Three.js. Same engine idea as the portfolio: one fixed canvas, a camera that flies through an isometric
"distribution" diorama as you scroll. Brand look from the MRAMU guidelines (palette, type, pixel motif, logo). All copy is from the live mramu.com.

## Run
    npm install
    npm run dev        # add ?debug to the URL to expose window.__scene
    npm run build      # output in dist/

## Structure
- `src/App.vue` — page content (copy lives here) + styles
- `src/components/SceneCanvas.vue` — canvas, scroll → camera mapping, stage rail, no-WebGL fallback
- `src/engine/Scene3D.js` — renderer, camera path, intro, parallax, shadows
- `src/engine/world.js` — the diorama: three service stations + data hall + HQ. Belts carry content cards (search results, ads, reports, posts, press, quotes, leads), staff carry tablets, `PINS` are the HTML labels projected over each service prop. Camera stations are in `STATIONS`.
- Each section with `data-cam="N"` tells the camera which station to fly to (0 overview, 1 Get found, 2 Get trusted, 3 Get chosen, 5 HQ — station 4 is the Data Services hall the camera flies past on the way to HQ).

## Before going live
- Fonts: Eiko and Editorial New are licensed — swap the stand-ins (Playfair Display / Instrument Serif) in `src/style.css` tokens.
- Logo is the 250px PNG from the guidelines PDF — replace `public/mramu-logo.png` with the SVG/hi-res master.
- Warm Stone: swatch measures #D9D3C9, the PDF label says #D9D3D9 — confirm with the brand owner.
- `EMAIL` in `App.vue` is empty (hidden on the old site by Cloudflare). Fill it to show the email button.
- Legal links are `#` placeholders. No GTM / cookie banner / client logos yet.
- Data Services is listed as a normal service under "Get chosen" — its one-line copy and the service-to-station mapping are new wording, confirm.
