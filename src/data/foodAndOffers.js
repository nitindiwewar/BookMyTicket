export const foodItems = [
  { id: 'popcorn-lg', name: 'Salted Popcorn', size: 'Large', price: 8.5, emoji: '🍿', category: 'Snacks' },
  { id: 'popcorn-caramel', name: 'Caramel Popcorn', size: 'Large', price: 9.5, emoji: '🍿', category: 'Snacks' },
  { id: 'nachos', name: 'Loaded Nachos', size: 'Regular', price: 7.0, emoji: '🧀', category: 'Snacks' },
  { id: 'hotdog', name: 'Classic Hot Dog', size: 'Regular', price: 6.5, emoji: '🌭', category: 'Snacks' },
  { id: 'cola', name: 'Cola', size: 'Large', price: 5.0, emoji: '🥤', category: 'Drinks' },
  { id: 'icetea', name: 'Peach Iced Tea', size: 'Regular', price: 4.5, emoji: '🧋', category: 'Drinks' },
  { id: 'coffee', name: 'Cold Brew Coffee', size: 'Regular', price: 5.5, emoji: '☕', category: 'Drinks' },
  { id: 'combo', name: 'Couple Combo', size: '2 Popcorn + 2 Drinks', price: 22.0, emoji: '🎁', category: 'Combos' },
]

export const promoCodes = {
  CINE20: { type: 'percent', value: 20, label: '20% off your order' },
  FIRST5: { type: 'flat', value: 5, label: '$5 off for first booking' },
  WEEKEND10: { type: 'percent', value: 10, label: '10% weekend special' },
}

export const offers = [
  {
    id: 'o1',
    title: '50% Off on Wednesdays',
    code: 'CINE20',
    desc: 'Midweek movie magic — flat discount on all 2D shows every Wednesday.',
    accent: '#7c3aed',
    tag: 'Limited',
  },
  {
    id: 'o2',
    title: 'Free Popcorn Combo',
    code: 'FIRST5',
    desc: 'Get a complimentary couple combo on your first booking with CineVerse.',
    accent: '#e11d48',
    tag: 'New users',
  },
  {
    id: 'o3',
    title: 'IMAX Weekend Saver',
    code: 'WEEKEND10',
    desc: 'Premium large-format experiences for less, every Saturday & Sunday.',
    accent: '#f5b942',
    tag: 'Weekend',
  },
]

export const paymentMethods = [
  { id: 'card', label: 'Credit / Debit Card', icon: 'CreditCard' },
  { id: 'upi', label: 'UPI', icon: 'Smartphone' },
  { id: 'paypal', label: 'PayPal', icon: 'Wallet' },
  { id: 'wallet', label: 'CineVerse Wallet', icon: 'Coins' },
]
