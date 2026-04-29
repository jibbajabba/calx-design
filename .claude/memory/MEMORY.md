# Calx — Project Memory

## Architecture
<!-- Key architectural decisions and patterns -->
- Two-view app: `'landing' | 'overview'` state in `App.tsx` — no router
- Helper components defined inline at bottom of each page file (not in separate files)
- Tailwind CSS v4 via `@tailwindcss/vite` — no `tailwind.config.js`

## Build & Deploy
<!-- Build commands, hosting config, deployment notes -->

## Known Issues & Workarounds
<!-- Active bugs, patches, workarounds with context -->

## Key Patterns
<!-- Reusable patterns, conventions, gotchas -->
- Fonts loaded via Google Fonts in `index.css` (Source Serif 4, Geist, Inter, Source Sans 3)
- Icons: individual SVGs in `src/assets/icons/`, sprite at `public/icons.svg`
- Font families always applied via inline `style` prop, not Tailwind utility classes

## Dependencies
<!-- Notable dependency choices and version constraints -->
