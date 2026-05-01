# Civic Engine — Interactive Democracy Simulator

A full-stack React app for exploring, simulating, and roleplaying election processes across India, US, UK, and the EU.

---

## Quick Start

### 1. Prerequisites
- Node.js 18+ (check: `node -v`)
- npm 9+ (check: `npm -v`)
- A Gemini API key → https://aistudio.google.com/app/apikey

### 2. Install dependencies
```bash
cd civic-engine
npm install
```

### 3. Set up your API key
```bash
cp .env.example .env
```
Open `.env` and replace `AIzaSy...` with your actual key.

### 4. Run the dev server
```bash
npm run dev
```


---

## Project Structure

```
civic-engine/
├── index.html                     ← HTML entry point
├── vite.config.js                 ← Vite config (port 3000, auto-open)
├── package.json
├── .env.example                   ← Copy to .env and add your API key
├── .gitignore
│
└── src/
    ├── main.jsx                   ← React root mount
    ├── App.jsx                    ← Root component — routes between 3 modes
    ├── index.css                  ← Global CSS, design tokens (CSS vars), animations
    │
    ├── components/
    │   ├── Shell.jsx              ← Sticky header, nav tabs, country picker
    │   ├── ExploreMode.jsx        ← Timeline + ELI5 + quiz + Oracle chat
    │   ├── SimulateMode.jsx       ← Parallel Ballot (3 systems) + What-If engine
    │   ├── RoleplayMode.jsx       ← AI-driven election official scenarios
    │   ├── OracleChat.jsx         ← Context-aware Gemini API chat widget
    │   └── ui/
    │       ├── Card.jsx           ← Surface card component
    │       ├── Pill.jsx           ← Badge/label component
    │       └── VoteBar.jsx        ← Animated seat/vote bar
    │
    ├── data/
    │   ├── countries.js           ← Country configs + base election results + party colors
    │   ├── timelines.js           ← Full stage data for IN, US, UK, EU
    │   ├── votingSystems.js       ← FPTP, RCV, PR definitions
    │   ├── scenarios.js           ← 3 roleplay scenario configs + AI prompts
    │   └── quiz.js                ← Quiz questions for every stage ID
    │
    └── utils/
        └── simulate.js            ← Electoral math: FPTP, RCV (IRV), PR (d'Hondt)
```

---

## Features by Mode

### 🗺 Explore
- Horizontal interactive timeline for each country
- Click any stage → steps, key term, ELI5 toggle, fun fact, source link
- "Check My Voter Status" CTA per country
- Per-stage quiz with score tracking
- AI Oracle chat (context-aware to current stage + country)

### ⚗ Simulate
- **Parallel Ballot**: cast a test vote, see it processed under FPTP, RCV, and PR simultaneously
- **What-If Engine**: live sliders for youth turnout, third-party share, system switch
- Seat allocation recalculates in real time using real electoral math (d'Hondt, IRV)
- Parliament dot visualization
- Educational callout explaining why results changed

### 🎭 Roleplay
- 3 AI-driven scenarios: certify result, handle disputed ballot, declare winner
- Gemini plays "the situation" — you make decisions
- Ends with a Civic Score (1–10) and real electoral law feedback

---

## Design System
All colors and fonts are CSS variables in `src/index.css`:

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0A0A0B` | Page background |
| `--surface` | `#111214` | Card backgrounds |
| `--gold` | `#C9A84C` | Primary accent |
| `--blue` | `#3D7EBF` | FPTP system, links |
| `--green` | `#3D8F6E` | PR system, success |
| `--red` | `#BF4040` | Errors, hung parliament |
| `--font-display` | Playfair Display | Headings |
| `--font-body` | DM Sans | Body text |
| `--font-mono` | JetBrains Mono | Numbers, data |

---

## Build for Production
```bash
npm run build
npm run preview   # preview the production build locally
```

Output goes to `dist/` — deploy to Vercel, Netlify, or any static host.
