import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCreateTrip } from '../hooks/useTrips'
import { Sparkles, MapPin, DollarSign, Compass, Check, ArrowRight, Heart, Camera, Landmark, Utensils, Mountain, ShoppingBag, Palmtree } from 'lucide-react'

interface CurrencyConfig {
  symbol: string
  code: string
  label: string
  min: number
  max: number
  step: number
  defaultBudget: number
}

const CURRENCY_MAP: Record<string, CurrencyConfig> = {
  USD: { symbol: '$', code: 'USD', label: 'USD ($)', min: 500, max: 20000, step: 250, defaultBudget: 3500 },
  EUR: { symbol: '€', code: 'EUR', label: 'EUR (€)', min: 450, max: 18000, step: 250, defaultBudget: 3200 },
  GBP: { symbol: '£', code: 'GBP', label: 'GBP (£)', min: 400, max: 16000, step: 200, defaultBudget: 2800 },
  INR: { symbol: '₹', code: 'INR', label: 'INR (₹)', min: 25000, max: 1500000, step: 5000, defaultBudget: 150000 },
  JPY: { symbol: '¥', code: 'JPY', label: 'JPY (¥)', min: 60000, max: 3000000, step: 10000, defaultBudget: 450000 },
  CAD: { symbol: 'CA$', code: 'CAD', label: 'CAD (CA$)', min: 650, max: 25000, step: 250, defaultBudget: 4500 },
  AUD: { symbol: 'A$', code: 'AUD', label: 'AUD (A$)', min: 700, max: 26000, step: 250, defaultBudget: 4800 },
  AED: { symbol: 'AED', code: 'AED', label: 'AED (AED)', min: 1800, max: 75000, step: 500, defaultBudget: 12500 },
}

