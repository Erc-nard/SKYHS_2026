export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { prompt, systemPrompt } = req.body
  const apiKey = process.env.OPENAI_API_KEY

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt || '당신은 감정적인 개인 투자자입니다.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 256,
        temperature: 0.9,
      }),
    })
    const data = await response.json()
    if (!response.ok) {
      console.error('OpenAI error:', response.status, JSON.stringify(data))
      return res.status(200).json({ text: '', error: data?.error?.message || 'OpenAI error' })
    }
    const text = data.choices?.[0]?.message?.content || ''
    res.json({ text })
  } catch (e) {
    console.error('OpenAI fetch error:', e.message)
    res.status(200).json({ text: '', error: e.message })
  }
}
