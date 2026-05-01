import { useState, useEffect } from 'react'
import Shell from './components/Shell.jsx'
import ExploreMode from './components/ExploreMode.jsx'
import SimulateMode from './components/SimulateMode.jsx'
import RoleplayMode from './components/RoleplayMode.jsx'

export default function App() {
  const [mode, setMode]       = useState('explore')   // explore | simulate | roleplay
  const [country, setCountry] = useState('IN')         // IN | US | UK | EU
  const [scores, setScores]   = useState({})           // { stageId: true } quiz scores

  return (
    <Shell
      mode={mode}
      setMode={setMode}
      country={country}
      setCountry={setCountry}
      scores={scores}
    >
      {mode === 'explore'  && <ExploreMode  country={country} scores={scores} setScores={setScores} />}
      {mode === 'simulate' && <SimulateMode country={country} />}
      {mode === 'roleplay' && <RoleplayMode country={country} />}
    </Shell>
  )
}
