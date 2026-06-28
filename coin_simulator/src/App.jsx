import { useGameStore } from './store/gameStore'
import StartScreen  from './components/StartScreen'
import SelectScreen from './components/SelectScreen'
import MainScreen   from './components/MainScreen'
import EndingScreen from './components/EndingScreen'

export default function App() {
  const screen = useGameStore(s => s.screen)

  return (
    <div style={{ minHeight: '100vh', background: '#f4f5f7', fontFamily: 'Pretendard,system-ui,sans-serif', color: '#1e232b', WebkitFontSmoothing: 'antialiased' }}>
      {screen === 'start'   && <StartScreen />}
      {screen === 'select'  && <SelectScreen />}
      {screen === 'main'    && <MainScreen />}
      {screen === 'ending'  && <EndingScreen />}
    </div>
  )
}
