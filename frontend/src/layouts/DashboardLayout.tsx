import { ReactNode, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Home, Compass, Calendar, Settings, Plus, Sparkles, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Avatar from '../components/common/Avatar'
import AvatarPicker from '../components/common/AvatarPicker'
import Navbar from '../components/common/Navbar'

interface DashboardLayoutProps {
  children?: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false)
  const location = useLocation()
  const { user } = useAuth()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'My Trips', href: '/trips', icon: Calendar },
    { name: 'Explore Destinations', href: '/explore', icon: Compass },
    { name: 'My Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="glass-card p-4 sticky top-28 space-y-6">
            {/* User Profile Card */}
            <div
              onClick={() => setIsAvatarPickerOpen(true)}
              className="p-4 bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 rounded-2xl cursor-pointer group transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <Avatar src={user?.avatar_url} name={user?.full_name || 'Guest'} size="lg" ring />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors truncate">
                    {user?.full_name || 'Explorer Guest'}
                  </h4>
                  <p className="text-xs text-indigo-400 font-medium flex items-center gap-1 mt-0.5">
                    <Sparkles className="h-3 w-3" /> Change Avatar
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1.5">
              {navigation.map((item) => {
                const isActive =
                  location.pathname === item.href ||
                  (item.href !== '/dashboard' && location.pathname.startsWith(`${item.href}`))
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-lg shadow-indigo-500/10'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <item.icon className={`h-5 w-5 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Quick Action Button */}
            <div className="pt-4 border-t border-slate-800/80">
              <Link
                to="/trips/create"
                className="btn-primary w-full py-3 text-sm gap-2"
              >
                <Plus className="h-4 w-4" />
                <span>Create New Trip</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          {children || <Outlet />}
        </main>
      </div>

      {/* Avatar Picker Modal */}
      <AvatarPicker
        isOpen={isAvatarPickerOpen}
        onClose={() => setIsAvatarPickerOpen(false)}
      />
    </div>
  )
}
