import { useState } from 'react'
import { AVATAR_PRESETS, AvatarPreset } from '../../services/guestStore'
import { useAuth } from '../../contexts/AuthContext'
import Avatar from './Avatar'
import { Check, Sparkles, X, User as UserIcon } from 'lucide-react'

interface AvatarPickerProps {
  isOpen: boolean
  onClose: () => void
}

export default function AvatarPicker({ isOpen, onClose }: AvatarPickerProps) {
  const { user, updateAvatar } = useAuth()
  const [selectedAvatar, setSelectedAvatar] = useState<string>(
    user?.avatar_url || AVATAR_PRESETS[0].url
  )
  const [guestName, setGuestName] = useState<string>(user?.full_name || 'Explorer Guest')

  if (!isOpen) return null

  const handleSave = () => {
    updateAvatar(selectedAvatar, guestName)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl overflow-hidden">
        {/* Ambient Glow background */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
              <Sparkles className="h-6 w-6 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Choose Your Avatar</h3>
              <p className="text-xs text-slate-400">Select your travel persona & nickname</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Current Active Preview */}
        <div className="flex items-center space-x-4 p-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl mb-6">
          <Avatar src={selectedAvatar} name={guestName} size="xl" />
          <div className="flex-1 min-w-0">
            <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
              <UserIcon className="h-3.5 w-3.5 text-indigo-400" /> Explorer Name
            </label>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg px-3 py-1.5 text-sm text-white font-medium outline-none transition-all"
              placeholder="Your travel handle..."
            />
          </div>
        </div>

        {/* Avatar Grid */}
        <div className="mb-6">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Available Explorer Avatars
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-64 overflow-y-auto pr-1">
            {AVATAR_PRESETS.map((preset: AvatarPreset) => {
              const isSelected = selectedAvatar === preset.url
              return (
                <div
                  key={preset.id}
                  onClick={() => setSelectedAvatar(preset.url)}
                  className={`relative cursor-pointer p-3 rounded-2xl border transition-all duration-200 flex flex-col items-center justify-center group ${
                    isSelected
                      ? 'bg-slate-800/90 border-indigo-500 ring-2 ring-indigo-500/50 shadow-lg shadow-indigo-500/20'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 p-1 bg-indigo-500 text-white rounded-full">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                  <Avatar src={preset.url} name={preset.name} size="lg" ring={isSelected} />
                  <span className="mt-2 text-xs font-semibold text-slate-200 text-center truncate max-w-full">
                    {preset.name}
                  </span>
                  <span className="text-[10px] text-indigo-400 font-medium px-2 py-0.5 bg-indigo-500/10 rounded-full mt-1">
                    {preset.tag}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all duration-200"
          >
            Save Avatar & Profile
          </button>
        </div>
      </div>
    </div>
  )
}
