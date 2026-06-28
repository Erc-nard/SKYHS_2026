import axios from 'axios'

export interface NewsItem {
  id: string
  title: string
  body: string
  url: string
  source: string
  published_on: number  // Unix timestamp
  tags: string
}

export type NewsMap = Record<string, NewsItem[]>  // "YYYY-MM-DD" → items

// CryptoCompare News API — 무료, CORS 허용, 과거 날짜 조회 가능
export async function fetchNewsByDate(
  categories: string,  // 예: "BTC,DOGE"
  beforeTs: number     // Unix timestamp (이 시각 이전 뉴스)
): Promise<NewsItem[]> {
  const { data } = await axios.get('https://min-api.cryptocompare.com/data/v2/news/', {
    params: {
      categories,
      lTs: beforeTs,  // before timestamp
      lang: 'EN',
    },
  })
  return data.Data ?? []
}

/** 시나리오 전체 기간의 뉴스를 날짜별 맵으로 반환 */
export async function fetchScenarioNews(
  categories: string,
  startDate: string,
  endDate: string
): Promise<NewsMap> {
  const map: NewsMap = {}

  // 끝 날짜부터 시작 날짜까지 한 번에 조회 (최대 50개)
  const endTs = Math.floor(new Date(endDate).getTime() / 1000)
  const items = await fetchNewsByDate(categories, endTs)

  const startTs = Math.floor(new Date(startDate).getTime() / 1000)

  for (const item of items) {
    if (item.published_on < startTs) continue
    const date = new Date(item.published_on * 1000).toISOString().split('T')[0]
    if (!map[date]) map[date] = []
    map[date].push(item)
  }

  return map
}
