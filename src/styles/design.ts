// ============================================================
// Design System — Calx
// Auto-maintained by /update-design-system
// ============================================================

// --- Colors ---------------------------------------------------

export const colors = {
  // Semantic tokens (defined in index.css @theme)
  background: 'bg-background',   // stone-200 (#e7e5e4)
  card:       'bg-card',         // white (#ffffff)
  foreground: 'text-foreground', // stone-900 (#1c1917)
  bioCard:    'bg-bio-card',     // stone-100 — expert/advisor card backgrounds
  mapCanvas:  'bg-map-canvas',   // slate-100 — map placeholder and canvas backgrounds

  // Primitive palettes (Tailwind built-ins, documented here for reference)
  blue: {
    50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe',
    300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6',
    600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af',
    900: '#1e3a8a', 950: '#172554',
  },
  slate: {
    50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0',
    300: '#cbd5e1', 400: '#94a3b8', 500: '#64748b',
    600: '#475569', 700: '#334155', 800: '#1e293b',
    900: '#0f172a', 950: '#020617',
  },

  // Clay — brand/accent palette
  clay: {
    50:  '#FBF5F1',
    100: '#F6E8DE',
    200: '#EBCFBD',
    300: '#DFAF92',
    400: '#D18766',
    500: '#C4633F',
    600: '#B9563D',
    700: '#9A4434',
    800: '#7C3830',
    900: '#653029',
    950: '#361714',
  },
} as const

// --- Typography -----------------------------------------------

export const typography = {
  // Font families (defined in index.css @theme, body default is sans)
  serif: 'font-serif',  // Source Serif 4 — headings, logo, card titles
  sans:  'font-sans',   // Source Sans 3 — body, UI, labels (body default)
  mono:  'font-mono',   // Roboto Mono — code, class references, data values

  // Type scale
  scale: {
    xs:   'text-xs',   // 12px — micro labels, legends, data rows
    sm:   'text-sm',   // 14px — body text, secondary UI
    base: 'text-base', // 16px — default body
    lg:   'text-lg',   // 18px — intro paragraphs
    xl:   'text-xl',   // 20px — card headings
    '2xl': 'text-2xl', // 24px — section titles
    '4xl': 'text-4xl', // 36px — large display
    '6xl': 'text-6xl', // 60px — hero headings
  },

  // Usage rules
  // heading:        font-serif + font-semibold or font-light (display)
  // body:           (body default) + font-normal, text-sm or text-base
  // eyebrow label:  font-sans + font-semibold + tracking-widest + uppercase + text-[13px]
  // chat header:    font-sans + font-semibold + tracking-widest + uppercase + text-[11px]
  // badge:          font-sans + font-semibold + tracking-wider + text-[9px]–text-[10px]
} as const

// --- Shadows --------------------------------------------------

export const shadows = {
  // Scale — defined in index.css @theme, overrides Tailwind defaults
  '2xs': 'shadow-2xs', // 0 1px 2px — barely visible, near-flat surfaces
  xs:    'shadow-xs',  // 0 1px 3px — search inputs, subtle borders
  sm:    'shadow-sm',  // 0 2px 4px — section cards
  md:    'shadow-md',  // 0 4px 8px — floating islands, dropdowns
  lg:    'shadow-lg',  // 0 8px 16px — modals, popovers
  xl:    'shadow-xl',  // 0 16px 24px — prominent overlays
  '2xl': 'shadow-2xl', // 0 24px 48px — major focal elements

  // Usage rules
  // header:           shadow-xs
  // card / section:   shadow-sm
  // floating island:  shadow-md
  // input / pill:     shadow-2xs
} as const

// --- Tabs -----------------------------------------------------

