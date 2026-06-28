import { useEffect, useRef, useState } from 'react'
import { createChart, ColorType, LineStyle, CandlestickSeries, HistogramSeries } from 'lightweight-charts'

// ── 배경 캔들: 시나리오 시작 전 히스토리 (월봉 기준) ─────────
export const DOGE_BG = [
  { time: '2020-01-01', open: 2.5,  high: 2.9,  low: 2.1,  close: 2.6,  volume: 80   },
  { time: '2020-02-01', open: 2.6,  high: 2.9,  low: 2.0,  close: 2.3,  volume: 72   },
  { time: '2020-03-01', open: 2.3,  high: 2.6,  low: 1.5,  close: 2.1,  volume: 130  },
  { time: '2020-04-01', open: 2.1,  high: 2.5,  low: 1.8,  close: 2.3,  volume: 92   },
  { time: '2020-05-01', open: 2.3,  high: 2.7,  low: 2.1,  close: 2.5,  volume: 100  },
  { time: '2020-06-01', open: 2.5,  high: 3.0,  low: 2.4,  close: 2.8,  volume: 115  },
  { time: '2020-07-01', open: 2.8,  high: 3.4,  low: 2.6,  close: 3.1,  volume: 135  },
  { time: '2020-08-01', open: 3.1,  high: 3.9,  low: 2.9,  close: 3.6,  volume: 160  },
  { time: '2020-09-01', open: 3.6,  high: 3.9,  low: 3.0,  close: 3.2,  volume: 142  },
  { time: '2020-10-01', open: 3.2,  high: 6.8,  low: 3.1,  close: 5.8,  volume: 460  },
  { time: '2020-11-01', open: 5.8,  high: 9.9,  low: 5.2,  close: 8.5,  volume: 640  },
  { time: '2020-12-01', open: 8.5,  high: 11.0, low: 5.5,  close: 8.0,  volume: 490  },
  { time: '2021-01-01', open: 8.0,  high: 68.0, low: 7.5,  close: 17.0, volume: 1700 },
  { time: '2021-02-01', open: 17.0, high: 100.0, low: 14.0, close: 24.0, volume: 2300 },
  { time: '2021-03-01', open: 24.0, high: 74.0, low: 21.0, close: 62.0, volume: 3300 },
]

// ── 게임 캔들: 게임 진행 구간 (일봉) ─────────────────────────
export const DOGE_GAME = [
  { time: '2021-03-31', open: 62,  high: 68,  low: 60,  close: 65,  volume: 3800  },
  { time: '2021-04-01', open: 65,  high: 80,  low: 64,  close: 77,  volume: 5200  },
  { time: '2021-04-06', open: 77,  high: 92,  low: 75,  close: 86,  volume: 7500  },
  { time: '2021-04-13', open: 86,  high: 135, low: 84,  close: 121, volume: 13000 },
  { time: '2021-04-15', open: 121, high: 245, low: 118, close: 228, volume: 26000 },
  { time: '2021-04-16', open: 228, high: 510, low: 220, close: 467, volume: 52000 },
  { time: '2021-04-19', open: 467, high: 555, low: 450, close: 513, volume: 62000 },
  { time: '2021-04-20', open: 513, high: 520, low: 370, close: 395, volume: 48000 },
  { time: '2021-04-21', open: 395, high: 415, low: 360, close: 388, volume: 36000 },
  { time: '2021-04-23', open: 388, high: 395, low: 270, close: 295, volume: 32000 },
  { time: '2021-04-28', open: 295, high: 390, low: 290, close: 376, volume: 29000 },
  { time: '2021-05-03', open: 376, high: 560, low: 372, close: 539, volume: 58000 },
]

