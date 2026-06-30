// Lightweight decorative QR-style matrix generated deterministically from a
// string. Not a scannable QR code — it provides an authentic ticket look
// without pulling in an external dependency.
function hashStr(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export default function QRCode({ value = 'CINEVERSE', size = 132, className }) {
  const cells = 21
  const seedBase = hashStr(value)
  const modules = []
  for (let r = 0; r < cells; r += 1) {
    for (let c = 0; c < cells; c += 1) {
      // finder patterns at three corners
      const inFinder =
        (r < 7 && c < 7) || (r < 7 && c >= cells - 7) || (r >= cells - 7 && c < 7)
      let on
      if (inFinder) {
        const lr = r % 7
        const lc = c >= cells - 7 ? c - (cells - 7) : c
        const rr = r >= cells - 7 ? r - (cells - 7) : r
        const fr = r >= cells - 7 ? rr : lr
        const fc = c >= cells - 7 ? lc : lr >= 0 ? c % 7 : c
        const ring = fr === 0 || fr === 6 || fc === 0 || fc === 6
        const core = fr >= 2 && fr <= 4 && fc >= 2 && fc <= 4
        on = ring || core
      } else {
        on = (hashStr(`${value}-${r}-${c}-${seedBase}`) & 1) === 1
      }
      if (on) modules.push([c, r])
    }
  }
  const unit = size / cells
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className} role="img" aria-label="Ticket QR code">
      <rect width={size} height={size} rx="8" fill="#ffffff" />
      {modules.map(([c, r], i) => (
        <rect
          key={i}
          x={c * unit}
          y={r * unit}
          width={unit + 0.5}
          height={unit + 0.5}
          fill="#08070d"
        />
      ))}
    </svg>
  )
}
