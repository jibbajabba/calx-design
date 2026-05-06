import { useState } from 'react'
import type { ReactNode } from 'react'
import { Download, Check, TrendingUp, AlertTriangle, CircleDollarSign, Scale, Globe } from 'lucide-react'

interface Intervention {
  icon: ReactNode
  label: string
}

const INTERVENTIONS: Intervention[] = [
  { icon: <CircleDollarSign size={14} />, label: 'Wage Floor Legislation' },
  { icon: <Scale size={14} />,            label: 'Chemical Disclosure Law' },
  { icon: <AlertTriangle size={14} />,    label: 'Brand Liability Framework' },
  { icon: <Globe size={14} />,            label: 'Worker Cooperative Fund' },
]

const DETAILS = [
  { label: 'Investment', value: '$180M',                 bold: false },
  { label: 'Timeline',   value: '3 Years',               bold: false },
  { label: 'Coverage',   value: '85% Factories',         bold: false },
  { label: 'Tech',       value: 'Digital Traceability',  bold: true  },
]

const SUMMARY_STATS = [
  { label: 'Child Labor Risk',    value: '-61%',   positive: true,  sublabel: '' },
  { label: 'Chemical Discharge', value: '-38%',   positive: true,  sublabel: '' },
  { label: 'Operating Costs',    value: '+9%',    positive: false, sublabel: '' },
  { label: 'Jobs Formalized',    value: '+125K',  positive: true,  sublabel: 'Total Employment' },
]

const TRADEOFFS = [
  { label: 'Brand sourcing may shift to lower-regulation markets', value: '' },
  { label: 'Compliance cost increase for small factories',          value: '+9%' },
]

const BASELINE = [
  { label: 'Wage Compliance',      value: '23% of factories',  color: 'text-orange-500' },
  { label: 'Child Labor Incidence', value: '14%',              color: 'text-red-500'    },
  { label: 'Chemical Violations',  value: '68% unreported',    color: 'text-orange-500' },
  { label: 'Brand Accountability', value: 'Voluntary only',    color: 'text-orange-500' },
  { label: 'Export Value',         value: '$51B',              color: 'text-foreground' },
  { label: 'External Costs',       value: '$8.9B',             color: 'text-orange-500' },
]

const WITH_INTERVENTION = [
  { label: 'Wage Compliance',      value: '91% of factories',  color: 'text-green-600' },
  { label: 'Child Labor Incidence', value: '5.5%',             color: 'text-green-600' },
  { label: 'Chemical Violations',  value: '12% unreported',    color: 'text-green-600' },
  { label: 'Brand Accountability', value: 'Legally binding',   color: 'text-green-600' },
  { label: 'Export Value',         value: '$54B',              color: 'text-foreground' },
  { label: 'External Costs',       value: '$3.2B',             color: 'text-green-600' },
]

