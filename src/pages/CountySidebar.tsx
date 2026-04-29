import type { ReactNode } from 'react'
import {
  COUNTY_NAMES, GIS, RISK_SCORES, BY_RISK, BY_AG5KM,
  USDA, WIND, ECONOMIC,
  mgdToTonnesYr, getEmissions,
} from '../data/countyData'
import type { BufferKey } from './EmissionMapTab'

// ── Shared primitives ──────────────────────────────────────────────────────

function MeasuredBadge() {
  return <span className="bg-green-50 text-green-600 text-[9px] font-semibold tracking-wider px-1.5 py-0.5 rounded">MEASURED</span>
}
function DerivedBadge() {
  return <span className="bg-orange-50 text-orange-500 text-[9px] font-semibold tracking-wider px-1.5 py-0.5 rounded">DERIVED</span>
}
function EstimatedBadge() {
  return <span className="bg-red-50 text-red-500 text-[9px] font-semibold tracking-wider px-1.5 py-0.5 rounded">ESTIMATED</span>
}
function GisBadge() {
  return <span className="bg-green-50 text-green-600 text-[9px] font-semibold tracking-wider px-1.5 py-0.5 rounded">GIS</span>
}

function Section({ title, badge, children }: { title: string; badge: ReactNode; children: ReactNode }) {
  return (
    <div className="border-t border-[#e5e5e5] py-2">
      <div className="flex items-center gap-1.5 px-3 mb-1.5 flex-wrap">
        <p className="text-[13px] font-semibold text-foreground tracking-widest uppercase">{title}</p>
        {badge}
      </div>
      {children}
    </div>
  )
}

function Row({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex items-center justify-between px-3 py-0.5">
      <p className="text-xs text-[#404040]">{label}</p>
      <p className={`text-sm font-medium text-right shrink-0 ml-2 ${valueClass ?? 'text-foreground'}`}>{value}</p>
    </div>
  )
}

function RankedRow({ rank, label, value, onClick }: { rank: number; label: string; value: string; onClick?: () => void }) {
  return (
    <div className={`flex items-center justify-between px-3 py-0.5 ${onClick ? 'cursor-pointer hover:bg-neutral-50' : ''}`} onClick={onClick}>
      <p className="text-xs text-[#404040]">{rank}. {label}</p>
      <p className="text-xs text-[#737373] text-right shrink-0 ml-2">{value}</p>
    </div>
  )
}

function BarRow({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="mx-3 my-1 h-2 rounded-full bg-neutral-100 overflow-hidden">
      <div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }} />
    </div>
  )
}

function Note({ children }: { children: ReactNode }) {
  return <p className="text-[10px] text-[#737373] px-3 pb-1 leading-tight">{children}</p>
}

function Callout({ children, color = 'green' }: { children: ReactNode; color?: 'green' | 'amber' | 'red' }) {
  const cls = color === 'red'
    ? 'bg-red-50 text-red-800'
    : color === 'amber'
    ? 'bg-orange-50 text-orange-800'
    : 'bg-green-50 text-green-800'
  return <p className={`text-[10px] leading-tight mx-3 mt-1 mb-2 px-2 py-1.5 rounded ${cls}`}>{children}</p>
}

// ── Statewide view ─────────────────────────────────────────────────────────

