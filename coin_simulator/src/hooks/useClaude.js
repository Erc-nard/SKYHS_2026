import { useState, useCallback } from 'react'

export function useClaude() {
  const [loading, setLoading] = useState(false)

  const generate = useCallback(async (prompt, systemPrompt) => {
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, systemPrompt }),
      })
      const data = await res.json()
      return data.text || ''
    } catch (e) {
      console.error('Claude API error:', e)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { generate, loading }
}
