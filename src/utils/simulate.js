import { BASE_RESULTS } from '../data/countries.js'
import { COUNTRIES } from '../data/countries.js'

export function runSimulation(country, system, turnoutDelta, thirdPartyDelta) {
  const base    = BASE_RESULTS[country]
  const cfg     = COUNTRIES[country]
  const parties = Object.keys(base.votes)
  const total   = cfg.seats

  // 1. Adjust vote shares
  let adj = { ...base.votes }

  if (turnoutDelta !== 0) {
    const boost = turnoutDelta * 0.12
    adj[parties[0]] = Math.max(0, adj[parties[0]] - boost * 0.3)
    if (parties[1]) adj[parties[1]] = Math.max(0, adj[parties[1]] + boost * 0.5)
    parties.slice(2).forEach(p => {
      adj[p] = Math.max(0, adj[p] + boost * 0.2 / Math.max(1, parties.length - 2))
    })
  }

  if (thirdPartyDelta !== 0) {
    adj[parties[0]] = Math.max(0, adj[parties[0]] - thirdPartyDelta * 0.5)
    if (parties[1]) adj[parties[1]] = Math.max(0, adj[parties[1]] - thirdPartyDelta * 0.4)
    if (parties[2]) adj[parties[2]] = Math.max(0, adj[parties[2]] + thirdPartyDelta)
  }

  // 2. Normalize to 100
  const tot = Object.values(adj).reduce((a, b) => a + b, 0)
  const votes = {}
  parties.forEach(p => { votes[p] = (adj[p] / tot) * 100 })

  // 3. Allocate seats by system
  let seats = {}

  if (system === 'PR') {
    // d'Hondt method
    const quotients = []
    parties.forEach(p => {
      for (let d = 1; d <= total; d++) quotients.push({ p, q: votes[p] / d })
    })
    quotients.sort((a, b) => b.q - a.q)
    parties.forEach(p => { seats[p] = 0 })
    quotients.slice(0, total).forEach(({ p }) => { seats[p]++ })

  } else if (system === 'RCV') {
    // Instant-runoff (simplified): eliminate last, redistribute
    const sorted = [...parties].sort((a, b) => votes[b] - votes[a])
    const rcv = { ...votes }
    if (sorted.length > 2) {
      const last = sorted[sorted.length - 1]
      const eliminated = rcv[last]
      rcv[sorted[0]] += eliminated * 0.45
      rcv[sorted[1]] += eliminated * 0.55
      rcv[last] = 0
    }
    const rt = Object.values(rcv).reduce((a, b) => a + b, 0)
    const winner = sorted[0]
    parties.forEach(p => {
      const share = (rcv[p] || 0) / rt
      seats[p] = p === winner
        ? Math.round(total * share * 1.25)
        : Math.round(total * share * 0.95)
    })
    // Correct total
    const diff = total - Object.values(seats).reduce((a, b) => a + b, 0)
    seats[winner] = Math.max(0, (seats[winner] || 0) + diff)

  } else {
    // FPTP — winner amplification
    const sorted = [...parties].sort((a, b) => votes[b] - votes[a])
    const winner = sorted[0]
    const winShare = votes[winner] / 100
    seats[winner] = Math.round(Math.min(total * winShare * (1 + (winShare - 0.3) * 2.2), total * 0.78))
    let rem = total - seats[winner]
    sorted.slice(1).forEach((p, i) => {
      seats[p] = i < sorted.length - 2 ? Math.round(rem * (votes[p] / 100) * 1.1) : 0
    })
    const last = sorted[sorted.length - 1]
    const diff = total - Object.values(seats).reduce((a, b) => a + b, 0)
    seats[last] = Math.max(0, diff)
  }

  return { votes, seats }
}
