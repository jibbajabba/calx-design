import { useState, useEffect } from 'react'
import { LayoutGrid, AlertTriangle, SlidersHorizontal, Sparkles, UserCircle, ChevronDown, X, Check } from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import apparelLifecycleChart from '../assets/apparel-lifecycle-chart.svg'
import ApparelHarmsContent from './ApparelHarmsPage'
import ApparelInterventionsContent from './ApparelInterventionsPage'
import BangladeshMap from './BangladeshMap'

// ─── Small reusable pieces ────────────────────────────────────────────────────

// ─── Page ─────────────────────────────────────────────────────────────────────

type ApparelTab = 'overview' | 'harms' | 'interventions'

function tabFromPath(path: string): ApparelTab {
  if (path === '/apparel/harms') return 'harms'
  if (path === '/apparel/interventions') return 'interventions'
  return 'overview'
}

export default function ApparelPage({ onHome, initialTab = 'overview' }: { onHome: () => void; initialTab?: ApparelTab }) {
  const [tab, setTab] = useState<ApparelTab>(initialTab)
  const [tabVisible, setTabVisible] = useState(true)
  const [chatOpen, setChatOpen] = useState(false)
  const [overviewCollapsed, setOverviewCollapsed] = useState(false)
  const [summaryExpanded, setSummaryExpanded] = useState(true)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [theme, setTheme] = useState<'wireframe' | 'branded'>('wireframe')
  const [year, setYear] = useState(2026)

  useEffect(() => {
    function onPop() {
      setTab(tabFromPath(window.location.pathname))
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  function switchTab(t: ApparelTab) {
    if (t === tab) return
    const path = t === 'overview' ? '/apparel' : `/apparel/${t}`
    history.pushState(null, '', path)
    setTabVisible(false)
    setTimeout(() => {
      setTab(t)
      setTabVisible(true)
    }, 150)
  }

  return (
    <div className="flex flex-col bg-background pt-11">

      {/* ── App Header ── */}
      <header className="bg-card flex items-center gap-2 h-11 px-5 shadow-xs fixed top-0 left-0 right-0 z-10">
        <button onClick={onHome} className="font-serif italic text-foreground text-xl font-semibold leading-6 shrink-0 hover:opacity-70 transition-opacity">
          Calx
        </button>
        <div className="w-px h-4 bg-[#d4d4d4] mx-1 shrink-0" />
        <div className="flex items-center gap-1.5 shrink-0">
          <button className="text-[#404040] text-xs font-medium hover:text-foreground">Apparel</button>
          <span className="text-[#d4d4d4] text-xs">/</span>
          <button className="text-[#404040] text-xs font-medium hover:text-foreground">Bangladesh</button>
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
          <ApparelHarmsContent chatOpen={chatOpen} />
        </main>
      )}
      {tab === 'interventions' && (
        <main className="flex gap-2.5 px-5 py-5 min-h-[calc(100vh-2.75rem)]">
          <ApparelInterventionsContent chatOpen={chatOpen} />
        </main>
      )}
      {tab === 'overview' && (
        <main className="flex gap-2.5 px-5 py-5">
          <div className="flex-1 flex flex-col gap-2.5 min-w-0">

            {/* ── Overview card ── */}
            <section className="bg-card rounded-lg shadow-sm shrink-0 relative">
              {overviewCollapsed && (
                <div className="flex items-center justify-between px-5 py-3">
                  <h2 className="font-serif text-xl font-semibold text-foreground leading-tight">Apparel Analysis</h2>
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
                      <p className="font-serif text-[30px] font-semibold text-foreground leading-tight mb-2">Apparel Analysis</p>
                      <p className="text-sm text-[#737373] leading-5">Garment industry harms &amp; labor conditions — Bangladesh</p>
                      <div className="mt-4 pt-4 border-t border-[#e5e5e5]">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-9 h-9 rounded-full bg-clay-100 flex items-center justify-center shrink-0">
                            <span className="text-clay-600 text-xs font-bold">PM</span>
                          </div>
                          <div className="min-w-0">
                            <Dialog.Trigger asChild>
                              <button className="text-sm font-semibold text-foreground hover:text-clay-600 transition-colors leading-4 text-left">Dr. Priya Mehta</button>
                            </Dialog.Trigger>
                            <p className="text-xs text-[#737373] leading-4">Trade &amp; Labor Economist · Calx Analyst</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-[#e5e5e5] flex flex-col gap-2">
                        <p className="text-sm text-[#737373] leading-relaxed">
                          Bangladesh is the world's 2nd largest garment exporter, shipping <strong className="text-foreground">$42.1B</strong> annually from <strong className="text-foreground">3,500+</strong> factories employing <strong className="text-foreground">4.1 million</strong> workers — 80% women. Factory concentration in Dhaka's export processing zones makes this the densest apparel production corridor in the world.
                        </p>
                        <p className="text-sm text-[#737373] leading-relaxed">
                          An estimated <strong className="text-foreground">$8.9B</strong> in annual external costs — chemical contamination, healthcare burden, lost productivity — are borne by communities, not brands. The average garment worker wage represents just <strong className="text-foreground">3% of retail price</strong>, while brand operating margins average 60%.
                        </p>
                        <p className="text-sm text-[#737373] leading-relaxed">
                          The 2013 Rana Plaza collapse (1,134 deaths) demonstrated systemic structural failure, yet <strong className="text-foreground">62% of tier-2 suppliers</strong> remain unaudited by major sourcing brands. Without binding liability frameworks, the cost gap between harm and accountability will widen as export volumes grow at +6%/yr.
                        </p>
                      </div>
                    </div>

                    <Dialog.Portal>
                      <Dialog.Overlay className="fixed inset-0 bg-black/30 z-[9998]" />
                      <Dialog.Content className="fixed inset-0 z-[9999] flex items-center justify-center p-6 outline-none">
                        <div className="relative bg-card rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                          <div className="flex items-center gap-4 px-6 pt-6 pb-4 border-b border-[#e5e5e5]">
                            <div className="w-20 h-20 rounded-xl bg-clay-100 flex items-center justify-center shrink-0">
                              <span className="text-clay-600 text-2xl font-bold">PM</span>
                            </div>
                            <div>
                              <Dialog.Title className="font-serif text-3xl font-semibold text-foreground leading-tight mb-0.5">Dr. Priya Mehta</Dialog.Title>
                              <Dialog.Description className="text-base text-[#737373]">Trade &amp; Labor Economist · Calx Analyst</Dialog.Description>
                            </div>
                          </div>
                          <div className="px-6 pt-4 pb-5">
                            <p className="text-base text-[#404040] leading-7">
                              Trade and labor economist specializing in global supply chain governance, with a focus on South and Southeast Asian apparel manufacturing. Her research examines the political economy of buyer-supplier power asymmetries, living wage policy, and the effectiveness of social compliance auditing in garment export industries.
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
                      <p className="text-[9px] font-bold tracking-widest uppercase text-[#444] font-mono">WHERE HARM IS PRICED — AND WHERE THE ACCOUNTABILITY GAP WIDENS</p>
                      <p className="text-[10px] text-[#666] leading-snug mb-1">Below the dashed line: share of worker &amp; community harm at each stage. Above: priced cost today (coral) versus 2026–28 (indigo).</p>
                      <img src={apparelLifecycleChart} alt="Apparel supply chain cost by stage" className="w-full h-auto" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ── Analysis section ── */}
            <section className="h-[calc(100vh-4.625rem)] flex flex-col bg-card rounded-lg shadow-sm overflow-hidden">

              {/* Panel header */}
              <div className="border-b border-[#e5e5e5] flex items-center gap-3 px-4 py-2.5 shrink-0">
                <p className="font-serif flex-1 text-xl font-semibold text-foreground leading-6">Analysis</p>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-[#a3a3a3]">2020</span>
                  <input
                    type="range" min={2020} max={2030} step={1} value={year}
                    onChange={e => setYear(Number(e.target.value))}
                    className="w-36 cursor-pointer"
                    style={{ accentColor: '#C0503A' }}
                  />
                  <span className="text-[10px] text-[#a3a3a3]">2030</span>
                  <span className="text-xs font-semibold text-foreground bg-[#f5f5f5] border border-[#e5e5e5] px-2 py-0.5 rounded min-w-[3rem] text-center">
                    {year}
                  </span>
                </div>
              </div>

              {/* Stats row — projected state */}
              {(() => {
                const BASELINE_YEAR = 2026
                const t = Math.max(0, Math.min(1, (year - BASELINE_YEAR) / (2030 - BASELINE_YEAR)))
                const stats = [
                  { label: 'Water Depletion',  baseline: 0.78, target: 0.95 },
                  { label: 'Labor Violations', baseline: 0.85, target: 0.97 },
                  { label: 'Air Quality',       baseline: 0.62, target: 0.91 },
                ]
                return (
                  <div className="border-b border-[#e5e5e5] flex items-stretch shrink-0">
                    {/* Left label */}
                    <div className="px-5 py-3 flex flex-col justify-center shrink-0">
                      <p className="text-sm font-semibold text-foreground leading-tight">
                        {year <= BASELINE_YEAR ? `Baseline ${year}` : `Projected State (${year})`}
                      </p>
                      <p className="text-[10px] text-[#737373] mt-0.5">Current Baseline {BASELINE_YEAR}</p>
                    </div>
                    {/* Indicator columns */}
                    {stats.map(({ label, baseline, target }) => {
                      const proj = baseline + (target - baseline) * t
                      const changed = proj > baseline + 0.005
                      return (
                        <div key={label} className="border-l border-[#e5e5e5] flex-1 px-5 py-3 flex items-center gap-3">
                          <span className="text-sm text-[#737373]">{label}</span>
                          <div className="flex items-baseline gap-1.5">
                            {changed && <span className="text-[#C0503A] text-sm">↑</span>}
                            <span className="text-[22px] font-bold text-[#C0503A] leading-none">
                              {Math.round(proj * 100)}%
                            </span>
                          </div>
                          <span className="text-[11px] text-[#a3a3a3] self-end pb-0.5">
                            {Math.round(baseline * 100)}%
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )
              })()}

              {/* Map area */}
              <div className="flex-1 min-h-0">
                <BangladeshMap year={year} />
              </div>

              {/* Bottom legend */}
              <div className="border-t border-[#e5e5e5] flex items-center justify-end px-4 py-1.5 shrink-0">
                <p className="text-[9px] text-[#737373]">
                  BGMEA 2023 · ILO Labor Standards · BWDB Water Quality · UN Comtrade Export Data
                </p>
              </div>
            </section>
          </div>

          <div className={`grid transition-all duration-300 ease-in-out shrink-0 ${chatOpen ? 'grid-cols-[240px]' : 'grid-cols-[0px]'} overflow-hidden`}><div className="w-[240px]" /></div>
          <aside className={`fixed top-11 right-0 bottom-0 w-[240px] bg-card border-l border-[#e5e5e5] flex flex-col transition-transform duration-300 ease-in-out z-30 ${chatOpen ? 'translate-x-0' : 'translate-x-[260px]'}`}>
                <div className="flex items-center justify-between px-4 py-3 border-y border-[#e5e5e5] shrink-0 bg-neutral-50">
                  <p className="text-[11px] font-semibold text-[#737373] tracking-widest uppercase">Overview Analysis Chat</p>
                  <span className="bg-clay-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-[3px]">AI</span>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 text-center min-h-0">
                  <div className="w-8 h-8 rounded-full bg-clay-50 flex items-center justify-center mb-3">
                    <span className="text-clay-600 text-sm font-bold">AI</span>
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1">Ask about this analysis</p>
                  <p className="text-sm text-[#737373] leading-relaxed">Use the suggested prompts below or type your own question about Bangladesh apparel, labor conditions, or export economics.</p>
                </div>
                <div className="shrink-0 px-3 pb-3 pt-2 space-y-2 border-t border-[#e5e5e5]">
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {[
                      'Where are factories concentrated?',
                      'What is the wage gap?',
                      'How does Rana Plaza matter today?',
                      'Which brands source from Bangladesh?',
                      'What is an EPZ?',
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
        </main>
      )}
      </div>

    </div>
  )
}
