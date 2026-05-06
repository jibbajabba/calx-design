import { useState } from 'react'

type DashStyle = 'solid' | 'dashed' | 'dotted'
type Strength = 'weak' | 'moderate' | 'strong'

interface GraphNode {
  id: string
  lines: string[]
  x: number
  y: number
  r: number
  color: string
}

interface GraphEdge {
  from: string
  to: string
  label: string
  dash: DashStyle
  strength: Strength
}

interface NodeDetail {
  title: string
  currentState: string
  directlyAffects: string[]
  downstreamEffects: string[]
}

const NODES: GraphNode[] = [
  { id: 'chemical-exposure',    lines: ['Chemical', 'Exposure'],       x: 420, y: 175, r: 58, color: '#c06060' },
  { id: 'water-contamination',  lines: ['Water', 'Contamination'],     x: 230, y: 335, r: 60, color: '#3d6b5a' },
  { id: 'labor-exploitation',   lines: ['Labor', 'Exploitation'],      x: 710, y: 325, r: 54, color: '#c07840' },
  { id: 'wage-suppression',     lines: ['Wage', 'Suppression'],        x: 225, y: 575, r: 54, color: '#4a5c8c' },
  { id: 'community-health',     lines: ['Community', 'Health'],        x: 460, y: 460, r: 62, color: '#8c4040' },
  { id: 'child-labor-risk',     lines: ['Child Labor', 'Risk'],        x: 685, y: 550, r: 54, color: '#a89830' },
  { id: 'supply-chain-opacity', lines: ['Supply Chain', 'Opacity'],    x: 460, y: 720, r: 60, color: '#6b4a90' },
]

const EDGES: GraphEdge[] = [
  { from: 'chemical-exposure',    to: 'water-contamination', label: 'leaches into', dash: 'solid',  strength: 'strong'   },
  { from: 'chemical-exposure',    to: 'community-health',    label: 'degrades',     dash: 'dashed', strength: 'moderate' },
  { from: 'labor-exploitation',   to: 'wage-suppression',    label: 'causes',       dash: 'solid',  strength: 'strong'   },
  { from: 'labor-exploitation',   to: 'child-labor-risk',    label: 'increases',    dash: 'dashed', strength: 'moderate' },
  { from: 'water-contamination',  to: 'community-health',    label: 'worsens',      dash: 'solid',  strength: 'moderate' },
  { from: 'wage-suppression',     to: 'community-health',    label: 'contributes',  dash: 'dashed', strength: 'weak'     },
  { from: 'supply-chain-opacity', to: 'labor-exploitation',  label: 'enables',      dash: 'dotted', strength: 'weak'     },
]

const NODE_DETAILS: Record<string, NodeDetail> = {
  'chemical-exposure': {
    title: 'CHEMICAL EXPOSURE',
    currentState: '3,500+ dye chemicals used; 72% factories lack treatment',
    directlyAffects: ['River ecosystems', 'Worker skin/lung health', 'Groundwater quality'],
    downstreamEffects: ['Chronic illness rates', 'Reduced crop yields', 'Community displacement'],
  },
  'water-contamination': {
    title: 'WATER CONTAMINATION',
    currentState: 'Buriganga River oxygen near zero in factory zones',
    directlyAffects: ['Drinking water supply', 'Agricultural irrigation', 'Fish populations'],
    downstreamEffects: ['Food insecurity', 'Health costs', 'Rural outmigration'],
  },
  'labor-exploitation': {
    title: 'LABOR EXPLOITATION',
    currentState: 'Avg wage $95/mo; global brand margin 60%+',
    directlyAffects: ['Worker income', 'Household savings', 'Labor mobility'],
    downstreamEffects: ['Wage suppression', 'Child labor pressure', 'Community poverty'],
  },
  'wage-suppression': {
    title: 'WAGE SUPPRESSION',
    currentState: 'Bangladesh garment wage = 3% of retail price',
    directlyAffects: ['Household income', 'Education access', 'Healthcare access'],
    downstreamEffects: ['Generational poverty', 'Urban overcrowding', 'Labor unrest'],
  },
  'community-health': {
    title: 'COMMUNITY HEALTH',
    currentState: 'Respiratory illness 2.4× above national avg near EPZs',
    directlyAffects: ['Worker productivity', 'Healthcare utilization', 'Child development'],
    downstreamEffects: ['Labor absenteeism', 'Educational outcomes', 'Economic drag'],
  },
  'child-labor-risk': {
    title: 'CHILD LABOR RISK',
    currentState: '14% of garment supply chain sub-contractors use child labor',
    directlyAffects: ['Education enrollment', 'Long-term earning potential', 'Family dependency'],
    downstreamEffects: ['Generational poverty trap', 'Reduced workforce quality', 'Brand liability'],
  },
  'supply-chain-opacity': {
    title: 'SUPPLY CHAIN OPACITY',
    currentState: '62% of tier-2 suppliers unaudited by major brands',
    directlyAffects: ['Labor standards enforcement', 'Chemical use tracking', 'Brand accountability'],
    downstreamEffects: ['Labor exploitation', 'Chemical contamination', 'Regulatory evasion'],
  },
}

