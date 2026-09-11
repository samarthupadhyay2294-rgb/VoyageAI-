import { Link } from 'react-router-dom'
import { Calendar, MapPin, DollarSign, Plus, Copy, Trash2, ArrowRight, Plane } from 'lucide-react'
import { useTrips, useDeleteTrip, useDuplicateTrip } from '../hooks/useTrips'
import Spinner from '../components/common/Spinner'

export default function TripsPage() {
  const { data: tripsData, isLoading } = useTrips(1, 20)
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

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">All Planned Trips</h1>
          <p className="text-slate-400 text-sm mt-1">Manage, edit, or duplicate your saved itineraries.</p>
        </div>
        <Link to="/trips/create" className="btn-primary py-2.5 px-5 text-sm gap-2 self-start sm:self-auto">
          <Plus className="h-4 w-4" /> Plan New Trip
        </Link>
      </div>

      {trips.length === 0 ? (
        <div className="glass-card p-12 text-center max-w-md mx-auto">
          <Plane className="h-12 w-12 text-indigo-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No trips found</h3>
          <p className="text-slate-400 text-sm mb-6">Start planning your dream adventure today!</p>
          <Link to="/trips/create" className="btn-primary py-2.5 px-5 text-sm">
            Create Trip
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <div key={trip.id} className="glass-card-hover group flex flex-col justify-between overflow-hidden">
              <Link to={`/trips/${trip.id}`} className="block">
                <div className="h-36 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-5 relative flex flex-col justify-between overflow-hidden">
                  <div className="flex items-center justify-between relative z-10">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-950/80 text-indigo-400 border border-slate-700">
                      {trip.travel_style || 'General'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
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

              <div className="p-5 flex-1 flex flex-col justify-between bg-slate-900/60 space-y-4">
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-indigo-400" /> Dates
                    </span>
                    <span className="font-medium">
                      {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
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
                    View Details <ArrowRight className="h-3.5 w-3.5" />
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
  )
}
