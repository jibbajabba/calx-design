import { useState } from 'react'
import type { ReactNode } from 'react'
import { LayoutGrid, AlertTriangle, SlidersHorizontal, Sparkles, UserCircle } from 'lucide-react'
import HarmsContent from './HarmsPage'
import InterventionsContent from './InterventionsPage'

// ─── Small reusable pieces ────────────────────────────────────────────────────

function ChevronDownIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M2.5 3.75L5 6.25L7.5 3.75" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MeasuredBadge() {
  return <span className="bg-green-50 text-green-600 text-[9px] font-semibold tracking-wider whitespace-nowrap px-1.5 py-0.5 rounded">MEASURED</span>
}

function DerivedBadge() {
  return <span className="bg-orange-50 text-orange-500 text-[9px] font-semibold tracking-wider whitespace-nowrap px-1.5 py-0.5 rounded">DERIVED</span>
}

function GisBadge() {
  return <span className="bg-green-50 text-green-600 text-[9px] font-semibold tracking-wider whitespace-nowrap px-1.5 py-0.5 rounded">GIS MEASURED</span>
}

type BadgeVariant = 'measured' | 'derived' | 'gis'

function SectionBadge({ variant }: { variant: BadgeVariant }) {
  if (variant === 'derived') return <DerivedBadge />
  if (variant === 'gis') return <GisBadge />
  return <MeasuredBadge />
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
        <p className="text-[10px] font-semibold text-[#737373] tracking-wide uppercase leading-none">{label}</p>
        {badge === 'measured' ? <MeasuredBadge /> : <DerivedBadge />}
      </div>
      <div className="text-[26px] font-bold leading-tight">{value}</div>
      <p className="text-[10px] text-[#737373] leading-tight">{description}</p>
    </div>
  )
}

function MapTab({ label, dotColor, active = false }: { label: string; dotColor?: string; active?: boolean }) {
  return (
    <button
      className={`flex items-center gap-1.5 px-3 py-2 text-xs whitespace-nowrap transition-colors ${
        active ? 'border-b-2 border-foreground text-foreground font-medium' : 'text-[#737373] hover:bg-neutral-200 hover:text-foreground'
      }`}
    >
      {dotColor && <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: dotColor }} />}
      {label}
    </button>
  )
}

function SidebarSection({ title, badge, children }: { title: string; badge: BadgeVariant; children: ReactNode }) {
  return (
    <div className="border-t border-[#e5e5e5] py-2">
      <div className="flex items-center gap-1.5 px-3 mb-1.5 flex-wrap">
        <p className="text-xs font-semibold text-foreground tracking-wide uppercase">{title}</p>
        <SectionBadge variant={badge} />
      </div>
      {children}
    </div>
  )
}

function DataRow({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex items-center justify-between px-3 py-0.5">
      <p className="text-xs text-[#404040]">{label}</p>
      <p className={`text-xs font-medium text-right ${valueClass ?? 'text-foreground'}`}>{value}</p>
    </div>
  )
}

function RankedRow({ rank, label, value }: { rank: number; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-3 py-0.5">
      <p className="text-xs text-[#404040]">{rank}. {label}</p>
      <p className="text-xs text-[#737373] text-right shrink-0 ml-2">{value}</p>
    </div>
  )
}

