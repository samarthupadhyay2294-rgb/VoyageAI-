import { useAuth } from '../contexts/AuthContext'
import Avatar from '../components/common/Avatar'
import AvatarPicker from '../components/common/AvatarPicker'
import { Mail, Calendar, Sparkles, DollarSign, Award, Compass, ShieldCheck } from 'lucide-react'
import { useState } from 'react'

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false)
  const [editingCurrency, setEditingCurrency] = useState(user?.preferred_currency || 'USD')

  if (!user) {
    return <div className="text-slate-400">Loading profile...</div>
  }

  const handleSaveCurrency = (curr: string) => {
    setEditingCurrency(curr)
    updateProfile({ preferred_currency: curr })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Explorer Profile</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your persona, avatar, and travel preferences.</p>
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="glass-card p-6 sm:p-8 relative overflow-hidden space-y-8">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 border-b border-slate-800 pb-8">
          <Avatar
            src={user.avatar_url}
            name={user.full_name || 'Guest'}
            size="xl"
            ring
            onClick={() => setIsAvatarPickerOpen(true)}
          />

          <div className="text-center sm:text-left flex-1 min-w-0">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl font-bold text-white">{user.full_name || 'Explorer Guest'}</h2>
              <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-400 text-xs font-semibold rounded-full border border-indigo-500/30">
                Verified Explorer
              </span>
            </div>
            <p className="text-slate-400 text-xs mt-1">{user.email}</p>

            <button
              onClick={() => setIsAvatarPickerOpen(true)}
              className="btn-primary py-2 px-4 text-xs font-semibold gap-2 mt-4 inline-flex"
            >
              <Sparkles className="h-4 w-4" /> Change Avatar & Name
            </button>
          </div>
        </div>

        {/* Travel Stats & Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-center space-x-3">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Travel Rank</p>
              <p className="text-sm font-bold text-white">Globe Trotter Level 4</p>
            </div>
          </div>

          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-center space-x-3">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Mode</p>
              <p className="text-sm font-bold text-white">Guest Session (Offline)</p>
            </div>
          </div>

          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-center space-x-3">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Privacy Status</p>
              <p className="text-sm font-bold text-white">Local Storage Saved</p>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between p-4 bg-slate-950/60 rounded-2xl border border-slate-800 text-sm">
            <div className="flex items-center space-x-3 text-slate-300">
              <Mail className="h-5 w-5 text-indigo-400" />
              <span>Email Address</span>
            </div>
            <span className="font-semibold text-white">{user.email}</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-950/60 rounded-2xl border border-slate-800 text-sm">
            <div className="flex items-center space-x-3 text-slate-300">
              <Calendar className="h-5 w-5 text-indigo-400" />
              <span>Member Since</span>
            </div>
            <span className="font-semibold text-white">
              {new Date(user.created_at).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-950/60 rounded-2xl border border-slate-800 text-sm">
            <div className="flex items-center space-x-3 text-slate-300">
              <DollarSign className="h-5 w-5 text-emerald-400" />
              <span>Preferred Currency</span>
            </div>
            <select
              value={editingCurrency}
              onChange={(e) => handleSaveCurrency(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-1 text-sm font-medium focus:outline-none focus:border-indigo-500"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Avatar Picker Modal */}
      <AvatarPicker
        isOpen={isAvatarPickerOpen}
        onClose={() => setIsAvatarPickerOpen(false)}
      />
    </div>
  )
}