export const FTX_BG = [
  { time: '2022-06-01', open: 3800, high: 3900, low: 3700, close: 3820, volume: 5000 },
  { time: '2022-07-01', open: 3820, high: 4100, low: 3750, close: 4050, volume: 6000 },
  { time: '2022-08-01', open: 4050, high: 4200, low: 3900, close: 4000, volume: 5500 },
  { time: '2022-09-01', open: 4000, high: 4050, low: 3400, close: 3600, volume: 7000 },
  { time: '2022-10-01', open: 3600, high: 3700, low: 3200, close: 3300, volume: 6500 },
]
export const FTX_GAME = [
  { time: '2022-11-07', open: 2950, high: 2980, low: 2850, close: 2895, volume: 8000  },
  { time: '2022-11-08', open: 2895, high: 2900, low: 2500, close: 2665, volume: 15000 },
  { time: '2022-11-09', open: 2665, high: 2680, low: 2100, close: 2292, volume: 22000 },
  { time: '2022-11-10', open: 2292, high: 2450, low: 2250, close: 2366, volume: 12000 },
  { time: '2022-11-11', open: 2366, high: 2380, low: 2150, close: 2251, volume: 9000  },
  { time: '2022-11-12', open: 2251, high: 2360, low: 2230, close: 2300, volume: 7000  },
  { time: '2022-11-13', open: 2300, high: 2320, low: 2260, close: 2295, volume: 6000  },
  { time: '2022-11-14', open: 2295, high: 2340, low: 2270, close: 2298, volume: 5500  },
  { time: '2022-11-15', open: 2298, high: 2350, low: 2290, close: 2306, volume: 5000  },
  { time: '2022-11-16', open: 2306, high: 2310, low: 2190, close: 2222, volume: 6000  },
  { time: '2022-11-17', open: 2222, high: 2290, low: 2210, close: 2258, volume: 5200  },
  { time: '2022-11-20', open: 2258, high: 2300, low: 2245, close: 2273, volume: 4800  },
]

// ── 인터벌 집계 ───────────────────────────────────────────────
function getMondayStr(dateStr) {
  const d = new Date(dateStr)
  const day = d.getUTCDay()
  d.setUTCDate(d.getUTCDate() - (day === 0 ? 6 : day - 1))
  return d.toISOString().split('T')[0]
}
function getMonthStr(dateStr) { return dateStr.slice(0, 7) + '-01' }

function aggregate(candles, keyFn) {
  const map = {}
  for (const c of candles) {
    const k = keyFn(c.time)
    if (!map[k]) map[k] = { time: k, open: c.open, high: c.high, low: c.low, close: c.close, volume: c.volume }
    else {
      map[k].high   = Math.max(map[k].high, c.high)
      map[k].low    = Math.min(map[k].low, c.low)
      map[k].close  = c.close
      map[k].volume += c.volume
    }
  }
  return Object.values(map).sort((a, b) => a.time.localeCompare(b.time))
}

function applyInterval(candles, interval) {
  if (interval === 'W') return aggregate(candles, getMondayStr)
  if (interval === 'M') return aggregate(candles, getMonthStr)
  return candles
}

// ── 차트 생성 (앱 테마: 흰 배경) ─────────────────────────────
export function createDarkChart(container, height) {
  return createChart(container, {
    layout: {
      background: { type: ColorType.Solid, color: '#fff' },
      textColor: '#9099a6',
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: 11,
    },
    grid: {
      vertLines: { color: '#f0f2f5' },
      horzLines: { color: '#f0f2f5' },
    },
    crosshair: {
      vertLine: { color: '#c8cdd4', style: LineStyle.Dashed, width: 1 },
      horzLine: { color: '#c8cdd4', style: LineStyle.Dashed, width: 1 },
    },
    rightPriceScale: { borderVisible: false, textColor: '#aab0ba', scaleMargins: { top: 0.05, bottom: 0.22 } },
    timeScale: { borderVisible: false, timeVisible: true, secondsVisible: false },
    handleScroll: true,
    handleScale: true,
    width: container.clientWidth,
    height,
  })
}

const INTERVAL_LABEL = { D: '일', W: '주', M: '월' }

