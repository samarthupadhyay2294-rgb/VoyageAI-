import { useState } from 'react'
import { Settings, Bell, Shield, Sparkles, Check } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true)
  const [autoSave, setAutoSave] = useState(true)
  const [aiPreferences, setAiPreferences] = useState('smart')

  const handleSave = () => {
    toast.success('Settings saved successfully')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      <div>
        <h1 className="text-3xl font-black text-white">Application Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Configure your travel planner preferences.</p>
      </div>

      <div className="glass-card p-6 sm:p-8 space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Settings className="h-5 w-5 text-indigo-400" /> Preferences
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-indigo-400" />
              <div>
                <h4 className="font-semibold text-white text-sm">Trip Notifications</h4>
                <p className="text-xs text-slate-400">Receive flight updates and daily itinerary reminders</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="h-5 w-5 accent-indigo-500 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-emerald-400" />
              <div>
                <h4 className="font-semibold text-white text-sm">Local Storage Auto-Save</h4>
                <p className="text-xs text-slate-400">Save all itineraries and trip plans in offline guest mode</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={autoSave}
              onChange={(e) => setAutoSave(e.target.checked)}
              className="h-5 w-5 accent-indigo-500 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
            <div className="flex items-center space-x-3">
              <Sparkles className="h-5 w-5 text-purple-400" />
              <div>
                <h4 className="font-semibold text-white text-sm">AI Generation Model</h4>
                <p className="text-xs text-slate-400">Pacing and detail optimization level</p>
              </div>
            </div>
            <select
              value={aiPreferences}
              onChange={(e) => setAiPreferences(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:border-indigo-500"
            >
              <option value="smart">Balanced (Recommended)</option>
              <option value="compact">Packed Itinerary</option>
              <option value="relaxed">Relaxed & Slow Paced</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="btn-primary py-3 px-6 text-sm font-semibold gap-2"
        >
          <Check className="h-4 w-4" /> Save Preferences
        </button>
      </div>
    </div>
  )
}
