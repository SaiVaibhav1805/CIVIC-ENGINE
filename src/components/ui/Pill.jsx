export default function Pill({ children, color = 'var(--gold)', small }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: small ? '2px 8px' : '4px 12px',
      borderRadius: 9999,
      border: `1px solid ${color}55`,
      background: color + '15',
      color,
      fontSize: small ? 10 : 11,
      fontWeight: 600,
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    }}>
      {children}
    </span>
  )
}