function sw(s: Strength) { return s === 'weak' ? 1.5 : s === 'moderate' ? 2.5 : 4 }
function da(d: DashStyle) { return d === 'dashed' ? '8 5' : d === 'dotted' ? '3 5' : undefined }

function edgePts(a: GraphNode, b: GraphNode) {
  const dx = b.x - a.x, dy = b.y - a.y
  const dist = Math.sqrt(dx * dx + dy * dy)
  const ux = dx / dist, uy = dy / dist
  return { x1: a.x + ux * (a.r + 2), y1: a.y + uy * (a.r + 2), x2: b.x - ux * (b.r + 2), y2: b.y - uy * (b.r + 2) }
}

export default function ApparelHarmsContent({ chatOpen }: { chatOpen: boolean }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const nodeMap = Object.fromEntries(NODES.map(n => [n.id, n]))

  return (
    <>
      {/* ── Main graph panel ── */}
      <section className="bg-card rounded-lg shadow-sm flex-1 flex flex-col min-h-0">
        <div className="px-5 py-3 border-b border-[#e5e5e5] shrink-0">
          <p className="font-serif text-[30px] font-semibold text-foreground leading-tight">
            Apparel Analysis: Garment industry harms &amp; labor conditions — Bangladesh
          </p>
        </div>

        <div className="flex-1 flex items-center justify-center min-h-0 overflow-hidden">
          <div className="relative" style={{ aspectRatio: '960/800', height: '100%', maxWidth: '100%' }}>
            <svg viewBox="0 0 960 800" className="w-full h-full" style={{ userSelect: 'none' }}>

              {/* Edges */}
              {EDGES.map((edge, i) => {
                const a = nodeMap[edge.from], b = nodeMap[edge.to]
                const { x1, y1, x2, y2 } = edgePts(a, b)
                const mx = (x1 + x2) / 2, my = (y1 + y2) / 2
                const dx = x2 - x1, dy = y2 - y1, dist = Math.sqrt(dx * dx + dy * dy)
                const lx = mx + (-dy / dist) * 14, ly = my + (dx / dist) * 14
                return (
                  <g key={i}>
                    <line x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke="#a3a3a3" strokeWidth={sw(edge.strength)}
                      strokeDasharray={da(edge.dash)} strokeLinecap="round"
                    />
                    <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fill="#a3a3a3" fontSize={11}>
                      {edge.label}
                    </text>
                  </g>
                )
              })}

              {/* Nodes */}
              {NODES.map(node => (
                <g key={node.id} style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedId(p => p === node.id ? null : node.id)}>
                  <circle cx={node.x} cy={node.y} r={node.r} fill={node.color} />
                  {node.lines.map((line, i) => (
                    <text key={i} x={node.x} y={node.y + (i - (node.lines.length - 1) / 2) * 16}
                      textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={13} fontWeight={500}>
                      {line}
                    </text>
                  ))}
                </g>
              ))}

            </svg>

            {/* HTML popup */}
            {selectedId && NODE_DETAILS[selectedId] && (() => {
              const node = nodeMap[selectedId]
              const detail = NODE_DETAILS[selectedId]
              const onRight = node.x > 480
              return (
                <div
                  className="absolute bg-card border border-[#e5e5e5] rounded-lg shadow-md p-3 w-44"
                  style={{
                    top: `${Math.max(1, (node.y - node.r) / 800 * 100)}%`,
                    ...(onRight
                      ? { right: `${(960 - node.x + node.r + 12) / 960 * 100}%` }
                      : { left: `${(node.x + node.r + 12) / 960 * 100}%` }
                    ),
                  }}
                >
                  <p className="text-[9px] font-semibold text-[#737373] tracking-widest uppercase mb-2">{detail.title}</p>
                  <p className="text-[9px] font-bold text-foreground tracking-wide uppercase mb-0.5">Current State</p>
                  <p className="text-[10px] text-[#404040] mb-2">{detail.currentState}</p>
                  <p className="text-[9px] font-bold text-foreground tracking-wide uppercase mb-0.5">Directly Affects</p>
                  <ul className="mb-2">
                    {detail.directlyAffects.map(item => (
                      <li key={item} className="text-[10px] text-[#404040] flex gap-1 leading-4"><span>•</span><span>{item}</span></li>
                    ))}
                  </ul>
                  <p className="text-[9px] font-bold text-foreground tracking-wide uppercase mb-0.5">Downstream Effects</p>
                  <ul className="mb-2">
                    {detail.downstreamEffects.map(item => (
                      <li key={item} className="text-[10px] text-[#404040] flex gap-1 leading-4"><span>•</span><span>{item}</span></li>
                    ))}
                  </ul>
                  <button className="text-[10px] text-clay-600 flex items-center gap-1">
                    <span>→</span><span>Model interventions for this harm</span>
                  </button>
                </div>
              )
            })()}
          </div>
        </div>

        {/* Legend + footnote */}
        <div className="shrink-0 border-t border-[#e5e5e5] px-5 py-3 space-y-1.5">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-5">
              <span className="text-[9px] font-semibold text-[#737373] tracking-widest uppercase">Confidence</span>
              <LegendLine label="Confirmed" />
              <LegendLine dash="dashed" label="Estimated" />
              <LegendLine dash="dotted" label="Inferred" />
            </div>
            <div className="flex items-center gap-5">
              <span className="text-[9px] font-semibold text-[#737373] tracking-widest uppercase">Strength</span>
              <LegendLine weight={1.5} label="Weak" />
              <LegendLine weight={2.5} label="Moderate" />
              <LegendLine weight={4} label="Strong" />
            </div>
          </div>
          <p className="text-[10px] text-[#a3a3a3]">Click nodes to explore. Edge thickness = relationship strength.</p>
        </div>
      </section>

      {/* ── Chat sidebar ── */}
      <div className={`grid transition-all duration-300 ease-in-out shrink-0 ${chatOpen ? 'grid-cols-[240px]' : 'grid-cols-[0px]'} overflow-hidden`}><div className="w-[240px]" /></div>
      <aside className={`fixed top-11 right-0 bottom-0 w-[240px] bg-card border-l border-[#e5e5e5] flex flex-col transition-transform duration-300 ease-in-out z-30 ${chatOpen ? 'translate-x-0' : 'translate-x-[260px]'}`}>
        <div className="flex items-center justify-between px-4 py-3 border-y border-[#e5e5e5] shrink-0 bg-neutral-50">
          <p className="text-[11px] font-semibold text-[#737373] tracking-widest uppercase">Harms Analysis Chat</p>
          <span className="bg-clay-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-[3px]">AI</span>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
          <p className="text-sm text-[#404040] leading-relaxed">
            Supply chain opacity is the structural enabler — 62% of tier-2 suppliers are unaudited, allowing labor exploitation and chemical dumping to persist undetected. The dominant harm pathway is: brand purchasing pressure → wage suppression → child labor risk. Chemical contamination follows a separate pathway through unregulated dyeing discharge into the Buriganga River system. Both pathways converge on community health decline.
          </p>
        </div>
        <div className="shrink-0 px-3 pb-3 pt-2 space-y-2 border-t border-[#e5e5e5]">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {[
              'Which harms are most preventable?',
              'How does purchasing pressure cause wage suppression?',
              'What chemicals are most harmful?',
              'How does child labor enter the supply chain?',
              'What do audits actually measure?',
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

function LegendLine({ dash, weight = 2, label }: { dash?: DashStyle; weight?: number; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <svg width="36" height="6" className="shrink-0">
        <line x1="2" y1="3" x2="34" y2="3"
          stroke="#737373" strokeWidth={weight}
          strokeDasharray={dash === 'dashed' ? '6 3' : dash === 'dotted' ? '2 3' : undefined}
          strokeLinecap="round"
        />
      </svg>
      <span className="text-xs text-[#737373]">{label}</span>
    </div>
  )
}
