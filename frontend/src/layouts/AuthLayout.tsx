import { ReactNode } from 'react'
import { Compass, Sparkles, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-blue-600/20 via-indigo-600/20 to-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Top back to home link */}
      <div className="absolute top-6 left-6">
        <Link to="/" className="inline-flex items-center text-slate-400 hover:text-white text-xs font-semibold gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
      </div>

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Logo Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-3 group mb-2">
            <div className="p-3 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform duration-300">
              <Compass className="h-8 w-8 text-white" />
            </div>
            <div className="flex flex-col justify-center text-left">
              <span className="text-2xl font-black tracking-tight text-white leading-none">
                Voyage<span className="text-indigo-400">AI</span>
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-semibold mt-1">
                Smart Travel Planner
              </span>
            </div>
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-semibold mt-2">
            <Sparkles className="h-3 w-3" /> Your AI Travel Companion
          </div>
        </div>

        {/* Children Form Container */}
        {children}
      </div>
    </div>
  )
}
