import { useState } from 'react'
import { COUNTRIES } from '../data/countries.js'
import { BASE_RESULTS, PARTY_COLORS } from '../data/countries.js'
import { VOTING_SYSTEMS } from '../data/votingSystems.js'
import { runSimulation } from '../utils/simulate.js'
import VoteBar from './ui/VoteBar.jsx'

export default function SimulateMode({ country }) {
  const [tab, setTab]             = useState('ballot')   // ballot | whatif
  const [voted, setVoted]         = useState(null)
  const [system, setSystem]       = useState('FPTP')
  const [turnout, setTurnout]     = useState(0)
  const [thirdParty, setThirdParty] = useState(0)

  const cfg     = COUNTRIES[country]
  const base    = BASE_RESULTS[country]
  const parties = Object.keys(base.votes)

  // Pre-compute all 3 systems for Parallel Ballot
  const fptp = runSimulation(country, 'FPTP', 0, 0)
  const pr   = runSimulation(country, 'PR',   0, 0)
  const rcv  = runSimulation(country, 'RCV',  0, 0)

  // What-If simulation
  const whatif = runSimulation(country, system, turnout, thirdParty)
  const winner  = Object.entries(whatif.seats).sort((a, b) => b[1] - a[1])[0]
  const hasMaj  = winner[1] >= cfg.majority

  const explanations = []
  if (turnout > 5)     explanations.push(`Youth turnout +${turnout}% boosts challenger parties at the expense of incumbents.`)
  if (turnout < -5)    explanations.push(`Lower youth turnout strengthens the incumbent's established base.`)
  if (thirdParty > 5)  explanations.push(`A third party taking +${thirdParty}% draws from both major parties — the classic "spoiler effect."`)
  if (system === 'PR') explanations.push('Under PR (d\'Hondt), every vote translates to fractional seat allocation — far fewer wasted votes.')
  if (system === 'RCV') explanations.push('Under RCV, the lowest-ranked candidate is eliminated and their votes redistributed, often boosting the runner-up.')

  return (
    <div className="fade-up w-full">
      <div className="mb-8">
        <h1 className="font-headline-xl text-[38px] font-black leading-tight text-slate-50 mb-2">
          {cfg.flag} Electoral Simulator
        </h1>
        <p className="text-slate-400 text-sm">
          Cast a test vote, then see how different systems process it. Toggle variables to watch seats shift live.
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-4 mb-8">
        {[['ballot', '🗳 Parallel Ballot'], ['whatif', '⚗ What-If Engine']].map(([t, label]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all border ${
              tab === t
                ? 'bg-secondary/10 border-secondary/50 text-secondary'
                : 'bg-transparent border-slate-800 text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── PARALLEL BALLOT ────────────────────────────────────── */}
      {tab === 'ballot' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Cast Vote */}
          <div className="glass-card p-5 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-4">
              Step 1 — Cast Your Vote
            </div>
            <div className="space-y-2">
              {parties.map(p => {
                const color = PARTY_COLORS[p] || '#ffb95f'
                const isSelected = voted === p
                return (
                  <button
                    key={p}
                    onClick={() => setVoted(p)}
                    className="w-full flex justify-between items-center px-4 py-3 rounded-lg border text-sm transition-all"
                    style={{
                      borderColor: isSelected ? color : 'var(--color-border)',
                      backgroundColor: isSelected ? `${color}18` : 'var(--color-bg)',
                      color: isSelected ? color : 'var(--color-text-muted)',
                      fontWeight: isSelected ? 700 : 500,
                    }}
                  >
                    {p}
                    <span className="text-xs opacity-70">{base.votes[p]?.toFixed(1)}%</span>
                  </button>
                )
              })}
            </div>
            {voted && (
              <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs text-emerald-400">
                ✅ Voted for <strong>{voted}</strong>. See how 3 systems process it →
              </div>
            )}
          </div>

          {/* FPTP */}
          <SystemResultCard
            systemKey="FPTP"
            result={fptp}
            voted={voted}
            parties={parties}
            totalSeats={cfg.seats}
            majority={cfg.majority}
            callout={voted ? `Under FPTP, your ${voted} vote only "counts" if they win the local seat. All other votes produce zero seats.` : null}
          />

          {/* RCV */}
          <SystemResultCard
            systemKey="RCV"
            result={rcv}
            voted={voted}
            parties={parties}
            totalSeats={cfg.seats}
            majority={cfg.majority}
            callout={voted ? `Under RCV, if ${voted} is eliminated, your vote transfers to your 2nd choice. Far fewer wasted votes.` : null}
          />

          {/* PR */}
          <SystemResultCard
            systemKey="PR"
            result={pr}
            voted={voted}
            parties={parties}
            totalSeats={cfg.seats}
            majority={cfg.majority}
            callout={voted ? `Under PR, your ${voted} vote directly translates into fractional seat allocation. No vote is ever truly "wasted."` : null}
          />
        </div>
      )}

      {/* ── WHAT-IF ENGINE ─────────────────────────────────────── */}
      {tab === 'whatif' && (
        <div className="flex flex-col xl:flex-row gap-6">
          {/* Controls */}
          <div className="flex flex-col gap-6 w-full xl:w-[320px] shrink-0">
            <div className="glass-card p-5 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-6">
                Toggle Variables
              </div>

              {/* Youth Turnout */}
              <SliderControl
                label="Youth Turnout Delta"
                value={turnout}
                min={-20} max={20} step={5}
                onChange={setTurnout}
                color={turnout > 0 ? '#10b981' : turnout < 0 ? '#ef4444' : '#64748b'}
                display={`${turnout > 0 ? '+' : ''}${turnout}%`}
                hint={['-20% (suppress)', '+20% (mobilise)']}
              />

              {/* Third Party */}
              <SliderControl
                label="Third-Party Vote Share"
                value={thirdParty}
                min={0} max={20} step={5}
                onChange={setThirdParty}
                color={thirdParty > 5 ? '#ffb95f' : '#64748b'}
                display={`+${thirdParty}%`}
                hint={['0% (none)', '+20% (major force)']}
              />

              {/* System Picker */}
              <div className="mt-6">
                <div className="text-sm font-bold text-slate-300 mb-3">Electoral System</div>
                <div className="space-y-2">
                  {Object.entries(VOTING_SYSTEMS).map(([key, s]) => (
                    <button
                      key={key}
                      onClick={() => setSystem(key)}
                      className="w-full flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer text-left"
                      style={{
                        borderColor: system === key ? `${s.color}88` : 'var(--color-border)',
                        backgroundColor: system === key ? `${s.color}15` : 'transparent',
                      }}
                    >
                      <div
                        className="w-3.5 h-3.5 rounded-full mt-1 shrink-0 border-2 transition-all"
                        style={{
                          borderColor: system === key ? s.color : 'var(--color-border)',
                          backgroundColor: system === key ? s.color : 'transparent',
                        }}
                      />
                      <div>
                        <div
                          className="text-xs font-bold"
                          style={{ color: system === key ? s.color : 'var(--color-text-muted)' }}
                        >
                          {s.shortName} — {s.name}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                          {s.description.slice(0, 65)}…
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {explanations.length > 0 && (
              <div className="glass-card p-5 rounded-xl border border-secondary/30 bg-secondary/5">
                <div className="text-[10px] text-secondary uppercase tracking-widest font-bold mb-3">
                  💡 Why It Changed
                </div>
                <div className="space-y-2">
                  {explanations.map((e, i) => (
                    <p key={i} className="text-xs text-slate-300 leading-relaxed">→ {e}</p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Result */}
          <div
            className="glass-card p-6 rounded-xl border flex-1"
            style={{
              borderColor: `${VOTING_SYSTEMS[system].color}40`,
              boxShadow: `0 0 40px ${VOTING_SYSTEMS[system].color}10 inset`
            }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                  Simulated Outcome
                </div>
                <h2 className="font-headline-xl text-2xl mt-1 text-slate-100">
                  {cfg.flag} {cfg.name} — {VOTING_SYSTEMS[system].shortName}
                </h2>
              </div>
              <div className="text-right">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${
                    hasMaj
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-red-500/10 border-red-500/30 text-red-400'
                  }`}
                >
                  {hasMaj ? '✓ Majority' : '⚠ No Majority'}
                </span>
                <div className="text-[10px] text-slate-500 mt-2">
                  Need {cfg.majority} seats
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {parties.map(p => (
                <VoteBar
                  key={p}
                  label={p}
                  votes={whatif.votes[p] || 0}
                  seats={whatif.seats[p] || 0}
                  color={PARTY_COLORS[p] || '#ffb95f'}
                  totalSeats={cfg.seats}
                  animate
                />
              ))}
            </div>

            {/* Parliament dots */}
            <div className="mt-8 p-5 bg-slate-900/50 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-4">
                Parliament Composition
              </div>
              <div className="flex gap-1 flex-wrap">
                {parties.map(p => {
                  const dots = Math.max(1, Math.round((whatif.seats[p] || 0) / cfg.seats * 100))
                  return Array.from({ length: dots }).map((_, i) => (
                    <div
                      key={`${p}-${i}`}
                      className="w-2 h-2 rounded-full opacity-80"
                      style={{ backgroundColor: PARTY_COLORS[p] || '#64748b' }}
                    />
                  ))
                })}
              </div>
              <div className="mt-4 flex flex-wrap gap-4">
                {parties.map(p => (
                  <span key={p} className="flex items-center gap-2 text-xs text-slate-400">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: PARTY_COLORS[p] || '#64748b' }}
                    />
                    {p}: {whatif.seats[p] || 0}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Sub-components ───────────────────────────────────────────── */

function SystemResultCard({ systemKey, result, voted, parties, totalSeats, majority, callout }) {
  const sys    = VOTING_SYSTEMS[systemKey]
  const winner = Object.entries(result.seats).sort((a, b) => b[1] - a[1])[0]
  const hasMaj = winner[1] >= majority

  return (
    <div
      className="glass-card p-5 rounded-xl border"
      style={{
        borderColor: `${sys.color}40`,
        boxShadow: `0 0 20px ${sys.color}10 inset`
      }}
    >
      <div
        className="text-[10px] uppercase tracking-widest font-bold mb-1"
        style={{ color: sys.color }}
      >
        {sys.shortName}
      </div>
      <div className="text-xs text-slate-400 mb-4 leading-relaxed">
        {sys.description.slice(0, 72)}…
      </div>
      
      <span
        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border mb-5 ${
          hasMaj
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}
      >
        {hasMaj ? '✓ Majority' : '⚠ Hung'}
      </span>

      <div className="space-y-4 mb-4">
        {parties.map(p => (
          <VoteBar
            key={p}
            label={p}
            votes={result.votes[p] || 0}
            seats={result.seats[p] || 0}
            color={PARTY_COLORS[p] || '#ffb95f'}
            totalSeats={totalSeats}
            animate
          />
        ))}
      </div>

      {callout && voted && (
        <div
          className="p-3 rounded-lg text-xs leading-relaxed border mt-2"
          style={{
            backgroundColor: `${sys.color}12`,
            borderColor: `${sys.color}33`,
            color: sys.color
          }}
        >
          {callout}
        </div>
      )}
    </div>
  )
}

function SliderControl({ label, value, min, max, step, onChange, color, display, hint }) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-end mb-2">
        <span className="text-sm font-bold text-slate-300">{label}</span>
        <span className="font-mono text-sm" style={{ color }}>{display}</span>
      </div>
      {/* Native range input stylized with tailwind or accentColor */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(+e.target.value)}
        className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
        style={{ accentColor: color }}
      />
      <div className="flex justify-between text-[10px] text-slate-500 mt-2">
        <span>{hint[0]}</span>
        <span>{hint[1]}</span>
      </div>
    </div>
  )
}
