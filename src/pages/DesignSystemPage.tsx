import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'

// ─── Design System — Calx ─────────────────────────────────────────────────────

const BLUE = [
  { shade: '50',  hex: '#eff6ff' },
  { shade: '100', hex: '#dbeafe' },
  { shade: '200', hex: '#bfdbfe' },
  { shade: '300', hex: '#93c5fd' },
  { shade: '400', hex: '#60a5fa' },
  { shade: '500', hex: '#3b82f6' },
  { shade: '600', hex: '#2563eb' },
  { shade: '700', hex: '#1d4ed8' },
  { shade: '800', hex: '#1e40af' },
  { shade: '900', hex: '#1e3a8a' },
  { shade: '950', hex: '#172554' },
]

const SLATE = [
  { shade: '50',  hex: '#f8fafc' },
  { shade: '100', hex: '#f1f5f9' },
  { shade: '200', hex: '#e2e8f0' },
  { shade: '300', hex: '#cbd5e1' },
  { shade: '400', hex: '#94a3b8' },
  { shade: '500', hex: '#64748b' },
  { shade: '600', hex: '#475569' },
  { shade: '700', hex: '#334155' },
  { shade: '800', hex: '#1e293b' },
  { shade: '900', hex: '#0f172a' },
  { shade: '950', hex: '#020617' },
]

const CLAY = [
  { shade: '50',  hex: '#FBF5F1' },
  { shade: '100', hex: '#F6E8DE' },
  { shade: '200', hex: '#EBCFBD' },
  { shade: '300', hex: '#DFAF92' },
  { shade: '400', hex: '#D18766' },
  { shade: '500', hex: '#C4633F' },
  { shade: '600', hex: '#B9563D' },
  { shade: '700', hex: '#9A4434' },
  { shade: '800', hex: '#7C3830' },
  { shade: '900', hex: '#653029' },
  { shade: '950', hex: '#361714' },
]

const TYPE_SCALE: { label: string; cls: string; px: string }[] = [
  { label: 'text-xs',   cls: 'text-xs',   px: '12px' },
  { label: 'text-sm',   cls: 'text-sm',   px: '14px' },
  { label: 'text-base', cls: 'text-base', px: '16px' },
  { label: 'text-lg',   cls: 'text-lg',   px: '18px' },
  { label: 'text-xl',   cls: 'text-xl',   px: '20px' },
  { label: 'text-2xl',  cls: 'text-2xl',  px: '24px' },
  { label: 'text-3xl',  cls: 'text-3xl',  px: '30px' },
  { label: 'text-4xl',  cls: 'text-4xl',  px: '36px' },
  { label: 'text-5xl',  cls: 'text-5xl',  px: '48px' },
]

const WEIGHTS: { label: string; cls: string; num: string }[] = [
  { label: 'Light',    cls: 'font-light',    num: '300' },
  { label: 'Normal',   cls: 'font-normal',   num: '400' },
  { label: 'Medium',   cls: 'font-medium',   num: '500' },
  { label: 'Semibold', cls: 'font-semibold', num: '600' },
  { label: 'Bold',     cls: 'font-bold',     num: '700' },
]

const NAV = [
  {
    id: 'colors',
    label: 'Colors',
    children: [
      { id: 'colors-semantic', label: 'Semantic tokens' },
      { id: 'colors-clay',     label: 'Clay' },
      { id: 'colors-blue',     label: 'Blue' },
      { id: 'colors-slate',    label: 'Slate' },
    ],
  },
  {
    id: 'typography',
    label: 'Typography',
    children: [
      { id: 'type-serif',   label: 'Serif' },
      { id: 'type-sans',    label: 'Sans' },
      { id: 'type-mono',    label: 'Mono' },
      { id: 'type-weights', label: 'Font weights' },
    ],
  },
  {
    id: 'shadows',
    label: 'Shadows',
    children: [
      { id: 'shadow-scale', label: 'Scale' },
    ],
  },
  {
    id: 'motion',
    label: 'Motion',
    children: [
      { id: 'motion-timing',   label: 'Timing' },
      { id: 'motion-collapse', label: 'Collapse / expand' },
    ],
  },
  {
    id: 'components',
    label: 'Components',
    children: [
      { id: 'comp-tabs',    label: 'Tabs' },
      { id: 'comp-badges',  label: 'Badges' },
      { id: 'comp-buttons', label: 'Buttons' },
      { id: 'comp-input',   label: 'Search input' },
      { id: 'comp-bio',     label: 'Bio card' },
    ],
  },
]

