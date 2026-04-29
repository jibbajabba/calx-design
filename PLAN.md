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

## In Progress

## Planned

## Ideas

- Real map integration (Mapbox / deck.gl) replacing the California map placeholder
- Animated transitions between tabs
- Actual AI chat API integration
- Query input persisted from landing page into analysis views
- Mobile / responsive layout pass
