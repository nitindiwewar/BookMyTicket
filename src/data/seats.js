// Seat map generator. Returns rows of seats with type + status.
// Types: regular | premium | vip. Status: available | booked.

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K']
const COLS = 16

const SEAT_PRICES = {
  regular: 12,
  premium: 18,
  vip: 28,
}

// Deterministic pseudo-random so a given show always looks the same.
function seeded(seed) {
  let s = 0
  for (let i = 0; i < seed.length; i += 1) s = (s * 31 + seed.charCodeAt(i)) % 100000
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
}

export function generateSeatMap(showId = 'default', fillRate = 0.4) {
  const rnd = seeded(showId)
  return ROWS.map((row, rowIndex) => {
    let type = 'regular'
    if (rowIndex >= ROWS.length - 2) type = 'vip'
    else if (rowIndex >= ROWS.length - 5) type = 'premium'

    const seats = Array.from({ length: COLS }, (_, c) => {
      const number = c + 1
      const isAisleGap = c === 3 || c === COLS - 4
      return {
        id: `${row}${number}`,
        row,
        number,
        type,
        price: SEAT_PRICES[type],
        status: rnd() < fillRate ? 'booked' : 'available',
        aisleAfter: isAisleGap,
      }
    })
    return { row, type, seats }
  })
}

export { SEAT_PRICES }
