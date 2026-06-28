import { useEffect } from 'react'
import { useGameStore } from '@/store/gameStore'
import { fetchDayCandles, Candle } from '@/api/upbit'
import { fetchFearGreedHistory } from '@/api/fearGreed'
import { SCENARIOS, getScenarioToParam } from '@/data/scenarios'

export function useScenarioLoader() {
  const { scenarioId, setCandles, setBgCandles, setFearGreedMap, setNewsMap, setLoading } = useGameStore()

  useEffect(() => {
    if (!scenarioId) return
    const scenario = SCENARIOS.find((s) => s.id === scenarioId)
    if (!scenario) return

    const load = async () => {
      setLoading(true)
      try {
        const toParam = getScenarioToParam(scenario)
        const gameCount = scenario.totalTurns * scenario.intervalDays + 5

        // 정확히 1년 전 날짜 계산
        const oneYearAgo = new Date(scenario.startDate)
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
        const oneYearAgoStr = oneYearAgo.toISOString().split('T')[0]

        // 배경 캔들: 최근 200일 + 그 이전 200일 → 1년 전 이후로 필터
        const bgTo = scenario.startDate + 'T00:00:00Z'
        const bgMidDate = new Date(scenario.startDate)
        bgMidDate.setDate(bgMidDate.getDate() - 200)
        const bgMidTo = bgMidDate.toISOString().split('.')[0] + 'Z'

        const [gameCandleData, bg1, bg2, fearGreedMap] = await Promise.all([
          fetchDayCandles(scenario.market, toParam, gameCount),
          fetchDayCandles(scenario.market, bgTo, 200),
          fetchDayCandles(scenario.market, bgMidTo, 200),
          fetchFearGreedHistory(2200),
        ])
        const newsMap = {}

        // 1년 전 이후 데이터만 남기고 정렬·중복 제거
        const bgAll = dedup([...bg2, ...bg1]).filter(
          (c) => c.candle_date_time_kst.split('T')[0] >= oneYearAgoStr
        )

        setCandles(gameCandleData)
        setBgCandles(bgAll)
        setFearGreedMap(fearGreedMap)
        setNewsMap(newsMap)
      } catch (e) {
        console.error('데이터 로딩 실패', e)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [scenarioId])
}

function dedup(candles: Candle[]): Candle[] {
  const seen = new Set<number>()
  return candles
    .filter((c) => {
      if (seen.has(c.timestamp)) return false
      seen.add(c.timestamp)
      return true
    })
    .sort((a, b) => a.timestamp - b.timestamp)
}