function OverviewChat() {
  return (
    <aside className="w-[240px] shrink-0 bg-card rounded-lg shadow-sm flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#e5e5e5] shrink-0">
        <p className="text-[9px] font-semibold text-[#737373] tracking-widest uppercase">Overview Analysis Chat</p>
        <span className="bg-clay-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-[3px]">AI</span>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
        <p className="text-xs text-[#404040] leading-relaxed">
          California highways emit an estimated 922.3 tonnes of tire wear particles annually. San Joaquin County leads combined risk, with prevailing winds concentrating deposition on the same farmland year after year.
        </p>
        <p className="text-xs text-[#404040] leading-relaxed">
          The 2020 COVID lockdowns provided a natural experiment — a 10.1% drop in emissions validates the model and shows that traffic reduction directly cuts loading. With traffic growing at +4.0% per decade, intervention timing matters.
        </p>
      </div>
      <div className="shrink-0 px-3 pb-3 pt-2 space-y-2 border-t border-[#e5e5e5]">
        <div className="flex items-center gap-2 border border-[#e5e5e5] rounded-lg px-3 py-2">
          <input
            placeholder="Ask about this region..."
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

export default function OverviewPage({ onHome }: { onHome: () => void }) {
  const [tab, setTab] = useState<'overview' | 'harms' | 'interventions'>('overview')
  const [chatOpen, setChatOpen] = useState(false)

  return (
    <div className="h-screen flex flex-col bg-background">

      {/* ── App Header ── */}
      <header className="bg-card flex items-center gap-2 h-11 px-5 shadow-xs shrink-0 z-10">
        <button onClick={onHome} className="font-serif italic text-foreground text-xl font-semibold leading-6 shrink-0 hover:opacity-70 transition-opacity">
          Calx
        </button>
        <div className="w-px h-4 bg-[#d4d4d4] mx-1 shrink-0" />
        <div className="flex items-center gap-1.5 shrink-0">
          <button className="text-[#404040] text-xs font-medium hover:text-foreground">Microplastics</button>
          <span className="text-[#d4d4d4] text-xs">/</span>
          <button className="text-[#404040] text-xs font-medium hover:text-foreground">Tire wear particle emissions</button>
          <span className="text-[#d4d4d4] text-xs">/</span>
          <button className="text-[#404040] text-xs font-medium hover:text-foreground">San Joaquin, CA</button>
        </div>
        <div className="flex-1" />
        <div className="flex self-stretch">
          <nav className="flex self-stretch">
            <div className="flex flex-col self-stretch">
              <button onClick={() => setTab('overview')} className={`flex-1 flex items-center gap-1.5 px-4 text-xs font-medium transition-colors ${tab === 'overview' ? 'border-b-2 border-clay-600 text-clay-600' : 'text-[#404040] hover:bg-neutral-100'}`}>
                <LayoutGrid size={12} className="shrink-0" />
                Overview
              </button>
            </div>
            <div className="flex flex-col self-stretch">
              <button onClick={() => setTab('harms')} className={`flex-1 flex items-center gap-1.5 px-4 text-xs font-medium transition-colors ${tab === 'harms' ? 'border-b-2 border-clay-600 text-clay-600' : 'text-[#404040] hover:bg-neutral-100'}`}>
                <AlertTriangle size={12} className="shrink-0" />
                Harms
              </button>
            </div>
            <div className="flex flex-col self-stretch">
              <button onClick={() => setTab('interventions')} className={`flex-1 flex items-center gap-1.5 px-4 text-xs font-medium transition-colors ${tab === 'interventions' ? 'border-b-2 border-clay-600 text-clay-600' : 'text-[#404040] hover:bg-neutral-100'}`}>
                <SlidersHorizontal size={12} className="shrink-0" />
                Interventions
              </button>
            </div>
          </nav>
          <button onClick={() => setChatOpen(o => !o)} className={`self-stretch flex items-center justify-center px-3 transition-colors ${chatOpen ? 'bg-clay-50 text-clay-600' : 'hover:bg-neutral-100 text-[#404040]'}`}>
            <Sparkles size={16} />
          </button>
          <div className="w-px h-4 bg-[#d4d4d4] self-center shrink-0 mx-2" />
        </div>
        <UserCircle size={24} className="text-[#404040]" />
      </header>

      {/* ── Body ── */}
      {tab === 'harms' && (
        <main className="flex-1 flex gap-2.5 px-5 py-5 min-h-0">
          <HarmsContent chatOpen={chatOpen} />
        </main>
      )}
      {tab === 'interventions' && (
        <main className="flex-1 flex gap-2.5 px-5 py-5 min-h-0">
          <InterventionsContent chatOpen={chatOpen} />
        </main>
      )}
      {tab === 'overview' && <main className="flex-1 flex gap-2.5 px-5 py-5 min-h-0">
      <div className="flex-1 flex flex-col gap-2.5 min-h-0 min-w-0">

        {/* ── Overview & Analysis ── */}
        <section className="bg-card rounded-lg shadow-sm">
              <div className="flex items-stretch px-5 py-4 gap-5">
                {/* Left column */}
                <div className="w-[220px] shrink-0">
                  <h2 className="font-serif text-[28px] font-semibold text-foreground leading-tight mb-2">Microplastics</h2>
                  <p className="text-sm text-[#737373] leading-5">Tire Wear Particle Analysis : Tire wear particle emissions &amp; farmland deposition — California</p>
                </div>
                {/* Column divider */}
                <div className="w-px bg-[#e5e5e5] shrink-0 self-stretch" />
                <div className="flex-1 min-w-0">
                  <p className="text-base text-foreground leading-6 mb-3">
                    California highways emit an estimated <strong>922.3 tonnes of PM10</strong> and <strong>98 tonnes of PM2.5</strong> in tire wear particles annually across <strong>6,442 road segments</strong>. San Joaquin County ranks first in combined risk (score: 6,103), followed by Sacramento, Fresno, Kern, and Solano — all Central Valley counties where prevailing winds are exceptionally stable (CV 7.2%), concentrating deposition on the same farmland year after year.
                  </p>
                  <p className="text-base text-foreground leading-6 mb-3">
                    An estimated <strong>$45.1B</strong> in agricultural value sits within 5km of California highways. Sutter County leads farmland exposure at 82.5% of its ag land within the buffer, with Colusa (71.6%), Kings (70.2%), Glenn (63.4%), and Yolo (61.8%) close behind. PM10 settles on crops within 1–2km of the roadway; the finer PM2.5 fraction stays airborne and reaches farmworkers up to 5km away.
                  </p>
                  <p className="text-base text-foreground leading-6">
                    Los Angeles County is the largest single emitter at <strong>192.3 t/yr</strong>, reflecting its high AADT on a dense highway network. The 2020 COVID lockdowns provided a natural experiment — a <strong>10.1% drop</strong> in emissions (≈59 tonnes avoided) that closely tracks traffic volume reductions, validating the emissions model. With statewide traffic growing at +4.0% per decade, loading pressure will continue to rise without targeted intervention.
                  </p>
                </div>
                {/* Expert advisor card */}
                <div className="shrink-0 w-[480px] bg-bio-card rounded-lg overflow-hidden flex self-start">
                  <img src="/images/anup-sharma.png" alt="Anup Sharma" className="w-28 h-28 shrink-0 object-cover self-start rounded-xl m-3" />
                  <div className="flex-1 p-4">
                    <p className="font-serif text-base font-semibold text-foreground leading-5 mb-0.5">Anup Sharma, PhD</p>
                    <p className="text-sm text-[#737373] pb-2 mb-2 border-b border-[#e5e5e5]">Science Advisor · Calx Analyst</p>
                    <p className="text-sm text-[#404040] leading-5">
                      Translational epigenetics scientist at Yale School of Medicine with expertise in molecular mechanisms of disease and novel biomarker technologies.
                    </p>
                  </div>
                </div>
              </div>
        </section>

        {/* ── TWP Analysis ── */}
        <section className="bg-card rounded-lg shadow-sm overflow-hidden flex-1 flex flex-col min-h-0">

          {/* Panel header */}
          <div className="border-b border-[#e5e5e5] flex items-center gap-3 px-4 py-2.5">
            <p className="font-serif flex-1 text-xl font-semibold text-foreground leading-6">
              Analysis
            </p>
            <div className="flex items-center gap-2 shrink-0">
              <div className="relative flex items-center">
                <select className="text-xs text-[#404040] border border-[#d4d4d4] rounded-sm pl-2 pr-5 py-0.5 bg-card hover:bg-neutral-50 whitespace-nowrap appearance-none cursor-pointer" defaultValue="2023">
                  <option>10-yr average</option>
                  <option>2013</option>
                  <option>2014</option>
                  <option>2015</option>
                  <option>2016</option>
                  <option>2017</option>
                  <option>2018</option>
                  <option>2019</option>
                  <option>2020 (COVID)</option>
                  <option>2021</option>
                  <option>2022</option>
                  <option>2023</option>
                </select>
                <span className="pointer-events-none absolute right-1.5"><ChevronDownIcon /></span>
              </div>
              {['All counties', 'Sort: Combined risk', 'Buffer: 5km'].map(label => (
                <button key={label} className="flex items-center gap-1 text-xs text-[#404040] border border-[#d4d4d4] rounded-sm px-2 py-0.5 hover:bg-neutral-50 whitespace-nowrap">
                  {label} <ChevronDownIcon />
                </button>
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div className="border-b border-[#e5e5e5] flex">
            <StatMetric label="Statewide PM10" badge="measured" value="535" description="tonnes/yr — settles on crops within 1–2km of highway" />
            <StatMetric label="Statewide PM2.5" badge="measured" value="58" description="tonnes/yr — stays airborne, inhaled by farmworkers 5km+" />
            <StatMetric label="AG Value at Risk" badge="measured" value="$45.1B" description="crops growing within 5km of highways" />
            <StatMetric label="#1 Risk County" badge="derived" value={<span className="text-orange-500">SAN JOAQUIN</span>} description="highest combined: emissions + farmland + wind" />
            <StatMetric label="Wind Stability" badge="measured" value="CV 7.2%" description="wind blows the same way every year — patterns are reliable" />
            <StatMetric label="COVID Impact" badge="measured" value={<span className="text-green-600">-10.1%</span>} description="59 tonnes of tire dust avoided in 2020 — a natural experiment" />
          </div>

          {/* Map layer tabs */}
          <div className="border-b border-[#e5e5e5] flex overflow-x-auto px-2 bg-stone-100">
            <MapTab label="Emission map" dotColor="#22c55e" active />
            <MapTab label="Farmland" dotColor="#22c55e" />
            <MapTab label="Wind + transport" dotColor="#22c55e" />
            <MapTab label="Human exposure" dotColor="#ef4444" />
            <MapTab label="Trends" dotColor="#22c55e" />
            <MapTab label="Economic impact" />
            <MapTab label="Models" dotColor="#3b82f6" />
            <MapTab label="Applications" />
            <MapTab label="Compound explorer" dotColor="#ef4444" />
          </div>

          {/* Map canvas + data sidebar */}
          <div className="flex flex-1 min-h-0">

            {/* Map */}
            <div className="flex-1 relative overflow-hidden bg-map-canvas">
              <div className="absolute inset-0 flex items-center justify-center select-none">
                <p className="text-[#9ca3af] text-sm">California map</p>
              </div>

              {/* Marker legend — bottom-right overlay */}
              <div className="absolute bottom-4 right-3 bg-card rounded-lg shadow-md p-3">
                <p className="text-[10px] font-semibold text-foreground mb-1.5">Marker colors (ag within buffer)</p>
                {[
                  { color: '#ef4444', label: '>40% farmland' },
                  { color: '#f97316', label: '20-40% farmland' },
                  { color: '#3b82f6', label: '5-20% farmland' },
                  { color: '#9ca3af', label: '<5% farmland' },
                ].map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-1.5 py-0.5">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <p className="text-[10px] text-[#404040]">{label}</p>
                  </div>
                ))}
                <p className="text-[9px] text-[#737373] mt-1.5">Size = combined risk score</p>
              </div>

              {/* Zoom island */}
              <div className="absolute bottom-4 left-3 bg-card rounded-lg shadow-md overflow-hidden">
                <button className="w-8 h-[34px] flex items-center justify-center hover:bg-neutral-50 border-b border-[#e5e5e5] text-sm font-medium text-[#404040]">+</button>
                <button className="w-8 h-[34px] flex items-center justify-center hover:bg-neutral-50 text-sm font-medium text-[#404040]">−</button>
              </div>

              {/* Hotspots + Buffer island */}
              <div className="absolute bottom-4 left-14 bg-card rounded-lg shadow-md px-3 py-2 flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs text-[#404040] font-medium whitespace-nowrap w-16 shrink-0">Hotspots:</p>
                  {['None', 'All', 'Ramps', 'Hwy-farm', 'Convergence'].map(label => (
                    <button
                      key={label}
                      className={`text-xs px-2 py-0.5 rounded font-medium whitespace-nowrap ${
                        label === 'None' ? 'bg-green-600 text-white' : 'border border-[#d4d4d4] text-[#404040] hover:bg-neutral-50'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1.5">
                  <p className="text-xs text-[#404040] font-medium whitespace-nowrap w-16 shrink-0">Buffer:</p>
                  {['1km', '2km', '5km', 'Top 10', 'Bottom 10', 'All 58'].map(label => (
                    <button
                      key={label}
                      className={`text-xs px-2 py-0.5 rounded font-medium whitespace-nowrap ${
                        label === '5km' ? 'bg-green-600 text-white' : 'border border-[#d4d4d4] text-[#404040] hover:bg-neutral-50'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Data sidebar */}
            <div className="w-72 shrink-0 border-l border-[#e5e5e5] bg-card overflow-y-auto">
              <div className="px-3 py-2.5 border-b border-[#e5e5e5] bg-stone-100">
                <p className="text-sm font-semibold text-foreground">California — Statewide</p>
                <p className="text-xs text-[#737373]">58 counties · 2021 · Click any county</p>
              </div>

              <SidebarSection title="EMISSIONS (2021)" badge="measured">
                <DataRow label="Total PM10" value="922.3 t/yr" />
                <DataRow label="Total PM2.5" value="98 t/yr" valueClass="text-orange-500 font-semibold" />
                <p className="text-[10px] text-[#737373] px-3 py-1 leading-tight">
                  PM10 settles on crops (1-2km) · PM2.5 inhaled by workers (5km+)
                </p>
                <DataRow label="Segments" value="6,442" />
                <DataRow label="Avg AADT" value="37,121" />
                <DataRow label="10-yr growth" value="+4.0%" />
              </SidebarSection>

              <SidebarSection title="TOP 5 RISK COUNTIES" badge="derived">
                {[
                  { name: 'San Joaquin', value: 'risk: 6103' },
                  { name: 'Sacramento', value: 'risk: 5589' },
                  { name: 'Fresno', value: 'risk: 4733' },
                  { name: 'Kern', value: 'risk: 3816' },
                  { name: 'Solano', value: 'risk: 3423' },
                ].map(({ name, value }, i) => <RankedRow key={name} rank={i + 1} label={name} value={value} />)}
              </SidebarSection>

              <SidebarSection title="TOP 5 FARMLAND EXPOSURE (5KM)" badge="gis">
                {[
                  { name: 'Sutter', value: '82.5% ag within 5km' },
                  { name: 'Colusa', value: '71.6% ag within 5km' },
                  { name: 'Kings', value: '70.2% ag within 5km' },
                  { name: 'Glenn', value: '63.4% ag within 5km' },
                  { name: 'Yolo', value: '61.8% ag within 5km' },
                ].map(({ name, value }, i) => <RankedRow key={name} rank={i + 1} label={name} value={value} />)}
              </SidebarSection>

              <SidebarSection title="TOP 5 EMITTERS" badge="measured">
                {[
                  { name: 'Los Angeles', value: '192.3 t/yr' },
                  { name: 'San Diego', value: '82.8 t/yr' },
                  { name: 'San Bernardino', value: '73.3 t/yr' },
                  { name: 'Orange', value: '68 t/yr' },
                  { name: 'Riverside', value: '62.6 t/yr' },
                ].map(({ name, value }, i) => <RankedRow key={name} rank={i + 1} label={name} value={value} />)}
              </SidebarSection>
            </div>
          </div>

          {/* Bottom legend + sources */}
          <div className="border-t border-[#e5e5e5] flex items-center justify-between px-4 py-1.5">
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
              CalTrans AADT 2013-2023 · CIMIS 12 stations · USDA AgComm · CropScape CDL · GIS 58 counties
            </p>
          </div>

        </section>
      </div>
      {chatOpen && <OverviewChat />}
      </main>}
    </div>
  )
}