export default function ApparelInterventionsContent({ chatOpen }: { chatOpen: boolean }) {
  const [selected, setSelected] = useState(0)

  return (
    <>
      {/* ── Main panel ── */}
      <section className="bg-card rounded-lg shadow-sm flex-1 flex flex-col min-h-0 overflow-y-auto">

        {/* Title bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#e5e5e5] shrink-0">
          <p className="flex-1 leading-6">
            <span className="font-serif text-[30px] font-semibold text-foreground leading-tight">Apparel Analysis,</span>
            <span className="text-[30px] text-foreground leading-tight"> Intervention Modeling</span>
          </p>
          <button className="text-[#737373] hover:text-foreground transition-colors">
            <Download size={16} />
          </button>
        </div>

        {/* Top: Intervention Modeling | Summary of Key Changes */}
        <div className="flex px-5 py-5 gap-0 shrink-0">

          {/* Left: Intervention Modeling */}
          <div className="w-[360px] shrink-0 pr-8">
            <p className="text-3xl font-semibold text-foreground mb-3">Intervention Modeling</p>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {INTERVENTIONS.map((iv, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`flex items-start gap-2 px-3 py-3 rounded-lg border text-left transition-colors ${
                    i === selected
                      ? 'bg-clay-100 border-clay-200 text-clay-900'
                      : 'border-[#e5e5e5] text-[#404040] hover:bg-neutral-50'
                  }`}
                >
                  <span className="shrink-0 mt-0.5">{iv.icon}</span>
                  <span className="text-lg font-medium leading-4">{iv.label}</span>
                </button>
              ))}
            </div>
            {DETAILS.map(row => (
              <div key={row.label} className="flex items-center justify-between py-2.5 border-t border-[#e5e5e5]">
                <span className="text-lg text-[#404040]">{row.label}</span>
                <span className="text-lg text-foreground font-semibold">{row.value}</span>
              </div>
            ))}
          </div>

          {/* Column divider */}
          <div className="w-px bg-[#e5e5e5] shrink-0 self-stretch" />

          {/* Right: Summary of Key Changes */}
          <div className="flex-1 min-w-0 pl-8">
            <p className="text-3xl font-semibold text-foreground mb-3">Summary of Key Changes</p>
            <div className="flex border border-[#e5e5e5] rounded-lg overflow-hidden mb-6">
              {SUMMARY_STATS.map((stat, i) => (
                <div key={i} className="flex-1 px-4 py-3 border-r border-[#e5e5e5] last:border-r-0">
                  <p className="text-lg font-semibold text-[#737373] mb-1">{stat.label}</p>
                  <div className="flex items-center gap-1 mb-0.5">
                    {stat.positive
                      ? <Check size={12} className="text-green-600 shrink-0" />
                      : <TrendingUp size={12} className="text-orange-500 shrink-0" />
                    }
                    <span className={`text-3xl font-bold leading-none ${stat.positive ? 'text-green-600' : 'text-orange-500'}`}>
                      {stat.value}
                    </span>
                  </div>
                  {stat.sublabel && <p className="text-lg text-[#737373]">{stat.sublabel}</p>}
                </div>
              ))}
            </div>

            <p className="text-3xl font-semibold text-foreground mb-3">Tradeoffs &amp; Unintended Consequences</p>
            {TRADEOFFS.map((t, i) => (
              <div key={i} className="flex items-center gap-2 py-2.5 border-t border-[#e5e5e5]">
                <AlertTriangle size={13} className="text-orange-400 shrink-0" />
                <span className="text-lg text-[#404040] flex-1">{t.label}</span>
                {t.value && <span className="text-lg text-[#404040]">{t.value}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Section divider */}
        <div className="border-t border-[#e5e5e5] mx-5 shrink-0" />

        {/* Bottom: Baseline vs With Intervention */}
        <div className="flex px-5 py-5 gap-0 flex-1">

          {/* Left: Baseline */}
          <div className="flex-1 flex flex-col pr-8">
            <p className="text-3xl font-semibold text-foreground mb-4">Baseline (2030) - No Intervention</p>
            {BASELINE.map(m => (
              <div key={m.label} className="flex items-center justify-between py-3 border-b border-[#e5e5e5]">
                <span className="text-lg text-[#404040]">{m.label}</span>
                <span className={`text-lg font-medium ${m.color}`}>{m.value}</span>
              </div>
            ))}
            <div className="mt-4 bg-red-50 rounded-lg p-5">
              <p className="text-[40px] font-bold text-foreground leading-none mb-2">$4.1B</p>
              <p className="text-lg font-semibold text-foreground mb-1">Net Value</p>
              <p className="text-lg text-[#737373] italic">Projected trajectory</p>
            </div>
          </div>

          {/* Column divider */}
          <div className="w-px bg-[#e5e5e5] shrink-0 self-stretch" />

          {/* Right: With Intervention */}
          <div className="flex-1 flex flex-col pl-8">
            <p className="text-3xl font-semibold text-foreground mb-4">With Intervention (2030)</p>
            {WITH_INTERVENTION.map(m => (
              <div key={m.label} className="flex items-center justify-between py-3 border-b border-[#e5e5e5]">
                <span className="text-lg text-[#404040]">{m.label}</span>
                <span className={`text-lg font-medium ${m.color}`}>{m.value}</span>
              </div>
            ))}
            <div className="mt-4 bg-green-50 rounded-lg p-5">
              <p className="text-[40px] font-bold text-foreground leading-none mb-2">+$5.8B</p>
              <p className="text-lg font-semibold text-foreground mb-1">Net Value</p>
              <p className="text-lg text-[#737373] italic">After wage floor + liability</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Chat sidebar ── */}
      <div className={`grid transition-all duration-300 ease-in-out shrink-0 ${chatOpen ? 'grid-cols-[240px]' : 'grid-cols-[0px]'} overflow-hidden`}><div className="w-[240px]" /></div>
      <aside className={`fixed top-11 right-0 bottom-0 w-[240px] bg-card border-l border-[#e5e5e5] flex flex-col transition-transform duration-300 ease-in-out z-30 ${chatOpen ? 'translate-x-0' : 'translate-x-[260px]'}`}>
        <div className="flex items-center justify-between px-4 py-3 border-y border-[#e5e5e5] shrink-0 bg-neutral-50">
          <p className="text-[11px] font-semibold text-[#737373] tracking-widest uppercase">Intervention Analysis Chat</p>
          <span className="bg-clay-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-[3px]">AI</span>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
          <p className="text-sm text-[#404040] leading-relaxed">
            The highest-leverage intervention is the Brand Liability Framework — it shifts accountability upstream to buyers whose margin structure currently incentivizes wage suppression. Wage Floor Legislation alone cuts child labor risk by 61% because household income pressure is the primary driver of early workforce entry. Want me to model how these interact?
          </p>
        </div>
        <div className="shrink-0 px-3 pb-3 pt-2 space-y-2 border-t border-[#e5e5e5]">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {[
              'Which intervention has the highest ROI?',
              'How does brand liability work legally?',
              'What countries have wage floor laws?',
              'Model all 4 interventions combined',
              'What\'s the timeline for full compliance?',
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
    </>
  )
}