// Two variants:
//
// 1. Map layer tabs (square, bg hover) — use inside a bg-stone-100 container
//    Container: bg-stone-100 flex overflow-x-auto px-2 py-1
//    Active:    border-b-2 border-foreground text-foreground font-medium text-xs
//    Inactive:  text-[#737373] hover:bg-neutral-200 hover:text-foreground text-xs
//    Dots:      w-2 h-2 rounded-full (colored per data layer)
//    Note:      No rounded corners — square tabs only
//
// 2. Header nav tabs (full-height flush, bg hover) — use inside self-stretch flex
//    Active:    self-stretch border-b-2 border-clay-600 text-clay-600 font-medium text-xs
//    Inactive:  self-stretch hover:bg-neutral-100 text-[#404040] font-medium text-xs
//    Note:      No rounded corners — square fills only (matches map layer tabs)

// --- Motion ---------------------------------------------------

// Two timing levels. Both use ease-in-out.
//
// Micro (200ms) — hover states, icon rotation, color transitions
//   transition-colors duration-200 ease-in-out
//   transition-transform duration-200 ease-in-out
//   Example: chevron rotate, tab hover bg, button color
//
// Content (300ms) — panel reveals, collapse/expand
//   transition-all duration-300 ease-in-out
//   Example: collapse/expand sections, slide-in panels
//
// Collapse/expand height pattern (CSS grid trick — no JS height measurement):
//   Outer wrapper: grid transition-all duration-300 ease-in-out
//                  collapsed → grid-rows-[0fr]   expanded → grid-rows-[1fr]
//   Inner wrapper: overflow-hidden   (clips content at zero height)
//   Content:       normal layout (the actual content)
//
//   Border fade on heading row (pair with collapse):
//   border-b transition-colors duration-300 ease-in-out
//   collapsed → border-transparent   expanded → border-[#e5e5e5]

// --- Border Radius --------------------------------------------

// Semantic token: --radius = 0.5rem (defined in index.css @theme)
// Tailwind alias:  rounded-lg
//
// Use rounded-lg (--radius) for all surface containers and overlays.
// Use rounded for smaller interactive elements (buttons, badges, filter chips).
//
// rounded-lg — bg-card sections, floating islands (zoom, hotspots, marker legend)
// rounded    — inline buttons, badge pills, filter chips

// --- Card Layout ----------------------------------------------

// Card heading rule: padding belongs on each inner row, NOT on the section.
// This lets the border-b on the heading row span the full card width while
// content inside the row stays padded.
//
// Correct pattern:
//   <section className="bg-card rounded-lg shadow-sm">          ← no px
//     <div className="flex items-center px-5 py-4 border-b ..."> ← px here
//       heading content
//     </div>
//     <div className="px-5 py-4">                               ← px here
//       body content
//     </div>
//   </section>

// --- Spacing --------------------------------------------------

// Uses Tailwind default scale (4px base unit). No custom overrides.
// Common patterns:
//   gap-2.5  (10px) — between main layout sections
//   px-5     (20px) — page horizontal padding
//   px-10    (40px) — content max-width padding
//   py-4     (16px) — card vertical padding

// --- Status & Severity Colors ---------------------------------

// Used in Interventions and Harms pages to color-code metric values.
// Positive / improving:   text-green-600
// Warning / moderate:     text-orange-500
// Critical / severe:      text-red-500
// Neutral / default:      text-foreground

// --- AI Chat Sidebar ------------------------------------------

// Shared pattern across Overview, Harms, and Interventions pages.
// Triggered by the sparkle (✦) button in the header nav (chatOpen state in OverviewPage).
// Width: w-[240px] shrink-0
//
// Header:   flex items-center justify-between px-4 py-3 border-b border-[#e5e5e5]
//   Label:  text-[11px] font-semibold text-[#737373] tracking-widest uppercase
//   Badge:  bg-clay-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-[3px]
// Body:     flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0
//   Text:   text-sm text-[#404040] leading-relaxed
// Empty state (no messages):
//   flex flex-col items-center justify-center px-4 py-6 text-center
//   Icon:   w-8 h-8 rounded-full bg-clay-50 flex items-center justify-center
//   Title:  text-sm font-medium text-foreground
//   Hint:   text-xs text-[#737373] leading-relaxed
// Footer:   shrink-0 px-3 pb-3 pt-2 space-y-2 border-t border-[#e5e5e5]
//   Suggested prompts (pills):
//     flex flex-wrap gap-1.5 mb-2
//     text-xs text-[#404040] bg-neutral-100 hover:bg-neutral-200 border border-[#e5e5e5]
//     rounded-full px-2.5 py-1 leading-none transition-colors
//   Input:  flex items-center gap-2 border border-[#e5e5e5] rounded-lg px-3 py-2
//   Send:   w-5 h-5 bg-foreground rounded-full flex items-center justify-center
//   Placeholder: "Ask about this analysis..."

