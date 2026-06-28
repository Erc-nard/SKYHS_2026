import { Action } from '@/store/gameStore'

interface Props {
  onSelect: (action: Action) => void
  canBuy: boolean
  canSell: boolean
}

export default function ActionButtons({ onSelect, canBuy, canSell }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <button
        onClick={() => canBuy && onSelect('buy')}
        disabled={!canBuy}
        className={`py-2.5 rounded-lg border text-sm font-semibold transition-all duration-100 ${
          canBuy
            ? 'border-zinc-200 text-red-500 hover:border-red-400 hover:bg-red-50 active:scale-95'
            : 'border-zinc-200 text-zinc-400 cursor-not-allowed'
        }`}
      >
        매수
        {!canBuy && <span className="block text-[9px] font-normal mt-0.5">현금 없음</span>}
      </button>
      <button
        onClick={() => onSelect('hold')}
        className="py-2.5 rounded-lg border border-zinc-200 text-zinc-600 text-sm font-semibold hover:border-zinc-400 hover:bg-zinc-100 active:scale-95 transition-all duration-100"
      >
        보유
      </button>
      <button
        onClick={() => canSell && onSelect('sell')}
        disabled={!canSell}
        className={`py-2.5 rounded-lg border text-sm font-semibold transition-all duration-100 ${
          canSell
            ? 'border-zinc-200 text-blue-500 hover:border-blue-400 hover:bg-blue-50 active:scale-95'
            : 'border-zinc-200 text-zinc-400 cursor-not-allowed'
        }`}
      >
        매도
        {!canSell && <span className="block text-[9px] font-normal mt-0.5">보유 없음</span>}
      </button>
    </div>
  )
}
