import { useGameStore } from '@/store/gameStore'

interface Props {
  turnEndDate: string
  onConfirm: () => void
}

export default function EmotionPanel({ turnEndDate, onConfirm }: Props) {
  const fearGreedMap = useGameStore((s) => s.fearGreedMap)
  const newsMap = useGameStore((s) => s.newsMap)

  const fg = fearGreedMap[turnEndDate]
  const fgValue = fg?.value ?? null
  const fgLabel = fg?.classification ?? '—'
  const fgColor =
    fgValue === null ? 'text-zinc-400'
    : fgValue >= 60 ? 'text-red-400'
    : fgValue >= 40 ? 'text-yellow-400'
    : 'text-blue-400'

  // 해당 날짜 기준 ±1일 이내 뉴스
  const todayNews = newsMap[turnEndDate] ?? []
  const prevDay = new Date(turnEndDate)
  prevDay.setDate(prevDay.getDate() - 1)
  const prevDayStr = prevDay.toISOString().split('T')[0]
  const prevNews = newsMap[prevDayStr] ?? []
  const allNews = [...todayNews, ...prevNews].slice(0, 3)

  return (
    <div className="flex flex-col gap-2 px-4 py-3">

      {/* 공포탐욕지수 */}
      <div className="flex items-center justify-between bg-zinc-900 rounded-xl px-3 py-3 border border-zinc-800">
        <div>
          <p className="text-[10px] text-zinc-500 mb-0.5">공포탐욕지수</p>
          <p className="text-xs text-zinc-400">{turnEndDate}</p>
        </div>
        {fgValue !== null ? (
          <div className="text-right">
            <p className={`text-2xl font-bold ${fgColor}`}>{fgValue}</p>
            <p className={`text-xs ${fgColor}`}>{fgLabel}</p>
          </div>
        ) : (
          <span className="text-zinc-600 text-xs">데이터 없음</span>
        )}
      </div>

      {/* 뉴스 */}
      <div className="bg-zinc-900 rounded-xl px-3 py-3 border border-zinc-800">
        <p className="text-[10px] text-zinc-500 mb-2">관련 뉴스</p>
        {allNews.length > 0 ? (
          <div className="flex flex-col gap-2">
            {allNews.map((n) => (
              <div key={n.id} className="border-b border-zinc-800 pb-2 last:border-0 last:pb-0">
                <p className="text-xs text-zinc-200 leading-relaxed">{n.title}</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">{n.source}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-zinc-600 text-xs">(해당 날짜 뉴스 없음)</p>
        )}
      </div>

      {/* 커뮤니티 */}
      <div className="bg-zinc-900 rounded-xl px-3 py-3 border border-zinc-800">
        <p className="text-[10px] text-zinc-500 mb-2">커뮤니티 반응</p>
        <p className="text-zinc-600 text-xs italic">"(커뮤니티 글 직접 작성 예정)"</p>
      </div>

      <button
        onClick={onConfirm}
        className="w-full py-3 rounded-xl bg-yellow-400 text-black font-bold text-sm hover:bg-yellow-300 transition-colors mt-1"
      >
        최종 결정하기 →
      </button>
    </div>
  )
}