function CollapseDemo() {
  const [collapsed, setCollapsed] = useState(true)
  return (
    <div className="bg-card rounded-lg border border-[#e5e5e5] overflow-hidden w-96">
      <div className={`flex items-center justify-between px-5 py-4 border-b transition-colors duration-300 ease-in-out ${collapsed ? 'border-transparent' : 'border-[#e5e5e5]'}`}>
        <p className="text-sm font-semibold text-foreground">Section heading</p>
        <button onClick={() => setCollapsed(c => !c)} className="w-5 h-5 rounded hover:bg-neutral-100 flex items-center justify-center">
          <ChevronDown size={14} className={`text-[#737373] transition-transform duration-200 ease-in-out ${collapsed ? '' : 'rotate-180'}`} />
        </button>
      </div>
      <div className={`grid transition-all duration-300 ease-in-out ${collapsed ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'}`}>
        <div className="overflow-hidden">
          <div className="px-5 py-4 text-sm text-[#737373] leading-5">
            Content that animates in and out smoothly using the CSS grid row transition — no JS height measurement required.
          </div>
        </div>
      </div>
    </div>
  )
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="flex flex-col gap-6 scroll-mt-20">
      <h2 className="font-serif text-2xl font-semibold text-foreground border-b border-[#e5e5e5] pb-3">{title}</h2>
      {children}
    </section>
  )
}

function Label({ id, children }: { id?: string; children: React.ReactNode }) {
  return <p id={id} className="text-xs font-semibold text-[#737373] tracking-wide uppercase mb-3 scroll-mt-20">{children}</p>
}

