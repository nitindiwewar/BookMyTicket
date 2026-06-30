import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Film, Mail, Lock, User, Eye, EyeOff, Chrome, Apple } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Login() {
  const [mode, setMode] = useState('login')
  const [showPass, setShowPass] = useState(false)
  const navigate = useNavigate()
  const { toggleLogin, state } = useApp()

  const submit = (e) => {
    e.preventDefault()
    if (!state.loggedIn) toggleLogin()
    navigate('/dashboard')
  }

  return (
    <div className="section grid min-h-[80vh] place-items-center py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong w-full max-w-md rounded-3xl p-8 shadow-card"
      >
        <div className="mb-6 text-center">
          <span className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-purple-red shadow-glow">
            <Film size={22} className="text-white" />
          </span>
          <h1 className="text-2xl font-bold">{mode === 'login' ? 'Welcome back' : 'Create account'}</h1>
          <p className="mt-1 text-sm text-slate-400">
            {mode === 'login' ? 'Sign in to book your next show' : 'Join CineVerse for member perks'}
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode === 'signup' && (
            <Field icon={User} type="text" placeholder="Full name" />
          )}
          <Field icon={Mail} type="email" placeholder="Email address" />
          <div className="relative">
            <Lock size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type={showPass ? 'text' : 'password'} placeholder="Password" className="input px-11" required />
            <button type="button" onClick={() => setShowPass((s) => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white" aria-label="Toggle password">
              {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>

          {mode === 'login' && (
            <div className="flex justify-end">
              <button type="button" className="text-xs text-cinema-purple-glow hover:underline">Forgot password?</button>
            </div>
          )}

          <button type="submit" className="btn-primary w-full py-3">
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-slate-500">
          <span className="h-px flex-1 bg-white/10" /> or continue with <span className="h-px flex-1 bg-white/10" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button className="btn-outline py-2.5"><Chrome size={16} /> Google</button>
          <button className="btn-outline py-2.5"><Apple size={16} /> Apple</button>
        </div>

        <p className="mt-6 text-center text-sm text-slate-400">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="font-semibold text-cinema-purple-glow hover:underline">
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
        <p className="mt-3 text-center text-xs text-slate-600">
          <Link to="/" className="hover:text-slate-400">← Back to home</Link>
        </p>
      </motion.div>
    </div>
  )
}

function Field({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      <Icon size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
      <input className="input pl-11" required {...props} />
    </div>
  )
}