// --- Collapsible Card -----------------------------------------

// Pattern: card collapses to header-only bar; content animates out via CSS grid trick.
// Collapse is triggered by a circle chevron button (up = expanded, down = collapsed).
//
// When expanded: no header bar; circle button sits absolute top-2 right-2 inside the card.
//   Button: absolute top-2 right-2 w-7 h-7 flex items-center justify-center
//           rounded-full bg-white shadow-sm text-[#a3a3a3] hover:text-foreground
//           transition-colors duration-200
//   Icon:   ChevronDown size={16} className="rotate-180"  (points up)
//   Hide button immediately on click: render only when !collapsed
//
// When collapsed: header row appears with title + down chevron.
//   Header: flex items-center justify-between px-5 py-3
//   Title:  font-serif text-xl font-semibold text-foreground leading-tight
//   Button: text-[#a3a3a3] hover:text-foreground transition-colors duration-200
//   Icon:   ChevronDown size={20}  (points down)
//
// Collapsible body uses same grid height trick as above (Motion section).

// --- Causal Graph (Harms page) --------------------------------

// SVG-based node graph inside an aspect-ratio-locked container.
// This ensures absolute HTML popups positioned by SVG-coordinate percentages
// are pixel-accurate regardless of container size.
//
// Container: flex-1 flex items-center justify-center min-h-0 overflow-hidden
//   Inner:   relative; style={{ aspectRatio: '960/800', height: '100%', maxWidth: '100%' }}
//   SVG:     viewBox="0 0 960 800" className="w-full h-full"
//
// Popup positioning formula:
//   top:    (node.y - node.r) / 800 * 100 + '%'
//   right:  (960 - node.x + node.r + 12) / 960 * 100 + '%'  (if node.x > 480)
//   left:   (node.x + node.r + 12) / 960 * 100 + '%'        (if node.x ≤ 480)
//
// Edge confidence styles:
//   Confirmed: no strokeDasharray
//   Estimated: strokeDasharray="8 5"
//   Inferred:  strokeDasharray="3 5"
// Edge strength: Weak → strokeWidth 1.5 · Moderate → 2.5 · Strong → 4

// --- Radix UI Components --------------------------------------

// Project uses @radix-ui/react-dialog and @radix-ui/react-select.
// All Radix portals MUST set z-[9999] to render above the Leaflet map (z default ~400).

// AppSelect (custom wrapper around Radix Select):
//   Trigger: flex items-center gap-1 text-xs text-[#404040] border border-[#d4d4d4]
//            rounded-sm pl-2 pr-1.5 py-0.5 bg-card hover:bg-neutral-50 outline-none
//            focus:border-[#a3a3a3] data-[state=open]:border-[#a3a3a3] cursor-pointer
//   Portal wraps Content to escape stacking context.
//   Content: bg-card rounded-lg shadow-md border border-[#e5e5e5] overflow-hidden
//            z-[9999] max-h-72
//   Item: text-xs text-[#404040] px-2.5 py-1.5 rounded
//         data-[highlighted]:bg-neutral-100 data-[state=checked]:font-medium
//         ItemIndicator shows Check icon in clay-600 when selected
//
// Analyst Bio Dialog (Radix Dialog):
//   Overlay: fixed inset-0 bg-black/30 z-[9998]
//   Content: fixed inset-0 z-[9999] flex items-center justify-center p-6 outline-none
//   Card:    bg-card rounded-lg shadow-xl p-6 w-full max-w-md relative
//            Header row: flex items-center gap-4 pb-4 border-b border-[#e5e5e5] mb-5
//            Photo: w-16 h-16 rounded-full object-cover shrink-0
//            Name:  font-serif text-3xl font-semibold  (Dialog.Title)
//            Role:  text-base text-[#737373]           (Dialog.Description)
//            Close: X icon in absolute top-4 right-4, text-[#737373] hover:text-foreground
//   ESC closes via Radix built-in keyboard handling.

