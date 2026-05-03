import { useState, useRef, useEffect } from 'react'

const GEMINI_API = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`

export default function OracleChat({ stageTitle, countryName }) {
  const [messages, setMessages] = useState([])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight
  }, [messages])

  const send = async () => {
    const msg = input.trim()
    if (!msg || loading) return
    const userMsg = { role: 'user', content: msg }
    setMessages(m => [...m, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch(GEMINI_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: `You are the Civic Oracle — a knowledgeable, friendly guide on election processes. 
The user is currently exploring the "${stageTitle}" stage of the ${countryName} election process. 
Keep answers concise (2-4 sentences), factual, and engaging. 
Focus on democratic processes, election law, and civic education. 
Use relatable examples. If off-topic, gently redirect.` }] },
          contents: [...messages, userMsg].map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.content }] })),
        }),
      })

      const data = await res.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Try rephrasing your question!'
      setMessages(m => [...m, { role: 'assistant', content: text }])
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'Connection issue. Please try again.' }])
    }

    setLoading(false)
  }

  return (
    <div className="glass-card flex flex-col h-[400px] rounded-xl overflow-hidden border border-slate-800">
      <div className="bg-slate-900/50 p-4 border-b border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-secondary to-amber-200 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-slate-950 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-200">Ask the Oracle</h4>
          <p className="text-[10px] text-slate-500 uppercase tracking-tighter">AI-Driven Civic Advice</p>
        </div>
      </div>
      
      <div ref={ref} className="flex-1 p-4 space-y-4 overflow-y-auto scrollbar-thin">
        {messages.length === 0 && (
          <p className="text-slate-500 text-xs italic text-center mt-4">
            Ask anything about this stage or elections…
          </p>
        )}
        
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : ''}`}>
            {m.role !== 'user' && (
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-secondary to-amber-200 shrink-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-slate-950 text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              </div>
            )}
            
            <div className={`p-3 text-xs leading-relaxed max-w-[85%] ${
              m.role === 'user'
                ? 'bg-secondary/20 rounded-lg rounded-tr-none text-slate-200 border border-secondary/20'
                : 'bg-slate-800 rounded-lg rounded-tl-none text-slate-300'
            }`}>
              {m.content}
            </div>

            {m.role === 'user' && (
              <div className="w-6 h-6 rounded-full bg-slate-800 shrink-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-2 items-center text-secondary">
            <span className="material-symbols-outlined animate-spin text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>autorenew</span>
            <span className="text-xs italic text-slate-500">Oracle is thinking...</span>
          </div>
        )}
      </div>
      
      <div className="p-4 bg-slate-900/30">
        <div className="relative">
          <input
            className="w-full bg-slate-950/50 border-none border-b-2 border-slate-700 focus:border-secondary focus:ring-0 text-sm rounded-lg pl-4 pr-12 py-3 transition-all text-slate-200"
            placeholder="Type your question..."
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            disabled={loading}
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-secondary hover:scale-110 transition-transform disabled:opacity-50 disabled:hover:scale-100"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
          </button>
        </div>
      </div>
    </div>
  )
}
