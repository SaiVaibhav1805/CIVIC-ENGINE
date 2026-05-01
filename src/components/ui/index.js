/* ── Card ────────────────────────────────────────────────────── */
export function Card({ children, style, glow }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: `1px solid ${glow ? glow + '44' : 'var(--border)'}`,
      borderRadius: 14,
      padding: 24,
      boxShadow: glow ? `0 0 32px ${glow}12` : 'none',
      ...style,
    }}>
      {children}
    </div>
  )
}

/* ── Pill ────────────────────────────────────────────────────── */
export function Pill({ children, color = 'var(--gold)', small }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: small ? '2px 8px' : '4px 12px',
      borderRadius: 20,
      border: `1px solid ${color}55`,
      background: color + '15',
      color,
      fontSize: small ? 10 : 11,
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    }}>
      {children}
    </span>
  )
}

/* ── VoteBar ─────────────────────────────────────────────────── */
export function VoteBar({ label, votes, seats, color, totalSeats, animate }) {
  const pct = Math.max(2, (seats / totalSeats) * 100)
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <span style={{ fontSize: 13, fontWeight: 500 }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color }}>
          {seats} seats &nbsp;
          <span style={{ color: 'var(--text-muted)' }}>{votes.toFixed(1)}%</span>
        </span>
      </div>
      <div style={{ height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 4, background: color,
          width: `${pct}%`,
          transition: animate ? 'width 0.7s cubic-bezier(0.4,0,0.2,1)' : 'none',
        }} />
      </div>
    </div>
  )
}
