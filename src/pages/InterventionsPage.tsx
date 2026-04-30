import { useState } from 'react'
import type { ReactNode } from 'react'
import { Download, Check, TrendingUp, AlertTriangle, Droplets, Scale, Wind, CircleDollarSign } from 'lucide-react'

interface Intervention {
  icon: ReactNode
  label: string
}

const INTERVENTIONS: Intervention[] = [
  { icon: <Droplets size={14} />,         label: 'Water Recycling Program' },
  { icon: <Scale size={14} />,            label: 'Labor Rights Enforcement' },
  { icon: <Wind size={14} />,             label: 'Clean Air Initiative' },
  { icon: <CircleDollarSign size={14} />, label: 'Economic Stabilization Fund' },
]

const DETAILS = [
  { label: 'Investment', value: '$450M',                bold: false },
  { label: 'Timeline',   value: '5 Years',              bold: false },
  { label: 'Coverage',   value: '60% Facilities',       bold: false },
  { label: 'Tech',       value: 'Closed-Loop Systems',  bold: true  },
]

const SUMMARY_STATS = [
  { label: 'Migration',        value: '-9%',   positive: true,  sublabel: '' },
  { label: 'Operating Costs',  value: '+12%',  positive: false, sublabel: '' },
  { label: 'Water Use',        value: '-42%',  positive: true,  sublabel: 'Total Reduction' },
  { label: 'Jobs Created',     value: '+8000', positive: true,  sublabel: 'Total Employment' },
]

const TRADEOFFS = [
  { label: 'Energy Demand',          value: '+6%' },
  { label: 'Chemical treatment needs', value: ''  },
]

const BASELINE = [
  { label: 'Water Stress',        value: 'Critical (95%)', color: 'text-orange-500' },
  { label: 'Labor Pressure',      value: 'Severe',         color: 'text-red-500'    },
  { label: 'Migration Rate',      value: '+18%/yr',        color: 'text-orange-500' },
  { label: 'Community Stability', value: 'Low',            color: 'text-orange-500' },
  { label: 'Economic Output',     value: '$8.2B',          color: 'text-foreground' },
  { label: 'External Costs',      value: '$11.4B',         color: 'text-orange-500' },
]

const WITH_INTERVENTION = [
  { label: 'Water Stress',        value: 'Moderate (53%)', color: 'text-orange-500' },
  { label: 'Labor Pressure',      value: 'Stable',         color: 'text-green-600'  },
  { label: 'Migration Rate',      value: '+9%/yr',         color: 'text-orange-500' },
  { label: 'Community Stability', value: 'Improving',      color: 'text-green-600'  },
  { label: 'Economic Output',     value: '$8.8B',          color: 'text-foreground' },
  { label: 'External Costs',      value: '$6.1B',          color: 'text-green-600'  },
]

