export const theaters = [
  {
    id: 'aurora-imax',
    name: 'Aurora IMAX',
    city: 'New York',
    area: 'Downtown',
    rating: 4.8,
    screens: 9,
    amenities: ['IMAX', 'Dolby Atmos', 'Recliners', 'Valet'],
    accent: '#7c3aed',
  },
  {
    id: 'velvet-screen',
    name: 'Velvet Screen Cinemas',
    city: 'Los Angeles',
    area: 'Sunset Blvd',
    rating: 4.6,
    screens: 7,
    amenities: ['4DX', 'Bar & Lounge', 'Premium', 'Parking'],
    accent: '#e11d48',
  },
  {
    id: 'royal-picture-house',
    name: 'Royal Picture House',
    city: 'London',
    area: 'Soho',
    rating: 4.7,
    screens: 6,
    amenities: ['Dolby Atmos', 'Heritage Hall', 'Café'],
    accent: '#0ea5e9',
  },
  {
    id: 'galaxy-multiplex',
    name: 'Galaxy Multiplex',
    city: 'Mumbai',
    area: 'Bandra',
    rating: 4.5,
    screens: 11,
    amenities: ['IMAX', '4DX', 'Recliners', 'Food Court'],
    accent: '#f5b942',
  },
  {
    id: 'sakura-cinema',
    name: 'Sakura Cinema',
    city: 'Tokyo',
    area: 'Shibuya',
    rating: 4.9,
    screens: 8,
    amenities: ['IMAX', 'Laser Projection', 'Pods'],
    accent: '#f9a8d4',
  },
  {
    id: 'lumiere-pavilion',
    name: 'Lumière Pavilion',
    city: 'Paris',
    area: 'Le Marais',
    rating: 4.7,
    screens: 5,
    amenities: ['Dolby Vision', 'Champagne Bar', 'Premium'],
    accent: '#a855f7',
  },
]

export const getTheaterById = (id) => theaters.find((t) => t.id === id)

const TIMES = ['10:15 AM', '01:30 PM', '04:45 PM', '07:30 PM', '10:45 PM']

// Deterministic showtimes for a movie across theaters in its city pool.
export function getShowtimes(movie) {
  if (!movie) return []
  return theaters.slice(0, 4).map((theater) => ({
    theater,
    shows: TIMES.map((time, i) => ({
      id: `${theater.id}-${time}`.replace(/[^a-z0-9]/gi, '-'),
      time,
      format: movie.formats[i % movie.formats.length],
      price: 12 + (i % 3) * 4,
      fillRate: [0.3, 0.55, 0.7, 0.85, 0.45][i],
    })),
  }))
}
