import { useEffect, useRef } from 'react'
import { createChart, IChartApi } from 'lightweight-charts'

interface Props {
  turn: number
}

// TODO: Upbit API 연동으로 교체
const DUMMY_CANDLES = Array.from({ length: 30 }, (_, i) => {
  const base = 300 + Math.sin(i * 0.5) * 100 + i * 5
  const open = base + (Math.random() - 0.5) * 30
  const close = base + (Math.random() - 0.5) * 30
  const high = Math.max(open, close) + Math.random() * 20
  const low = Math.min(open, close) - Math.random() * 20
  const date = new Date(2021, 0, i + 1)
  return {
    time: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` as `${number}-${string}-${string}`,
    open: Math.round(open),
    high: Math.round(high),
    low: Math.round(low),
    close: Math.round(close),
  }
})

export default function CandleChart({ turn }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 260,
      layout: { background: { color: '#0f0f0f' }, textColor: '#a1a1aa' },
      grid: { vertLines: { color: '#27272a' }, horzLines: { color: '#27272a' } },
      timeScale: { borderColor: '#3f3f46' },
    })

    const series = chart.addCandlestickSeries({
      upColor: '#ef4444',
      downColor: '#3b82f6',
      borderUpColor: '#ef4444',
      borderDownColor: '#3b82f6',
      wickUpColor: '#ef4444',
      wickDownColor: '#3b82f6',
    })

    // 현재 턴까지만 표시 (미래 데이터 숨김)
    series.setData(DUMMY_CANDLES.slice(0, turn * 2))
    chart.timeScale().fitContent()

    chartRef.current = chart

    return () => chart.remove()
  }, [turn])

  return <div ref={containerRef} className="w-full rounded-2xl overflow-hidden border border-zinc-800" />
}