export default function InterventionsContent({ chatOpen }: { chatOpen: boolean }) {
  const [selected, setSelected] = useState(0)

  return (
    <>
      {/* ── Main panel ── */}
      <section className="bg-card rounded-lg shadow-sm flex-1 flex flex-col min-h-0 overflow-y-auto">

        {/* Title bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#e5e5e5] shrink-0">
          <p className="flex-1 leading-6">
            <span className="font-serif text-xl font-semibold text-foreground">Tire Wear Particle Analysis,</span>
            <span className="text-xl text-foreground"> Intervention Modeling</span>
          </p>
          <button className="text-[#737373] hover:text-foreground transition-colors">
            <Download size={16} />
          </button>
        </div>

        {/* Top: Intervention Modeling | Summary of Key Changes */}
        <div className="flex px-5 py-5 gap-0 shrink-0">

          {/* Left: Intervention Modeling */}
          <div className="w-[360px] shrink-0 pr-8">
            <p className="text-sm text-[#737373] mb-3">Intervention Modeling</p>
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
                  <span className="text-xs font-medium leading-4">{iv.label}</span>
                </button>
              ))}
            </div>
            {DETAILS.map(row => (
              <div key={row.label} className="flex items-center justify-between py-2.5 border-t border-[#e5e5e5]">
                <span className="text-sm text-[#404040]">{row.label}</span>
                <span className={`text-sm text-foreground ${row.bold ? 'font-semibold' : ''}`}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* Column divider */}
          <div className="w-px bg-[#e5e5e5] shrink-0 self-stretch" />

          {/* Right: Summary of Key Changes */}
          <div className="flex-1 min-w-0 pl-8">
            <p className="text-sm text-[#737373] mb-3">Summary of Key Changes</p>
            <div className="flex border border-[#e5e5e5] rounded-lg overflow-hidden mb-6">
              {SUMMARY_STATS.map((stat, i) => (
                <div key={i} className="flex-1 px-4 py-3 border-r border-[#e5e5e5] last:border-r-0">
                  <p className="text-sm text-[#737373] mb-1">{stat.label}</p>
                  <div className="flex items-center gap-1 mb-0.5">
                    {stat.positive
                      ? <Check size={12} className="text-green-600 shrink-0" />
                      : <TrendingUp size={12} className="text-orange-500 shrink-0" />
                    }
                    <span className={`text-2xl font-bold leading-none ${stat.positive ? 'text-green-600' : 'text-orange-500'}`}>
                      {stat.value}
                    </span>
                  </div>
                  {stat.sublabel && <p className="text-[10px] text-[#737373]">{stat.sublabel}</p>}
                </div>
              ))}
            </div>

            <p className="text-sm text-[#737373] mb-2">Tradeoffs &amp; Unintended Consequences</p>
            {TRADEOFFS.map((t, i) => (
              <div key={i} className="flex items-center gap-2 py-2.5 border-t border-[#e5e5e5]">
                <AlertTriangle size={13} className="text-orange-400 shrink-0" />
                <span className="text-sm text-[#404040] flex-1">{t.label}</span>
                {t.value && <span className="text-sm text-[#404040]">{t.value}</span>}
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
            <p className="text-sm text-foreground mb-4">Baseline (2030) - No Intervention</p>
            {BASELINE.map(m => (
              <div key={m.label} className="flex items-center justify-between py-3 border-b border-[#e5e5e5]">
                <span className="text-sm text-[#404040]">{m.label}</span>
                <span className={`text-sm font-medium ${m.color}`}>{m.value}</span>
              </div>
            ))}
            <div className="mt-4 bg-red-50 rounded-lg p-5">
              <p className="text-[40px] font-bold text-foreground leading-none mb-2">$3.2B</p>
              <p className="text-sm font-semibold text-foreground mb-1">Net Value</p>
              <p className="text-xs text-[#737373] italic">Continuation of current trajectory</p>
            </div>
          </div>

          {/* Column divider */}
          <div className="w-px bg-[#e5e5e5] shrink-0 self-stretch" />

          {/* Right: With Intervention */}
          <div className="flex-1 flex flex-col pl-8">
            <p className="text-sm text-foreground mb-4">With Intervention (2030)</p>
            {WITH_INTERVENTION.map(m => (
              <div key={m.label} className="flex items-center justify-between py-3 border-b border-[#e5e5e5]">
                <span className="text-sm text-[#404040]">{m.label}</span>
                <span className={`text-sm font-medium ${m.color}`}>{m.value}</span>
              </div>
            ))}
            <div className="mt-4 bg-green-50 rounded-lg p-5">
              <p className="text-[40px] font-bold text-foreground leading-none mb-2">+$2.7B</p>
              <p className="text-sm font-semibold text-foreground mb-1">Net Value</p>
              <p className="text-xs text-[#737373] italic">After water recycling program</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Chat sidebar ── */}
      <div className={`grid transition-all duration-300 ease-in-out self-stretch ${chatOpen ? 'grid-cols-[240px]' : 'grid-cols-[0px]'} overflow-hidden`}>
      <div className="overflow-hidden h-full">
      <aside className="w-[240px] shrink-0 bg-card rounded-lg shadow-sm flex flex-col h-full">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#e5e5e5] shrink-0">
          <p className="text-[11px] font-semibold text-[#737373] tracking-widest uppercase">Intervention Analysis Chat</p>
          <span className="bg-clay-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-[3px]">AI</span>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
          <p className="text-sm text-[#404040] leading-relaxed">
            You're viewing intervention projections for 2030. Without action, external costs hit $11.4B and water stress reaches critical levels. Each intervention card shows how those numbers shift.
          </p>
          <p className="text-sm text-[#404040] leading-relaxed">
            While water Recycling cuts external costs by $5.3B, it increases energy demand 6%. Want me to break down that tradeoff?
          </p>
        </div>
        <div className="shrink-0 px-3 pb-3 pt-2 space-y-2 border-t border-[#e5e5e5]">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {[
              'Compare all 4 interventions',
              'Rank by net value impact',
              'Which cuts the most emissions?',
              'What are the co-benefits?',
              'What does implementation cost?',
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
      </div>
      </div>
    </>
  )
}
