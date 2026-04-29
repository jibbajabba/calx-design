# Calx — Changelog

## [0.1.1] — 2026-04-29

### Infrastructure

- **Password protection** — Netlify edge function (`netlify/edge-functions/auth.ts`) gates all routes behind a `/login` page; password stored in `SITE_PASSWORD` env var; auth cookie `calx_auth` set on success; `netlify.toml` configures build (`npm run build → dist`) and routes `/*` through the edge function

## [0.1.0] — 2026-04-28

### Features & Improvements

- **Three-tab analysis shell** — Overview, Harms, and Interventions tabs in a shared header; active tab highlighted with clay underline; state managed in `OverviewPage.tsx` with no router
- **AI chat sidebar** — Sparkle button in header toggles a contextual `w-[240px]` chat panel on every tab; each tab has its own heading and content; `chatOpen` state persists across tab switches
- **Overview tab** — Expert advisor card (photo left, name/title/bio right with middot-separated role); Microplastics left column + analysis text + advisor card layout; full TWP Analysis dashboard with stats row, map-layer tabs, California map placeholder, emissions/risk/farmland/emitters data sidebar, and hotspot/buffer controls
- **Harms tab** — Interactive SVG causal chain graph with 7 colored nodes (Water Depletion, Agricultural Decline, Air Quality Decline, Rural Migration, Food Insecurity, Wage Suppression, Urban Labor Pressure); click-to-open node detail popovers; confidence (solid/dashed/dotted) and strength (thin/medium/thick) edge legend; popovers are auto-height HTML overlays inside an aspect-ratio-locked SVG wrapper
- **Interventions tab** — 2×2 intervention selector with clay highlight on selected card; Summary of Key Changes stat row; Tradeoffs & Unintended Consequences section; Baseline (2030) vs With Intervention (2030) side-by-side comparison with color-coded severity values and net value summary cards
- **Design system** — Clay brand palette (50–950), custom shadow scale (2xs–2xl), Source Serif 4 / Source Sans 3 / Roboto Mono font stack, semantic color tokens in `index.css @theme`
- **Landing page** — Hero with search input, example query pills, animated globe placeholder, and How Calx Works section
