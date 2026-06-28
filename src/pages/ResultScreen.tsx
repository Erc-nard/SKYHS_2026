import { useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import { SCENARIOS, getTurnStartDate, getTurnEndDate } from '@/data/scenarios'
import ResultChart from '@/components/ResultChart'

const EMOTION_TYPES = [
  {
    range: [0, 20],
    name: '냉정한 분석가',
    emoji: '🧊',
    desc: '감정 신호에 거의 흔들리지 않았습니다. 차트를 기반으로 일관되게 판단했습니다.',
    tip: '시장 심리도 때론 유효한 신호입니다. 군중의 극단적 감정(공포/탐욕)을 역발상 기회로 활용해보세요.',
  },
  {
    range: [21, 40],
    name: '신중한 관찰자',
    emoji: '🔍',
    desc: '대부분 차트를 믿었지만, 강한 신호 앞에서는 가끔 반응했습니다.',
    tip: '어떤 상황에서 마음을 바꿨는지 패턴을 분석해보세요. 그 패턴이 수익과 연관되는지 확인하는 것이 중요합니다.',
  },
  {
    range: [41, 60],
    name: '흔들리는 중간자',
    emoji: '⚖️',
    desc: '이성과 감정 사이에서 갈등했습니다. 중요한 순간마다 외부 신호가 결정을 바꿨습니다.',
    tip: '투자 전 "이 가격에 매수/매도하겠다"는 기준을 미리 정해두세요. 감정 신호를 보기 전에 결정 원칙을 세워두면 흔들림이 줄어듭니다.',
  },
  {
    range: [61, 80],
    name: '감정 추종자',
    emoji: '🌊',
    desc: '시장의 감정에 민감하게 반응했습니다. 커뮤니티와 뉴스가 결정에 큰 영향을 미쳤습니다.',
    tip: '"남들이 탐욕스러울 때 두려워하고, 남들이 두려워할 때 탐욕스러워져라." — 워런 버핏. 뉴스를 보기 전에 먼저 자신의 판단을 기록하는 습관을 들여보세요.',
  },
  {
    range: [81, 100],
    name: '군중 속의 나',
    emoji: '🎭',
    desc: '감정 신호가 거의 모든 결정을 바꿨습니다. 시장이 흥분하면 함께 흥분하고, 공포에 물들면 함께 패닉했습니다.',
    tip: '차트만 보고 내린 1차 결정이 오히려 더 나은 결과를 냈을 가능성이 높습니다. 정보가 많을수록 판단이 흐려질 수 있습니다.',
  },
]

function getEmotionType(rate: number) {
  return EMOTION_TYPES.find((t) => rate >= t.range[0] && rate <= t.range[1]) ?? EMOTION_TYPES[2]
}

const SCENARIO_AFTERMATH: Record<number, string> = {
  1: '2021년 5월 8일, 일론 머스크는 SNL에 출연해 도지코인을 "허슬"이라고 불렀습니다. 방송 직후 도지코인은 30% 급락했고, 이후 한 달 만에 고점 대비 70% 이상 하락했습니다. "SNL 전까지만"이라는 커뮤니티의 예측은 정확했지만, 실제로 고점에서 매도한 사람은 많지 않았습니다.',
}

export default function ResultScreen() {
  const { records, candles, scenarioId, cash, holdings, reset, fearGreedMap } = useGameStore()
  const [copied, setCopied] = useState(false)

  const scenario = SCENARIOS.find((s) => s.id === scenarioId)!

  const turnDates = Array.from({ length: scenario.totalTurns }, (_, i) =>
    getTurnStartDate(scenario, i + 1)
  )

  const completed = records.filter((r) => r.secondChoice !== null)
  const candleByDate = new Map(candles.map((c) => [c.candle_date_time_kst.slice(0, 10), c.trade_price] as const))
  const getPriceByTurn = (turn: number) => candleByDate.get(getTurnEndDate(scenario, turn)) ?? null
  const getMaxPriceBeforeTurn = (turn: number) => {
    const prevPrices = Array.from({ length: turn - 1 }, (_, i) => getPriceByTurn(i + 1)).filter(
      (price): price is number => price !== null
    )
    return prevPrices.length ? Math.max(...prevPrices) : null
  }
  const getFgByTurn = (turn: number) => fearGreedMap[getTurnEndDate(scenario, turn)]?.value ?? null
  const sellFgValues = completed
    .filter((r) => r.secondChoice === 'sell')
    .map((r) => getFgByTurn(r.turn))
    .filter((value): value is number => value !== null)
  const buyFgValues = completed
    .filter((r) => r.secondChoice === 'buy')
    .map((r) => getFgByTurn(r.turn))
    .filter((value): value is number => value !== null)
  const avgSellFg = sellFgValues.length
    ? Math.round(sellFgValues.reduce((sum, value) => sum + value, 0) / sellFgValues.length)
    : null
  const avgBuyFg = buyFgValues.length
    ? Math.round(buyFgValues.reduce((sum, value) => sum + value, 0) / buyFgValues.length)
    : null
  const sellTendency = avgSellFg === null ? null : avgSellFg >= 50 ? '높은 공포탐욕지수에서 매도' : '낮은 공포탐욕지수에서 매도'
  const buyTendency = avgBuyFg === null ? null : avgBuyFg >= 50 ? '높은 공포탐욕지수에서 매수' : '낮은 공포탐욕지수에서 매수'
  const fomoBuyCount = completed.filter((r) => {
    if (r.secondChoice !== 'buy' || r.tradePrice === null || r.turn <= 1) return false
    const peakPrice = getMaxPriceBeforeTurn(r.turn)
    return peakPrice !== null && r.tradePrice >= peakPrice
  }).length
  const panicSellCount = completed.filter((r) => {
    if (r.secondChoice !== 'sell' || r.tradePrice === null || r.turn <= 1) return false
    const prevPrice = getPriceByTurn(r.turn - 1)
    return prevPrice !== null && r.tradePrice < prevPrice
  }).length
  const buyCount = completed.filter((r) => r.secondChoice === 'buy').length
  const sellCount = completed.filter((r) => r.secondChoice === 'sell').length
  const fomoIndex = buyCount ? Math.round((fomoBuyCount / buyCount) * 100) : null
  const panicSellIndex = sellCount ? Math.round((panicSellCount / sellCount) * 100) : null
  const fomoScore = fomoIndex !== null ? `${fomoIndex}%` : null
  const panicSellScore = panicSellIndex !== null ? `${panicSellIndex}%` : null
  const fomoDescription = fomoIndex === null
    ? null
    : fomoIndex < 34
    ? '낮은 추격매수 비율'
    : fomoIndex < 67
    ? '보통 수준의 추격매수 비율'
    : '높은 추격매수 비율'
  const panicSellDescription = panicSellIndex === null
    ? null
    : panicSellIndex < 34
    ? '낮은 급매도 비율'
    : panicSellIndex < 67
    ? '보통 수준의 급매도 비율'
    : '높은 급매도 비율'
  const fomoPanicSummary = fomoDescription && panicSellDescription
    ? `${fomoDescription}과 ${panicSellDescription}을 보입니다.`
    : null
  const fgBehaviorText = avgSellFg !== null && avgBuyFg !== null
    ? `당신은 ${buyTendency}하고\n${sellTendency}하는 경향이 있습니다.`
    : null
  const adviceLines: string[] = []
  if (avgSellFg !== null && avgBuyFg !== null) {
    if (avgSellFg >= 50 && avgBuyFg < 50) {
      adviceLines.push('매도는 탐욕 구간, 매수는 공포 구간에서 이루어졌습니다. 초보자는 계획된 진입/청산 기준을 세워 감정 매매를 줄이세요.')
    } else if (avgSellFg < 50 && avgBuyFg >= 50) {
      adviceLines.push('매도는 공포 구간, 매수는 탐욕 구간에서 이루어졌습니다. 시장의 반란적 심리에 휩쓸리지 않도록 분할 매수/분할 매도를 고려하세요.')
    } else if (avgSellFg >= 50 && avgBuyFg >= 50) {
      adviceLines.push('매수와 매도가 모두 탐욕 구간에서 발생했습니다. 차트와 리스크 관리를 우선해 과도한 추격 매수/매도는 피하세요.')
    } else {
      adviceLines.push('매수와 매도가 모두 공포 구간에서 발생했습니다. 초보자는 감정이 격해질 때 무리한 거래를 자제하고 원칙을 지키세요.')
    }
  }
  if (fomoIndex !== null && fomoIndex >= 50) {
    adviceLines.push('FOMO 지수가 높습니다. 놓치지 않으려는 심리보다 자금 관리와 분할 진입을 먼저 생각하세요.')
  }
  if (panicSellIndex !== null && panicSellIndex >= 50) {
    adviceLines.push('패닉셀 지수가 높습니다. 급락 구간에서 성급한 청산을 피하려면 손절 기준과 매수 여력부터 먼저 준비하세요.')
  }
  if (!adviceLines.length) {
    adviceLines.push('거래 데이터가 충분하지 않거나 감정 지표가 비교적 안정적입니다. 꾸준히 원칙을 지키며 경험을 쌓아보세요.')
  }
  const swayCount = completed.filter((r) => r.firstChoice !== r.secondChoice).length
  const swayRate = completed.length > 0 ? Math.round((swayCount / completed.length) * 100) : 0

  const lastCandle = candles[candles.length - 1]
  const finalPrice = lastCandle?.trade_price ?? 0
  const finalAsset = cash + holdings * finalPrice
  const profit = finalAsset - 100_000_000
  const profitRate = (profit / 100_000_000) * 100

  const emotionType = getEmotionType(swayRate)
  const aftermath = SCENARIO_AFTERMATH[scenarioId ?? 1]

  const shareText = [
    `${emotionType.emoji} 코인 투자 심리 진단`,
    ``,
    `시나리오: ${scenario.title}`,
    `유형: ${emotionType.name}`,
    `수익률: ${profitRate >= 0 ? '+' : ''}${profitRate.toFixed(1)}%`,
    `감정에 흔들린 비율: ${swayRate}%`,
    ``,
    `감정은 결정을 바꿀까요? → skysh3.vercel.app`,
  ].join('\n')

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: '코인 투자 심리 진단', text: shareText })
        return
      } catch { /* 취소 시 무시 */ }
    }
    await navigator.clipboard.writeText(shareText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <div className="max-w-4xl mx-auto px-5 py-12">

        {/* 헤더 */}
        <div className="text-center mb-10">
          <p className="text-zinc-400 text-sm tracking-widest uppercase mb-3">게임 종료 — 감정 분석 결과</p>
          <div className="text-7xl mb-4">{emotionType.emoji}</div>
          <h1 className="text-4xl font-bold mb-2 text-zinc-900">{emotionType.name}</h1>
          <p className="text-zinc-500 max-w-md mx-auto leading-relaxed">{emotionType.desc}</p>
        </div>

        <div className="mb-8 rounded-2xl border border-zinc-200 bg-zinc-50 px-6 py-5">
          <div className="grid grid-cols-1 gap-4 text-sm text-zinc-600 md:grid-cols-2">
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 md:min-h-[220px] md:flex md:flex-col md:justify-between">
              <div>
                <p className="text-sm font-bold text-zinc-700 mb-3">공포탐욕지수 분석</p>
                <div className="text-xs text-zinc-400 mb-4">매수/매도 시 각각의 평균 공포탐욕지수를 평가합니다.</div>
                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                  <div className="flex-1 text-center p-4 rounded-2xl">
                    <p className="text-[10px] text-zinc-400 mb-1.5">매수 시 평균 공탐지수</p>
                    <p className="text-3xl font-bold text-red-500">{avgBuyFg !== null ? `${avgBuyFg}점` : '데이터 없음'}</p>
                  </div>
                  <div className="hidden md:block h-16 w-px bg-zinc-200" />
                  <div className="flex-1 text-center p-4 rounded-2xl">
                    <p className="text-[10px] text-zinc-400 mb-1.5">매도 시 평균 공탐지수</p>
                    <p className="text-3xl font-bold text-blue-500">{avgSellFg !== null ? `${avgSellFg}점` : '데이터 없음'}</p>
                  </div>
                </div>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm text-zinc-600">{fgBehaviorText ?? '매수 또는 매도 데이터가 부족해 공포탐욕지수 기반 경향을 평가할 수 없습니다.'}</p>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 md:min-h-[220px] md:flex md:flex-col md:justify-start">
              <div>
                <p className="text-sm font-bold text-zinc-700 mb-3">FOMO / 패닉셀 지수 분석</p>
                <div className="text-xs text-zinc-400 mb-4">FOMO는 추격매수, 패닉셀은 급락 후 급매도를 보여줍니다.</div>
                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                  <div className="flex-1 text-center p-4 rounded-2xl">
                    <p className="text-[10px] text-zinc-400 mb-1.5">FOMO 지수</p>
                    <p className="text-3xl font-bold text-rose-500">{fomoScore ?? '데이터 없음'}</p>
                  </div>
                  <div className="hidden md:block h-16 w-px bg-zinc-200" />
                  <div className="flex-1 text-center p-4 rounded-2xl">
                    <p className="text-[10px] text-zinc-400 mb-1.5">패닉셀 지수</p>
                    <p className="text-3xl font-bold text-sky-500">{panicSellScore ?? '데이터 없음'}</p>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm text-zinc-600">{fomoPanicSummary ?? '데이터가 부족해 특징을 표시할 수 없습니다.'}</p>
            </div>
          </div>
          <div className="mt-4 rounded-2xl bg-white border border-zinc-200 p-4 text-sm text-zinc-700">
            <p className="font-semibold text-zinc-900 mb-2">입문자를 위한 투자 조언</p>
            <ul className="list-disc list-inside space-y-2">
              {adviceLines.map((line, index) => (
                <li key={index}>{line}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* 핵심 지표 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <StatCard label="감정에 흔들린 횟수" value={`${swayCount}번`} sub={`전체 ${completed.length}턴 중`} highlight />
          <StatCard label="흔들린 비율" value={`${swayRate}%`} sub={swayRate >= 50 ? '평균 이상' : '평균 이하'} highlight />
          <StatCard
            label="최종 수익률"
            value={`${profitRate >= 0 ? '+' : ''}${profitRate.toFixed(1)}%`}
            sub={`₩${Math.abs(profit / 10000).toFixed(0)}만 ${profit >= 0 ? '수익' : '손실'}`}
            positive={profit >= 0}
          />
          <StatCard label="거래 내역" value={`매수 ${buyCount} / 매도 ${sellCount}`} sub={`보유 ${completed.length - buyCount - sellCount}턴`} />
        </div>

        {/* 전체 차트 */}
        <div className="mb-8">
          <h2 className="text-sm text-zinc-400 mb-3 flex items-center gap-2">
            전체 게임 구간 차트
            <span className="text-[10px] text-zinc-400">↑ 빨간 = 매수 / 파란 = 매도</span>
          </h2>
          <div className="h-[280px] rounded-2xl overflow-hidden border border-zinc-200">
            <ResultChart candles={candles} records={records} turnDates={turnDates} />
          </div>
        </div>

        {/* 1차 vs 2차 비교 */}
        <div className="mb-8">
          <h2 className="text-sm text-zinc-400 mb-3">턴별 1차 결정 vs 최종 결정</h2>
          <div className="rounded-2xl border border-zinc-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-400 text-xs bg-zinc-50">
                  <th className="px-4 py-2.5 text-left">턴</th>
                  <th className="px-4 py-2.5 text-left">날짜</th>
                  <th className="px-4 py-2.5 text-center">차트만</th>
                  <th className="px-4 py-2.5 text-center">감정 후</th>
                  <th className="px-4 py-2.5 text-center">변경</th>
                  <th className="px-4 py-2.5 text-right">누적 손익</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => {
                  const changed = r.firstChoice !== r.secondChoice
                  return (
                    <tr key={r.turn} className={`border-b border-zinc-100 last:border-0 ${changed ? 'bg-orange-50' : ''}`}>
                      <td className="px-4 py-2.5 text-zinc-400 text-xs">{r.turn}</td>
                      <td className="px-4 py-2.5 text-zinc-400 text-xs">{turnDates[r.turn - 1]}</td>
                      <td className="px-4 py-2.5 text-center"><ActionBadge action={r.firstChoice} /></td>
                      <td className="px-4 py-2.5 text-center"><ActionBadge action={r.secondChoice} /></td>
                      <td className="px-4 py-2.5 text-center text-xs">
                        {changed ? <span className="text-orange-500 font-medium">⚡ 변경</span> : <span className="text-zinc-300">—</span>}
                      </td>
                      <td className="px-4 py-2.5 text-right text-xs font-mono">
                        {r.assetAfter !== null ? (
                          (() => {
                            const cumPnl = r.assetAfter - 100_000_000
                            const cumRate = (cumPnl / 100_000_000) * 100
                            return (
                              <span className={cumPnl >= 0 ? 'text-red-500' : 'text-blue-500'}>
                                {cumPnl >= 0 ? '+' : ''}{Math.round(cumPnl / 10000).toLocaleString()}만
                                <span className="text-[10px] ml-0.5 opacity-70">({cumRate >= 0 ? '+' : ''}{cumRate.toFixed(1)}%)</span>
                              </span>
                            )
                          })()
                        ) : (
                          <span className="text-zinc-300">—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 실제 시장 결과 */}
        {aftermath && (
          <div className="mb-8 rounded-2xl border border-zinc-200 bg-zinc-50 px-6 py-5">
            <p className="text-xs text-zinc-700 mb-2 font-medium">실제 시장에서는 어떤 일이 일어났을까요?</p>
            <p className="text-zinc-600 text-sm leading-relaxed">{aftermath}</p>
          </div>
        )}

        {/* 개선 팁 */}
        <div className="mb-10 rounded-2xl border border-zinc-200 bg-zinc-50 px-6 py-5">
          <p className="text-xs text-zinc-400 mb-2">투자 행동 개선 포인트</p>
          <p className="text-zinc-700 text-sm leading-relaxed">{emotionType.tip}</p>
        </div>

        {/* CTA */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={reset}
            className="px-8 py-3.5 bg-zinc-900 text-white font-bold rounded-full hover:bg-zinc-700 active:scale-95 transition-all"
          >
            다시 도전하기
          </button>
          <button
            onClick={() => useGameStore.getState().setScreen('scenario')}
            className="px-8 py-3.5 bg-white border border-zinc-300 text-zinc-700 font-bold rounded-full hover:bg-zinc-100 active:scale-95 transition-all"
          >
            다른 시나리오
          </button>
          <button
            onClick={handleShare}
            className="px-8 py-3.5 bg-white border border-zinc-300 text-zinc-700 font-bold rounded-full hover:bg-zinc-100 active:scale-95 transition-all flex items-center gap-2"
          >
            {copied ? (
              <><span className="text-green-500">✓</span> 복사됨</>
            ) : (
              <><span>↗</span> 결과 공유</>
            )}
          </button>
        </div>

      </div>
    </div>
  )
}

function StatCard({ label, value, sub, highlight, positive }: {
  label: string; value: string; sub: string; highlight?: boolean; positive?: boolean
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4">
      <p className="text-[10px] text-zinc-400 mb-1">{label}</p>
      <p className={`text-2xl font-bold mb-0.5 ${
        highlight ? 'text-zinc-900' : positive === true ? 'text-red-500' : positive === false ? 'text-blue-500' : 'text-zinc-900'
      }`}>{value}</p>
      <p className="text-[10px] text-zinc-400">{sub}</p>
    </div>
  )
}

function ActionBadge({ action }: { action: string | null }) {
  if (!action) return <span className="text-zinc-300 text-xs">—</span>
  const map: Record<string, { label: string; color: string }> = {
    buy: { label: '매수', color: 'text-red-500' },
    sell: { label: '매도', color: 'text-blue-500' },
    hold: { label: '보유', color: 'text-zinc-500' },
  }
  const { label, color } = map[action] ?? { label: action, color: 'text-zinc-500' }
  return <span className={`text-xs font-medium ${color}`}>{label}</span>
}
