export default function Card({ children, style, glow }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: glow ? `2px solid ${glow}` : '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: 16, padding: 24,
      boxShadow: glow ? `0 4px 12px rgba(15, 23, 42, 0.8), 0 0 24px ${glow}20` : 'none',
      ...style,
    }}>
      {children}
    </div>
  )
}
