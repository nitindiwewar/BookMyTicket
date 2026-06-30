import { Link } from 'react-router-dom'
import { Film, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="section grid min-h-[70vh] place-items-center text-center">
      <div>
        <span className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-purple-red shadow-glow">
          <Film size={28} className="text-white" />
        </span>
        <p className="font-display text-7xl font-extrabold gradient-text">404</p>
        <h1 className="mt-2 text-2xl font-bold">Scene not found</h1>
        <p className="mt-2 text-slate-400">This reel seems to be missing. Let's get you back.</p>
        <Link to="/" className="btn-primary mt-6"><Home size={18} /> Back to home</Link>
      </div>
    </div>
  )
}