export default function DesignSystemPage({ onHome }: { onHome: () => void }) {
  const [activeId, setActiveId] = useState<string>('colors')
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const allIds = NAV.flatMap(g => [g.id, ...g.children.map(c => c.id)])

    observerRef.current = new IntersectionObserver(
      entries => {
        // Pick the topmost visible entry
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-10% 0px -60% 0px', threshold: 0 },
    )

    allIds.forEach(id => {
      const el = document.getElementById(id)
      if (el) observerRef.current!.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <header className="bg-card border-b border-[#e5e5e5] flex items-center gap-3 px-10 py-4 sticky top-0 z-10">
        <button
          onClick={onHome}
          className="font-serif italic text-foreground text-xl font-semibold hover:opacity-70 transition-opacity"
        >
          Calx
        </button>
        <span className="text-[#d4d4d4]">/</span>
        <span className="text-sm text-[#737373]">Design System</span>
      </header>

      <div className="flex">

        {/* Left nav */}
        <nav className="w-52 shrink-0 sticky top-[61px] self-start h-[calc(100vh-61px)] overflow-y-auto border-r border-[#e5e5e5] bg-card py-8 px-5">
          {NAV.map(group => (
            <div key={group.id} className="mb-6">
              <a
                href={`#${group.id}`}
                className={`block text-xs font-semibold tracking-wide uppercase mb-2 transition-colors ${
                  activeId === group.id ? 'text-clay-600' : 'text-[#404040] hover:text-foreground'
                }`}
              >
                {group.label}
              </a>
              {group.children.map(child => (
                <a
                  key={child.id}
                  href={`#${child.id}`}
                  className={`block text-sm py-0.5 pl-3 border-l-2 transition-colors ${
                    activeId === child.id
                      ? 'border-clay-500 text-clay-600 font-medium'
                      : 'border-transparent text-[#737373] hover:text-foreground hover:border-[#d4d4d4]'
                  }`}
                >
                  {child.label}
                </a>
              ))}
            </div>
          ))}
        </nav>

        {/* Main content */}
        <main className="flex-1 px-12 py-12 flex flex-col gap-16 min-w-0 max-w-5xl">

          {/* ── Colors ── */}
          <Section id="colors" title="Colors">
            <div>
              <Label id="colors-semantic">Semantic tokens</Label>
              <div className="flex gap-3">
                {[
                  { name: 'background', cls: 'bg-background', token: '--color-background', note: 'stone-200' },
                  { name: 'card',       cls: 'bg-card',       token: '--color-card',       note: '#ffffff' },
                  { name: 'foreground', cls: 'bg-foreground', token: '--color-foreground', note: 'stone-900' },
                  { name: 'bio-card',   cls: 'bg-bio-card',   token: '--color-bio-card',   note: 'stone-100' },
                  { name: 'map-canvas', cls: 'bg-map-canvas', token: '--color-map-canvas', note: 'slate-100' },
                ].map(({ name, cls, token, note }) => (
                  <div key={name} className="flex flex-col gap-2">
                    <div className={`${cls} w-24 h-16 rounded-lg border border-[#d4d4d4]`} />
                    <p className="text-sm font-medium text-foreground">{name}</p>
                    <p className="text-xs text-[#737373] font-mono">{token}</p>
                    <p className="text-xs text-[#a3a3a3]">{note}</p>
                  </div>
                ))}
              </div>
            </div>
            {([
              { id: 'colors-clay',  label: 'Clay',  ramp: CLAY  },
              { id: 'colors-blue',  label: 'Blue',  ramp: BLUE  },
              { id: 'colors-slate', label: 'Slate', ramp: SLATE },
            ] as const).map(({ id, label, ramp }) => (
              <div key={id}>
                <Label id={id}>{label}</Label>
                <div className="bg-card rounded-lg border border-[#e5e5e5] p-5">
                  <div className="flex gap-2">
                    {ramp.map(({ shade, hex }) => (
                      <div key={shade} className="flex flex-col gap-1.5 items-center flex-1">
                        <div className="w-full h-14 rounded-lg" style={{ backgroundColor: hex }} />
                        <p className="text-xs text-[#737373]">{shade}</p>
                        <p className="text-[10px] text-[#a3a3a3] font-mono">{hex}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </Section>

          {/* ── Typography ── */}
          <Section id="typography" title="Typography">

            <div>
              <Label id="type-serif">Serif — Source Serif 4 · font-serif · headings, logo, card titles</Label>
              <div className="bg-card rounded-lg border border-[#e5e5e5] divide-y divide-[#e5e5e5]">
                {TYPE_SCALE.map(({ label, cls, px }) => (
                  <div key={label} className="flex items-baseline gap-6 px-5 py-3">
                    <p className="text-xs text-[#737373] w-20 shrink-0 font-mono">{label}</p>
                    <p className="text-xs text-[#a3a3a3] w-10 shrink-0">{px}</p>
                    <p className={`font-serif ${cls} text-foreground leading-tight`}>The quick brown fox</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label id="type-sans">Sans — Source Sans 3 · font-sans · body, UI, labels (body default)</Label>
              <div className="bg-card rounded-lg border border-[#e5e5e5] divide-y divide-[#e5e5e5]">
                {TYPE_SCALE.map(({ label, cls, px }) => (
                  <div key={label} className="flex items-baseline gap-6 px-5 py-3">
                    <p className="text-xs text-[#737373] w-20 shrink-0 font-mono">{label}</p>
                    <p className="text-xs text-[#a3a3a3] w-10 shrink-0">{px}</p>
                    <p className={`${cls} text-foreground leading-tight`}>The quick brown fox</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label id="type-mono">Mono — Roboto Mono · font-mono · code, class refs, data values</Label>
              <div className="bg-card rounded-lg border border-[#e5e5e5] divide-y divide-[#e5e5e5]">
                {[
                  { label: 'Regular', weight: 'font-normal' },
                  { label: 'Medium',  weight: 'font-medium' },
                ].map(({ label, weight }) => (
                  <div key={label} className="flex items-baseline gap-6 px-5 py-3">
                    <p className="text-xs text-[#737373] w-20 shrink-0 font-mono">{label}</p>
                    <p className={`font-mono text-sm text-foreground ${weight}`}>
                      The quick brown fox · 0123456789
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label id="type-weights">Font weights</Label>
              <div className="flex gap-6">
                {(['font-serif', 'font-sans'] as const).map(family => (
                  <div key={family} className="flex-1 bg-card rounded-lg border border-[#e5e5e5] divide-y divide-[#e5e5e5]">
                    <p className="text-xs font-semibold text-[#737373] tracking-wide uppercase px-5 py-2.5">
                      {family === 'font-serif' ? 'Serif' : 'Sans'}
                    </p>
                    {WEIGHTS.map(({ label, cls, num }) => (
                      <div key={cls} className="flex items-baseline justify-between px-5 py-2">
                        <p className={`${family} ${cls} text-base text-foreground`}>{label}</p>
                        <p className="text-xs text-[#a3a3a3] font-mono">{num}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

          </Section>

          {/* ── Shadows ── */}
          <Section id="shadows" title="Shadows">
            <div>
              <Label id="shadow-scale">Scale</Label>
              <div className="flex flex-col gap-3">
                {([
                  { cls: 'shadow-2xs', label: 'shadow-2xs', usage: 'inputs, pill buttons' },
                  { cls: 'shadow-xs',  label: 'shadow-xs',  usage: 'headers' },
                  { cls: 'shadow-sm',  label: 'shadow-sm',  usage: 'section cards' },
                  { cls: 'shadow-md',  label: 'shadow-md',  usage: 'floating islands, dropdowns' },
                  { cls: 'shadow-lg',  label: 'shadow-lg',  usage: 'modals, popovers' },
                  { cls: 'shadow-xl',  label: 'shadow-xl',  usage: 'prominent overlays' },
                  { cls: 'shadow-2xl', label: 'shadow-2xl', usage: 'major focal elements' },
                ] as const).map(({ cls, label, usage }) => (
                  <div key={cls} className="flex items-center gap-6">
                    <div className={`bg-card rounded-lg ${cls} w-32 h-12 shrink-0`} />
                    <div>
                      <p className="text-sm font-mono font-medium text-foreground">{label}</p>
                      <p className="text-xs text-[#737373]">{usage}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* ── Motion ── */}
          <Section id="motion" title="Motion">
            <div>
              <Label id="motion-timing">Timing</Label>
              <div className="bg-card rounded-lg border border-[#e5e5e5] divide-y divide-[#e5e5e5]">
                {[
                  { level: 'Micro', duration: '200ms', cls: 'duration-200 ease-in-out', usage: 'Hover states, icon rotation, color transitions' },
                  { level: 'Content', duration: '300ms', cls: 'duration-300 ease-in-out', usage: 'Panel reveals, collapse/expand, slide-in' },
                ].map(({ level, duration, cls, usage }) => (
                  <div key={level} className="flex items-center gap-6 px-5 py-3">
                    <p className="text-sm font-medium text-foreground w-16 shrink-0">{level}</p>
                    <p className="text-xs text-[#737373] w-10 shrink-0">{duration}</p>
                    <p className="text-xs font-mono text-foreground flex-1">{cls}</p>
                    <p className="text-xs text-[#737373]">{usage}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label id="motion-collapse">Collapse / expand</Label>
              <div className="flex flex-col gap-4">
                <CollapseDemo />
                <div className="bg-card rounded-lg border border-[#e5e5e5] p-5 text-xs font-mono space-y-2 text-[#737373]">
                  <p className="text-foreground font-semibold not-italic mb-3 font-sans text-xs tracking-wide uppercase">CSS grid height pattern</p>
                  <p><span className="text-foreground">outer:</span>  grid transition-all duration-300 ease-in-out</p>
                  <p><span className="text-foreground">        </span> collapsed → grid-rows-[0fr]  &nbsp; expanded → grid-rows-[1fr]</p>
                  <p className="pt-1"><span className="text-foreground">inner:</span>  overflow-hidden</p>
                  <p className="pt-1"><span className="text-foreground">border:</span> border-b transition-colors duration-300 ease-in-out</p>
                  <p><span className="text-foreground">        </span> collapsed → border-transparent  &nbsp; expanded → border-[#e5e5e5]</p>
                </div>
              </div>
            </div>
          </Section>

          {/* ── Components ── */}
          <Section id="components" title="Components">

            <div>
              <Label id="comp-tabs">Tabs</Label>
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-xs text-[#737373] mb-2">Map layer tab bar — <span className="font-mono">bg-stone-100</span> container</p>
                  <div className="bg-stone-100 rounded-lg border border-[#e5e5e5] flex overflow-x-auto px-2 py-1">
                    {[
                      { label: 'Emission map', dot: '#22c55e', active: true },
                      { label: 'Farmland',     dot: '#22c55e', active: false },
                      { label: 'Wind + transport', dot: '#22c55e', active: false },
                      { label: 'Human exposure',   dot: '#ef4444', active: false },
                      { label: 'Trends',           dot: '#22c55e', active: false },
                      { label: 'Models',           dot: '#3b82f6', active: false },
                    ].map(({ label, dot, active }) => (
                      <button
                        key={label}
                        className={`flex items-center gap-1.5 px-3 py-2 text-xs whitespace-nowrap transition-colors ${
                          active
                            ? 'border-b-2 border-foreground text-foreground font-medium'
                            : 'text-[#737373] hover:bg-neutral-200 hover:text-foreground'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: dot }} />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-card rounded-lg border border-[#e5e5e5] p-5 flex flex-col gap-3">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1.5 px-3 py-2 text-xs border-b-2 border-foreground text-foreground font-medium">Active tab</button>
                    <button className="flex items-center gap-1.5 px-3 py-2 text-xs text-[#737373] hover:bg-neutral-200 hover:text-foreground transition-colors">Inactive tab</button>
                  </div>
                  <div className="text-xs text-[#737373] font-mono space-y-1">
                    <p>active:   <span className="text-foreground">border-b-2 border-foreground text-foreground font-medium</span></p>
                    <p>inactive: <span className="text-foreground">text-[#737373] hover:bg-neutral-200 hover:text-foreground</span></p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Label id="comp-badges">Badges</Label>
              <div className="bg-card rounded-lg border border-[#e5e5e5] p-5 flex flex-wrap gap-3 items-center">
                <span className="bg-green-50 text-green-600 text-[9px] font-semibold tracking-wider whitespace-nowrap px-1.5 py-0.5 rounded">MEASURED</span>
                <span className="bg-orange-50 text-orange-500 text-[9px] font-semibold tracking-wider whitespace-nowrap px-1.5 py-0.5 rounded">DERIVED</span>
                <span className="bg-green-50 text-green-600 text-[9px] font-semibold tracking-wider whitespace-nowrap px-1.5 py-0.5 rounded">GIS MEASURED</span>
                <span className="bg-clay-50 text-clay-700 text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded">Calx Analyst Summary</span>
              </div>
            </div>

            <div>
              <Label id="comp-buttons">Buttons</Label>
              <div className="bg-card rounded-lg border border-[#e5e5e5] p-5 flex flex-wrap gap-3 items-center">
                <button className="bg-[#171717] text-[#fafafa] text-sm font-medium px-4 py-2 rounded min-h-[36px]">Get Started</button>
                <button className="bg-[#fafafa] border border-[#d4d4d4] text-foreground text-sm font-medium px-4 py-2 rounded-full">Example pill</button>
                <button className="flex items-center gap-1 text-xs text-[#404040] border border-[#d4d4d4] rounded px-2 py-1 hover:bg-neutral-50">Filter <span className="text-[#737373]">▾</span></button>
                <button className="bg-green-600 text-white text-xs px-2 py-0.5 rounded font-medium">Active state</button>
              </div>
            </div>

            <div>
              <Label id="comp-input">Search input</Label>
              <div className="bg-card rounded-lg border border-[#e5e5e5] p-5">
                <div className="bg-card border border-[#e5e5e5] flex items-center gap-2 h-[52px] px-3 rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] w-full max-w-lg">
                  <svg className="w-4 h-4 text-[#737373] shrink-0" fill="none" viewBox="0 0 16 16">
                    <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <input
                    type="text"
                    placeholder="How does fast fashion impact air quality…"
                    className="flex-1 text-sm text-[#737373] bg-transparent outline-none border-none placeholder:text-[#737373]"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label id="comp-bio">Bio card · bg-bio-card</Label>
              <div className="bg-bio-card rounded-lg overflow-hidden flex w-[480px] border border-[#e5e5e5]">
                <div className="flex-1 p-4">
                  <p className="font-serif text-base font-semibold text-foreground leading-5 mb-0.5">Anup Sharma, PhD</p>
                  <p className="text-sm text-[#737373] mb-3">Science Advisor</p>
                  <p className="text-sm text-[#404040] leading-5">
                    Translational epigenetics scientist at Yale School of Medicine with expertise in molecular mechanisms of disease and novel biomarker technologies.
                  </p>
                </div>
                <div className="w-40 h-40 shrink-0 self-center m-3 rounded-xl bg-stone-200" />
              </div>
            </div>

          </Section>

        </main>
      </div>
    </div>
  )
}
