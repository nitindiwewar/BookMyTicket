import { Check } from 'lucide-react'
import { cx } from '../lib/format'

const steps = ['Seats', 'Checkout', 'Confirmation']

export default function BookingSteps({ current = 0 }) {
  return (
    <div className="mx-auto mb-8 flex max-w-xl items-center">
      {steps.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center">
              <span
                className={cx(
                  'grid h-9 w-9 place-items-center rounded-full border text-sm font-bold transition',
                  done && 'border-transparent bg-purple-red text-white',
                  active && 'border-cinema-purple-glow bg-cinema-purple/20 text-white shadow-glow',
                  !done && !active && 'border-white/15 text-slate-500',
                )}
              >
                {done ? <Check size={16} /> : i + 1}
              </span>
              <span className={cx('mt-1.5 text-xs', active || done ? 'text-white' : 'text-slate-500')}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={cx('mx-2 h-0.5 flex-1 rounded-full transition', done ? 'bg-purple-red' : 'bg-white/10')} />
            )}
          </div>
        )
      })}
    </div>
  )
}
