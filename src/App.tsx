import { useState } from 'react'
import OverviewPage from './pages/OverviewPage'
import DesignSystemPage from './pages/DesignSystemPage'
import searchIcon from './assets/globe/search-icon.svg'
import arrowRightIcon from './assets/globe/arrow-right.svg'

type Page = 'landing' | 'overview' | 'design-system'

const EXAMPLES = [
  'Philippines air quality vs. apparel export growth',
  'Labor harm reduction interventions in textile industry',
  'Impact of fast fashion on Vietnam water systems',
  'CO2 cost of global shipping by sector',
]

function getInitialPage(): Page {
  if (window.location.pathname === '/design-system') return 'design-system'
  return 'landing'
}

export default function App() {
  const [page, setPage] = useState<Page>(getInitialPage)
  const [query, setQuery] = useState('')

  function navigate(p: Page) {
    history.pushState(null, '', p === 'design-system' ? '/design-system' : '/')
    setPage(p)
  }

  if (page === 'overview') return <OverviewPage onHome={() => navigate('landing')} />
  if (page === 'design-system') return <DesignSystemPage onHome={() => navigate('landing')} />

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-card flex items-center gap-2.5 px-5 py-5 shadow-sm shrink-0">
        <div className="flex items-center gap-2 mr-auto">
          <span className="font-serif italic text-foreground text-3xl leading-none tracking-[-1px] font-semibold">
            Calx
          </span>
        </div>
        <nav className="flex items-center gap-4">
          <a href="#" className="text-foreground text-base font-normal">How It Works</a>
          <a href="#" className="text-foreground text-base font-normal">Use Cases</a>
          <a href="#" className="text-foreground text-base font-normal">Pricing</a>
          <button
            onClick={() => navigate('design-system')}
            className="text-[#a3a3a3] text-sm font-normal hover:text-foreground transition-colors"
          >
            Design System
          </button>
          <button className="bg-[#171717] text-[#fafafa] text-sm font-medium px-3 py-2 rounded min-h-[36px]">
            Get Started
          </button>
        </nav>
      </header>

      {/* Body */}
      <div className="flex flex-col gap-5 py-2.5 flex-1">
        {/* Hero */}
        <div className="flex items-start overflow-hidden pb-5">
          {/* Left Column */}
          <div className="flex flex-col gap-2.5 px-10 shrink-0 flex-1">
            {/* Value prop */}
            <div className="flex flex-col gap-10 pb-10 pt-[100px]">
              <h1 className="font-serif text-[64px] text-black font-light leading-tight tracking-[-1.5px] whitespace-pre-wrap m-0">
                {'Turning economic waste into \neconomic value at scale.'}
              </h1>
              <p className="text-lg text-black font-normal">
                Systemic harms remain unpriced across entire industries. Calx provides the infrastructure{' '}
                <br />
                that aligns profit with measurable harm reduction, giving you evidence for meaningful action.
              </p>
            </div>

            {/* Search Panel */}
            <div className="flex flex-col w-[780px]">
              {/* Search Input */}
              <div className="bg-card border border-[#e5e5e5] flex items-center gap-2 h-[52px] px-3 rounded-lg shadow-2xs overflow-hidden">
                <div className="shrink-0 w-5 h-5 flex items-center justify-center">
                  <img src={searchIcon} alt="" className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="How does fast fashion impact air quality in Bangladesh?"
                  className="flex-1 text-sm text-[#737373] bg-transparent outline-none border-none placeholder:text-[#737373]"
                />
                <button
                  className="shrink-0 w-10 h-10 flex items-center justify-center"
                  onClick={() => setPage('overview')}
                >
                  <img src={arrowRightIcon} alt="Search" className="w-4 h-4" />
                </button>
              </div>

              {/* Example suggestions */}
              <div className="mt-5">
                <p className="text-[#a3a3a3] text-[11px] font-bold tracking-widest mb-3 uppercase">
                  Try an Example
                </p>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLES.map(ex => (
                    <button
                      key={ex}
                      onClick={() => { setQuery(ex); setPage('overview') }}
                      className="bg-[#fafafa] border border-[#d4d4d4] text-foreground text-sm font-medium px-4 py-2 rounded-full shadow-2xs hover:bg-card transition-colors"
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* How Calx Works section */}
        <div className="border-t border-[#a3a3a3] flex items-start overflow-hidden">
          <div className="flex flex-1 flex-col px-10">
            <div className="flex flex-col gap-5 pb-10 pt-[100px]">
              <p className="text-[#a3a3a3] text-sm font-bold uppercase tracking-wide">
                01 - HOW CALX WORKS
              </p>
              <h2 className="text-[32px] font-semibold leading-8 text-black m-0">
                From query to evidence
              </h2>
              <div className="bg-[#d9d9d9] h-[186px] w-full rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#f5f5f5] h-[84px] shrink-0 w-full" />
    </div>
  )
}
