import { useState } from 'react'
import { COUNTRIES } from '../data/countries.js'
import { TIMELINES } from '../data/timelines.js'
import { QUIZ } from '../data/quiz.js'
import OracleChat from './OracleChat.jsx'

export default function ExploreMode({ country, scores, setScores }) {
  const [activeStage, setActiveStage]   = useState(null)
  const [eli5, setEli5]                 = useState(false)
  const [quizAnswered, setQuizAnswered] = useState({})
  const [animKey, setAnimKey]           = useState(0)

  const cfg    = COUNTRIES[country]
  const stages = TIMELINES[country] || TIMELINES.IN
  const stage  = stages.find(s => s.id === activeStage)
  const quiz   = stage ? QUIZ[stage.id] : null
  const answered = stage ? quizAnswered[stage.id] : undefined

  return (
    <div className="fade-up w-full">
      {/* Page heading */}
      <div className="mb-10">
        <div className="flex items-end gap-4 mb-2">
          <h1 className="font-headline-xl text-[38px] font-black leading-tight text-slate-50">
            {cfg.flag} {cfg.name}
          </h1>
          <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-xs font-bold border border-slate-700">
            {cfg.system}
          </span>
        </div>
        <p className="text-slate-400 text-sm">
          Select any stage — explore steps, facts, key terms, and test yourself.
        </p>
      </div>

      {/* ── TIMELINE RIBBON ──────────────────────────────────── */}
      <div className="flex items-center justify-center gap-0 mb-10 overflow-x-auto pb-4 pt-2 scrollbar-thin">
        {stages.map((s, i) => (
          <div key={s.id} className="flex items-center">
            <button
              onClick={() => { setActiveStage(s.id); setEli5(false); setAnimKey(k => k + 1) }}
              className={`flex flex-col items-center gap-3 p-4 min-w-[100px] rounded-2xl transition-all duration-300 cursor-pointer border hover:shadow-lg hover:-translate-y-1 ${
                activeStage === s.id
                  ? 'bg-slate-800/80 border-secondary shadow-lg shadow-secondary/20 scale-105'
                  : 'bg-slate-900/80 border-slate-700 hover:bg-slate-800 hover:border-slate-500'
              }`}
            >
              <div
                className={`w-14 h-14 rounded-full text-3xl flex items-center justify-center transition-all duration-300 border-2 ${
                  activeStage === s.id
                    ? 'bg-secondary/20 border-secondary text-secondary shadow-[0_0_24px_rgba(245,158,11,0.5)]'
                    : 'bg-slate-800 border-slate-600 text-slate-200'
                }`}
              >
                {scores[s.id] ? '✓' : s.icon}
              </div>
              <span
                className={`text-xs text-center leading-tight uppercase tracking-widest font-extrabold ${
                  activeStage === s.id ? 'text-secondary drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]' : 'text-slate-300'
                }`}
              >
                {s.label}
              </span>
            </button>
            {i < stages.length - 1 && (
              <div className="w-8 h-1 bg-slate-600 shrink-0 rounded-full mx-1" />
            )}
          </div>
        ))}
      </div>

      {/* ── DETAIL PANEL ─────────────────────────────────────── */}
      {stage ? (
        <div key={animKey} className="flex flex-col xl:flex-row gap-8 fade-up w-full">
          {/* LEFT column (Main Content) */}
          <div className="flex-1 space-y-6">
            <section className="space-y-4">
              <div className="flex items-end justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-secondary font-label-bold uppercase tracking-widest">
                    Phase: {stage.title}
                  </span>
                  <h1 className="font-headline-xl text-slate-50 mt-1">
                    {stage.title}: <span className="text-slate-400">Region: {cfg.name}</span>
                  </h1>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-800">
                  <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    timer
                  </span>
                  <span className="font-label-bold text-slate-300">⏱ {stage.timeline}</span>
                </div>
              </div>

              {/* Hero Image Card (Placeholder) */}
              <div className="relative w-full aspect-[2.17/1] rounded-xl overflow-hidden shadow-2xl border border-slate-800 group">
                <img
                  alt="Election scene"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src="https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&q=80&w=1200"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="px-2 py-1 bg-secondary text-slate-950 text-xs font-bold rounded uppercase">
                    Active Phase
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6">
                <h3 className="text-xl font-bold text-slate-200">Protocol Steps</h3>
                <button
                  onClick={() => setEli5(e => !e)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
                    eli5
                      ? 'bg-secondary/20 border-secondary/50 text-secondary'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {eli5 ? '🧠 Normal View' : '👶 ELI5 Mode'}
                </button>
              </div>

              {eli5 ? (
                <div className="glass-card p-6 rounded-xl border-secondary/30 bg-secondary/10 text-slate-300 text-sm leading-relaxed italic">
                  💡 {stage.eli5}
                </div>
              ) : (
                /* Protocol Steps Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stage.steps.map((step, i) => (
                    <div key={i} className="glass-card p-4 rounded-xl hover:border-secondary/50 transition-colors group">
                      <div className="flex items-start gap-4">
                        <span className="w-10 h-10 shrink-0 flex items-center justify-center bg-slate-900 border border-slate-800 rounded-lg text-secondary font-bold group-hover:bg-secondary group-hover:text-slate-950 transition-all">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <p className="text-sm text-slate-400 leading-relaxed">{step}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Key Term & Fast Fact combined cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="glass-card p-4 rounded-xl border-slate-800">
                  <div className="text-[10px] text-secondary uppercase tracking-widest font-bold mb-2">
                    📖 Key Term
                  </div>
                  <div className="text-sm font-bold text-slate-200 mb-1">{stage.keyTerm.word}</div>
                  <div className="text-xs text-slate-400 leading-relaxed">{stage.keyTerm.meaning}</div>
                </div>
                
                <div className="glass-card p-4 rounded-xl border-slate-800">
                  <div className="text-[10px] text-secondary uppercase tracking-widest font-bold mb-2">
                    🌟 Fast Fact
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">{stage.funFact}</p>
                  <div className="flex flex-col gap-2">
                    <a href={cfg.portal} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-sky-500/40 bg-sky-500/10 text-sky-400 text-xs font-bold no-underline hover:bg-sky-500/20 transition-colors">
                      ✅ Check My Voter Status
                    </a>
                    <a href={stage.sourceUrl} target="_blank" rel="noreferrer" className="text-[10px] text-slate-500 no-underline border border-slate-800 rounded px-2 py-1 inline-block text-center hover:bg-slate-800">
                      ↗ Source: {stage.sourceLabel}
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT column (Sidebar) */}
          <aside className="w-full xl:w-80 flex flex-col gap-6 shrink-0">
            {/* Knowledge Check Card */}
            {quiz && (
              <div className="glass-card p-6 rounded-xl border-t-2 border-t-secondary/50 amber-glow">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    quiz
                  </span>
                  <h4 className="font-label-bold text-secondary uppercase tracking-widest text-xs">Knowledge Check</h4>
                </div>
                <p className="font-headline-lg text-base text-slate-200 mb-6 leading-snug">{quiz.q}</p>
                <div className="space-y-2">
                  {quiz.opts.map((opt, i) => {
                    let isSelected = answered === i;
                    let isCorrect = i === quiz.ans;
                    let showCorrect = answered !== undefined && isCorrect;
                    let showError = answered !== undefined && isSelected && !isCorrect;
                    
                    let bgClass = "bg-transparent";
                    let borderClass = "border-slate-800";
                    let dotClass = "border-slate-500";
                    
                    if (answered === undefined) {
                      bgClass = "hover:bg-slate-900";
                      borderClass = "hover:border-secondary border-slate-800";
                    } else if (showCorrect) {
                      bgClass = "bg-emerald-900/30";
                      borderClass = "border-emerald-500";
                      dotClass = "border-emerald-500 bg-emerald-500";
                    } else if (showError) {
                      bgClass = "bg-red-900/30";
                      borderClass = "border-red-500";
                      dotClass = "border-red-500 bg-red-500";
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => {
                          if (answered !== undefined) return
                          setQuizAnswered(q => ({ ...q, [stage.id]: i }))
                          if (i === quiz.ans) setScores(s => ({ ...s, [stage.id]: true }))
                        }}
                        className={`w-full text-left px-4 py-3 rounded-lg border transition-all flex items-center gap-4 group ${borderClass} ${bgClass} ${answered !== undefined ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        <div className={`w-4 h-4 shrink-0 rounded-full border-2 transition-colors ${dotClass} ${answered === undefined ? 'group-hover:border-secondary' : ''}`}></div>
                        <span className={`text-sm ${showCorrect ? 'text-emerald-400 font-medium' : showError ? 'text-red-400' : 'text-slate-300'}`}>
                          {opt}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {answered !== undefined && (
                  <div className={`mt-4 p-3 rounded-lg text-xs font-medium ${answered === quiz.ans ? 'bg-emerald-900/30 text-emerald-400' : 'bg-red-900/30 text-red-400'}`}>
                    {answered === quiz.ans ? '✅ Correct! Points awarded.' : `❌ Incorrect. The right answer is: ${quiz.opts[quiz.ans]}`}
                  </div>
                )}
              </div>
            )}

            {/* Oracle Chat */}
            <OracleChat stageTitle={stage.title} countryName={cfg.name} />
          </aside>
        </div>
      ) : (
        <div className="text-center mt-20 text-slate-500">
          <div className="text-5xl mb-4">☝</div>
          <p className="font-headline-lg text-lg">Select a stage above to begin exploring</p>
        </div>
      )}
    </div>
  )
}
