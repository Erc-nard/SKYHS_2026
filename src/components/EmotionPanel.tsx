import { Action } from '@/store/gameStore'

interface Props {
  turn: number
  firstChoice?: Action
  onConfirm: () => void
}

// TODO: 시나리오별 실제 데이터로 교체
const DUMMY_EMOTIONS: Record<number, { fearGreed: number; community: string; news: string }> = {
  1: { fearGreed: 82, community: '"가즈아!!! 이거 천만원 넣었다 ㅋㅋ"', news: '도지코인, 일주일 만에 200% 상승' },
  2: { fearGreed: 35, community: '"살까요 말까요... 너무 올랐나"', news: '비트코인 조정 우려에도 투자자 몰려' },
}

export default function EmotionPanel({ turn, onConfirm }: Props) {
  const data = DUMMY_EMOTIONS[turn] ?? DUMMY_EMOTIONS[1]

  const fgColor = data.fearGreed >= 60 ? 'text-red-400' : data.fearGreed >= 40 ? 'text-yellow-400' : 'text-blue-400'
  const fgLabel = data.fearGreed >= 60 ? '탐욕' : data.fearGreed >= 40 ? '중립' : '공포'

  return (
    <div className="flex flex-col gap-3">
      <p className="text-center text-zinc-400 text-sm">시장의 감정을 확인하세요</p>

      {/* 공포탐욕지수 */}
      <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
        <p className="text-xs text-zinc-500 mb-1">공포탐욕지수</p>
        <p className={`text-3xl font-bold ${fgColor}`}>{data.fearGreed} <span className="text-lg">{fgLabel}</span></p>
      </div>

      {/* 커뮤니티 */}
      <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
        <p className="text-xs text-zinc-500 mb-2">커뮤니티 반응</p>
        <p className="text-zinc-300 text-sm italic">"{data.community}"</p>
      </div>

      {/* 뉴스 */}
      <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
        <p className="text-xs text-zinc-500 mb-2">오늘의 뉴스</p>
        <p className="text-zinc-300 text-sm">{data.news}</p>
      </div>

      <button
        onClick={onConfirm}
        className="py-3 rounded-2xl bg-zinc-800 text-zinc-200 font-bold hover:bg-zinc-700 transition-colors"
      >
        최종 결정하기 →
      </button>
    </div>
  )
}
