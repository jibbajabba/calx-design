# Calx

A data-driven platform for analyzing systemic environmental and economic harms, modeling interventions, and surfacing evidence for meaningful action.

## What It Does

Calx takes a research query (e.g., "impact of tire wear particles on California farmland") and produces a structured, evidence-backed analysis across three views:

| Tab | What it shows |
|-----|---------------|
| **Overview** | Headline stats, expert advisor summary, TWP analysis dashboard with map and data sidebar |
| **Harms** | Interactive causal chain graph linking environmental events to downstream social and economic impacts |
| **Interventions** | Side-by-side modeling of interventions vs. a no-action baseline, with tradeoffs and projected outcomes |

An AI chat panel (toggled via the ✦ sparkle button) provides contextual analysis on every view.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 19 + TypeScript 6 |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite` |
| Icons | lucide-react |
| Fonts | Source Serif 4, Source Sans 3, Roboto Mono (Google Fonts) |

Tailwind is configured via CSS `@theme` in `src/index.css` — there is no `tailwind.config.js`.

## Getting Started

```bash
npm install
npm run dev       # http://localhost:5173
```

## Commands

```bash
npm run dev       # Start dev server with HMR (Vite)
npm run build     # Type-check (tsc -b) then build for production
npm run lint      # Run ESLint
npm run preview   # Preview production build locally
```

## Project Structure

```
src/
├── App.tsx                    # Landing page + top-level navigation state
├── index.css                  # @theme tokens (colors, fonts, shadows), global styles
├── main.tsx                   # React entry point
├── pages/
│   ├── OverviewPage.tsx       # Shell: header, tab nav (overview/harms/interventions), chatOpen toggle
│   ├── HarmsPage.tsx          # Causal chain SVG graph + node popovers + harms chat
│   ├── InterventionsPage.tsx  # Intervention selector, stats, baseline vs intervention comparison
│   └── DesignSystemPage.tsx   # Living design system reference (dev only)
├── assets/
│   ├── icons/                 # Individual SVG icons (droplets, wind, harms, etc.)
│   ├── globe/                 # Globe animation assets (landing page)
│   └── overview/              # Static assets for overview page
└── styles/
    └── design.ts              # Design token documentation and component pattern reference
```

## Navigation

No router. Navigation is `useState` in two places:

- **`App.tsx`** — `'landing' | 'overview' | 'design-system'`
- **`OverviewPage.tsx`** — `'overview' | 'harms' | 'interventions'` (tab) + `chatOpen` (boolean)

## Design System

Colors, typography, shadows, spacing, component patterns, and animation conventions are documented in `src/styles/design.ts`. The brand accent palette is **Clay** (`clay-50` through `clay-950`).

Run `/update-design-system` to refresh the token file from source.

## Claude Code Commands

| Command | What it does |
|---------|-------------|
| `/update-docs` | Runs all documentation updates in one pass |
| `/update-design-system` | Scans tokens, maintains `src/styles/design.ts` |
| `/update-changelog` | Generates changelog entry from git history |
| `/update-readme` | Regenerates this file from project config |
| `/update-memory` | Records patterns and decisions in `.claude/memory/MEMORY.md` |
| `/update-plan` | Tracks roadmap progress in `PLAN.md` |
