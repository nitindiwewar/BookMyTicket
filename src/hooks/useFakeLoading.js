import { useEffect, useState } from 'react'

// Simulates async data fetching so skeleton screens are demonstrable.
export function useFakeLoading(delay = 700) {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), delay)
    return () => clearTimeout(t)
  }, [delay])
  return loading
}
