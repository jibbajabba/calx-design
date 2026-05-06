import { useState, useMemo, useEffect } from 'react'
import lifecycleChart from '../assets/twp-lifecycle-chart.svg'
import type { ReactNode } from 'react'
import { LayoutGrid, AlertTriangle, SlidersHorizontal, Sparkles, UserCircle, ChevronDown, X, Check } from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import * as Select from '@radix-ui/react-select'
import HarmsContent from './HarmsPage'
import InterventionsContent from './InterventionsPage'
import EmissionMapTab from './EmissionMapTab'
import type { HotspotMode, FilterMode, BufferKey } from './EmissionMapTab'
import CountySidebar from './CountySidebar'
import { GIS, COUNTY_NAMES, RISK_SCORES, EMISSIONS_2021, getEmissions, mgdToTonnesYr } from '../data/countyData'

// ─── Small reusable pieces ────────────────────────────────────────────────────

function AppSelect({ value, onValueChange, children }: { value: string; onValueChange: (v: string) => void; children: ReactNode }) {
  return (
    <Select.Root value={value} onValueChange={onValueChange}>
      <Select.Trigger className="flex items-center gap-1 text-xs text-[#404040] border border-[#d4d4d4] rounded-sm pl-2 pr-1.5 py-0.5 bg-card hover:bg-neutral-50 outline-none focus:border-[#a3a3a3] data-[state=open]:border-[#a3a3a3] cursor-pointer whitespace-nowrap">
        <Select.Value />
        <Select.Icon><ChevronDown size={10} className="text-[#737373]" /></Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content position="popper" sideOffset={4} className="bg-card rounded-lg shadow-md border border-[#e5e5e5] overflow-hidden z-[9999] max-h-72">
          <Select.Viewport className="p-1">
            {children}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}

function AppSelectItem({ value, children }: { value: string; children: ReactNode }) {
  return (
    <Select.Item value={value} className="flex items-center justify-between gap-4 text-xs text-[#404040] px-2.5 py-1.5 rounded outline-none cursor-pointer select-none data-[highlighted]:bg-neutral-100 data-[state=checked]:text-foreground data-[state=checked]:font-medium">
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator><Check size={10} className="text-clay-600 shrink-0" /></Select.ItemIndicator>
    </Select.Item>
  )
}

function MeasuredBadge() {
  return <span className="bg-green-50 text-green-600 text-[9px] font-semibold tracking-wider whitespace-nowrap px-1.5 py-0.5 rounded">MEASURED</span>
}

function DerivedBadge() {
  return <span className="bg-orange-50 text-orange-500 text-[9px] font-semibold tracking-wider whitespace-nowrap px-1.5 py-0.5 rounded">DERIVED</span>
}

interface StatMetricProps {
  label: string
  badge: 'measured' | 'derived'
  value: ReactNode
  description: string
}

function StatMetric({ label, badge, value, description }: StatMetricProps) {
  return (
    <div className="border-l border-[#e5e5e5] first:border-l-0 flex flex-col gap-0.5 px-4 py-3 flex-1 min-w-0">
      <div className="flex items-center gap-1.5 flex-wrap">
        <p className="text-[13px] font-semibold text-[#737373] tracking-widest uppercase leading-none">{label}</p>
        {badge === 'measured' ? <MeasuredBadge /> : <DerivedBadge />}
      </div>
      <div className="text-[26px] font-bold leading-tight">{value}</div>
      <p className="text-[10px] text-[#737373] leading-tight">{description}</p>
    </div>
  )
}

type MapLayerTab = 'emissions' | 'farmland' | 'wind' | 'human' | 'trends' | 'economic' | 'models' | 'applications' | 'compounds'

function MapTab({ label, dotColor, active = false, onClick }: { label: string; dotColor?: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-2 text-xs whitespace-nowrap transition-colors ${
        active ? 'border-b-2 border-foreground text-foreground font-medium' : 'text-[#737373] hover:bg-neutral-200 hover:text-foreground'
      }`}
    >
      {dotColor && <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: dotColor }} />}
      {label}
    </button>
  )
}

function ToggleBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`text-xs px-2 py-0.5 rounded font-medium whitespace-nowrap transition-colors ${
        active ? 'bg-green-600 text-white' : 'border border-[#d4d4d4] text-[#404040] hover:bg-neutral-50'
      }`}
    >
      {label}
    </button>
  )
}

function OverviewChat() {
  return (
    <aside className="w-[240px] shrink-0 bg-card border-l border-[#e5e5e5] flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-y border-[#e5e5e5] shrink-0 bg-neutral-50">
        <p className="text-[11px] font-semibold text-[#737373] tracking-widest uppercase">Overview Analysis Chat</p>
        <span className="bg-clay-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-[3px]">AI</span>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 text-center min-h-0">
        <div className="w-8 h-8 rounded-full bg-clay-50 flex items-center justify-center mb-3">
          <span className="text-clay-600 text-sm font-bold">AI</span>
        </div>
        <p className="text-sm font-medium text-foreground mb-1">Ask about this analysis</p>
        <p className="text-sm text-[#737373] leading-relaxed">Use the suggested prompts below or type your own question about TWP emissions, county risk, or farmland exposure.</p>
      </div>
      <div className="shrink-0 px-3 pb-3 pt-2 space-y-2 border-t border-[#e5e5e5]">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {[
            'Which counties are highest risk?',
            'How does wind affect deposition?',
            'What is 6PPD-quinone?',
            'Compare PM10 vs PM2.5',
            'How was risk score calculated?',
          ].map(q => (
            <button
              key={q}
              className="text-xs text-[#404040] bg-neutral-100 hover:bg-neutral-200 border border-[#e5e5e5] rounded-full px-2.5 py-1 leading-none transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 border border-[#e5e5e5] rounded-lg px-3 py-2">
          <input
            placeholder="Ask about this analysis..."
            className="flex-1 text-xs text-[#737373] bg-transparent outline-none border-none placeholder:text-[#737373]"
          />
          <button className="w-5 h-5 bg-foreground rounded-full flex items-center justify-center shrink-0">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M5 8V2M2 5l3-3 3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type OverviewTab = 'overview' | 'harms' | 'interventions'

function tabFromPath(path: string): OverviewTab {
  if (path === '/microplastics/harms') return 'harms'
  if (path === '/microplastics/interventions') return 'interventions'
  return 'overview'
}

export default function OverviewPage({ onHome, initialTab = 'overview' }: { onHome: () => void; initialTab?: OverviewTab }) {
  const [tab, setTab] = useState<OverviewTab>(initialTab)
  const [tabVisible, setTabVisible] = useState(true)
  const [chatOpen, setChatOpen] = useState(false)

  useEffect(() => {
    function onPop() {
      setTab(tabFromPath(window.location.pathname))
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  function switchTab(t: OverviewTab) {
    if (t === tab) return
    const path = t === 'overview' ? '/microplastics' : `/microplastics/${t}`
    history.pushState(null, '', path)
    setTabVisible(false)
    setTimeout(() => {
      setTab(t)
      setTabVisible(true)
    }, 150)
  }

  // Dashboard controls
  const [year, setYear] = useState('2021')
  const [buffer, setBuffer] = useState<BufferKey>('1')
  const [hotspot, setHotspot] = useState<HotspotMode>('all')
  const [filter, setFilter] = useState<FilterMode>('all')
  const [mapLayer, setMapLayer] = useState<MapLayerTab>('emissions')
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null)
  const [overviewCollapsed, setOverviewCollapsed] = useState(false)
  const [summaryExpanded, setSummaryExpanded] = useState(true)

  const [settingsOpen, setSettingsOpen] = useState(false)
  const [theme, setTheme] = useState<'wireframe' | 'branded'>('wireframe')

  // Computed statewide stats for the current year (risk scores scale with AADT)
  const stats = useMemo(() => {
    let totalPm10 = 0, totalPm25 = 0, topRiskCode = '', topRiskScore = 0
    Object.keys(GIS).forEach(co => {
      const e = getEmissions(co, year)
      totalPm10 += Math.max(0, e.pm10)
      totalPm25 += Math.max(0, e.pm25)
      const base = RISK_SCORES[co] ?? 0
      const base21 = EMISSIONS_2021[co]?.pm10
      const score = base21 && base21 > 0 ? base * (e.pm10 / base21) : base
      if (score > topRiskScore) { topRiskScore = score; topRiskCode = co }
    })
    return {
      pm10: mgdToTonnesYr(totalPm10),
      pm25: mgdToTonnesYr(totalPm25),
      topRisk: COUNTY_NAMES[topRiskCode] ?? topRiskCode,
      topRiskScore: Math.round(topRiskScore),
    }
  }, [year])

  return (
    <div className="flex flex-col bg-background pt-11">

      {/* ── App Header ── */}
      <header className="bg-card flex items-center gap-2 h-11 px-5 shadow-xs fixed top-0 left-0 right-0 z-10">
        <button onClick={onHome} className="font-serif italic text-foreground text-xl font-semibold leading-6 shrink-0 hover:opacity-70 transition-opacity">
          Calx
        </button>
        <div className="w-px h-4 bg-[#d4d4d4] mx-1 shrink-0" />
        <div className="flex items-center gap-1.5 shrink-0">
          <button className="text-[#404040] text-xs font-medium hover:text-foreground">Microplastics</button>
          <span className="text-[#d4d4d4] text-xs">/</span>
          <button className="text-[#404040] text-xs font-medium hover:text-foreground">Tire wear particle emissions</button>
          <span className="text-[#d4d4d4] text-xs">/</span>
          <button
            className="text-[#404040] text-xs font-medium hover:text-foreground"
            onClick={() => setSelectedCounty(null)}
          >
            {selectedCounty ? (COUNTY_NAMES[selectedCounty] ?? selectedCounty) + ', CA' : 'San Joaquin, CA'}
          </button>
        </div>
        <div className="flex-1" />
        <div className="flex self-stretch">
          <nav className="flex self-stretch">
            {(['overview', 'harms', 'interventions'] as const).map((t, i) => {
              const icons = [<LayoutGrid key="lg" size={12} />, <AlertTriangle key="at" size={12} />, <SlidersHorizontal key="sh" size={12} />]
              const labels = ['Overview', 'Harms', 'Interventions']
              return (
                <div key={t} className="flex flex-col self-stretch">
                  <button onClick={() => switchTab(t)} className={`flex-1 flex items-center gap-1.5 px-4 text-xs font-medium transition-colors ${tab === t ? 'border-b-2 border-clay-600 text-clay-600' : 'text-[#404040] hover:bg-neutral-100'}`}>
                    {icons[i]}
                    {labels[i]}
                  </button>
                </div>
              )
            })}
          </nav>
          <button onClick={() => setChatOpen(o => !o)} className={`self-stretch flex items-center justify-center px-3 transition-colors ${chatOpen ? 'bg-clay-50 text-clay-600' : 'hover:bg-neutral-100 text-[#404040]'}`}>
            <Sparkles size={16} />
          </button>
          <div className="w-px h-4 bg-[#d4d4d4] self-center shrink-0 mx-2" />
        </div>
        <button onClick={() => setSettingsOpen(o => !o)} className={`transition-colors ${settingsOpen ? 'text-clay-600' : 'text-[#404040] hover:text-foreground'}`}>
          <UserCircle size={24} />
        </button>
      </header>

      {/* ── Settings panel ── */}
      {settingsOpen && <div className="fixed inset-0 z-40" onClick={() => setSettingsOpen(false)} />}
      <div className={`fixed top-11 right-0 bottom-0 w-72 bg-card shadow-xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${settingsOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5e5e5] shrink-0">
          <p className="font-serif text-base font-semibold text-foreground">Settings</p>
          <button onClick={() => setSettingsOpen(false)} className="text-[#a3a3a3] hover:text-foreground transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <p className="text-[11px] font-semibold text-[#737373] tracking-widest uppercase mb-3">Theme</p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setTheme('wireframe')}
              className={`border rounded-lg p-3 text-left transition-colors ${theme === 'wireframe' ? 'border-clay-500 bg-clay-50' : 'border-[#e5e5e5] hover:bg-neutral-50'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-foreground">Wireframe</p>
                {theme === 'wireframe' && <Check size={14} className="text-clay-600" />}
              </div>
              <div className="h-10 rounded bg-stone-200 flex gap-1 p-1.5">
                <div className="w-8 h-full bg-white rounded-sm" />
                <div className="flex-1 h-full bg-white rounded-sm opacity-80" />
              </div>
              <p className="text-xs text-[#737373] mt-1.5">Neutral stone palette — current</p>
            </button>
            <button
              disabled
              className="border border-[#e5e5e5] rounded-lg p-3 text-left opacity-50 cursor-not-allowed"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-foreground">Branded</p>
                <span className="text-[9px] font-semibold tracking-widest uppercase bg-neutral-100 text-[#737373] px-1.5 py-0.5 rounded">Soon</span>
              </div>
              <div className="h-10 rounded flex gap-1 p-1.5" style={{ backgroundColor: '#EBCFBD' }}>
                <div className="w-8 h-full rounded-sm" style={{ backgroundColor: '#B9563D' }} />
                <div className="flex-1 h-full bg-white rounded-sm opacity-80" />
              </div>
              <p className="text-xs text-[#737373] mt-1.5">Clay accent palette — coming soon</p>
            </button>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="transition-opacity duration-150 ease-in-out" style={{ opacity: tabVisible ? 1 : 0 }}>
      {tab === 'harms' && (
        <main className="flex gap-2.5 px-5 py-5 min-h-[calc(100vh-2.75rem)]">
          <HarmsContent chatOpen={chatOpen} />
        </main>
      )}
      {tab === 'interventions' && (
        <main className="flex gap-2.5 px-5 py-5 min-h-[calc(100vh-2.75rem)]">
          <InterventionsContent chatOpen={chatOpen} />
        </main>
      )}
      {tab === 'overview' && (
        <main className="flex gap-2.5 px-5 py-5">
          <div className="flex-1 flex flex-col gap-2.5 min-w-0">

            {/* ── Overview card ── */}
            <section className="bg-card rounded-lg shadow-sm shrink-0 relative">
              {overviewCollapsed && (
                <div className="flex items-center justify-between px-5 py-3">
                  <h2 className="font-serif text-xl font-semibold text-foreground leading-tight">TWP Analysis</h2>
                  <button onClick={() => setOverviewCollapsed(false)} className="text-[#a3a3a3] hover:text-foreground transition-colors duration-200">
                    <ChevronDown size={20} />
                  </button>
                </div>
              )}
              <div className={`grid transition-all duration-300 ease-in-out ${overviewCollapsed ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'}`}>
                <div className="overflow-hidden">
                  <div className="relative flex items-stretch px-5 pr-10 py-4 gap-5">
                    {!overviewCollapsed && (
                      <button onClick={() => setOverviewCollapsed(true)} className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-white shadow-sm text-[#a3a3a3] hover:text-foreground transition-colors duration-200">
                        <ChevronDown size={16} className="rotate-180" />
                      </button>
                    )}
                    <Dialog.Root>
                    <div className="w-[270px] shrink-0 flex flex-col">
                      <p className="font-serif text-[30px] font-semibold text-foreground leading-tight mb-2">TWP Analysis</p>
                      <p className="text-sm text-[#737373] leading-5">Tire wear particle analysis &amp; farmland deposition — California</p>
                      <div className="mt-4 pt-4 border-t border-[#e5e5e5]">
                        <div className="flex items-center gap-2 mb-2">
                          <img src="/images/anup-sharma.png" alt="Anup Sharma" className="w-9 h-9 rounded-full object-cover shrink-0" />
                          <div className="min-w-0">
                            <Dialog.Trigger asChild>
                              <button className="text-sm font-semibold text-foreground hover:text-clay-600 transition-colors leading-4 text-left">Anup Sharma, PhD</button>
                            </Dialog.Trigger>
                            <p className="text-xs text-[#737373] leading-4">Science Advisor · Calx Analyst</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-[#e5e5e5] flex flex-col gap-2">
                        <p className="text-sm text-[#737373] leading-relaxed">
                          California highways emit an estimated <strong className="text-foreground">922.3 t PM10</strong> and <strong className="text-foreground">98 t PM2.5</strong> annually. San Joaquin ranks first in risk — all top counties are Central Valley, where stable winds concentrate deposition on the same farmland year after year.
                        </p>
                        <p className="text-sm text-[#737373] leading-relaxed">
                          An estimated <strong className="text-foreground">$45.1B</strong> in ag value sits within 5km of California highways. Sutter leads farmland exposure at 82.5%, followed by Colusa (71.6%), Kings (70.2%), Glenn (63.4%), and Yolo (61.8%).
                        </p>
                        <p className="text-sm text-[#737373] leading-relaxed">
                          LA County is the largest emitter at <strong className="text-foreground">192.3 t/yr</strong>. The 2020 lockdowns showed a <strong className="text-foreground">10.1% drop</strong> in emissions, validating the model. Traffic grows at +4.0% per decade without intervention.
                        </p>
                      </div>
                    </div>

                    <Dialog.Portal>
                      <Dialog.Overlay className="fixed inset-0 bg-black/30 z-[9998]" />
                      <Dialog.Content className="fixed inset-0 z-[9999] flex items-center justify-center p-6 outline-none">
                        <div className="relative bg-card rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                          <div className="flex items-center gap-4 px-6 pt-6 pb-4 border-b border-[#e5e5e5]">
                            <img src="/images/anup-sharma.png" alt="Anup Sharma" className="w-20 h-20 rounded-xl object-cover object-top shrink-0" />
                            <div>
                              <Dialog.Title className="font-serif text-3xl font-semibold text-foreground leading-tight mb-0.5">Anup Sharma, PhD</Dialog.Title>
                              <Dialog.Description className="text-base text-[#737373]">Science Advisor · Calx Analyst</Dialog.Description>
                            </div>
                          </div>
                          <div className="px-6 pt-4 pb-5">
                            <p className="text-base text-[#404040] leading-7">
                              Translational epigenetics scientist at Yale School of Medicine with expertise in molecular mechanisms of disease and novel biomarker technologies. His research focuses on the intersection of environmental exposures and genomic responses, with particular emphasis on how particulate matter and chemical contaminants alter gene expression in agricultural and urban populations.
                            </p>
                          </div>
                          <Dialog.Close asChild>
                            <button className="absolute top-3 right-3 text-[#a3a3a3] hover:text-foreground transition-colors">
                              <X size={18} />
                            </button>
                          </Dialog.Close>
                        </div>
                      </Dialog.Content>
                    </Dialog.Portal>
                    </Dialog.Root>

                    <div className="w-px bg-[#e5e5e5] shrink-0 self-stretch" />
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      <p className="text-[9px] font-bold tracking-widest uppercase text-[#444] font-mono">WHERE POLYMER LEAVES THE TIRE — AND WHERE THE COST LANDS</p>
                      <p className="text-[10px] text-[#666] leading-snug mb-1">Below the dashed line: TWP released at each stage. Above the dashed line: cost burden today (coral) versus 2026–28 (indigo).</p>
                      <img src={lifecycleChart} alt="TWP lifecycle cost by stage" className="w-full h-auto" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ── TWP Analysis ── */}
            <section className="bg-card rounded-lg shadow-sm overflow-hidden h-[calc(100vh-4.625rem)] flex flex-col">

              {/* Panel header */}
              <div className="border-b border-[#e5e5e5] flex items-center gap-3 px-4 py-2.5 shrink-0">
                <p className="font-serif flex-1 text-xl font-semibold text-foreground leading-6">Analysis</p>
                <div className="flex items-center gap-2 shrink-0">
                  <AppSelect value={year} onValueChange={v => { setYear(v); setSelectedCounty(null) }}>
                    <AppSelectItem value="avg">10-yr average</AppSelectItem>
                    {['2013','2014','2015','2016','2017','2018','2019','2020','2021','2022','2023'].map(y => (
                      <AppSelectItem key={y} value={y}>{y === '2020' ? '2020 (COVID)' : y}</AppSelectItem>
                    ))}
                  </AppSelect>
                  <AppSelect value={selectedCounty ?? 'all'} onValueChange={v => setSelectedCounty(v === 'all' ? null : v)}>
                    <AppSelectItem value="all">All counties</AppSelectItem>
                    {Object.entries(COUNTY_NAMES).sort((a, b) => a[1].localeCompare(b[1])).map(([co, name]) => (
                      <AppSelectItem key={co} value={co}>{name}</AppSelectItem>
                    ))}
                  </AppSelect>
                  <AppSelect value="risk" onValueChange={() => {}}>
                    <AppSelectItem value="risk">Sort: Combined risk</AppSelectItem>
                    <AppSelectItem value="farmland">Sort: Farmland %</AppSelectItem>
                    <AppSelectItem value="emissions">Sort: Emissions</AppSelectItem>
                    <AppSelectItem value="aadt">Sort: Traffic (AADT)</AppSelectItem>
                  </AppSelect>
                  <AppSelect value={buffer} onValueChange={v => setBuffer(v as BufferKey)}>
                    <AppSelectItem value="1">Buffer: 1km</AppSelectItem>
                    <AppSelectItem value="2">Buffer: 2km</AppSelectItem>
                    <AppSelectItem value="5">Buffer: 5km</AppSelectItem>
                  </AppSelect>
                </div>
              </div>

              {/* Stats row — live values from selected year */}
              <div className="border-b border-[#e5e5e5] flex shrink-0">
                <StatMetric label="Statewide PM10" badge="measured" value={String(stats.pm10)} description="tonnes/yr — settles on crops within 1–2km of highway" />
                <StatMetric label="Statewide PM2.5" badge="measured" value={<span className="text-blue-500">{stats.pm25}</span>} description="tonnes/yr — stays airborne, inhaled by farmworkers 5km+" />
                <StatMetric label="AG Value at Risk" badge="measured" value="$45.1B" description="crops growing within 5km of highways" />
                <StatMetric label="#1 Risk County" badge="derived" value={<span className="text-orange-500 uppercase">{stats.topRisk}</span>} description="highest combined: emissions × farmland × wind" />
                <StatMetric label="Wind Stability" badge="measured" value="CV 7.2%" description="wind blows the same way every year — patterns are reliable" />
                <StatMetric label="COVID Impact" badge="measured" value={<span className="text-green-600">-10.1%</span>} description="59 tonnes of tire dust avoided in 2020 — a natural experiment" />
              </div>

              {/* Map layer tabs */}
              <div className="border-b border-[#e5e5e5] flex overflow-x-auto px-2 bg-stone-100 shrink-0">
                <MapTab label="Emission map" dotColor="#22c55e" active={mapLayer === 'emissions'} onClick={() => setMapLayer('emissions')} />
                <MapTab label="Farmland" dotColor="#22c55e" active={mapLayer === 'farmland'} onClick={() => setMapLayer('farmland')} />
                <MapTab label="Wind + transport" dotColor="#22c55e" active={mapLayer === 'wind'} onClick={() => setMapLayer('wind')} />
                <MapTab label="Human exposure" dotColor="#ef4444" active={mapLayer === 'human'} onClick={() => setMapLayer('human')} />
                <MapTab label="Trends" dotColor="#22c55e" active={mapLayer === 'trends'} onClick={() => setMapLayer('trends')} />
                <MapTab label="Economic impact" active={mapLayer === 'economic'} onClick={() => setMapLayer('economic')} />
                <MapTab label="Models" dotColor="#3b82f6" active={mapLayer === 'models'} onClick={() => setMapLayer('models')} />
                <MapTab label="Applications" active={mapLayer === 'applications'} onClick={() => setMapLayer('applications')} />
                <MapTab label="Compound explorer" dotColor="#ef4444" active={mapLayer === 'compounds'} onClick={() => setMapLayer('compounds')} />
              </div>

              {/* Map canvas + data sidebar */}
              <div className="flex flex-1 min-h-0">

                {mapLayer === 'emissions' ? (
                  <>
                    {/* Live Leaflet map */}
                    <div className="flex-1 relative overflow-hidden">

                      {/* Map fills container */}
                      <EmissionMapTab
                        year={year}
                        buffer={buffer}
                        hotspot={hotspot}
                        filter={filter}
                        selectedCounty={selectedCounty}
                        onSelectCounty={setSelectedCounty}
                      />

                      {/* Marker legend — bottom-right overlay */}
                      <div className="absolute bottom-4 right-3 bg-card rounded-lg shadow-md p-3 z-[1000]">
                        <p className="text-[10px] font-semibold text-foreground mb-1.5">Marker colors (ag within buffer)</p>
                        {[
                          { color: '#E24B4A', label: '>40% farmland' },
                          { color: '#EF9F27', label: '20–40% farmland' },
                          { color: '#378ADD', label: '5–20% farmland' },
                          { color: '#888888', label: '<5% farmland' },
                        ].map(({ color, label }) => (
                          <div key={label} className="flex items-center gap-1.5 py-0.5">
                            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                            <p className="text-[10px] text-[#404040]">{label}</p>
                          </div>
                        ))}
                        <p className="text-[9px] text-[#737373] mt-1.5">Size = combined risk score</p>
                      </div>

                      {/* Hotspots + Buffer island — adjacent to zoom controls (bottom-left) */}
                      <div className="absolute bottom-3 left-14 bg-card rounded-lg shadow-sm px-3 py-2 flex flex-col gap-1.5 z-[1000]">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs text-[#404040] font-medium whitespace-nowrap w-16 shrink-0">Hotspots:</p>
                          {(['none', 'all', 'ramp', 'interface', 'convergence'] as HotspotMode[]).map(m => (
                            <ToggleBtn key={m} label={m === 'none' ? 'None' : m === 'interface' ? 'Hwy-farm' : m.charAt(0).toUpperCase() + m.slice(1)} active={hotspot === m} onClick={() => setHotspot(m)} />
                          ))}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs text-[#404040] font-medium whitespace-nowrap w-16 shrink-0">Buffer:</p>
                          {(['1', '2', '5'] as BufferKey[]).map(b => (
                            <ToggleBtn key={b} label={`${b}km`} active={buffer === b} onClick={() => setBuffer(b)} />
                          ))}
                          <span className="text-[#d4d4d4] text-xs px-1">|</span>
                          {(['top10', 'bottom10', 'all'] as FilterMode[]).map(f => (
                            <ToggleBtn key={f} label={f === 'top10' ? 'Top 10' : f === 'bottom10' ? 'Bottom 10' : 'All 58'} active={filter === f} onClick={() => setFilter(f)} />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Dynamic data sidebar */}
                    <CountySidebar
                      selectedCounty={selectedCounty}
                      year={year}
                      buffer={buffer}
                      onSelectCounty={setSelectedCounty}
                    />
                  </>
                ) : (
                  /* Placeholder for other tabs */
                  <div className="flex-1 flex items-center justify-center bg-map-canvas">
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground mb-1">{mapLayer.charAt(0).toUpperCase() + mapLayer.slice(1).replace(/_/g, ' ')} view</p>
                      <p className="text-xs text-[#737373]">Coming soon</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom legend + sources */}
              <div className="border-t border-[#e5e5e5] flex items-center justify-between px-4 py-1.5 shrink-0">
                <div className="flex items-center gap-4">
                  {[
                    { color: '#22c55e', label: 'Measured' },
                    { color: '#f97316', label: 'Derived' },
                    { color: '#ef4444', label: 'Estimated' },
                  ].map(({ color, label }) => (
                    <div key={label} className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                      <p className="text-[10px] text-[#404040]">{label}</p>
                    </div>
                  ))}
                </div>
                <p className="text-[9px] text-[#737373]">
                  CalTrans AADT 2013–2023 · CIMIS 12 stations · USDA AgComm · CropScape CDL · GIS 58 counties
                </p>
              </div>
            </section>
          </div>
          <div className={`grid transition-all duration-300 ease-in-out shrink-0 ${chatOpen ? 'grid-cols-[240px]' : 'grid-cols-[0px]'} overflow-hidden`}><div className="w-[240px]" /></div>
          <div className={`fixed top-11 right-0 bottom-0 w-[240px] transition-transform duration-300 ease-in-out z-30 ${chatOpen ? 'translate-x-0' : 'translate-x-[260px]'}`}>
            <OverviewChat />
          </div>
        </main>
      )}
      </div>

    </div>
  )
}
