import { Link, useLocation } from 'react-router-dom'
import { Compass, Menu, X, Plus, Sparkles, LogIn, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import Avatar from './Avatar'
import AvatarPicker from './AvatarPicker'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false)
  const location = useLocation()
  const { user, isGuest, signOut } = useAuth()

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Explore Destinations', href: '/explore' },
    { name: 'My Trips', href: '/trips' },
  ]

  return (
    <>
      <nav className="glass-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform duration-300">
                <Compass className="h-7 w-7 text-white animate-spin-slow" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-2xl font-black tracking-tight text-white leading-none">
                  Voyage<span className="text-indigo-400">AI</span>
                </span>
                <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-semibold mt-1">
                  Smart Travel Planner
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              })}
            </div>

            {/* User Avatar, Sign In & CTA Actions */}
            <div className="hidden md:flex items-center space-x-3">
              <Link
                to="/trips/create"
                className="btn-primary py-2.5 px-4 text-sm gap-2"
              >
                <Plus className="h-4 w-4" />
                <span>Plan New Trip</span>
              </Link>

              {/* Avatar trigger button */}
              <div
                onClick={() => setIsAvatarPickerOpen(true)}
                className="flex items-center space-x-3 p-1.5 pr-3 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 rounded-full cursor-pointer transition-all duration-200"
                title="Click to customize avatar"
              >
                <Avatar src={user?.avatar_url} name={user?.full_name || 'Guest'} size="sm" showBadge />
                <div className="text-left">
                  <p className="text-xs font-semibold text-white leading-tight truncate max-w-[100px]">
                    {user?.full_name || 'Explorer'}
                  </p>
                  <span className="text-[10px] text-indigo-400 font-medium flex items-center gap-1">
                    <Sparkles className="h-2.5 w-2.5" /> {isGuest ? 'Guest' : 'Member'}
                  </span>
                </div>
              </div>

              {/* Optional Login Button */}
              {isGuest ? (
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors flex items-center gap-1.5"
                >
                  <LogIn className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Sign In</span>
                </Link>
              ) : (
                <button
                  onClick={signOut}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-xl transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <div
                onClick={() => setIsAvatarPickerOpen(true)}
                className="cursor-pointer"
              >
                <Avatar src={user?.avatar_url} name={user?.full_name || 'Guest'} size="sm" />
              </div>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2.5 text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-xl"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden bg-slate-950/95 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3 animate-slide-down">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="block px-4 py-3 rounded-xl text-slate-200 hover:bg-slate-900 hover:text-white font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/trips/create"
              className="btn-primary w-full py-3 text-center justify-center"
              onClick={() => setIsOpen(false)}
            >
              <Plus className="h-5 w-5 mr-2" /> Plan New Trip
            </Link>
            {isGuest ? (
              <Link
                to="/login"
                className="btn-secondary w-full py-3 text-center justify-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <LogIn className="h-4 w-4 text-indigo-400" /> Sign In
              </Link>
            ) : (
              <button
                onClick={() => {
                  signOut()
                  setIsOpen(false)
                }}
                className="btn-secondary w-full py-3 text-center justify-center gap-2 text-rose-400 border-rose-500/20"
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            )}
          </div>
        )}
      </nav>

      {/* Avatar Picker Modal */}
      <AvatarPicker
        isOpen={isAvatarPickerOpen}
        onClose={() => setIsAvatarPickerOpen(false)}
      />
    </>
  )
}
