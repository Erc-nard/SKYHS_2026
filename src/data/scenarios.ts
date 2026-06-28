export interface Scenario {
  id: number
  title: string
  description: string
  tags: string[]
  market: string        // Upbit 마켓 코드
  startDate: string     // 첫 턴 기준 날짜 (ISO)
  intervalDays: number  // 턴당 간격
  available: boolean
}

export const SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: '21년 도지코인',
    description: '일론 머스크 트윗 한 줄에 5000% 폭등한 그 날',
    tags: ['#밈코인', '#롤러코스터', '#일론효과'],
    market: 'KRW-DOGE',
    startDate: '2021-01-01',
    intervalDays: 3,
    available: true,
  },
  {
    id: 2,
    title: '21년 코인 고점',
    description: '비트코인이 8천만원을 넘던 불장의 절정',
    tags: ['#불장', '#천장은어디', '#FOMO'],
    market: 'KRW-BTC',
    startDate: '2021-03-01',
    intervalDays: 7,
    available: false,
  },
  {
    id: 3,
    title: '22년 거래소 파산',
    description: 'FTX 붕괴, 루나 폭락 — 공포가 시장을 삼켰다',
    tags: ['#패닉', '#뱅크런', '#폭락장'],
    market: 'KRW-BTC',
    startDate: '2022-05-01',
    intervalDays: 7,
    available: false,
  },
  {
    id: 4,
    title: '25년 하반기',
    description: '지금 이 순간, 당신이라면 어떻게 했을까',
    tags: ['#최근장', '#실전', '#현재진행중'],
    market: 'KRW-BTC',
    startDate: '2025-07-01',
    intervalDays: 7,
    available: false,
  },
]
