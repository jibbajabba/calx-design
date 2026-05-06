import { useEffect, useRef, useState } from 'react' // useState used for mapReady
import 'leaflet/dist/leaflet.css'
import type { Map as LeafletMap, LayerGroup } from 'leaflet'

// ── Region data ──────────────────────────────────────────────────────────────
// [name, swLat, swLon, neLat, neLon, laborRisk, waterStress, airQuality]
type Region = readonly [string, number, number, number, number, number, number, number]

const REGIONS: Region[] = [
  // Rangpur Division (NW)
  ['Rangpur N',          25.8, 88.7, 26.6, 89.5, 0.50, 0.58, 0.36],
  ['Rangpur S',          25.0, 88.7, 25.8, 89.5, 0.55, 0.62, 0.40],
  ['Dinajpur',           25.1, 88.1, 26.0, 88.8, 0.52, 0.60, 0.38],
  // Rajshahi Division (W)
  ['Rajshahi',           24.1, 88.0, 25.1, 89.0, 0.72, 0.68, 0.55],
  ['Bogra-Pabna',        23.9, 88.8, 25.0, 89.7, 0.68, 0.65, 0.52],
  ['Natore',             24.3, 88.5, 24.8, 89.1, 0.62, 0.63, 0.50],
  // Mymensingh Division (N-center)
  ['Mymensingh N',       24.5, 89.8, 25.3, 90.8, 0.64, 0.54, 0.57],
  ['Mymensingh S',       24.0, 89.7, 24.6, 90.8, 0.70, 0.57, 0.62],
  // Sylhet Division (NE) — high air/water
  ['Sylhet N',           24.5, 91.4, 25.2, 92.6, 0.40, 0.70, 0.82],
  ['Sylhet S',           23.8, 91.0, 24.5, 92.2, 0.48, 0.67, 0.78],
  ['Moulvibazar',        24.0, 91.6, 24.6, 92.3, 0.44, 0.65, 0.74],
  // Dhaka Division (center) — highest labor
  ['Gazipur',            23.9, 90.1, 24.3, 90.7, 0.88, 0.78, 0.84],
  ['Dhaka Metro',        23.6, 90.2, 24.0, 90.9, 0.93, 0.82, 0.88],
  ['Dhaka W',            23.5, 89.5, 24.1, 90.2, 0.76, 0.72, 0.68],
  ['Narayanganj',        23.2, 90.4, 23.7, 91.0, 0.91, 0.86, 0.82],
  ['Tangail-Manikganj',  23.7, 89.8, 24.3, 90.4, 0.72, 0.68, 0.64],
  // Comilla / Chattogram boundary
  ['Comilla',            23.2, 90.8, 23.9, 91.4, 0.74, 0.64, 0.68],
  ['Noakhali-Feni',      22.5, 90.8, 23.2, 91.6, 0.68, 0.73, 0.62],
  // Khulna Division (SW) — high water stress, Sundarbans
  ['Jessore',            23.0, 89.0, 23.8, 89.9, 0.64, 0.70, 0.54],
  ['Khulna N',           22.7, 88.9, 23.4, 89.9, 0.60, 0.76, 0.50],
  ['Khulna-Satkhira',    21.8, 88.5, 22.7, 89.7, 0.52, 0.86, 0.44],
  // Barisal Division (S delta)
  ['Barisal',            22.4, 89.9, 23.2, 90.6, 0.56, 0.74, 0.50],
  ['Coastal Delta',      21.7, 89.8, 22.4, 90.8, 0.50, 0.84, 0.46],
  // Chattogram Division (SE)
  ['Chattogram City',    22.1, 91.6, 23.2, 92.3, 0.88, 0.74, 0.86],
  ['Chattogram N',       23.2, 91.2, 24.4, 92.5, 0.70, 0.60, 0.80],
  ['Hill Tracts',        22.0, 91.0, 23.2, 92.0, 0.44, 0.52, 0.58],
  ['Cox Bazar',          21.3, 91.8, 22.1, 92.4, 0.62, 0.66, 0.70],
]

// ── Indicators ───────────────────────────────────────────────────────────────

interface Indicator {
  label: string
  baseline: number   // 0–1 at 2026
  target: number     // 0–1 at 2030
  color: string
}

const INDICATORS: Record<string, Indicator> = {
  water: { label: 'Water Depletion',     baseline: 0.78, target: 0.95, color: '#cc3333' },
  air:   { label: 'Air Quality',          baseline: 0.62, target: 0.91, color: '#cc7700' },
  labor: { label: 'Labor Violations',    baseline: 0.85, target: 0.97, color: '#880000' },
  eco:   { label: 'Economic Instability', baseline: 0.45, target: 0.78, color: '#cc8800' },
}
const BASELINE = 2026

function project(ind: Indicator, year: number): number {
  const t = Math.max(0, Math.min(1, (year - BASELINE) / (2030 - BASELINE)))
  return ind.baseline + (ind.target - ind.baseline) * t
}

