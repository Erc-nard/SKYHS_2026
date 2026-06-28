import { useState } from 'react'
import { useGameStore, Action } from '@/store/gameStore'
import CandleChart from '@/components/CandleChart'
import EmotionPanel from '@/components/EmotionPanel'
import ActionButtons from '@/components/ActionButtons'
import Portfolio from '@/components/Portfolio'

type Phase = 'first' | 'emotion' | 'second'

export default function GameScreen() {
  const { currentTurn, totalTurns, recordFirstChoice, recordSecondChoice, nextTurn } = useGameStore()
  const [phase, setPhase] = useState<Phase>('first')
  const [firstChoice, setFirstChoice] = useState<Action>(null)

  const handleFirstChoice = (action: Action) => {
    setFirstChoice(action)
    recordFirstChoice(action)
    setPhase('emotion')
  }

  const handleSecondChoice = (action: Action) => {
    // TODO: 실제 가격은 현재 턴의 종가로 대체
    const currentPrice = 100
    recordSecondChoice(action, currentPrice)
    setPhase('first')
    setFirstChoice(null)
    nextTurn()
  }

  return (
    <div className="flex flex-col min-h-screen px-4 py-6 gap-4 max-w-3xl mx-auto">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <span className="text-zinc-400 text-sm">턴 {currentTurn} / {totalTurns}</span>
        <div className="flex-1 mx-4 h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-yellow-400 rounded-full transition-all"
            style={{ width: `${(currentTurn / totalTurns) * 100}%` }}
          />
        </div>
        <Portfolio />
      </div>

      {/* 차트 */}
      <CandleChart turn={currentTurn} />

      {/* 1차 선택 */}
      {phase === 'first' && (
        <div className="flex flex-col gap-3">
          <p className="text-center text-zinc-300">
            <span className="text-yellow-400 font-bold">차트만 보고</span> 결정하세요
          </p>
          <ActionButtons onSelect={handleFirstChoice} />
        </div>
      )}

      {/* 감정 신호 */}
      {phase === 'emotion' && (
        <EmotionPanel
          turn={currentTurn}
          firstChoice={firstChoice}
          onConfirm={() => setPhase('second')}
        />
      )}

      {/* 2차 선택 */}
      {phase === 'second' && (
        <div className="flex flex-col gap-3">
          <p className="text-center text-zinc-300">
            감정 신호를 본 뒤 <span className="text-yellow-400 font-bold">최종 결정</span>하세요
          </p>
          {firstChoice && (
            <p className="text-center text-xs text-zinc-500">
              1차 선택: {firstChoice === 'buy' ? '매수' : firstChoice === 'sell' ? '매도' : '보유'}
            </p>
          )}
          <ActionButtons onSelect={handleSecondChoice} />
        </div>
      )}
    </div>
  )
}
