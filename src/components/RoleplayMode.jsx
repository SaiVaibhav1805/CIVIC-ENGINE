import { useState, useRef, useEffect } from 'react'
import { ROLEPLAY_SCENARIOS } from '../data/scenarios.js'

const GEMINI_API = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`

export default function RoleplayMode() {
  const [scenario, setScenario] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [civicScore, setCivicScore] = useState(null)
  const [gameOver, setGameOver] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight
  }, [messages])

  const startScenario = async (s) => {
    setScenario(s)
    setMessages([])
    setGameOver(false)
    setCivicScore(null)
    setLoading(true)

    try {
      const res = await fetch(GEMINI_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: s.systemPrompt }] },
          contents: [{ role: 'user', parts: [{ text: 'Start the scenario. Set the scene and give me my first decision to make.' }] }],
        }),
      })
      const data = await res.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Ready.'
      setMessages([{ role: 'assistant', content: text }])
    } catch {
      setMessages([{ role: 'assistant', content: 'Error starting scenario. Try again.' }])
    }
    setLoading(false)
  }

  const sendMessage = async () => {
    const msg = input.trim()
    if (!msg || loading) return
    const userMsg = { role: 'user', content: msg }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch(GEMINI_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: scenario.systemPrompt }] },
          contents: [
            { role: 'user', parts: [{ text: 'Start the scenario. Set the scene and give me my first decision to make.' }] },
            ...newMessages.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.content }] }))
          ],
        }),
      })
      const data = await res.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '…'
      setMessages(m => [...m, { role: 'assistant', content: text }])

      const match = text.match(/Civic Score[:\s]+(\d+)/i)
      if (match) { setCivicScore(parseInt(match[1])); setGameOver(true) }
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'Connection issue.' }])
    }
    setLoading(false)
  }

  /* ── Scenario selector ─────────────────────────────────────── */
  if (!scenario) {
    return (
      <div className="fade-up w-full">
        <div className="mb-10">
          <h1 className="font-headline-xl text-[38px] font-black leading-tight text-slate-50 mb-2">
            The Candidate's Shoes
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
            Step into the role of an election official. Real decisions, real consequences.
            Discover how democracy works from the inside.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
          {ROLEPLAY_SCENARIOS.map(s => (
            <div
              key={s.id}
              className="glass-card p-6 rounded-xl border flex flex-col group transition-all"
              style={{
                borderColor: `${s.diffColor}30`,
                boxShadow: `0 0 20px ${s.diffColor}10 inset`
              }}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform origin-left">{s.icon}</div>
              <span
                className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border self-start mb-4"
                style={{
                  color: s.diffColor,
                  borderColor: `${s.diffColor}50`,
                  backgroundColor: `${s.diffColor}15`
                }}
              >
                {s.difficulty}
              </span>
              <h2 className="font-headline-xl text-xl text-slate-100 mb-3">{s.title}</h2>
              <p className="text-sm text-slate-400 leading-relaxed mb-6 flex-1">{s.description}</p>
              <button
                onClick={() => startScenario(s)}
                className="w-full py-3 rounded-lg text-sm font-bold transition-all border"
                style={{
                  color: s.diffColor,
                  borderColor: `${s.diffColor}60`,
                  backgroundColor: `${s.diffColor}15`
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = `${s.diffColor}25`}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = `${s.diffColor}15`}
              >
                Enter Scenario →
              </button>
            </div>
          ))}
        </div>

        <div className="glass-card p-6 rounded-xl border border-secondary/30 bg-secondary/5 max-w-4xl">
          <div className="text-[10px] text-secondary uppercase tracking-widest font-bold mb-3">
            💡 The Civic Digital Twin
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            These scenarios simulate real decisions election officials face. Most voters never see this side of democracy —
            the moment a single ruling can change an entire election. By experiencing it firsthand, you build genuine
            empathy for the process and understand why it matters.
          </p>
        </div>
      </div>
    )
  }

  /* ── Active roleplay ───────────────────────────────────────── */
  return (
    <div className="fade-up w-full max-w-3xl mx-auto flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div className="flex items-center gap-4">
          <span className="text-4xl">{scenario.icon}</span>
          <div>
            <h2 className="font-headline-xl text-2xl text-slate-100 mb-1">{scenario.title}</h2>
            <span
              className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border"
              style={{
                color: scenario.diffColor,
                borderColor: `${scenario.diffColor}50`,
                backgroundColor: `${scenario.diffColor}15`
              }}
            >
              {scenario.difficulty}
            </span>
          </div>
        </div>
        <button
          onClick={() => setScenario(null)}
          className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-900/50 text-slate-400 text-xs font-bold hover:bg-slate-800 transition-colors"
        >
          ← Back
        </button>
      </div>

      {/* Civic Score badge */}
      {civicScore && (
        <div className="glass-card mb-6 p-6 rounded-xl border border-secondary/40 text-center amber-glow shrink-0">
          <div className="text-4xl mb-2">🏅</div>
          <div className="font-headline-xl text-3xl text-secondary mb-3">
            Civic Score: {civicScore}/10
          </div>
          <span
            className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold border ${
              civicScore >= 8 ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                : civicScore >= 5 ? 'bg-secondary/20 border-secondary/50 text-secondary'
                : 'bg-red-500/20 border-red-500/50 text-red-400'
            }`}
          >
            {civicScore >= 8 ? 'Outstanding Official' : civicScore >= 5 ? 'Competent Supervisor' : 'Needs Development'}
          </span>
        </div>
      )}

      {/* Chat window */}
      <div className="glass-card flex-1 min-h-0 rounded-xl border border-slate-800 flex flex-col overflow-hidden mb-6">
        <div ref={ref} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-4 items-start ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div
                className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-lg border-2 ${
                  m.role === 'user'
                    ? 'bg-sky-500/20 border-sky-500/40'
                    : 'bg-secondary/20 border-secondary/40'
                }`}
              >
                {m.role === 'user' ? '👤' : '🎭'}
              </div>
              <div
                className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-sky-500/10 border border-sky-500/30 text-sky-100 rounded-tr-sm'
                    : 'bg-slate-800/80 border border-slate-700 text-slate-200 rounded-tl-sm shadow-md'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-4 items-center pl-2">
              <div className="flex gap-1.5 items-center bg-slate-800/80 px-4 py-3 rounded-2xl rounded-tl-sm border border-slate-700">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-secondary"
                    style={{ animation: `pulse 1.2s ${i * 0.4}s infinite` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input area */}
      <div className="shrink-0">
        {!gameOver ? (
          <div className="flex gap-3">
            <input
              className="flex-1 bg-slate-900/80 border border-slate-700 focus:border-secondary focus:ring-1 focus:ring-secondary/50 rounded-xl px-5 py-4 text-sm text-slate-100 transition-all placeholder:text-slate-600"
              placeholder="Type your decision or response…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-secondary text-slate-950 px-8 rounded-xl font-bold text-sm border-2 border-transparent hover:bg-amber-400 hover:border-secondary/50 transition-all disabled:opacity-50 disabled:hover:bg-secondary"
            >
              Decide →
            </button>
          </div>
        ) : (
          <button
            onClick={() => setScenario(null)}
            className="w-full py-4 rounded-xl border border-secondary/50 bg-secondary/10 hover:bg-secondary/20 text-secondary font-bold text-sm transition-all"
          >
            Try Another Scenario →
          </button>
        )}
      </div>
    </div>
  )
}
