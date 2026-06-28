import { useGameStore } from '@/store/gameStore'
import { SCENARIOS } from '@/data/scenarios'

export default function ScenarioSelect() {
  const selectScenario = useGameStore((s) => s.selectScenario)

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-16 gap-10">
      <div className="text-center">
        <p className="text-zinc-400 text-sm tracking-widest uppercase mb-2">시나리오 선택</p>
        <h2 className="text-3xl font-bold">어떤 시장을 경험해볼까요?</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            onClick={() => s.available && selectScenario(s.id)}
            disabled={!s.available}
            className={`
              relative flex flex-col items-start gap-3 p-6 rounded-2xl border text-left transition-all
              ${s.available
                ? 'border-zinc-700 hover:border-yellow-400 hover:bg-zinc-900 cursor-pointer'
                : 'border-zinc-800 opacity-40 cursor-not-allowed'
              }
            `}
          >
            {!s.available && (
              <span className="absolute top-3 right-3 text-xs text-zinc-500 border border-zinc-700 px-2 py-0.5 rounded-full">
                준비중
              </span>
            )}
            <span className="text-xl font-bold">{s.title}</span>
            <span className="text-zinc-400 text-sm">{s.description}</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {s.tags.map((tag) => (
                <span key={tag} className="text-xs text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
