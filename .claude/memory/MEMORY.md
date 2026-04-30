# Calx — Project Memory

## Architecture

- **Navigation** — No router. Two `useState` layers: `App.tsx` controls `'landing' | 'overview' | 'design-system'`; `OverviewPage.tsx` controls `'overview' | 'harms' | 'interventions'` tab + `chatOpen` boolean
- **Page structure** — Three analysis tabs (Overview, Harms, Interventions) share a single header shell in `OverviewPage.tsx`. Each tab's content is a separate file (`HarmsPage.tsx`, `InterventionsPage.tsx`) exporting a `*Content` component that accepts `chatOpen: boolean`
- **Emission map** — `EmissionMapTab.tsx` + `CountySidebar.tsx` are separate files (data complexity warrants it). County data lives in `src/data/countyData.ts` (auto-generated from prototype HTML via Python JSON parsing)
- **Helper components** — Defined inline at the bottom of each page file, not in separate files (per project convention)
- **Tailwind CSS v4** — Configured via `@theme` block in `src/index.css`; no `tailwind.config.js`

## Build & Deploy

- `npm run build` runs `tsc -b && vite build` — TypeScript errors block the build
- `noUnusedLocals` and `noUnusedParameters` enforced — always remove imports when removing usage
- Target repo: `https://github.com/calxinfo/design`
- **Netlify edge function auth** — `netlify/edge-functions/auth.ts` gates all `/*` routes; password in `SITE_PASSWORD` env var; sets `HttpOnly` cookie `calx_auth=1` on success; `/login` POST handler is exempted from the gate

## Known Issues & Workarounds

- SVG `foreignObject` does not auto-size to content height — replaced with absolute HTML overlays inside an aspect-ratio-locked parent for the Harms graph popovers

## Key Patterns

- **Fonts** — Applied via Tailwind utility classes (`font-serif`, `font-sans`, `font-mono`), NOT via inline `style` prop. Loaded from Google Fonts in `index.css` (Source Serif 4, Source Sans 3, Roboto Mono)
- **Icons** — Individual SVGs in `src/assets/icons/`; lucide-react used for UI icons (ChevronDown, LayoutGrid, AlertTriangle, SlidersHorizontal, Sparkles, UserCircle, etc.)
- **AI chat sidebar** — `w-[240px]` aside, conditionally rendered via `chatOpen` prop; clay-600 "AI" badge with `rounded-[3px]`; identical shell pattern on all three tabs; footer has suggested prompt pills (`text-xs rounded-full bg-neutral-100`) + input + send button; empty state: centered clay AI icon + heading + hint
- **Collapsible card** — CSS grid height trick (`grid-rows-[0fr]`/`grid-rows-[1fr]` + `overflow-hidden` inner). Circle chevron button (`w-7 h-7 rounded-full bg-white shadow-sm`) sits `absolute top-2 right-2` when expanded; rendered with `{!collapsed && ...}` so it disappears instantly on click. Collapsed state shows header row with title + down chevron.
- **Leaflet map** — Dynamic import (`import('leaflet').then(...)`) to avoid SSR issues; ResizeObserver calls `invalidateSize()`; county markers rebuilt on year/buffer/filter change; selected county highlighted with black border + map pan
- **Causal graph popup positioning** — SVG viewBox 960×800; wrap SVG in `style={{ aspectRatio: '960/800', height: '100%', maxWidth: '100%' }}` so it fills parent exactly; position HTML popups using `(svgCoord / viewBoxDim * 100)%` — no ref or ResizeObserver needed
- **Tab active state** — `border-b-2 border-clay-600 text-clay-600`; sparkle active: `bg-clay-50 text-clay-600`
- **Status color coding** — green-600 (positive/stable), orange-500 (warning/moderate), red-500 (critical/severe)
- **Eyebrow headings** — `text-[13px] font-semibold tracking-widest uppercase` for sidebar sections and stats row labels; `text-[11px]` for AI chat panel headers

## Dependencies

- `lucide-react ^1.8.0` — LayoutGrid, AlertTriangle, SlidersHorizontal, Sparkles, UserCircle, Download, Check, TrendingUp, Droplets, Scale, Wind, CircleDollarSign, ChevronDown
- `leaflet ^1.9.4` + `react-leaflet ^5.0.0` — Leaflet map; CartoDB light tiles; dynamic import pattern
- React 19, TypeScript 6, Vite 8 — all latest major as of project init
