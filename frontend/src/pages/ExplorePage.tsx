import { Link } from 'react-router-dom'
import { ArrowRight, Compass, Star } from 'lucide-react'

export default function ExplorePage() {
  const destinations = [
    {
      name: 'Tokyo, Japan',
      category: 'Culture & Modernity',
      rating: 4.9,
      img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
      description: 'Futuristic skyscrapers, ancient temples, sushi dining, and cherry blossom gardens.',
      estBudget: '$3,800',
    },
    {
      name: 'Paris, France',
      category: 'Romance & Heritage',
      rating: 4.8,
      img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
      description: 'Iconic Louvre art museum, Eiffel Tower vistas, cafes, and haute couture.',
      estBudget: '$3,400',
    },
    {
      name: 'Bali, Indonesia',
      category: 'Tropical Paradise',
      rating: 4.9,
      img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
      description: 'Lush emerald rice terraces, cliffside temples, surfing, and luxury beach villas.',
      estBudget: '$2,400',
    },
    {
      name: 'Santorini, Greece',
      category: 'Island & Views',
      rating: 4.9,
      img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
      description: 'Whitewashed Aegean villages, cobalt blue domes, volcanic beaches, and wine tasting.',
      estBudget: '$2,900',
    },
    {
      name: 'New York City, USA',
      category: 'Urban Adventure',
      rating: 4.7,
      img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
      description: 'Times Square lights, Broadway theater, Central Park strolls, and rooftop lounges.',
      estBudget: '$3,600',
    },
    {
      name: 'Reykjavik, Iceland',
      category: 'Glaciers & Northern Lights',
      rating: 4.9,
      img: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=800&q=80',
      description: 'Geothermal Blue Lagoon springs, cascading waterfalls, glaciers, and auroras.',
      estBudget: '$4,200',
    },
  ]

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Compass className="h-4 w-4" /> Destination Discovery
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Explore Top World Destinations</h1>
        <p className="text-slate-400 text-sm mt-2">
          Discover handpicked destinations and launch an instant AI itinerary plan in 1-click.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map((dest) => (
          <div key={dest.name} className="glass-card-hover group flex flex-col justify-between overflow-hidden">
            <div className="relative h-48 overflow-hidden">
              <img
                src={dest.img}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute top-3 right-3 px-2.5 py-1 bg-slate-950/80 backdrop-blur-md rounded-full text-xs font-bold text-amber-400 border border-slate-700 flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-400" /> {dest.rating}
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between bg-slate-900/70">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                  {dest.category}
                </span>
                <h3 className="font-extrabold text-xl text-white mt-1 group-hover:text-indigo-400 transition-colors">
                  {dest.name}
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{dest.description}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Est. Budget</span>
                  <span className="text-sm font-bold text-indigo-300">{dest.estBudget}</span>
                </div>

                <Link
                  to={`/trips/create?dest=${encodeURIComponent(dest.name)}`}
                  className="btn-primary py-2 px-4 text-xs font-semibold gap-1.5"
                >
                  <span>Plan Trip</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