// --- Settings Drawer ------------------------------------------

// Right-side slide-in drawer for theme/config settings.
// Triggered by UserCircle icon in header (settingsOpen state in OverviewPage).
//
// Backdrop:  fixed inset-0 z-40 (click to dismiss)
// Panel:     fixed top-11 right-0 bottom-0 w-72 bg-card shadow-xl z-50 flex flex-col
//            translate-x-full (closed) → translate-x-0 (open)
//            transition-transform duration-300 ease-in-out
// Header:    px-5 py-4 border-b border-[#e5e5e5] flex items-center justify-between
// Body:      overflow-y-auto flex-1 px-5 py-4 space-y-6
// Icon active state: text-clay-600 (when settingsOpen); text-[#404040] hover:text-foreground (closed)

// --- Page Transitions -----------------------------------------

// Fade-out/in on page navigation. Managed by App.tsx.
//   pageVisible state: true (opaque) / false (transparent)
//   Wrapper div: transition-opacity duration-200 ease-in-out
//   navigate(): sets pageVisible=false → after 200ms sets new page + pageVisible=true
//   All page views are wrapped in a div with the fade props.

// --- Animated Search Placeholder ------------------------------

// Landing page search input cycles through query placeholders with crossfade.
//   PLACEHOLDERS array: 8 harm-related query strings
//   phIdx: current placeholder index
//   phVisible: opacity boolean (false during transition)
//   Cycle: every 3500ms, fade out (400ms), advance index, fade in
//   Hidden when: query has value OR inputFocused is true
//   Overlay span: absolute inset-0 flex items-center text-sm text-[#737373]
//                 pointer-events-none transition-opacity duration-400

// --- Dynamic Year Data ----------------------------------------

// Stats, risk scores, and avg AADT all recompute when the year dropdown changes.
//
// getEmissions(co, year) in countyData.ts:
//   - year='2021': returns EMISSIONS_2021[co] as-is
//   - year='avg': scales by (mean AADT across all trend years) / avg_aadt_2021
//   - otherwise: scales by COUNTY_AADT_TREND[co][year] / EMISSIONS_2021[co].avg_aadt
//   - Falls back to 2021 data if trend entry is missing.
//
// Risk score formula (derived):
//   RISK_SCORES[co] = EMISSIONS_2021[co].pm10 * (GIS[co].b5_pct / 100) * WIND[co].avg_wind * 1e-4
//   Dynamic version: RISK_SCORES[co] * (getEmissions(co, year).pm10 / EMISSIONS_2021[co].pm10)
//   Top-5 risk counties sorted by dynamic score each render.
//
// Avg AADT for year: mean of getEmissions(co, year).avg_aadt across all GIS counties.
//
// Statewide PM10/PM2.5: sum of mgdToTonnesYr(getEmissions(co, year).pm10) across all GIS counties.
// NOTE: 2023 values are similar to 2021 because 2023 AADT ≈ 2021 AADT for most counties.
// Prototype divergence at 2023 (545 t/yr vs ~947) requires year-specific fleet factors not
// in current data — AADT scaling alone cannot reproduce this.

// --- Breakpoints ----------------------------------------------

// Uses Tailwind default breakpoints. No custom overrides.
// sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px
