import { useGameStore } from '@/store/gameStore'

export default function Portfolio() {
  const { cash, holdings, avgPrice } = useGameStore()

  const total = cash + holdings * avgPrice

  return (
    <div className="text-right text-xs text-zinc-400">
      <p>현금 {(cash / 10000).toFixed(0)}만</p>
      <p className="text-yellow-400">{total >= 100_000_000 ? '▲' : '▼'} {(total / 10000).toFixed(0)}만</p>
    </div>
  )
}