export default function CreateTripPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const destQuery = queryParams.get('dest') || ''

  const createTrip = useCreateTrip()

  const [formData, setFormData] = useState({
    origin: '',
    destination: destQuery || '',
    start_date: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
    end_date: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
    travelers: 1,
    budget: 3500,
    currency: 'USD',
    interests: ['museums', 'foodie', 'historical_places'],
    travel_style: 'cultural',
  })

  const currentCurrencyConfig = CURRENCY_MAP[formData.currency] || CURRENCY_MAP.USD

  useEffect(() => {
    if (destQuery) {
      setFormData((prev) => ({ ...prev, destination: destQuery }))
    }
  }, [destQuery])

  const handleCurrencyChange = (newCurrency: string) => {
    const config = CURRENCY_MAP[newCurrency] || CURRENCY_MAP.USD
    setFormData((prev) => ({
      ...prev,
      currency: newCurrency,
      budget: config.defaultBudget,
    }))
  }

  const interestOptions = [
    { id: 'museums', label: 'Museums & Art', icon: Landmark },
    { id: 'foodie', label: 'Food & Dining', icon: Utensils },
    { id: 'historical_places', label: 'Historic Sites', icon: Camera },
    { id: 'parks', label: 'Nature & Parks', icon: Palmtree },
    { id: 'adventure_activities', label: 'Adventure', icon: Mountain },
    { id: 'shopping', label: 'Shopping', icon: ShoppingBag },
  ]

  const travelStyles = [
    { id: 'general', title: 'Balanced', desc: 'A mix of sightseeing, leisure, and local food' },
    { id: 'cultural', title: 'Cultural Heritage', desc: 'Museums, monuments, and historical walking tours' },
    { id: 'adventure', title: 'Thrill & Outdoor', desc: 'Hiking, outdoor exploration, and activities' },
    { id: 'relaxation', title: 'Chill & Wellness', desc: 'Resorts, spas, beaches, and slow pacing' },
    { id: 'foodie', title: 'Culinary Focus', desc: 'Street markets, wine tasting, and top dining' },
  ]

  const toggleInterest = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(id)
        ? prev.interests.filter((i) => i !== id)
        : [...prev.interests, id],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    createTrip.mutate(formData, {
      onSuccess: (data) => {
        if (data.data?.id) {
          navigate(`/trips/${data.data.id}`)
        }
      },
    })
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-8 pb-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="h-4 w-4" /> AI Itinerary Generator
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Design Your Next Voyage</h1>
        <p className="text-slate-400 text-sm mt-2">
          Fill in your trip details and our AI will build your day-by-day travel plan instantly.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Destination & Origin */}
        <div className="glass-card p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <MapPin className="h-5 w-5 text-indigo-400" /> 1. Where & When
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Starting From (Origin)
              </label>
              <input
                type="text"
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                required
                className="input-field"
                placeholder="Enter starting city or airport..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Destination City / Country
              </label>
              <input
                type="text"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                required
                className="input-field"
                placeholder="Enter destination city or country..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Departure Date
              </label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Return Date
              </label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Number of Travelers
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={formData.travelers || ''}
                onChange={(e) => setFormData({ ...formData, travelers: parseInt(e.target.value) || 0 })}
                required
                className="input-field"
                placeholder="Enter number of travelers..."
              />
            </div>
          </div>
        </div>

        {/* Step 2: Budget & Currency */}
        <div className="glass-card p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <DollarSign className="h-5 w-5 text-emerald-400" /> 2. Budget & Currency
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
            <div className="sm:col-span-2 space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Target Total Budget
                </label>
                <span className="text-xl font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
                  {currentCurrencyConfig.symbol}
                  {formData.budget.toLocaleString()} {currentCurrencyConfig.code}
                </span>
              </div>
              <input
                type="range"
                min={currentCurrencyConfig.min}
                max={currentCurrencyConfig.max}
                step={currentCurrencyConfig.step}
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) })}
                className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Min: {currentCurrencyConfig.symbol}{currentCurrencyConfig.min.toLocaleString()}</span>
                <span>Max: {currentCurrencyConfig.symbol}{currentCurrencyConfig.max.toLocaleString()}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Preferred Currency
              </label>
              <select
                value={formData.currency}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                className="input-field bg-slate-900 border-indigo-500/40 text-white font-bold"
              >
                {Object.values(CURRENCY_MAP).map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Step 3: Interests */}
        <div className="glass-card p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Heart className="h-5 w-5 text-rose-400" /> 3. Select What You Love
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {interestOptions.map((item) => {
              const isSelected = formData.interests.includes(item.id)
              const Icon = item.icon
              return (
                <div
                  key={item.id}
                  onClick={() => toggleInterest(item.id)}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all duration-200 flex items-center space-x-3 ${
                    isSelected
                      ? 'bg-indigo-500/20 border-indigo-500 text-white ring-1 ring-indigo-500/50'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <div className={`p-2 rounded-xl ${isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-900 text-slate-400'}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-semibold">{item.label}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Step 4: Travel Style */}
        <div className="glass-card p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Compass className="h-5 w-5 text-purple-400" /> 4. Choose Travel Style
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {travelStyles.map((style) => {
              const isSelected = formData.travel_style === style.id
              return (
                <div
                  key={style.id}
                  onClick={() => setFormData({ ...formData, travel_style: style.id })}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all duration-200 relative ${
                    isSelected
                      ? 'bg-indigo-500/20 border-indigo-500 text-white ring-1 ring-indigo-500/50'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 p-1 bg-indigo-500 text-white rounded-full">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                  <h4 className="font-bold text-white text-sm">{style.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">{style.desc}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={createTrip.isPending}
          className="btn-primary w-full py-4 text-base font-bold gap-3 shadow-xl glow-effect"
        >
          {createTrip.isPending ? (
            <span className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 animate-spin" /> Generating AI Itinerary...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" /> Generate AI Trip Itinerary <ArrowRight className="h-5 w-5" />
            </span>
          )}
        </button>
      </form>
    </div>
  )
}