function StatewideContent({ year, buffer, onSelectCounty }: {
  year: string; buffer: BufferKey; onSelectCounty: (co: string) => void
}) {
  const yrLabel = year === 'avg' ? '10-yr average' : year

  // Compute statewide totals for selected year
  let totalPm10 = 0, totalPm25 = 0
  Object.keys(GIS).forEach(co => {
    const e = getEmissions(co, year)
    totalPm10 += Math.max(0, e.pm10)
    totalPm25 += Math.max(0, e.pm25)
  })
  const pm10Yr = mgdToTonnesYr(totalPm10)
  const pm25Yr = mgdToTonnesYr(totalPm25)

  const topRisk = BY_RISK.slice(0, 5)
  const topFarmland = BY_AG5KM.slice(0, 5)

  // Top emitters by pm10
  const emitters = Object.keys(GIS)
    .map(co => ({ co, pm10: getEmissions(co, year).pm10 }))
    .sort((a, b) => b.pm10 - a.pm10)
    .slice(0, 5)

  return (
    <>
      <Section title={`Emissions (${yrLabel})`} badge={<MeasuredBadge />}>
        <Row label="Total PM10" value={`${pm10Yr} t/yr`} />
        <Row label="Total PM2.5" value={`${pm25Yr} t/yr`} valueClass="text-blue-500 font-medium" />
        <Note>PM10 settles on crops (1–2km) · PM2.5 inhaled by workers (5km+)</Note>
        <Row label="Segments" value="6,442" />
        <Row label="Avg AADT" value="37,121" />
        <Row label="10-yr growth" value="+4.0%" />
      </Section>

      <Section title="Top 5 Risk Counties" badge={<DerivedBadge />}>
        {topRisk.map((co, i) => (
          <RankedRow key={co} rank={i + 1} label={COUNTY_NAMES[co] ?? co}
            value={`risk: ${Math.round(RISK_SCORES[co] ?? 0)}`}
            onClick={() => onSelectCounty(co)} />
        ))}
      </Section>

      <Section title={`Top 5 Farmland Exposure (${buffer}km)`} badge={<GisBadge />}>
        {topFarmland.map((co, i) => {
          const g = GIS[co]
          const pct = g?.[`b${buffer}_pct` as keyof typeof g] as number ?? 0
          return (
            <RankedRow key={co} rank={i + 1} label={COUNTY_NAMES[co] ?? co}
              value={`${pct}% ag within ${buffer}km`}
              onClick={() => onSelectCounty(co)} />
          )
        })}
      </Section>

      <Section title="Top 5 Emitters" badge={<MeasuredBadge />}>
        {emitters.map(({ co, pm10 }, i) => (
          <RankedRow key={co} rank={i + 1} label={COUNTY_NAMES[co] ?? co}
            value={`${mgdToTonnesYr(pm10)} t/yr`}
            onClick={() => onSelectCounty(co)} />
        ))}
      </Section>

      <Section title="Agriculture" badge={<MeasuredBadge />}>
        <Row label="Total ag value" value="$120.7B" />
        <Row label="Ag counties" value="51" />
        <Row label="Wind stations" value="12" />
        <Row label="Wind years" value="2013–2023" />
      </Section>
    </>
  )
}

// ── County drill-down view ─────────────────────────────────────────────────

