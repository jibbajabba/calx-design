# Calx — Changelog

## [0.1.2] — 2026-04-29

### Features & Improvements

- **Live Leaflet emission map** — 58-county CircleMarker layer (radius by risk score, color by farmland buffer %) with ramp hotspots, highway-farm interface, and convergence zone overlay layers; hotspot/buffer/filter controls wired to map state
- **County data module** — `src/data/countyData.ts` with all 58-county data: CENTROIDS, GIS, EMISSIONS_2021, AADT trends, RISK_SCORES, rankings (BY_RISK, BY_AG5KM, BY_PM10), USDA, WIND, ECONOMIC, RAMP_HOTSPOTS (20), CONVERGENCE_ZONES (8); helper functions `mgdToTonnesYr`, `getEmissions`, `markerColor`
- **County sidebar** — `CountySidebar.tsx` with statewide view (live PM10/PM2.5 totals, top-5 rankings for risk/farmland/emitters) and county drill-down view (emissions, farmland USDA, wind/atmosphere, GIS proximity bars, deposition, chemical loading, risk rank, economic impact)
- **Collapsible overview card** — top card collapses to a header-only bar via CSS grid height trick; up chevron in white circle button with shadow triggers collapse; collapsed state shows "TWP Analysis" header with down chevron to restore
- **Suggested prompt pills** — all three AI chat panels now have contextual question pill rows above the input field
- **Overview chat empty state** — replaced pre-filled messages with centered empty state (clay AI badge, heading, hint text)

### UI Polish

- Leaflet zoom control styled to design system (`shadow-sm`, `border-[#e5e5e5]`, `rounded-lg`, grey icons)
- Eyebrow section headings bumped to `text-[13px] tracking-widest` in both sidebar and stats row
- AI chat panel header labels bumped from 9px to 11px; chat body text bumped to `text-sm`
- Suggested prompt pills bumped to `text-xs`; placeholder updated to "Ask about this analysis..."
- TWP Analysis heading in overview card set to 30px serif; card header simplified to "Microplastics" title only

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
