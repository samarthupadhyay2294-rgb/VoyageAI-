import { Link } from 'react-router-dom'
import { MapPin, DollarSign, Sparkles, ArrowRight, Compass, CheckCircle2, Zap } from 'lucide-react'
import Avatar from '../components/common/Avatar'
import { AVATAR_PRESETS } from '../services/guestStore'
import { useState } from 'react'

export default function LandingPage() {
  const [quickDestination, setQuickDestination] = useState('')

  const popularDestinations = [
    {
      name: 'Paris, France',
      tag: 'Romantic & Cultural',
      img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
      days: '7 Days',
      avgCost: '$3,200',
    },
    {
      name: 'Tokyo, Japan',
      tag: 'Modern & Historic',
      img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80',
      days: '10 Days',
      avgCost: '$4,100',
    },
    {
      name: 'Bali, Indonesia',
      tag: 'Tropical Wellness',
      img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
      days: '9 Days',
      avgCost: '$2,500',
    },
    {
      name: 'Santorini, Greece',
      tag: 'Island Panorama',
      img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&q=80',
      days: '6 Days',
      avgCost: '$2,900',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 lg:pt-24 lg:pb-32">
        {/* Glow blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/30 via-indigo-600/20 to-purple-600/30 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-8 animate-fade-in">
              <Zap className="h-4 w-4" /> Instant Access — No Signup Required
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white mb-8 leading-[1.1]">
              Craft Your Perfect Journey with <span className="text-gradient">Artificial Intelligence</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              VoyageAI designs custom day-by-day itineraries, flight estimates, top-rated hotels, and budget breakdowns tailored to your travel style.
            </p>

            {/* Quick Generator Input */}
            <div className="glass-card p-3 sm:p-4 max-w-xl mx-auto mb-10 flex flex-col sm:flex-row gap-3 glow-effect">
              <div className="flex-1 flex items-center gap-3 px-4 py-2 bg-slate-950/80 rounded-xl border border-slate-800">
                <MapPin className="h-5 w-5 text-indigo-400" />
                <input
                  type="text"
                  placeholder="Where do you want to travel? (e.g. Kyoto)"
                  value={quickDestination}
                  onChange={(e) => setQuickDestination(e.target.value)}
                  className="bg-transparent text-white placeholder-slate-500 focus:outline-none w-full text-sm font-medium"
                />
              </div>
              <Link
                to={quickDestination ? `/trips/create?dest=${encodeURIComponent(quickDestination)}` : '/trips/create'}
                className="btn-primary py-3 px-6 text-sm font-semibold gap-2 whitespace-nowrap"
              >
                <span>Generate Trip</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Sub CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-400 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> 100% Free Guest Mode
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Custom Traveler Avatars
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Instant Itinerary Export
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Avatar Persona Showcase */}
      <section className="py-16 bg-slate-900/50 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Express Yourself with Traveler Avatars</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Choose your travel persona and customize your profile freely without creating an account.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {AVATAR_PRESETS.slice(0, 4).map((preset) => (
              <div
                key={preset.id}
                className="glass-card-hover p-4 text-center flex flex-col items-center justify-center group"
              >
                <Avatar src={preset.url} name={preset.name} size="xl" ring />
                <h4 className="font-semibold text-white mt-3 text-sm">{preset.name}</h4>
                <span className="text-[11px] text-indigo-400 font-medium px-2.5 py-0.5 bg-indigo-500/10 rounded-full mt-1.5">
                  {preset.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-indigo-400 text-xs font-semibold uppercase tracking-wider">Top Trending</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mt-1">Explore Popular Destinations</h2>
            </div>
            <Link to="/explore" className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold flex items-center gap-1.5 mt-4 md:mt-0">
              View All Destinations <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDestinations.map((dest) => (
              <Link
                key={dest.name}
                to={`/trips/create?dest=${encodeURIComponent(dest.name)}`}
                className="glass-card-hover group overflow-hidden flex flex-col"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={dest.img}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  <span className="absolute top-3 right-3 px-2.5 py-1 bg-slate-950/80 backdrop-blur-md rounded-full text-xs font-medium text-white border border-slate-700">
                    {dest.days}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-white group-hover:text-indigo-400 transition-colors">
                      {dest.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">{dest.tag}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/80">
                    <span className="text-xs text-slate-400">Est. Budget</span>
                    <span className="text-sm font-bold text-indigo-300">{dest.avgCost}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-20 bg-slate-900/40 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Everything You Need For Unforgettable Travel</h2>
            <p className="text-slate-400 text-sm">
              Powered by smart algorithms to ensure every detail of your trip is organized, optimized, and effortless.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-6">
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl w-14 h-14 flex items-center justify-center mb-6 text-indigo-400">
                <Sparkles className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">AI Itinerary Planner</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Generates complete day-by-day morning, afternoon, and evening activities custom tailored to your interests.
              </p>
            </div>

            <div className="glass-card p-6">
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl w-14 h-14 flex items-center justify-center mb-6 text-blue-400">
                <DollarSign className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Budget Allocation</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Smart financial breakdowns across flights, stay, food, and activities to keep your trip within budget.
              </p>
            </div>

            <div className="glass-card p-6">
              <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl w-14 h-14 flex items-center justify-center mb-6 text-purple-400">
                <Compass className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Smart Curations</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Discover top hidden cafes, scenic viewpoints, historic sites, and local delicacies recommended by AI.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-20 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-card p-10 sm:p-16 relative overflow-hidden glow-effect">
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-6">
              Ready to Start Your Next Adventure?
            </h2>
            <p className="text-slate-300 text-base sm:text-lg mb-8 max-w-xl mx-auto">
              Plan your travel itinerary in seconds. No credit card, sign up, or login needed!
            </p>
            <Link
              to="/trips/create"
              className="btn-primary py-4 px-8 text-base font-bold gap-3 inline-flex"
            >
              <Sparkles className="h-5 w-5" />
              <span>Start Planning Free</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
