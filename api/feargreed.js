export default async function handler(req, res) {
  const { limit, format } = req.query
  const url = new URL('https://api.alternative.me/fng/')
  if (limit) url.searchParams.set('limit', limit)
  if (format) url.searchParams.set('format', format)

  const response = await fetch(url.toString())
  const data = await response.json()

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'application/json')
  res.status(response.status).json(data)
}
