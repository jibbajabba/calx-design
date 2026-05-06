import { useEffect, useRef, useState } from 'react'
import type { Map as LeafletMap, LayerGroup, CircleMarker, Marker } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {
  COUNTY_NAMES, CENTROIDS, GIS, RISK_SCORES, BY_RISK,
  RAMP_HOTSPOTS, CONVERGENCE_ZONES,
  mgdToTonnesYr, getEmissions, markerColor,
} from '../data/countyData'

export type HotspotMode = 'none' | 'all' | 'ramp' | 'interface' | 'convergence'
export type FilterMode = 'all' | 'top10' | 'bottom10'
export type BufferKey = '1' | '2' | '5'

interface Props {
  year: string
  buffer: BufferKey
  hotspot: HotspotMode
  filter: FilterMode
  selectedCounty: string | null
  onSelectCounty: (co: string | null) => void
}

export default function EmissionMapTab({ year, buffer, hotspot, filter, selectedCounty, onSelectCounty }: Props) {
  const [mapReady, setMapReady] = useState(false)
  const mapRef = useRef<LeafletMap | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const countyLayerRef = useRef<LayerGroup | null>(null)
  const rampLayerRef = useRef<LayerGroup | null>(null)
  const interfaceLayerRef = useRef<LayerGroup | null>(null)
  const convergenceLayerRef = useRef<LayerGroup | null>(null)
  const markersRef = useRef<Record<string, CircleMarker>>({})
  const convMarkersRef = useRef<Marker[]>([])

  // Compute which counties to show based on filter
  const visibleCounties = (): Set<string> => {
    if (filter === 'top10') return new Set(BY_RISK.slice(0, 10))
    if (filter === 'bottom10') return new Set(BY_RISK.slice(-10))
    return new Set(Object.keys(CENTROIDS))
  }

  // ── Init map once ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (mapRef.current || !containerRef.current) return
    // Dynamic import to avoid SSR issues
    import('leaflet').then(L => {
      const map = L.map(containerRef.current!, { zoomControl: false }).setView([37.5, -119.5], 6)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: 'CartoDB', maxZoom: 18,
      }).addTo(map)
      L.control.zoom({ position: 'bottomleft' }).addTo(map)
      mapRef.current = map
      setMapReady(true)

      countyLayerRef.current = L.layerGroup().addTo(map)
      rampLayerRef.current = L.layerGroup()
      interfaceLayerRef.current = L.layerGroup()
      convergenceLayerRef.current = L.layerGroup()
    })
    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [])

  // ── Rebuild county markers when year/buffer/filter change ─────────────────
  useEffect(() => {
    if (!mapReady || !mapRef.current || !countyLayerRef.current) return
    import('leaflet').then(L => {
      countyLayerRef.current!.clearLayers()
      markersRef.current = {}

      const maxRisk = Math.max(...Object.values(RISK_SCORES))
      const visible = visibleCounties()

      Object.keys(CENTROIDS).forEach(co => {
        if (!visible.has(co)) return
        const [lat, lng] = CENTROIDS[co]
        const e = getEmissions(co, year)
        const g = GIS[co]
        if (!g) return
        const agPct = g[`b${buffer}_pct` as keyof typeof g] as number
        const risk = RISK_SCORES[co] ?? 0
        const radius = Math.max(6, Math.min(25, (risk / maxRisk) * 25))
        const color = markerColor(agPct)
        const isSelected = co === selectedCounty

        const m = L.circleMarker([lat, lng], {
          radius,
          fillColor: color,
          color: isSelected ? '#000' : '#fff',
          weight: isSelected ? 3 : 1,
          opacity: 0.9,
          fillOpacity: 0.7,
        }).addTo(countyLayerRef.current!)

        const pm10 = mgdToTonnesYr(e.pm10)
        const pm25 = mgdToTonnesYr(e.pm25)
        m.bindTooltip(
          `<b>${COUNTY_NAMES[co] ?? co}</b><br>
           AADT: ${e.avg_aadt.toLocaleString()}<br>
           PM10: ${pm10} t/yr · PM2.5: ${pm25} t/yr<br>
           Ag 1km: ${g.b1_pct}% · 2km: ${g.b2_pct}% · 5km: ${g.b5_pct}%<br>
           Risk: ${Math.round(risk)}`,
          { direction: 'top' }
        )
        m.on('click', () => onSelectCounty(co))
        markersRef.current[co] = m
      })
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapReady, year, buffer, filter])

  // ── Rebuild hotspot layers when year changes ───────────────────────────────
  useEffect(() => {
    if (!mapReady || !mapRef.current) return
    import('leaflet').then(L => {
      rampLayerRef.current?.clearLayers()
      interfaceLayerRef.current?.clearLayers()
      convergenceLayerRef.current?.clearLayers()
      convMarkersRef.current = []

      // Ramp layer
      RAMP_HOTSPOTS.forEach(r => {
        const color = r.dist < 200 ? '#E24B4A' : r.dist < 500 ? '#EF9F27' : '#378ADD'
        const size = Math.max(5, Math.min(14, r.vol / 1500))
        const m = L.circleMarker([r.lat, r.lng], {
          radius: size, fillColor: color, color, weight: 2, opacity: 0.9, fillOpacity: 0.5,
        }).addTo(rampLayerRef.current!)
        m.bindTooltip(
          `<b>${r.name}</b><br>Volume: ${r.vol.toLocaleString()}/day<br>Nearest farm: ${r.dist}m (${r.crop})`,
          { direction: 'top' }
        )
      })

      // Highway-farm interface layer
      const ifCounties = Object.keys(GIS).filter(co => {
        const g = GIS[co]
        const e = getEmissions(co, year)
        return g && e && g.b1_pct > 15 && e.avg_aadt > 20000
      })
      ifCounties.forEach(co => {
        const centroid = CENTROIDS[co]
        if (!centroid) return
        const [lat, lng] = centroid
        const g = GIS[co]
        const e = getEmissions(co, year)
        const size = Math.max(15, Math.min(40, g.b1_pct * 0.6))
        const m = L.circleMarker([lat, lng], {
          radius: size, fillColor: '#1D9E75', color: '#0F6E56', weight: 2,
          opacity: 0.8, fillOpacity: 0.25,
        }).addTo(interfaceLayerRef.current!)
        m.bindTooltip(
          `<b>${COUNTY_NAMES[co] ?? co} — Hwy-Farm Interface</b><br>AADT: ${e.avg_aadt.toLocaleString()}<br>Ag 1km: ${g.b1_pct}% · 5km: ${g.b5_pct}%`,
          { direction: 'top' }
        )
      })

      // Convergence zones
      CONVERGENCE_ZONES.forEach(z => {
        const size = Math.max(10, Math.min(20, z.aadt / 15000))
        const icon = L.divIcon({
          html: `<div style="width:${size * 2}px;height:${size * 2}px;background:#7F77DD;opacity:0.7;transform:rotate(45deg);border:2px solid #534AB7"></div>`,
          iconSize: [size * 2, size * 2],
          iconAnchor: [size, size],
          className: '',
        })
        const m = L.marker([z.lat, z.lng], { icon }).addTo(convergenceLayerRef.current!)
        m.bindTooltip(
          `<b>${z.name}</b><br>Highways: ${z.hwys}<br>AADT: ${z.aadt.toLocaleString()}<br>Crops: ${z.crop}`,
          { direction: 'top' }
        )
        convMarkersRef.current.push(m)
      })
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapReady, year])

  // ── Toggle hotspot layers ──────────────────────────────────────────────────
  useEffect(() => {
    if (!mapReady || !mapRef.current) return
    const map = mapRef.current
    const ramp = rampLayerRef.current
    const iface = interfaceLayerRef.current
    const conv = convergenceLayerRef.current
    if (!ramp || !iface || !conv) return

    if (hotspot === 'none') { map.removeLayer(ramp); map.removeLayer(iface); map.removeLayer(conv) }
    else if (hotspot === 'all') { map.addLayer(ramp); map.addLayer(iface); map.addLayer(conv) }
    else if (hotspot === 'ramp') { map.addLayer(ramp); map.removeLayer(iface); map.removeLayer(conv) }
    else if (hotspot === 'interface') { map.removeLayer(ramp); map.addLayer(iface); map.removeLayer(conv) }
    else if (hotspot === 'convergence') { map.removeLayer(ramp); map.removeLayer(iface); map.addLayer(conv) }
  }, [mapReady, hotspot])

  // ── Highlight selected county ──────────────────────────────────────────────
  useEffect(() => {
    Object.entries(markersRef.current).forEach(([co, m]) => {
      m.setStyle({ weight: co === selectedCounty ? 3 : 1, color: co === selectedCounty ? '#000' : '#fff' })
    })
    if (selectedCounty && markersRef.current[selectedCounty] && mapRef.current) {
      mapRef.current.panTo(markersRef.current[selectedCounty].getLatLng())
    }
  }, [selectedCounty])

  // ── Invalidate size when container resizes ─────────────────────────────────
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(() => mapRef.current?.invalidateSize())
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return <div ref={containerRef} className="w-full h-full" />
}