export default function PriceChart({ revealedCount, scenario = 'doge' }) {
  const containerRef    = useRef(null)
  const chartRef        = useRef(null)
  const cancelRef       = useRef(false)
  const prevRevealedRef = useRef(0)
  const prevIntervalRef = useRef('D')
  const [interval, setIntervalType] = useState('D')

  useEffect(() => {
    if (!containerRef.current) return

    cancelRef.current = true
    if (chartRef.current) { chartRef.current.remove(); chartRef.current = null }

    const chart = createDarkChart(containerRef.current, 220)
    chartRef.current = chart
    cancelRef.current = false

    const rawBg   = scenario === 'doge' ? DOGE_BG   : FTX_BG
    const rawGame = scenario === 'doge' ? DOGE_GAME  : FTX_GAME

    const bgCandles   = applyInterval(rawBg, interval)
    const allGame     = applyInterval(rawGame, interval)
    const revGame     = allGame.slice(0, revealedCount)

    // ── 배경 시리즈 (연한 회색 — 히스토리 맥락) ──────────────
    const bgSeries = chart.addSeries(CandlestickSeries, {
      upColor:         'rgba(214,90,78,.08)',
      downColor:       'rgba(58,111,208,.08)',
      borderUpColor:   '#e8c5c2',
      borderDownColor: '#c2cce8',
      wickUpColor:     '#e8c5c2',
      wickDownColor:   '#c2cce8',
      priceFormat:     { type: 'price', precision: 0, minMove: 1 },
      lastValueVisible: false,
      priceLineVisible: false,
    })
    bgSeries.setData(bgCandles)

    // ── 게임 시리즈 (한국 컨벤션: 상승=빨강, 하락=파랑) ──────
    const gameSeries = chart.addSeries(CandlestickSeries, {
      upColor:         '#d65a4e',
      downColor:       '#3a6fd0',
      borderUpColor:   '#d65a4e',
      borderDownColor: '#3a6fd0',
      wickUpColor:     '#d65a4e',
      wickDownColor:   '#3a6fd0',
      priceFormat:     { type: 'price', precision: 0, minMove: 1 },
      lastValueVisible: false,
      priceLineVisible: false,
    })

    // ── 거래량 히스토그램 (하단 20%) ─────────────────────────
    const volSeries = chart.addSeries(HistogramSeries, {
      priceFormat:    { type: 'volume' },
      priceScaleId:   'vol',
      lastValueVisible: false,
    })
    chart.priceScale('vol').applyOptions({
      scaleMargins: { top: 0.82, bottom: 0 },
    })

    const buildVol = (bgC, gameC) => [
      ...bgC.map(c => ({ time: c.time, value: c.volume, color: '#eef0f3' })),
      ...gameC.map(c => ({ time: c.time, value: c.volume, color: c.close >= c.open ? 'rgba(214,90,78,.25)' : 'rgba(58,111,208,.25)' })),
    ]

    // 인터벌 변경 → 즉시 전체 표시
    const intervalChanged = interval !== prevIntervalRef.current
    const startFrom       = intervalChanged ? 0 : Math.min(prevRevealedRef.current, revGame.length)

    if (startFrom > 0) {
      gameSeries.setData(revGame.slice(0, startFrom))
      volSeries.setData(buildVol(bgCandles, revGame.slice(0, startFrom)))
    }

    // 새 캔들만 스태거드 애니메이션
    const animate = async () => {
      for (let i = startFrom; i < revGame.length; i++) {
        if (cancelRef.current) return
        const slice = revGame.slice(0, i + 1)
        gameSeries.setData(slice)
        volSeries.setData(buildVol(bgCandles, slice))
        if (i < revGame.length - 1 && !intervalChanged) {
          await new Promise(r => setTimeout(r, 260))
        }
      }
      if (!cancelRef.current) {
        chart.timeScale().fitContent()
        prevRevealedRef.current = revGame.length
        prevIntervalRef.current = interval
      }
    }
    animate()

    const ro = new ResizeObserver(entries => {
      if (entries[0] && chartRef.current) {
        chartRef.current.applyOptions({ width: entries[0].contentRect.width })
      }
    })
    ro.observe(containerRef.current)

    return () => {
      cancelRef.current = true
      ro.disconnect()
      if (chartRef.current) { chartRef.current.remove(); chartRef.current = null }
    }
  }, [interval, revealedCount, scenario])

  return (
    <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid #e4e7ec', marginTop: '2px' }}>
      <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end', padding: '8px 10px 0', background: '#fff' }}>
        {Object.entries(INTERVAL_LABEL).map(([k, label]) => (
          <button key={k} onClick={() => setIntervalType(k)}
            style={{
              padding: '3px 9px', borderRadius: '5px', fontSize: '10px',
              fontFamily: "'IBM Plex Mono',monospace", cursor: 'pointer',
              background: interval === k ? '#1e232b' : 'transparent',
              color:      interval === k ? '#fff' : '#aab0ba',
              border:     `1px solid ${interval === k ? '#1e232b' : 'transparent'}`,
              transition: 'all .12s',
            }}
          >{label}</button>
        ))}
      </div>
      <div ref={containerRef} style={{ width: '100%', height: '220px' }} />
    </div>
  )
}
