import { Action } from '@/store/gameStore'

interface Props {
  onSelect: (action: Action) => void
}

export default function ActionButtons({ onSelect }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <button
        onClick={() => onSelect('buy')}
        className="py-4 rounded-2xl bg-red-500/20 border border-red-500/50 text-red-400 font-bold hover:bg-red-500/30 transition-colors"
      >
        매수
      </button>
      <button
        onClick={() => onSelect('hold')}
        className="py-4 rounded-2xl bg-zinc-700/40 border border-zinc-600 text-zinc-300 font-bold hover:bg-zinc-700/60 transition-colors"
      >
        보유
      </button>
      <button
        onClick={() => onSelect('sell')}
        className="py-4 rounded-2xl bg-blue-500/20 border border-blue-500/50 text-blue-400 font-bold hover:bg-blue-500/30 transition-colors"
      >
        매도
      </button>
    </div>
  )
}
