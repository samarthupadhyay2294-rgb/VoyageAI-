import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import { Lock, Mail, User, ArrowRight, UserCheck, UserPlus, Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await signUp(email, password, fullName)
      toast.success('Account created successfully!')
      navigate('/dashboard')
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create account'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleGuestContinue = () => {
    toast.success('Continuing in Guest Mode!')
    navigate('/dashboard')
  }

  return (
    <div className="glass-card p-6 sm:p-8 space-y-6 animate-fade-in shadow-2xl border-indigo-500/20">
      <div className="text-center">
        <h2 className="text-2xl font-black text-white">Create Account</h2>
        <p className="text-xs text-slate-400 mt-1">
          Create an account or continue as guest.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-indigo-400" /> Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="input-field"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 text-indigo-400" /> Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-indigo-400" /> Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field pr-11"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-white"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3.5 text-sm font-bold gap-2 shadow-lg shadow-indigo-600/30"
        >
          {loading ? (
            'Creating account...'
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              <span>Create Account</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Optional Divider & Guest Mode Button */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-slate-900 px-3 text-slate-400 font-semibold">Or</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGuestContinue}
        className="btn-secondary w-full py-3 text-xs font-bold gap-2 text-indigo-300 border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20"
      >
        <UserCheck className="h-4 w-4 text-emerald-400" />
        <span>Continue as Guest</span>
      </button>

      <div className="text-center pt-2 text-xs text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold underline ml-1">
          Sign In
        </Link>
      </div>
    </div>
  )
}
