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

// --- Breakpoints ----------------------------------------------

// Uses Tailwind default breakpoints. No custom overrides.
// sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px