function CountyContent({ co, year, buffer, onBack }: {
  co: string; year: string; buffer: BufferKey; onBack: () => void
}) {
  const e = getEmissions(co, year)
  const g = GIS[co] ?? {}
  const w = WIND[co] ?? {}
  const u = USDA[co] ?? {}
  const ec = ECONOMIC[co] ?? null
  const name = COUNTY_NAMES[co] ?? co
  const pm10Yr = mgdToTonnesYr(e.pm10)
  const pm25Yr = mgdToTonnesYr(e.pm25)
  const pm10TonnesYr = (e.pm10 * 365) / 1e9

  const bufPct = (g[`b${buffer}_pct` as keyof typeof g] as number) ?? 0
  const bufHa = (g[`b${buffer}_ha` as keyof typeof g] as number) ?? 0

  const depKg = (e.pm10 * 365) / 1e6 * (bufPct / 100) * 0.1
  const depPm25Kg = (e.pm25 * 365) / 1e6 * (bufPct / 100) * 0.15
  const depGha = bufHa > 0 ? (depKg * 1000) / bufHa : 0

  const znLow = Math.round(depKg * 0.01)
  const znHigh = Math.round(depKg * 0.02)
  const ppdLow = Math.round(depKg * 0.004)
  const ppdHigh = Math.round(depKg * 0.02)

  const risk = RISK_SCORES[co] ?? 0
  const rank = BY_RISK.indexOf(co) + 1

  const dominant = Object.entries(w.rose ?? {}).sort((a, b) => (b[1] as number) - (a[1] as number))[0]
  const atm = w.atmosphere ?? {}

  return (
    <>
      <Section title="Emissions" badge={<MeasuredBadge />}>
        <Row label="Segments" value={String(e.segs)} />
        <Row label="Avg AADT" value={e.avg_aadt.toLocaleString()} />
        <Row label="Max AADT" value={e.max_aadt.toLocaleString()} />
        <Row label="PM10" value={`${pm10Yr} t/yr`} />
        <Row label="PM2.5" value={`${pm25Yr} t/yr`} valueClass="text-blue-500 font-medium" />
        <Note>PM10 (coarse) settles on crops 1–2km · PM2.5 (fine) stays airborne 5km+</Note>
        <Callout>{pm10TonnesYr.toFixed(1)} tonnes/yr of tire dust — equivalent to grinding down {Math.round(pm10TonnesYr * 1000 / 4.5).toLocaleString()} car tires per year on {name}'s roads</Callout>
      </Section>

      {u.total_value ? (
        <Section title="Farmland" badge={<MeasuredBadge />}>
          <Row label="Ag value" value={`$${(u.total_value / 1e9).toFixed(2)}B`} />
          <Row label="Harvested acres" value={(u.total_acres as number).toLocaleString()} />
          <Row label="Commodities" value={String(u.commodities)} />
          {(u.top_crops as { crop: string }[])?.slice(0, 4).map((c: { crop: string }) => (
            <span key={c.crop} className="inline-block text-[9px] px-1.5 py-0.5 mx-1 mb-1 rounded bg-green-50 text-green-800">{c.crop}</span>
          ))}
        </Section>
      ) : null}

      {w.avg_wind ? (
        <>
          <Section title="Wind" badge={<MeasuredBadge />}>
            <Row label="Avg speed" value={`${w.avg_wind} m/s`} />
            <Row label="Dominant dir" value={dominant ? String(dominant[0]) : '—'} />
            <Row label="CV (stability)" value={`${w.cv}%`} />
            <Row label="Avg temp" value={`${w.avg_temp}°F`} />
          </Section>
          {atm.avg_mixing_ht ? (
            <Section title="Atmosphere" badge={<DerivedBadge />}>
              <Row label="Avg mixing height" value={`${atm.avg_mixing_ht}m`} />
              <Row label="Stable days (E/F)" value={`${atm.stable_pct}%`} valueClass="text-red-500 font-medium" />
              <Row label="Unstable days (A)" value={`${atm.unstable_pct}%`} valueClass="text-green-600 font-medium" />
              <Row label="Conc. multiplier" value={`${atm.avg_conc_mult}× avg`} />
              <Row label="Worst case" value={`${atm.max_conc_mult}× baseline`} valueClass="text-red-500 font-medium" />
              <Callout color="amber">Mixing height {atm.avg_mixing_ht}m. On stable nights ({atm.stable_pct}% of days) drops to {atm.min_mixing_ht}m — trapping particles near ground.</Callout>
            </Section>
          ) : null}
        </>
      ) : (
        <Section title="Wind" badge={<DerivedBadge />}>
          <Note>No CIMIS station in this county. Using nearest station data.</Note>
        </Section>
      )}

      <Section title={`GIS Proximity (showing ${buffer}km)`} badge={<GisBadge />}>
        <Row label="Ag within 1km" value={`${g.b1_pct}%`} valueClass={buffer === '1' ? 'font-bold text-foreground' : undefined} />
        <BarRow pct={g.b1_pct} color="#E24B4A" />
        <Note>Road splash zone — particles fall by gravity</Note>
        <Row label="Ag within 2km" value={`${g.b2_pct}%`} valueClass={buffer === '2' ? 'font-bold text-foreground' : undefined} />
        <BarRow pct={g.b2_pct} color="#EF9F27" />
        <Note>Heavy deposition zone — wind carries PM10</Note>
        <Row label="Ag within 5km" value={`${g.b5_pct}%`} valueClass={buffer === '5' ? 'font-bold text-foreground' : undefined} />
        <BarRow pct={g.b5_pct} color="#1D9E75" />
        <Note>Extended wind zone — PM2.5 reaches here</Note>
        <Callout>{Math.round(bufHa).toLocaleString()} ha ({Math.round(bufHa * 2.47).toLocaleString()} acres) of cropland within {buffer}km of {name} highways.</Callout>
      </Section>

      <Section title="Deposition" badge={<DerivedBadge />}>
        <Row label={`Farm PM10 (${buffer}km)`} value={`${Math.round(depKg).toLocaleString()} kg/yr`} />
        <Row label={`Farm PM2.5 (${buffer}km)`} value={`${Math.round(depPm25Kg).toLocaleString()} kg/yr`} valueClass="text-blue-500 font-medium" />
        <Row label="Per hectare" value={`${depGha.toFixed(1)} g/ha/yr`} />
        <Callout color="amber">{Math.round(depKg).toLocaleString()} kg of tire dust on farmland/yr. PM2.5 fraction ({Math.round(depPm25Kg).toLocaleString()} kg) stays airborne and is inhaled by farmworkers.</Callout>
      </Section>

      <Section title="Chemical Loading" badge={<EstimatedBadge />}>
        <Row label="Zinc" value={`${znLow}–${znHigh} kg/yr`} />
        <Row label="6PPD-q" value={`${ppdLow}–${ppdHigh} kg/yr`} />
        <Note>Sources: Wagner 2018, Tian 2022</Note>
      </Section>

      <Section title="Combined Risk" badge={<DerivedBadge />}>
        <Row label="Risk score" value={String(Math.round(risk))} />
        <Row label="Rank" value={`#${rank} of 58`} />
      </Section>

      {ec && ec.total_high > 0 ? (
        <Section title="Economic Impact" badge={<DerivedBadge />}>
          <Row label="Total cost" value={`$${(ec.total_low / 1e6).toFixed(0)}–${(ec.total_high / 1e6).toFixed(0)}M/yr`} valueClass="text-red-500 font-medium" />
          <Row label="Yield loss" value={`$${(ec.yield_loss_low / 1e6).toFixed(0)}–${(ec.yield_loss_high / 1e6).toFixed(0)}M`} />
          <Row label="Health cost" value={`$${(ec.health_cost / 1e6).toFixed(1)}M`} />
          <Row label="Farmworkers" value={(ec.farmworkers as number).toLocaleString()} />
          <Row label="DALY lost" value={`${ec.daly} yrs/yr`} />
          {ec.premature_deaths > 0.05 ? (
            <Callout color="red">{(ec.premature_deaths as number).toFixed(1)} premature deaths/yr. {Math.round(ec.hosp_cardio)} cardiac + {Math.round(ec.hosp_resp)} respiratory hospitalizations. EPA BenMAP methodology.</Callout>
          ) : null}
        </Section>
      ) : null}

      <div className="px-3 py-2">
        <button onClick={onBack} className="text-xs text-clay-600 hover:underline">← Back to statewide</button>
      </div>
    </>
  )
}

