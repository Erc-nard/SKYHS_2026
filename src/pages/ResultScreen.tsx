import { useGameStore } from '@/store/gameStore'

export default function ResultScreen() {
  const { records, reset } = useGameStore()

  const totalChanged = records.filter(
    (r) => r.firstChoice !== r.secondChoice
  ).length

  const swayRate = Math.round((totalChanged / records.length) * 100)

  const getType = () => {
    if (swayRate >= 70) return { name: '감정 파도타기형', desc: '시장의 감정에 강하게 반응합니다. 군중이 흔들릴 때 함께 흔들렸습니다.' }
    if (swayRate >= 40) return { name: '중간 흔들림형', desc: '이성과 감정 사이에서 갈등했습니다. 중요한 순간에 감정이 개입했습니다.' }
    return { name: '냉정한 관찰자형', desc: '감정 신호에 크게 흔들리지 않았습니다. 차트를 기반으로 일관되게 판단했습니다.' }
  }

  const type = getType()

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-16 gap-8 max-w-2xl mx-auto">
      <p className="text-zinc-400 text-sm tracking-widest uppercase">분석 결과</p>

      <div className="flex flex-col items-center gap-2 text-center">
        <span className="text-yellow-400 text-5xl font-bold">{swayRate}%</span>
        <p className="text-zinc-400">감정에 흔들린 비율</p>
      </div>

      <div className="w-full bg-zinc-900 rounded-2xl p-6 border border-zinc-800 text-center">
        <p className="text-sm text-zinc-400 mb-1">당신의 유형</p>
        <h2 className="text-2xl font-bold text-yellow-400 mb-3">{type.name}</h2>
        <p className="text-zinc-300">{type.desc}</p>
      </div>

      <div className="w-full bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
        <p className="text-sm text-zinc-400 mb-4">턴별 선택 기록</p>
        <div className="flex flex-col gap-2">
          {records.map((r) => (
            <div key={r.turn} className="flex items-center justify-between text-sm">
              <span className="text-zinc-500">턴 {r.turn}</span>
              <span className={r.firstChoice !== r.secondChoice ? 'text-red-400' : 'text-zinc-300'}>
                {r.firstChoice} → {r.secondChoice}
                {r.firstChoice !== r.secondChoice && ' ⚡ 변경'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={reset}
        className="px-10 py-4 bg-yellow-400 text-black font-bold text-lg rounded-full hover:bg-yellow-300 transition-colors"
      >
        다시 시작
      </button>
    </div>
  )
}
