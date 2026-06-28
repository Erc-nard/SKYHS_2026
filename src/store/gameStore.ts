import { create } from 'zustand'
import { Screen } from '@/App'

export type Action = 'buy' | 'sell' | 'hold' | null

export interface TurnRecord {
  turn: number
  firstChoice: Action
  secondChoice: Action
}

interface GameState {
  screen: Screen
  scenarioId: number | null
  currentTurn: number
  totalTurns: number
  cash: number
  holdings: number        // 보유 코인 수량
  avgPrice: number        // 평균 매수가
  records: TurnRecord[]
  setScreen: (screen: Screen) => void
  selectScenario: (id: number) => void
  recordFirstChoice: (action: Action) => void
  recordSecondChoice: (action: Action, price: number) => void
  nextTurn: () => void
  reset: () => void
}

const INITIAL_CASH = 100_000_000

export const useGameStore = create<GameState>((set, get) => ({
  screen: 'start',
  scenarioId: null,
  currentTurn: 1,
  totalTurns: 12,
  cash: INITIAL_CASH,
  holdings: 0,
  avgPrice: 0,
  records: [],

  setScreen: (screen) => set({ screen }),

  selectScenario: (id) =>
    set({
      scenarioId: id,
      screen: 'game',
      currentTurn: 1,
      cash: INITIAL_CASH,
      holdings: 0,
      avgPrice: 0,
      records: [],
    }),

  recordFirstChoice: (action) => {
    const { currentTurn, records } = get()
    const existing = records.find((r) => r.turn === currentTurn)
    if (existing) {
      set({ records: records.map((r) => r.turn === currentTurn ? { ...r, firstChoice: action } : r) })
    } else {
      set({ records: [...records, { turn: currentTurn, firstChoice: action, secondChoice: null }] })
    }
  },

  recordSecondChoice: (action, price) => {
    const { currentTurn, records, cash, holdings, avgPrice } = get()
    const updated = records.map((r) =>
      r.turn === currentTurn ? { ...r, secondChoice: action } : r
    )

    let newCash = cash
    let newHoldings = holdings
    let newAvgPrice = avgPrice
    const tradeAmount = Math.floor(cash * 0.5) // 50% 단위 매매

    if (action === 'buy' && cash > 0) {
      const coinsBought = tradeAmount / price
      newAvgPrice = (avgPrice * holdings + price * coinsBought) / (holdings + coinsBought)
      newCash = cash - tradeAmount
      newHoldings = holdings + coinsBought
    } else if (action === 'sell' && holdings > 0) {
      newCash = cash + holdings * price
      newHoldings = 0
      newAvgPrice = 0
    }

    set({ records: updated, cash: newCash, holdings: newHoldings, avgPrice: newAvgPrice })
  },

  nextTurn: () => {
    const { currentTurn, totalTurns } = get()
    if (currentTurn >= totalTurns) {
      set({ screen: 'result' })
    } else {
      set({ currentTurn: currentTurn + 1 })
    }
  },

  reset: () =>
    set({
      screen: 'start',
      scenarioId: null,
      currentTurn: 1,
      cash: INITIAL_CASH,
      holdings: 0,
      avgPrice: 0,
      records: [],
    }),
}))