// Key colors: water stress=#cc3333 (red), labor risk=#cc7700 (orange), env load=#cc8800 (yellow)
function regionColor(labor: number, water: number, air: number, year: number): string {
  const t = Math.max(0, (year - BASELINE) / 4)
  const l = Math.min(1, labor * (1 + 0.14 * t))
  const w = Math.min(1, water * (1 + 0.22 * t))
  const a = Math.min(1, air   * (1 + 0.47 * t))

  const combined = l * 0.50 + w * 0.30 + a * 0.20

  if (combined > 0.87) return 'rgba(14, 3, 8, 0.95)'
  if (combined > 0.78) return 'rgba(80, 8, 20, 0.90)'

  // Determine dominant indicator and blend toward its key color
  const opacity = 0.35 + 0.55 * combined
  if (w >= l && w >= a) {
    // Water stress dominant → red #cc3333
    const i = w
    return `rgba(${Math.round(140 + 64 * i)}, ${Math.round(20 + 31 * (1 - i))}, ${Math.round(20 + 31 * (1 - i))}, ${opacity})`
  }
  if (l >= w && l >= a) {
    // Labor risk dominant → orange #cc7700
    const i = l
    return `rgba(${Math.round(140 + 64 * i)}, ${Math.round(60 + 59 * i)}, 0, ${opacity})`
  }
  // Environmental load dominant → yellow #cc8800
  const i = a
  return `rgba(${Math.round(140 + 64 * i)}, ${Math.round(70 + 66 * i)}, 0, ${opacity})`
}

// ── Component ────────────────────────────────────────────────────────────────

export default function BangladeshMap({ year }: { year: number }) {
  const [mapReady, setMapReady] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<LeafletMap | null>(null)
  const regionLayerRef = useRef<LayerGroup | null>(null)

  // Init map
  useEffect(() => {
    if (mapRef.current || !containerRef.current) return
    import('leaflet').then(L => {
      const map = L.map(containerRef.current!, {
        zoomControl: false,
        center: [23.8, 90.4],
        zoom: 7,
      })
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© CartoDB',
        maxZoom: 18,
      }).addTo(map)
      L.control.zoom({ position: 'bottomleft' }).addTo(map)
      regionLayerRef.current = L.layerGroup().addTo(map)
      mapRef.current = map
      setMapReady(true)
    })
    return () => { mapRef.current?.remove(); mapRef.current = null }
  }, [])

  // Rebuild region circles when year changes
  useEffect(() => {
    if (!mapReady || !mapRef.current || !regionLayerRef.current) return
    import('leaflet').then(L => {
      regionLayerRef.current!.clearLayers()
      REGIONS.forEach(([name, swLat, swLon, neLat, neLon, labor, water, air]) => {
        const fill = regionColor(labor, water, air, year)
        const lat = (swLat + neLat) / 2
        const lng = (swLon + neLon) / 2
        // Scale radius by region span (larger divisions get bigger circles)
        const spanKm = Math.sqrt(((neLat - swLat) * 111) ** 2 + ((neLon - swLon) * 89) ** 2)
        const radiusM = spanKm * 500
        const circle = L.circle([lat, lng], {
          radius: radiusM,
          color: 'rgba(255,255,255,0.15)',
          weight: 0.8,
          fillColor: fill,
          fillOpacity: 0.82,
          interactive: true,
        })
        const t = Math.max(0, (year - BASELINE) / 4)
        const lProj = Math.round(Math.min(1, labor * (1 + 0.14 * t)) * 100)
        const wProj = Math.round(Math.min(1, water * (1 + 0.22 * t)) * 100)
        const aProj = Math.round(Math.min(1, air   * (1 + 0.47 * t)) * 100)
        circle.bindTooltip(
          `<b>${name}</b><br>Labor: ${lProj}% · Water: ${wProj}% · Air: ${aProj}%`,
          { direction: 'top' }
        )
        circle.addTo(regionLayerRef.current!)
      })
    })
  }, [mapReady, year])

  const wProj  = project(INDICATORS.water, year)
  const lProj  = project(INDICATORS.labor, year)
  const aProj  = project(INDICATORS.air,   year)
  const eProj  = project(INDICATORS.eco,   year)

  return (
    <div className="relative w-full h-full">
      {/* Leaflet map */}
      <div ref={containerRef} className="w-full h-full" />

      {/* ── Pressure Indicators overlay ── */}
      <div className="absolute top-3 left-3 z-[1000] bg-white/92 backdrop-blur-sm rounded-lg shadow-lg p-3 w-52 pointer-events-auto">
        <p className="text-[9px] font-bold tracking-widest uppercase text-[#555] mb-2.5">Pressure Indicators</p>
        {([
          ['water', wProj],
          ['air',   aProj],
          ['labor', lProj],
          ['eco',   eProj],
        ] as [string, number][]).map(([key, val]) => {
          const ind = INDICATORS[key]
          return (
            <div key={key} className="mb-2.5">
              <div className="flex justify-between items-baseline mb-0.5">
                <span className="text-[11px] text-[#333]">{ind.label}</span>
                <span className="text-[11px] font-semibold" style={{ color: ind.color }}>
                  {Math.round(val * 100)}%
                </span>
              </div>
              <div className="h-[5px] bg-[#e5e5e5] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${val * 100}%`, backgroundColor: ind.color }}
                />
              </div>
            </div>
          )
        })}
        <p className="text-[9px] text-[#aaa] mt-1 leading-tight">
          Bars show current load vs. sustainable threshold
        </p>
        <button className="mt-2 w-full text-[11px] text-[#404040] border border-[#d4d4d4] rounded py-1 hover:bg-neutral-50 transition-colors">
          + Add Data
        </button>
      </div>

      {/* ── Color key ── */}
      <div className="absolute bottom-3 right-3 z-[1000] bg-white/92 backdrop-blur-sm rounded-lg shadow-lg px-3 py-2.5 pointer-events-auto">
        <p className="text-[9px] font-bold tracking-widest uppercase text-[#555] mb-2">Zone key</p>
        {[
          { label: 'Water stress', color: '#cc3333' },
          { label: 'Labor risk',   color: '#cc7700' },
          { label: 'Environmental load', color: '#cc8800' },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-2 mb-1.5 last:mb-0">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
            <span className="text-[11px] text-[#333]">{label}</span>
          </div>
        ))}
      </div>

    </div>
  )
}
