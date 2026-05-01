import { COUNTRIES } from '../data/countries.js'

export default function Shell({ mode, setMode, country, setCountry, scores, children }) {
  const totalScore = Object.values(scores).filter(Boolean).length
  const cfg = COUNTRIES[country]

  return (
    <div className="min-h-screen bg-background font-body-md text-on-background selection:bg-secondary/30">
      {/* TopAppBar */}
      <header className="bg-slate-950/80 backdrop-blur-md text-secondary font-sans text-sm tracking-wide border-b border-slate-800/60 shadow-lg shadow-slate-950/50 grid grid-cols-3 items-center px-8 h-20 w-full z-50 fixed top-0 left-0">
        <div className="flex justify-start items-center">
          <span className="text-xl font-black text-slate-50 uppercase tracking-tighter font-sans">Civic Engine</span>
        </div>
        
        <div className="flex justify-center h-full">
          <nav className="hidden md:flex gap-8 h-full items-center">
            {[
              ['explore', '🗺 Explore'],
              ['simulate', '⚗ Simulate'],
              ['roleplay', '🎭 Roleplay'],
            ].map(([m, label]) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`transition-colors h-full flex items-center font-sans ${
                  mode === m
                    ? 'text-secondary border-b-2 border-secondary pb-[2px] font-bold'
                    : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex justify-end items-center gap-4">
          {totalScore > 0 && (
            <span className="px-3 py-1 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-xs font-bold mr-2">
              🏅 {totalScore} pts
            </span>
          )}
          <div className="flex gap-2 mr-4 border-r border-slate-800 pr-4">
            {Object.keys(COUNTRIES).map((code) => (
              <button
                key={code}
                onClick={() => setCountry(code)}
                className={`px-2 py-1 text-xs font-bold border rounded transition-all font-sans ${
                  country === code
                    ? 'bg-slate-800 border-secondary text-secondary'
                    : 'border-slate-700 text-slate-400 hover:bg-slate-900 hover:text-slate-300'
                }`}
              >
                {code}
              </button>
            ))}
          </div>
          <span className="material-symbols-outlined text-slate-400 cursor-pointer hover:bg-slate-900/50 transition-all duration-300 p-2 rounded-full">language</span>
          <span className="material-symbols-outlined text-slate-400 cursor-pointer hover:bg-slate-900/50 transition-all duration-300 p-2 rounded-full">public</span>
          <span className="material-symbols-outlined text-slate-400 cursor-pointer hover:bg-slate-900/50 transition-all duration-300 p-2 rounded-full">flag</span>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 pt-28 pb-12 px-6 md:px-12 max-w-[1400px] w-full mx-auto">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-slate-950 w-full py-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center px-12 mt-auto font-sans text-xs text-slate-500">
          <div className="mb-4 md:mb-0">
              © 2024 Civic Engine Democracy Simulator. All rights reserved.
          </div>
          <div className="flex gap-6">
              <a className="text-slate-500 hover:text-secondary transition-colors" href="#">Privacy Policy</a>
              <a className="text-slate-500 hover:text-secondary transition-colors" href="#">Terms of Service</a>
              <a className="text-slate-500 hover:text-secondary transition-colors" href="#">Educational Licensing</a>
          </div>
        </footer>
      </div>
    </div>
  )
}
