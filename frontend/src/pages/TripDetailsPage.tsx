import { useParams, Link } from 'react-router-dom'
import { useTrip, useDeleteTrip, useDuplicateTrip, useShareTrip } from '../hooks/useTrips'
import { plannerApi } from '../api/planner'
import { useQuery } from '@tanstack/react-query'
import Spinner from '../components/common/Spinner'
import { MapPin, Calendar, Users, DollarSign, ArrowLeft, Sun, CheckSquare, Sparkles, Share2, Copy, Trash2, Clock, Navigation, CheckCircle2, Check, Plane, Building } from 'lucide-react'
import { useState } from 'react'

export default function TripDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { data: tripData, isLoading: isTripLoading } = useTrip(id!)
  const deleteTrip = useDeleteTrip()
  const duplicateTrip = useDuplicateTrip()
  const shareTrip = useShareTrip()

  const [activeTab, setActiveTab] = useState<'itinerary' | 'stays_flights' | 'budget' | 'packing'>('itinerary')
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})

  // Fetch AI Plan
  const { data: planData, isLoading: isPlanLoading } = useQuery({
    queryKey: ['trip-plan', id],
    queryFn: () => plannerApi.generateTripPlan(id!),
    enabled: !!id,
  })

  if (isTripLoading || isPlanLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 space-y-4">
        <Spinner />
        <p className="text-slate-400 text-sm font-medium animate-pulse flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-400" /> Generating your AI itinerary...
        </p>
      </div>
    )
  }

  const trip = tripData?.data
  const plan = planData?.data

  if (!trip) {
    return (
      <div className="text-center py-16 glass-card">
        <h2 className="text-xl font-bold text-white mb-2">Trip Not Found</h2>
        <Link to="/trips" className="btn-primary py-2 px-4 text-sm mt-4">
          Back to My Trips
        </Link>
      </div>
    )
  }

  const togglePackingItem = (item: string) => {
    setCheckedItems((prev) => ({ ...prev, [item]: !prev[item] }))
  }

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Back button */}
      <Link to="/trips" className="inline-flex items-center text-slate-400 hover:text-white text-sm font-medium transition-colors">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to My Trips
      </Link>

      {/* Hero Header Card */}
      <div className="glass-card p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-600/20 to-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-semibold uppercase tracking-wider">
                {trip.travel_style || 'General'}
              </span>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-semibold">
                {trip.status}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white">{trip.destination}</h1>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300 mt-3 font-medium">
              <span className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
                <MapPin className="h-4 w-4 text-indigo-400" /> From {trip.origin}
              </span>
              <span className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
                <Calendar className="h-4 w-4 text-indigo-400" />
                {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
                <Users className="h-4 w-4 text-indigo-400" /> {trip.travelers} Traveler(s)
              </span>
              <span className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800 text-indigo-300 font-bold">
                <DollarSign className="h-4 w-4 text-emerald-400" /> ${trip.budget?.toLocaleString()} {trip.currency}
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => shareTrip.mutate({ id: trip.id, email: 'friend@travel.com' })}
              className="btn-secondary py-2.5 px-4 text-xs font-semibold gap-2"
            >
              <Share2 className="h-4 w-4" /> Share
            </button>
            <button
              onClick={() => duplicateTrip.mutate(trip.id)}
              className="btn-secondary py-2.5 px-4 text-xs font-semibold gap-2"
            >
              <Copy className="h-4 w-4" /> Duplicate
            </button>
            <button
              onClick={() => deleteTrip.mutate(trip.id)}
              className="p-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl transition-colors"
              title="Delete Trip"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* AI Summary note */}
        {plan?.ai_summary && (
          <div className="mt-6 p-4 bg-slate-950/70 border border-indigo-500/20 rounded-2xl flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300 leading-relaxed">{plan.ai_summary}</p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: 'itinerary', label: 'Day-by-Day Itinerary' },
          { id: 'stays_flights', label: 'Flights & Hotels' },
          { id: 'budget', label: 'Budget Breakdown' },
          { id: 'packing', label: 'Weather & Packing' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: ITINERARY */}
      {activeTab === 'itinerary' && (
        <div className="space-y-6">
          {plan?.itinerary?.days?.map((day) => (
            <div key={day.day} className="glass-card p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 bg-indigo-600 text-white rounded-xl text-xs font-black">
                    DAY {day.day}
                  </span>
                  <h3 className="text-lg font-bold text-white">{day.title}</h3>
                </div>
                <span className="text-xs text-slate-400 font-medium">{day.date}</span>
              </div>

              <p className="text-xs text-slate-300">{day.description}</p>

              {/* Activities */}
              <div className="space-y-3 pt-2">
                {day.activities?.map((act, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400 mt-0.5">
                        <Clock className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-indigo-400">{act.time}</span>
                          <span className="text-xs px-2 py-0.5 bg-slate-800 text-slate-300 rounded-md font-medium">
                            {act.category}
                          </span>
                        </div>
                        <h4 className="font-bold text-white text-sm mt-1">{act.activity}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{act.description}</p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                          <Navigation className="h-3 w-3 text-slate-400" /> {act.location} ({act.duration})
                        </p>
                      </div>
                    </div>

                    {act.cost > 0 && (
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20 self-start sm:self-center">
                        ${act.cost}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Meals */}
              {day.meals && day.meals.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Recommended Culinary Stop
                  </h4>
                  {day.meals.map((meal, mIdx) => (
                    <div key={mIdx} className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/50 text-xs text-slate-300 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-white">{meal.type}: {meal.restaurant}</span> ({meal.cuisine})
                        <p className="text-slate-400 text-[11px] mt-0.5">{meal.recommendation}</p>
                      </div>
                      <span className="font-bold text-indigo-300">${meal.estimated_cost}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: FLIGHTS & HOTELS */}
      {activeTab === 'stays_flights' && (
        <div className="space-y-8">
          {/* Flights */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Plane className="h-5 w-5 text-indigo-400" /> Recommended Flight Options
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {plan?.flights?.options?.map((flight, idx) => (
                <div key={idx} className="p-5 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-sm">{flight.airline}</span>
                    <span className="text-lg font-black text-indigo-400">${flight.price}</span>
                  </div>
                  <div className="text-xs text-slate-400 space-y-1">
                    <p>Duration: {flight.duration}</p>
                    <p>Departure: {flight.departure_time} ➔ Arrival: {flight.arrival_time}</p>
                  </div>
                  <a
                    href={flight.booking_url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary w-full py-2 text-xs font-semibold text-center block"
                  >
                    Check Availability
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Hotels */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Building className="h-5 w-5 text-purple-400" /> Top Accommodation Picks
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {plan?.hotels?.options?.map((hotel, idx) => (
                <div key={idx} className="p-5 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-white text-sm">{hotel.name}</h4>
                      <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                        ★ {hotel.rating}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{hotel.location}</p>
                    <p className="text-xs text-indigo-400 font-bold mt-2">${hotel.price} / night</p>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {hotel.amenities?.map((am, aIdx) => (
                        <span key={aIdx} className="text-[10px] px-2 py-0.5 bg-slate-900 text-slate-300 rounded-md border border-slate-800">
                          {am}
                        </span>
                      ))}
                    </div>
                  </div>

                  <a
                    href={hotel.booking_url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary w-full py-2 text-xs font-semibold text-center block mt-4"
                  >
                    View Hotel Details
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BUDGET BREAKDOWN */}
      {activeTab === 'budget' && (
        <div className="glass-card p-6 sm:p-8 space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <DollarSign className="h-5 w-5 text-emerald-400" /> Financial Allocation (${plan?.budget_breakdown?.total_budget} {plan?.budget_breakdown?.currency})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Object.entries(plan?.budget_breakdown?.breakdown || {}).map(([key, val]) => {
              const total = plan?.budget_breakdown?.total_budget || 1000
              const pct = Math.round(((val as number) / total) * 100)
              return (
                <div key={key} className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="capitalize text-slate-300">{key.replace('_', ' ')}</span>
                    <span className="text-white font-bold">${val} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Budget Tips */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Smart Budget Tips</h4>
            {plan?.budget_breakdown?.tips?.map((tip, idx) => (
              <p key={idx} className="text-xs text-slate-300 flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" /> {tip}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: WEATHER & PACKING LIST */}
      {activeTab === 'packing' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Weather Widget */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sun className="h-5 w-5 text-amber-400" /> Destination Climate
            </h3>
            <div className="p-4 bg-gradient-to-br from-indigo-950 to-slate-950 rounded-2xl border border-indigo-500/20 text-center">
              <span className="text-4xl font-black text-white">{plan?.weather?.current?.temp}°C</span>
              <p className="text-xs text-indigo-300 font-semibold mt-1">{plan?.weather?.current?.weather_main}</p>
              <p className="text-xs text-slate-400 mt-2">{plan?.weather?.current?.weather_description}</p>
            </div>
            <div className="text-xs text-slate-300 space-y-1">
              <p><span className="font-semibold text-slate-400">Best Season:</span> {plan?.weather?.best_time_to_visit}</p>
            </div>
          </div>

          {/* Interactive Packing Checklist */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <CheckSquare className="h-5 w-5 text-indigo-400" /> Interactive Packing Checklist
            </h3>

            <div className="space-y-2">
              {plan?.itinerary?.packing_suggestions?.map((item) => {
                const isChecked = !!checkedItems[item]
                return (
                  <div
                    key={item}
                    onClick={() => togglePackingItem(item)}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between text-xs transition-all ${
                      isChecked
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-400 line-through'
                        : 'bg-slate-950/60 border-slate-800 text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <span>{item}</span>
                    <div className={`p-1 rounded-md ${isChecked ? 'bg-emerald-500 text-white' : 'bg-slate-900 border border-slate-700'}`}>
                      <Check className="h-3 w-3" />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