// ── Public component ───────────────────────────────────────────────────────

interface CountySidebarProps {
  selectedCounty: string | null
  year: string
  buffer: BufferKey
  onSelectCounty: (co: string | null) => void
}

export default function CountySidebar({ selectedCounty, year, buffer, onSelectCounty }: CountySidebarProps) {
  const yrLabel = year === 'avg' ? '10-yr average' : year

  return (
    <div className="w-72 shrink-0 border-l border-[#e5e5e5] bg-card overflow-y-auto">
      <div className="px-3 py-2.5 border-b border-[#e5e5e5] bg-stone-100 sticky top-0 z-10">
        <p className="text-sm font-semibold text-foreground">
          {selectedCounty ? `${COUNTY_NAMES[selectedCounty] ?? selectedCounty} County` : 'California — Statewide'}
        </p>
        <p className="text-xs text-[#737373]">
          {selectedCounty ? yrLabel : `58 counties · ${yrLabel} · Click any county`}
        </p>
      </div>

      {selectedCounty ? (
        <CountyContent co={selectedCounty} year={year} buffer={buffer} onBack={() => onSelectCounty(null)} />
      ) : (
        <StatewideContent year={year} buffer={buffer} onSelectCounty={co => onSelectCounty(co)} />
      )}
    </div>
  )
}
