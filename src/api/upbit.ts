import axios from 'axios'

const BASE_URL = 'https://api.upbit.com/v1'

export interface Candle {
  market: string
  candle_date_time_utc: string
  candle_date_time_kst: string
  opening_price: number
  high_price: number
  low_price: number
  trade_price: number
  timestamp: number
  candle_acc_trade_volume: number
}

export async function fetchDayCandles(
  market: string,
  to: string,       // "YYYY-MM-DD" 형식
  count: number = 200
): Promise<Candle[]> {
  const { data } = await axios.get<Candle[]>(`${BASE_URL}/candles/days`, {
    params: { market, to, count },
  })
  return data.reverse() // 오래된 순으로 정렬
}
