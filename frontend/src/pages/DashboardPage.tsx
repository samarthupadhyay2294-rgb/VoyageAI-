import { Link } from 'react-router-dom'
import { Calendar, MapPin, DollarSign, Plus, ArrowRight, Compass, Trash2, Copy, Plane } from 'lucide-react'
import { useTrips, useDeleteTrip, useDuplicateTrip } from '../hooks/useTrips'
import { useAuth } from '../contexts/AuthContext'
import Spinner from '../components/common/Spinner'
import Avatar from '../components/common/Avatar'

export default function DashboardPage() {
  const { data: tripsData, isLoading } = useTrips(1, 10)
  const { user, isGuest } = useAuth()
  const deleteTrip = useDeleteTrip()
  const duplicateTrip = useDuplicateTrip()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner />
      </div>
    )
  }

  const trips = tripsData?.data?.trips || []
  const totalBudget = trips.reduce((sum, t) => sum + (t.budget || 0), 0)
  const uniqueDestinations = new Set(trips.map((t) => t.destination)).size

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner with Avatar */}
      <div className="glass-card p-6 sm:p-8 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 border-indigo-500/20">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center space-x-5">
          <Avatar src={user?.avatar_url} name={user?.full_name || 'Guest'} size="xl" ring />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Welcome back, {user?.full_name || 'Explorer'}!
              </h1>
              <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-400 text-xs font-semibold rounded-full border border-indigo-500/30">
                {isGuest ? 'Guest Mode Active' : 'Member Mode'}
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              Ready to plan your next getaway? You have {trips.length} active trip(s) in your planner.
            </p>
          </div>
        </div>

        <Link
          to="/trips/create"
          className="btn-primary py-3 px-5 text-sm font-semibold gap-2 whitespace-nowrap self-start md:self-center"
        >
          <Plus className="h-4 w-4" />
          <span>Plan New Trip</span>
        </Link>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-5 flex items-center space-x-4">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Trips</p>
            <p className="text-2xl font-black text-white">{trips.length}</p>
          </div>
        </div>

        <div className="glass-card p-5 flex items-center space-x-4">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400">
            <MapPin className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Destinations</p>
            <p className="text-2xl font-black text-white">{uniqueDestinations}</p>
          </div>
        </div>

        <div className="glass-card p-5 flex items-center space-x-4">
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Combined Budget</p>
            <p className="text-2xl font-black text-white">${totalBudget.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Recent Trips Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Compass className="h-5 w-5 text-indigo-400" /> Recent Trips & Plans
          </h2>
          <Link to="/trips" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
            View All Trips <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {trips.length === 0 ? (
          <div className="glass-card p-12 text-center max-w-md mx-auto">
            <Plane className="h-12 w-12 text-indigo-400 mx-auto mb-4 animate-bounce" />
            <h3 className="text-lg font-bold text-white mb-2">No trips created yet</h3>
            <p className="text-slate-400 text-sm mb-6">
              Create your very first AI-guided itinerary in seconds!
            </p>
            <Link to="/trips/create" className="btn-primary py-2.5 px-5 text-sm">
              Create Your First Trip
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <div key={trip.id} className="glass-card-hover group flex flex-col justify-between overflow-hidden">
                <Link to={`/trips/${trip.id}`} className="block">
                  <div className="h-36 bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 p-5 relative flex flex-col justify-between overflow-hidden">
                    <div className="absolute inset-0 bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors" />

                    <div className="flex items-center justify-between relative z-10">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-950/80 backdrop-blur-md text-indigo-400 border border-slate-700">
                        {trip.travel_style || 'General'}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          trip.status === 'completed'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        }`}
                      >
                        {trip.status}
                      </span>
                    </div>

                    <div className="relative z-10">
                      <h3 className="font-extrabold text-xl text-white group-hover:text-indigo-400 transition-colors truncate">
                        {trip.destination}
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-indigo-400" /> From {trip.origin}
                      </p>
                    </div>
                  </div>
                </Link>

                <div className="p-5 flex-1 flex flex-col justify-between bg-slate-900/60">
                  <div className="space-y-2 mb-4 text-xs text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-indigo-400" /> Dates
                      </span>
                      <span className="font-medium">
                        {new Date(trip.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} -{' '}
                        {new Date(trip.end_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1">
                        <DollarSign className="h-3.5 w-3.5 text-emerald-400" /> Budget
                      </span>
                      <span className="font-bold text-white">
                        ${trip.budget?.toLocaleString()} {trip.currency}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                    <Link
                      to={`/trips/${trip.id}`}
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      View Itinerary <ArrowRight className="h-3.5 w-3.5" />
                    </Link>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => duplicateTrip.mutate(trip.id)}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        title="Duplicate Trip"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => deleteTrip.mutate(trip.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Delete Trip"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
