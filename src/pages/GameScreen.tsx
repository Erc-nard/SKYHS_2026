import { useState } from 'react'
import { useGameStore, Action } from '@/store/gameStore'
import { SCENARIOS, getTurnEndDate } from '@/data/scenarios'
import { useScenarioLoader } from '@/hooks/useScenarioLoader'
import ResizableLayout from '@/components/ResizableLayout'
import CandleChart from '@/components/CandleChart'
import ActionButtons from '@/components/ActionButtons'
import TradeHistory from '@/components/TradeHistory'
import EmotionPanel from '@/components/EmotionPanel'

type Phase = 'first' | 'emotion'

const ACTION_LABEL: Record<NonNullable<Action>, string> = {
  buy: '매수 📈',
  sell: '매도 📉',
  hold: '보유 ⏸',
}

export default function GameScreen() {
  useScenarioLoader()

  const {
    currentTurn, totalTurns,
    scenarioId, candles, bgCandles, isLoading,
    cash, holdings, fearGreedMap,
    recordFirstChoice, recordSecondChoice, nextTurn,
  } = useGameStore()

  const [phase, setPhase] = useState<Phase>('first')
  const [firstChoice, setFirstChoice] = useState<Action>(null)
  const [showFinalModal, setShowFinalModal] = useState(false)

  const scenario = SCENARIOS.find((s) => s.id === scenarioId)!
  const visibleCandles = candles.slice(0, currentTurn * scenario.intervalDays)
  const currentPrice = visibleCandles[visibleCandles.length - 1]?.trade_price ?? 0
  const turnEndDate = getTurnEndDate(scenario, currentTurn)

  const holdingsValue = holdings * currentPrice
  const totalAsset = cash + holdingsValue
  const profit = totalAsset - 100_000_000
  const profitRate = (profit / 100_000_000) * 100

  const fg = fearGreedMap[turnEndDate]
  const fgValue = fg?.value ?? null
  const fgLabel = fg?.classification ?? '데이터 없음'

  const handleFirstChoice = (action: Action) => {
    setFirstChoice(action)
    recordFirstChoice(action)
    setPhase('emotion')
  }

  const handleSecondChoice = (action: Action) => {
    setShowFinalModal(false)
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

  const leftPanel = (
    <div className="flex flex-col h-full border-r border-zinc-800">
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
  )

  const rightPanel = (
    <div className="flex flex-col h-full overflow-hidden bg-[#0f0f0f]">

      {/* 날짜 + 턴 */}
      <div className="px-4 py-3 border-b border-zinc-800 shrink-0">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-2xl font-bold font-mono tracking-wide">{turnEndDate}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{scenario.title} · 턴 {currentTurn}/{totalTurns}</p>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${
            phase === 'first'
              ? 'bg-zinc-700 text-zinc-300'
              : 'bg-yellow-400/20 text-yellow-400'
          }`}>
            {phase === 'first' ? '① 1차 결정' : '② 신호 확인'}
          </span>
        </div>
        <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-yellow-400 rounded-full transition-all"
            style={{ width: `${(currentTurn / totalTurns) * 100}%` }}
          />
        </div>
      </div>

      {/* 자산 + 1차 액션 */}
      <div className="px-4 py-3 border-b border-zinc-800 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-zinc-500">평가 자산</p>
            <p className="text-lg font-bold font-mono">₩{totalAsset.toLocaleString()}</p>
            <p className={`text-xs font-mono ${profit >= 0 ? 'text-red-400' : 'text-blue-400'}`}>
              {profit >= 0 ? '+' : ''}{profit.toLocaleString()} ({profitRate.toFixed(2)}%)
            </p>
          </div>
          {holdings > 0 && (
            <div className="text-right text-[10px] text-zinc-500 space-y-0.5">
              <p>현금 ₩{Math.floor(cash / 10000).toLocaleString()}만</p>
              <p>보유 {holdings.toFixed(2)} DOGE</p>
            </div>
          )}
        </div>

        {phase === 'first' && (
          <>
            <p className="text-xs text-zinc-400 mb-2">
              <span className="text-yellow-400 font-bold">차트만 보고</span> 1차 결정 — 감정 신호 공개 전
            </p>
            <ActionButtons onSelect={handleFirstChoice} />
          </>
        )}
        {phase === 'emotion' && (
          <p className="text-xs text-zinc-400 text-center py-1">
            1차 선택: <span className="text-yellow-400 font-bold">
              {firstChoice ? ACTION_LABEL[firstChoice] : '—'}
            </span> — 아래 감정 신호 확인 후 최종 결정
          </p>
        )}
      </div>

      {/* 공포탐욕지수 위젯 */}
      <div className="px-4 py-3 border-b border-zinc-800 shrink-0">
        <p className="text-[10px] text-zinc-500 mb-2">공포탐욕지수</p>
        {!fg || phase === 'first' ? (
          <div className="flex items-center gap-2 text-zinc-600 text-xs">
            <span>🔒</span>
            <span>1차 결정 후 공개</span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span className={`text-2xl font-bold font-mono ${
              fgValue! >= 60 ? 'text-red-400' : fgValue! >= 40 ? 'text-yellow-400' : 'text-blue-400'
            }`}>{fgValue}</span>
            <div className="flex-1">
              <div className="relative h-2 rounded-full bg-gradient-to-r from-blue-600 via-yellow-400 to-red-500 mb-1">
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-zinc-900 shadow"
                  style={{ left: `calc(${fgValue}% - 6px)` }}
                />
              </div>
              <p className={`text-[10px] ${
                fgValue! >= 60 ? 'text-red-400' : fgValue! >= 40 ? 'text-yellow-400' : 'text-blue-400'
              }`}>{fgLabel}</p>
            </div>
          </div>
        )}
      </div>

      {/* 뉴스·커뮤니티 패널 */}
      <div className="flex-1 flex flex-col min-h-0">
        <EmotionPanel
          scenarioId={scenarioId!}
          turnEndDate={turnEndDate}
          isRevealed={phase !== 'first'}
          onConfirm={() => setShowFinalModal(true)}
          showConfirm={phase === 'emotion'}
        />
      </div>

      {/* 매매 내역 */}
      <details className="border-t border-zinc-800 shrink-0">
        <summary className="px-4 py-2 text-xs text-zinc-500 cursor-pointer hover:text-zinc-300 select-none">
          매매 내역 ({useGameStore.getState().records.length}건)
        </summary>
        <div className="px-4 pb-3 max-h-40 overflow-y-auto">
          <TradeHistory />
        </div>
      </details>
    </div>
  )

  return (
    <>
      <ResizableLayout
        left={leftPanel}
        right={rightPanel}
        defaultLeftPct={35}
        minLeftPct={20}
        maxLeftPct={60}
      />

      {/* 최종 결정 팝업 */}
      {showFinalModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setShowFinalModal(false)}
        >
          <div
            className="relative w-80 bg-[#1a1a1a] border border-zinc-700 rounded-2xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 */}
            <button
              onClick={() => setShowFinalModal(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-200 text-lg leading-none"
            >
              ✕
            </button>

            <p className="text-xs text-zinc-500 mb-1">최종 결정</p>
            <p className="text-sm text-zinc-300 mb-1">
              1차 선택:{' '}
              <span className="text-yellow-400 font-bold">
                {firstChoice ? ACTION_LABEL[firstChoice] : '—'}
              </span>
            </p>
            <p className="text-xs text-zinc-500 mb-5">
              감정 신호를 확인했습니다. 지금 어떻게 하시겠습니까?
            </p>

            <ActionButtons onSelect={handleSecondChoice} />

            <button
              onClick={() => setShowFinalModal(false)}
              className="mt-3 w-full py-2 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              취소하고 다시 보기
            </button>
          </div>
        </div>
      )}
    </>
  )
}
