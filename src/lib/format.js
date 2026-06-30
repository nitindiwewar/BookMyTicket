export const formatRuntime = (min) => {
  const h = Math.floor(min / 60)
  const m = min % 60
  return `${h}h ${m}m`
}

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

export const formatMoney = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)

export const compactVotes = (n) => {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return `${n}`
}

export const cx = (...args) => args.filter(Boolean).join(' ')
