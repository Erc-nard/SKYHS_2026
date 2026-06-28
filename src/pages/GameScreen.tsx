import { useState } from 'react'
import { useGameStore, Action } from '@/store/gameStore'
import { SCENARIOS, getTurnEndDate } from '@/data/scenarios'
import { useScenarioLoader } from '@/hooks/useScenarioLoader'
import CandleChart from '@/components/CandleChart'
import ActionButtons from '@/components/ActionButtons'
import TradeHistory from '@/components/TradeHistory'
import EmotionPanel from '@/components/EmotionPanel'

type Phase = 'first' | 'emotion' | 'second'

const PHASE_LABEL: Record<Phase, string> = {
  first: '① 차트만 보고 결정',
  emotion: '② 감정 신호 확인 중',
  second: '③ 최종 결정',
}

export default function GameScreen() {
  useScenarioLoader()

  const {
    currentTurn, totalTurns,
    scenarioId, candles, bgCandles, isLoading,
    cash, holdings,
    recordFirstChoice, recordSecondChoice, nextTurn,
  } = useGameStore()

  const [phase, setPhase] = useState<Phase>('first')
  const [firstChoice, setFirstChoice] = useState<Action>(null)

  const scenario = SCENARIOS.find((s) => s.id === scenarioId)!
  const visibleCandles = candles.slice(0, currentTurn * scenario.intervalDays)
  const currentPrice = visibleCandles[visibleCandles.length - 1]?.trade_price ?? 0
  const turnEndDate = getTurnEndDate(scenario, currentTurn)

  const holdingsValue = holdings * currentPrice
  const totalAsset = cash + holdingsValue
  const profit = totalAsset - 100_000_000
  const profitRate = (profit / 100_000_000) * 100

  const handleFirstChoice = (action: Action) => {
    setFirstChoice(action)
    recordFirstChoice(action)
    setPhase('emotion')
  }

  const handleSecondChoice = (action: Action) => {
    recordSecondChoice(action, currentPrice)
    setPhase('first')
    setFirstChoice(null)
    nextTurn()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400 text-sm">시장 데이터 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0f0f0f]">

      {/* ── 좌측: 차트 (40%) ── */}
      <div className="w-[40%] flex flex-col border-r border-zinc-800 min-w-0">
        <div className="flex items-center gap-3 px-3 py-2 border-b border-zinc-800 shrink-0">
          <span className="font-bold text-sm">{scenario.market}</span>
          {currentPrice > 0 && (
            <span className="text-white font-mono text-sm">
              ₩{currentPrice.toLocaleString()}
            </span>
          )}
        </div>
        <div className="flex-1 min-h-0">
          <CandleChart
            bgCandles={bgCandles}
            gameCandles={visibleCandles}
            scenarioStartDate={scenario.startDate}
          />
        </div>
      </div>

      {/* ── 우측: 정보 패널 (60%) ── */}
      <div className="w-[60%] flex flex-col overflow-y-auto">

        {/* 날짜 + 턴 진행 */}
        <div className="px-5 py-3 border-b border-zinc-800 shrink-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-2xl font-bold font-mono tracking-wide">{turnEndDate}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{PHASE_LABEL[phase]}</p>
            </div>
            <div className="text-right text-xs text-zinc-500">
              <p>{scenario.title}</p>
              <p className="text-zinc-400 mt-0.5">턴 {currentTurn} / {totalTurns}</p>
            </div>
          </div>
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-400 rounded-full transition-all"
              style={{ width: `${(currentTurn / totalTurns) * 100}%` }}
            />
          </div>
        </div>

        {/* 평가 자산 */}
        <div className="px-5 py-3 border-b border-zinc-800 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 mb-0.5">평가 자산</p>
              <p className="text-xl font-bold font-mono">₩{totalAsset.toLocaleString()}</p>
              <p className={`text-xs font-mono mt-0.5 ${profit >= 0 ? 'text-red-400' : 'text-blue-400'}`}>
                {profit >= 0 ? '+' : ''}{profit.toLocaleString()} ({profitRate >= 0 ? '+' : ''}{profitRate.toFixed(2)}%)
              </p>
            </div>
            {holdings > 0 && (
              <div className="text-right text-xs text-zinc-500">
                <p>현금 ₩{cash.toLocaleString()}</p>
                <p className="mt-0.5">보유 {holdings.toFixed(4)}</p>
                <p className="mt-0.5">평단 ₩{Math.round(holdingsValue / holdings).toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>

        {/* 액션 */}
        <div className="px-5 py-3 border-b border-zinc-800 shrink-0">
          {phase === 'first' && (
            <>
              <p className="text-xs text-zinc-400 mb-2">
                <span className="text-yellow-400 font-bold">차트만 보고</span> 1차 결정하세요
              </p>
              <ActionButtons onSelect={handleFirstChoice} />
            </>
          )}
          {phase === 'emotion' && (
            <p className="text-xs text-zinc-400 text-center py-1">
              1차 선택:{' '}
              <span className="text-yellow-400 font-bold">
                {firstChoice === 'buy' ? '매수' : firstChoice === 'sell' ? '매도' : '보유'}
              </span>
              {' '}— 아래 감정 신호를 확인 후 최종 결정하세요
            </p>
          )}
          {phase === 'second' && (
            <>
              <p className="text-xs text-zinc-400 mb-2">
                감정 신호를 본 뒤{' '}
                <span className="text-yellow-400 font-bold">최종 결정</span>하세요
              </p>
              <ActionButtons onSelect={handleSecondChoice} />
            </>
          )}
        </div>

        {/* 감정 신호 — 항상 표시, 확인 단계에서 강조 */}
        <div className={`border-b border-zinc-800 transition-opacity ${phase === 'emotion' ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
          <EmotionPanel turnEndDate={turnEndDate} onConfirm={() => setPhase('second')} />
        </div>

        {/* 매매 내역 */}
        <div className="px-5 py-3">
          <p className="text-xs text-zinc-500 mb-2">매매 내역</p>
          <TradeHistory />
        </div>
      </div>
    </div>
  )
}
