import { useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Minus, Tag, Check, ShieldCheck, Lock, CreditCard, Smartphone, Wallet, Coins, Loader2 } from 'lucide-react'
import BookingSteps from '../components/BookingSteps'
import { useApp } from '../context/AppContext'
import { getMovieById } from '../data/movies'
import { getTheaterById } from '../data/theaters'
import { foodItems, promoCodes, paymentMethods } from '../data/foodAndOffers'
import { formatMoney, cx } from '../lib/format'

const ICONS = { CreditCard, Smartphone, Wallet, Coins }
const CONVENIENCE_FEE = 1.99
const TAX_RATE = 0.08

export default function Checkout() {
  const navigate = useNavigate()
  const { state, setFood, setPromo, confirmBooking } = useApp()
  const { movieId, theaterId, show, seats, food, promo } = state.booking
  const movie = getMovieById(movieId)
  const theater = getTheaterById(theaterId)

  const [foodMap, setFoodMap] = useState(food || {})
  const [promoInput, setPromoInput] = useState(promo?.code || '')
  const [promoError, setPromoError] = useState('')
  const [appliedPromo, setAppliedPromo] = useState(promo)
  const [payment, setPayment] = useState('card')
  const [processing, setProcessing] = useState(false)

  const seatTotal = seats.reduce((s, x) => s + x.price, 0)
  const foodTotal = useMemo(
    () => Object.entries(foodMap).reduce((sum, [id, qty]) => {
      const item = foodItems.find((f) => f.id === id)
      return sum + (item ? item.price * qty : 0)
    }, 0),
    [foodMap],
  )

  const preDiscount = seatTotal + foodTotal
  const discount = useMemo(() => {
    if (!appliedPromo) return 0
    return appliedPromo.type === 'percent'
      ? (preDiscount * appliedPromo.value) / 100
      : appliedPromo.value
  }, [appliedPromo, preDiscount])

  const taxable = Math.max(0, preDiscount - discount)
  const tax = taxable * TAX_RATE
  const total = taxable + tax + CONVENIENCE_FEE

  if (!movie || !seats.length) {
    return (
      <div className="section grid min-h-[60vh] place-items-center text-center">
        <div>
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <p className="mt-2 text-slate-400">Select seats for a show to continue to checkout.</p>
          <Link to="/movies" className="btn-primary mt-5">Browse movies</Link>
        </div>
      </div>
    )
  }

  const changeQty = (id, delta) => {
    setFoodMap((prev) => {
      const next = { ...prev }
      const qty = (next[id] || 0) + delta
      if (qty <= 0) delete next[id]
      else next[id] = qty
      return next
    })
  }

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase()
    const found = promoCodes[code]
    if (!found) {
      setPromoError('Invalid promo code')
      setAppliedPromo(null)
      return
    }
    setPromoError('')
    setAppliedPromo({ code, ...found })
  }

  const pay = () => {
    setProcessing(true)
    setFood(foodMap)
    setPromo(appliedPromo)
    const bookingId = 'CV-' + Math.random().toString(36).slice(2, 8).toUpperCase()
    setTimeout(() => {
      confirmBooking(bookingId)
      navigate('/confirmation')
    }, 1600)
  }

  return (
    <div className="section py-10">
      <BookingSteps current={1} />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {/* Selected seats */}
          <section className="glass-card p-5">
            <h2 className="mb-3 text-lg font-bold">Selected Seats</h2>
            <div className="flex flex-wrap items-center gap-2">
              {seats.map((s) => (
                <span key={s.id} className="chip border-cinema-purple-glow/40 text-cinema-purple-glow">
                  {s.id} <span className="text-slate-500">· {s.type}</span>
                </span>
              ))}
            </div>
            <p className="mt-3 text-sm text-slate-400">
              {movie.title} · {theater?.name} · {show.time} · {show.format}
            </p>
          </section>

          {/* Food & beverage */}
          <section className="glass-card p-5">
            <h2 className="mb-4 text-lg font-bold">Food & Beverages</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {foodItems.map((item) => {
                const qty = foodMap[item.id] || 0
                return (
                  <div key={item.id} className={cx('flex items-center gap-3 rounded-xl border p-3 transition', qty > 0 ? 'border-cinema-purple-glow/40 bg-cinema-purple/10' : 'border-white/10 bg-white/5')}>
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-black/30 text-2xl">{item.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{item.name}</p>
                      <p className="truncate text-xs text-slate-400">{item.size}</p>
                      <p className="text-sm font-medium text-cinema-purple-glow">{formatMoney(item.price)}</p>
                    </div>
                    {qty === 0 ? (
                      <button onClick={() => changeQty(item.id, 1)} className="btn-outline px-3 py-1.5 text-xs">
                        <Plus size={14} /> Add
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button onClick={() => changeQty(item.id, -1)} className="grid h-7 w-7 place-items-center rounded-full glass hover:bg-white/10"><Minus size={14} /></button>
                        <span className="w-5 text-center text-sm font-bold">{qty}</span>
                        <button onClick={() => changeQty(item.id, 1)} className="grid h-7 w-7 place-items-center rounded-full bg-purple-red"><Plus size={14} /></button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>

          {/* Payment methods */}
          <section className="glass-card p-5">
            <h2 className="mb-4 text-lg font-bold">Payment Method</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {paymentMethods.map((m) => {
                const Icon = ICONS[m.icon]
                const active = payment === m.id
                return (
                  <button
                    key={m.id}
                    onClick={() => setPayment(m.id)}
                    className={cx(
                      'flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition',
                      active ? 'border-cinema-purple-glow bg-cinema-purple/15 shadow-glow' : 'border-white/10 bg-white/5 hover:border-white/30',
                    )}
                  >
                    <Icon size={22} className={active ? 'text-cinema-purple-glow' : 'text-slate-300'} />
                    <span className="text-xs font-medium">{m.label}</span>
                  </button>
                )
              })}
            </div>

            {payment === 'card' && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <input className="input sm:col-span-2" placeholder="Card number" inputMode="numeric" />
                <input className="input" placeholder="MM / YY" />
                <input className="input" placeholder="CVV" inputMode="numeric" />
                <input className="input sm:col-span-2" placeholder="Name on card" />
              </div>
            )}
            {payment === 'upi' && <input className="input mt-4" placeholder="yourname@upi" />}

            <p className="mt-4 flex items-center gap-2 text-xs text-slate-500">
              <Lock size={13} /> Payments are simulated in this demo — no real charge is made.
            </p>
          </section>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-20 lg:h-max">
          <div className="glass-card space-y-4 p-5">
            <h2 className="text-lg font-bold">Price Details</h2>

            {/* Promo */}
            <div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Promo code"
                    className="input pl-9 uppercase"
                  />
                </div>
                <button onClick={applyPromo} className="btn-outline px-4">Apply</button>
              </div>
              {promoError && <p className="mt-1 text-xs text-cinema-red-glow">{promoError}</p>}
              {appliedPromo && (
                <p className="mt-1 flex items-center gap-1 text-xs text-emerald-400">
                  <Check size={13} /> {appliedPromo.code} applied — {appliedPromo.label}
                </p>
              )}
              <p className="mt-2 text-[11px] text-slate-500">Try: CINE20, FIRST5, WEEKEND10</p>
            </div>

            <div className="space-y-2 border-t border-white/10 pt-4 text-sm">
              <Row label={`Tickets (${seats.length})`} value={formatMoney(seatTotal)} />
              {foodTotal > 0 && <Row label="Food & beverages" value={formatMoney(foodTotal)} />}
              {discount > 0 && <Row label="Discount" value={`- ${formatMoney(discount)}`} accent="text-emerald-400" />}
              <Row label="Convenience fee" value={formatMoney(CONVENIENCE_FEE)} />
              <Row label="Tax (8%)" value={formatMoney(tax)} />
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <span className="font-semibold">Total</span>
              <span className="font-display text-2xl font-bold gradient-text">{formatMoney(total)}</span>
            </div>

            <motion.button whileTap={{ scale: 0.98 }} onClick={pay} disabled={processing} className="btn-primary w-full py-3">
              {processing ? (<><Loader2 size={18} className="animate-spin" /> Processing...</>) : (<><ShieldCheck size={18} /> Pay {formatMoney(total)}</>)}
            </motion.button>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <ShieldCheck size={14} className="text-emerald-400" /> 256-bit secure checkout
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

function Row({ label, value, accent }) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-400">{label}</span>
      <span className={cx('font-medium', accent)}>{value}</span>
    </div>
  )
}
