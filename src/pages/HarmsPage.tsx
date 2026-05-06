import harmNetwork from '../assets/twp-harm-network-light.svg'

export default function HarmsContent({ chatOpen }: { chatOpen: boolean }) {
  return (
    <>
      {/* ── Main graph panel ── */}
      <section className="bg-card rounded-lg shadow-sm flex-1 flex flex-col min-h-0">
        <div className="px-5 py-3 border-b border-[#e5e5e5] shrink-0">
          <p className="font-serif text-xl font-semibold text-foreground leading-6">
            Tire Wear Particle Analysis: Causal pathways — California
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <img
            src={harmNetwork}
            alt="TWP harm network causal pathways"
            className="w-full h-auto max-w-2xl mx-auto block"
          />
        </div>
      </section>

      {/* ── Chat sidebar ── */}
      <div className={`grid transition-all duration-300 ease-in-out self-stretch ${chatOpen ? 'grid-cols-[240px]' : 'grid-cols-[0px]'} overflow-hidden`}>
        <div className="overflow-hidden h-full">
          <aside className="w-[240px] shrink-0 bg-card rounded-lg shadow-sm flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#e5e5e5] shrink-0">
              <p className="text-[11px] font-semibold text-[#737373] tracking-widest uppercase">Harms Analysis Chat</p>
              <span className="bg-clay-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-[3px]">AI</span>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
              <p className="text-sm text-[#404040] leading-relaxed">
                Three causal chains account for ~89% of microplastic loading into San Francisco Bay. The dominant path — tire wear via freeway stormwater — drives 52% of total particles. Strongest links are well-supported by SFEI field measurements; downstream health and economic impacts remain estimated, meaning loading is quantifiable but cost of inaction can only be approximated.
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
