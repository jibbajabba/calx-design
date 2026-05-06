export default function BangladeshMap() {
  const gridLines = []
  for (let x = 0; x <= 480; x += 60) {
    gridLines.push(<line key={`v${x}`} x1={x} y1={0} x2={x} y2={520} stroke="#e0dbd3" strokeWidth={0.8} opacity={0.4} />)
  }
  for (let y = 0; y <= 520; y += 60) {
    gridLines.push(<line key={`h${y}`} x1={0} y1={y} x2={480} y2={y} stroke="#e0dbd3" strokeWidth={0.8} opacity={0.4} />)
  }

  // Bangladesh outline: ~10 points mapping lon/lat to SVG coords
  // lon range: 88°E–92.6°E → x 40–440, lat range: 21°N–26.6°N → y 30–490
  // x = (lon - 88) / 4.6 * 400 + 40
  // y = (26.6 - lat) / 5.6 * 460 + 30
  const outline = "M 160,30 L 420,38 L 440,90 L 430,200 L 390,310 L 350,370 L 310,420 L 260,490 L 180,490 L 100,430 L 60,340 L 40,200 L 60,100 Z"

  const coral = '#C0503A'

  return (
    <div className="w-full h-full bg-stone-100 flex items-center justify-center">
      <svg viewBox="0 0 480 520" className="w-full h-full" preserveAspectRatio="xMidYMid meet">

        {/* Grid */}
        {gridLines}

        {/* Country outline */}
        <path d={outline} fill="#f0ede8" stroke="#c8c0b0" strokeWidth={1.5} />

        {/* Dhaka / Gazipur / Savar cluster — densest */}
        <circle cx={245} cy={220} r={80} fill={coral} opacity={0.10} />
        <circle cx={245} cy={220} r={60} fill={coral} opacity={0.18} />
        <circle cx={245} cy={220} r={44} fill={coral} opacity={0.30} />
        <circle cx={245} cy={220} r={28} fill={coral} opacity={0.50} />
        <circle cx={245} cy={220} r={14} fill={coral} opacity={0.70} />

        {/* Narayanganj — just south of Dhaka */}
        <circle cx={260} cy={268} r={40} fill={coral} opacity={0.12} />
        <circle cx={260} cy={268} r={28} fill={coral} opacity={0.25} />
        <circle cx={260} cy={268} r={16} fill={coral} opacity={0.45} />
        <circle cx={260} cy={268} r={8}  fill={coral} opacity={0.65} />

        {/* Chittagong — southeast */}
        <circle cx={370} cy={360} r={50} fill={coral} opacity={0.10} />
        <circle cx={370} cy={360} r={35} fill={coral} opacity={0.22} />
        <circle cx={370} cy={360} r={22} fill={coral} opacity={0.38} />
        <circle cx={370} cy={360} r={11} fill={coral} opacity={0.58} />

        {/* Khulna — southwest */}
        <circle cx={130} cy={370} r={35} fill={coral} opacity={0.10} />
        <circle cx={130} cy={370} r={22} fill={coral} opacity={0.22} />
        <circle cx={130} cy={370} r={12} fill={coral} opacity={0.40} />

        {/* Rajshahi — northwest */}
        <circle cx={115} cy={145} r={32} fill={coral} opacity={0.10} />
        <circle cx={115} cy={145} r={20} fill={coral} opacity={0.22} />
        <circle cx={115} cy={145} r={10} fill={coral} opacity={0.40} />

        {/* City labels */}
        <text x={245} y={195} fontFamily="Georgia, serif" fontSize={11} fill="#444" textAnchor="middle" dominantBaseline="middle">Dhaka</text>
        <text x={370} y={336} fontFamily="Georgia, serif" fontSize={10} fill="#444" textAnchor="middle" dominantBaseline="middle">Chittagong</text>
        <text x={130} y={346} fontFamily="Georgia, serif" fontSize={10} fill="#444" textAnchor="middle" dominantBaseline="middle">Khulna</text>
        <text x={115} y={122} fontFamily="Georgia, serif" fontSize={10} fill="#444" textAnchor="middle" dominantBaseline="middle">Rajshahi</text>
        <text x={360} y={130} fontFamily="Georgia, serif" fontSize={10} fill="#444" textAnchor="middle" dominantBaseline="middle">Sylhet</text>

        {/* Legend */}
        <text x={52} y={456} fontFamily="Georgia, serif" fontSize={10} fill="#555" fontWeight="600">Factory Concentration</text>
        <circle cx={58} cy={472} r={6} fill={coral} opacity={0.65} />
        <text x={70} y={472} fontFamily="Georgia, serif" fontSize={9} fill="#555" dominantBaseline="middle">High density</text>
        <circle cx={58} cy={488} r={6} fill={coral} opacity={0.30} />
        <text x={70} y={488} fontFamily="Georgia, serif" fontSize={9} fill="#555" dominantBaseline="middle">Moderate</text>

      </svg>
    </div>
  )
}
