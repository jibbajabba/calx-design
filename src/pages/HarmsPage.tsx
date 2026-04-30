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
  { id: 'water-depletion',      lines: ['Water', 'Depletion'],      x: 420, y: 175, r: 58, color: '#c06060' },
  { id: 'agricultural-decline', lines: ['Agricultural', 'Decline'], x: 230, y: 335, r: 60, color: '#c07840' },
  { id: 'air-quality-decline',  lines: ['Air Quality', 'Decline'],  x: 710, y: 325, r: 54, color: '#5a6e7a' },
  { id: 'rural-migration',      lines: ['Rural', 'Migration'],      x: 460, y: 460, r: 62, color: '#a89830' },
  { id: 'food-insecurity',      lines: ['Food', 'Insecurity'],      x: 685, y: 550, r: 54, color: '#8c4040' },
  { id: 'wage-suppression',     lines: ['Wage', 'Suppression'],     x: 225, y: 575, r: 54, color: '#4a5c8c' },
  { id: 'urban-labor-pressure', lines: ['Urban Labor', 'Pressure'], x: 460, y: 720, r: 60, color: '#6b4a90' },
]

const EDGES: GraphEdge[] = [
  { from: 'agricultural-decline', to: 'water-depletion',      label: 'triggers',    dash: 'solid',  strength: 'moderate' },
  { from: 'water-depletion',      to: 'air-quality-decline',  label: 'worsens',     dash: 'dashed', strength: 'weak'     },
  { from: 'agricultural-decline', to: 'rural-migration',      label: 'causes',      dash: 'solid',  strength: 'strong'   },
  { from: 'rural-migration',      to: 'food-insecurity',      label: 'worsens',     dash: 'dashed', strength: 'moderate' },
  { from: 'rural-migration',      to: 'urban-labor-pressure', label: 'increases',   dash: 'dashed', strength: 'moderate' },
  { from: 'wage-suppression',     to: 'urban-labor-pressure', label: 'exacerbates', dash: 'dashed', strength: 'weak'     },
  { from: 'food-insecurity',      to: 'urban-labor-pressure', label: 'contributes', dash: 'dotted', strength: 'weak'     },
]

const NODE_DETAILS: Record<string, NodeDetail> = {
  'water-depletion': {
    title: 'WATER DEPLETION',
    currentState: 'Aquifer levels 23% below historical average',
    directlyAffects: ['Agricultural output', 'Ecosystem health', 'Municipal water supply'],
    downstreamEffects: ['Crop failures', 'Rural displacement', 'Food price inflation'],
  },
  'agricultural-decline': {
    title: 'AGRICULTURAL DECLINE',
    currentState: '$45.1B in ag value within 5km of highways',
    directlyAffects: ['Farm income', 'Rural employment', 'Food supply chain'],
    downstreamEffects: ['Rural outmigration', 'Food insecurity', 'Regional economic loss'],
  },
  'air-quality-decline': {
    title: 'AIR QUALITY DECLINE',
    currentState: 'PM2.5 at 62% above safe threshold',
    directlyAffects: ['Urban populations', 'Worker productivity', 'Health costs'],
    downstreamEffects: ['Healthcare burden', 'Labor absenteeism', 'Economic drag'],
  },
  'rural-migration': {
    title: 'RURAL MIGRATION',
    currentState: '12% decline in agricultural workforce since 2015',
    directlyAffects: ['Urban housing demand', 'Agricultural labor supply', 'Community tax base'],
    downstreamEffects: ['Urban overcrowding', 'Wage suppression', 'Service strain'],
  },
  'food-insecurity': {
    title: 'FOOD INSECURITY',
    currentState: 'Central Valley food bank usage up 34% since 2018',
    directlyAffects: ['Child development', 'Worker health', 'Healthcare utilization'],
    downstreamEffects: ['Labor absenteeism', 'Educational outcomes', 'Economic productivity'],
  },
  'wage-suppression': {
    title: 'WAGE SUPPRESSION',
    currentState: 'Ag wages 18% below statewide median',
    directlyAffects: ['Household income', 'Local spending', 'Worker retention'],
    downstreamEffects: ['Urban labor pressure', 'Reduced tax revenue', 'Service cuts'],
  },
  'urban-labor-pressure': {
    title: 'URBAN LABOR PRESSURE',
    currentState: 'Bay Area job vacancy rate at 6.2% in key sectors',
    directlyAffects: ['Service sector wages', 'Housing costs', 'Business productivity'],
    downstreamEffects: ['Cost of living increases', 'Business closures', 'Regional inequality'],
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

export default function HarmsContent({ chatOpen }: { chatOpen: boolean }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const nodeMap = Object.fromEntries(NODES.map(n => [n.id, n]))

  return (
    <>
      {/* ── Main graph panel ── */}
      <section className="bg-card rounded-lg shadow-sm flex-1 flex flex-col min-h-0">
        <div className="px-5 py-3 border-b border-[#e5e5e5] shrink-0">
          <p className="font-serif text-xl font-semibold text-foreground leading-6">
            Tire Wear Particle Analysis: Tire wear particle emissions &amp; farmland deposition — California
          </p>
        </div>

        {/* Aspect-ratio wrapper ensures SVG coords → % positions are exact */}
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

            {/* HTML popup — auto-height, positioned by SVG coordinate percentages */}
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
      <div className={`grid transition-all duration-300 ease-in-out ${chatOpen ? 'grid-cols-[240px]' : 'grid-cols-[0px]'} overflow-hidden`}>
      <div className="overflow-hidden">
      <aside className="w-[240px] shrink-0 bg-card rounded-lg shadow-sm flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#e5e5e5] shrink-0">
          <p className="text-[11px] font-semibold text-[#737373] tracking-widest uppercase">Harms Analysis Chat</p>
          <span className="bg-clay-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-[3px]">AI</span>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
          <p className="text-sm text-[#404040] leading-relaxed">
            Three causal chains account for an estimated 89% of microplastic loading into San Francisco Bay from the study area. The dominant chain — tire wear via freeway stormwater — alone drives 52% of total particles. Textile fibers are the second-largest source but follow a different pathway (residential drainage vs. freeway corridors), which matters for intervention design: solutions for tire wear don't address fibers, and vice versa.
          </p>
          <p className="text-sm text-[#404040] leading-relaxed">
            The strongest links in the chain (tire wear to stormwater, stormwater to Bay water) are well-supported by SFEI field measurements. The weakest links are the downstream health and economic impacts, where evidence is emerging but thresholds don't exist yet. This means we can confidently quantify the loading problem but can only estimate the cost of inaction.
          </p>
        </div>
        <div className="shrink-0 px-3 pb-3 pt-2 space-y-2 border-t border-[#e5e5e5]">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {[
              'What causes the most harm?',
              'How does 6PPD-q affect salmon?',
              'Which counties are most exposed?',
              'What are the health thresholds?',
              'How does stormwater carry TWP?',
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
