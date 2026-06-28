export default async function handler(req, res) {
  const { market, to, count } = req.query
  const url = new URL('https://api.upbit.com/v1/candles/days')
  if (market) url.searchParams.set('market', market)
  if (to) url.searchParams.set('to', to)
  if (count) url.searchParams.set('count', count)

  const response = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
  })
  const data = await response.json()

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'application/json')
  res.status(response.status).json(data)
}
