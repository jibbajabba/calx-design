# Calx — Roadmap

## Completed

- [x] Landing page — hero, search input, example pills, globe placeholder, How Calx Works section
- [x] App shell — header with breadcrumb, tab nav (Overview / Harms / Interventions), sparkle toggle, user icon
- [x] Overview tab — Microplastics left column, analysis text, expert advisor card (Anup Sharma), TWP Analysis dashboard with stats row, map-layer tabs, map placeholder, data sidebar
- [x] Harms tab — SVG causal chain graph (7 nodes, 7 edges), confidence/strength legend, click-to-open node detail popovers (auto-height HTML overlay)
- [x] Interventions tab — 2×2 intervention selector, Summary of Key Changes, Tradeoffs section, Baseline vs With Intervention comparison, net value cards
- [x] AI chat sidebar — sparkle button toggles panel on all three tabs; each tab has contextual copy and its own header label
- [x] Design system — Clay palette, custom shadow scale, font stack, design.ts token reference
- [x] Documentation — README, CHANGELOG, MEMORY.md, design.ts updated
- [x] Password protection — Netlify edge function auth gate with `SITE_PASSWORD` env var (2026-04-29)
- [x] Live Leaflet emission map — 58-county markers, ramp/interface/convergence hotspot layers, county sidebar with statewide + drill-down views (2026-04-29)
- [x] Collapsible overview card — CSS grid height trick, circle chevron button, instant hide on click (2026-04-29)
- [x] AI chat UI polish — suggested prompt pills, empty state, updated typography across all three chat panels (2026-04-29)
- [x] Radix UI — installed and wired Select (dropdowns) and Dialog (analyst bio); all portals z-[9999] above Leaflet (2026-04-30)
- [x] Analyst bio dialog — Radix Dialog with photo, name, role, bio, close button, Esc support (2026-04-30)
- [x] Settings drawer — right-side slide-in panel from UserCircle icon, theme toggle (2026-04-30)
- [x] Smooth page transitions — opacity fade (200ms) on all page navigations (2026-04-30)
- [x] Animated search placeholder — 8 query strings cycling with 400ms crossfade, hidden on focus (2026-04-30)
- [x] Dynamic risk scores & avg AADT — year-aware using AADT ratio scaling; Top 5 Risk Counties resorts by year (2026-04-30)

## In Progress

## Planned

## Ideas

- Real map integration (Mapbox / deck.gl) for additional layers beyond emissions
- Animated transitions between tabs
- Actual AI chat API integration
- Query input persisted from landing page into analysis views
- Mobile / responsive layout pass
- Farmland, Wind, Human Health, Trends, Economic, Models, Applications, Compound Explorer map tabs
