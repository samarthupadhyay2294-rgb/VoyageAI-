import { Trip, TripPlan, User } from '../api/types'

export interface AvatarPreset {
  id: string
  name: string
  url: string
  tag: string
  color: string
}

export const AVATAR_PRESETS: AvatarPreset[] = [
  {
    id: 'avatar-1',
    name: 'Aria Jetsetter',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aria&backgroundColor=ffdfbf',
    tag: 'Luxury & Culture',
    color: 'from-amber-400 to-rose-500',
  },
  {
    id: 'avatar-2',
    name: 'Felix Nomad',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4',
    tag: 'Digital Nomad',
    color: 'from-blue-400 to-indigo-600',
  },
  {
    id: 'avatar-3',
    name: 'Captain Leo',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo&backgroundColor=c0aede',
    tag: 'Coast & Sailing',
    color: 'from-purple-400 to-pink-600',
  },
  {
    id: 'avatar-4',
    name: 'Zoe Explorer',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe&backgroundColor=d1d4f9',
    tag: 'Mountain Trekker',
    color: 'from-emerald-400 to-teal-600',
  },
  {
    id: 'avatar-5',
    name: 'Ethan Backpacker',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan&backgroundColor=ffd5dc',
    tag: 'Budget Backpacker',
    color: 'from-orange-400 to-amber-600',
  },
  {
    id: 'avatar-6',
    name: 'Maya Wanderer',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya&backgroundColor=c0aede',
    tag: 'Culinary Connoisseur',
    color: 'from-pink-400 to-rose-600',
  },
  {
    id: 'avatar-7',
    name: 'Lucas Adventurer',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas&backgroundColor=b6e3f4',
    tag: 'Thrill Seeker',
    color: 'from-cyan-400 to-blue-600',
  },
  {
    id: 'avatar-8',
    name: 'Sophia Pioneer',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia&backgroundColor=ffdfbf',
    tag: 'Historical Places',
    color: 'from-violet-400 to-purple-600',
  },
]

const DEFAULT_GUEST_USER: User = {
  id: 'guest-user-001',
  email: 'guest@voyageai.explore',
  full_name: 'Explorer Guest',
  avatar_url: AVATAR_PRESETS[0].url,
  preferred_currency: 'USD',
  created_at: new Date().toISOString(),
}

const INITIAL_TRIPS: Trip[] = [
  {
    id: 'trip-paris-01',
    user_id: 'guest-user-001',
    origin: 'New York (JFK)',
    destination: 'Paris, France',
    start_date: '2026-09-10',
    end_date: '2026-09-17',
    travelers: 2,
    budget: 3400,
    currency: 'USD',
    interests: ['museums', 'historical_places', 'foodie', 'shopping'],
    travel_style: 'cultural',
    status: 'planned',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'trip-tokyo-02',
    user_id: 'guest-user-001',
    origin: 'San Francisco (SFO)',
    destination: 'Tokyo, Japan',
    start_date: '2026-10-05',
    end_date: '2026-10-15',
    travelers: 1,
    budget: 4200,
    currency: 'USD',
    interests: ['temples', 'adventure_activities', 'shopping', 'foodie'],
    travel_style: 'adventure',
    status: 'planned',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'trip-bali-03',
    user_id: 'guest-user-001',
    origin: 'London (LHR)',
    destination: 'Bali, Indonesia',
    start_date: '2026-11-01',
    end_date: '2026-11-10',
    travelers: 2,
    budget: 2800,
    currency: 'USD',
    interests: ['parks', 'relaxation', 'foodie'],
    travel_style: 'relaxation',
    status: 'completed',
    created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 12).toISOString(),
  },
]

interface LocationProfile {
  hero: string
  weather: { temp: number; desc: string; main: string; bestSeason: string }
  hotels: { name: string; location: string; pricePct: number; rating: number }[]
  airline: string
  days: {
    title: string
    desc: string
    activities: { time: string; activity: string; location: string; description: string; duration: string; cost: number; category: string }[]
    meal: { type: string; rest: string; loc: string; cuisine: string; cost: number; rec: string }
  }[]
  packing: string[]
}

const LOCATION_DATABASE: Record<string, LocationProfile> = {
  paris: {
    hero: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    weather: { temp: 21, desc: 'Pleasant spring breeze with sunshine', main: 'Clear Skies', bestSeason: 'April to October' },
    hotels: [
      { name: 'Hotel Pont Royal Saint-Germain', location: '7th Arrondissement, Paris', pricePct: 0.08, rating: 4.8 },
      { name: 'Le Relais Christine Boutique', location: 'Latin Quarter, Paris', pricePct: 0.06, rating: 4.9 },
    ],
    airline: 'Air France / Lufthansa',
    days: [
      {
        title: 'Arrival & Eiffel Tower Sunset Walk',
        desc: 'Settle into your hotel and witness the glittering Eiffel Tower from Champ de Mars.',
        activities: [
          { time: '02:30 PM', activity: 'Check-in & Fresh Croissants', location: 'Saint-Germain-des-Prés', description: 'Relax at a quintessential sidewalk cafe.', duration: '1.5 hours', cost: 15, category: 'Relaxation' },
          { time: '05:30 PM', activity: 'Eiffel Tower & Trocadéro Viewpoint', location: 'Champ de Mars', description: 'Walk around Trocadéro gardens as the Eiffel Tower lights up.', duration: '2 hours', cost: 28, category: 'Sightseeing' },
        ],
        meal: { type: 'Dinner', rest: 'Bistro Paul Bert', loc: '11th Arrondissement', cuisine: 'Classic French Steak Frites', cost: 65, rec: 'Famous seasonal steak frites with Bordeaux wine.' },
      },
      {
        title: 'Louvre Art Masterpieces & Seine River Cruise',
        desc: 'Explore Mona Lisa at the Louvre and glide along the Seine River at dusk.',
        activities: [
          { time: '09:00 AM', activity: 'Louvre Museum Priority Tour', location: 'Rue de Rivoli', description: 'Marvel at Mona Lisa, Venus de Milo, and French royal jewels.', duration: '3 hours', cost: 40, category: 'Art & Culture' },
          { time: '03:00 PM', activity: 'Tuileries Garden & Place Vendôme', location: '1st Arrondissement', description: 'Stroll past fountains, sculpture gardens, and luxury boutiques.', duration: '2 hours', cost: 0, category: 'Walking' },
          { time: '07:00 PM', activity: 'Bateaux Parisiens Seine Sunset Cruise', location: 'Port de la Bourdonnais', description: 'Cruise under historic stone bridges with live accordion music.', duration: '1.5 hours', cost: 35, category: 'Cruise' },
        ],
        meal: { type: 'Lunch', rest: 'Café Marly', loc: 'Louvre Courtyard', cuisine: 'Parisian Bistro & Espresso', cost: 45, rec: 'Dine directly overlooking the Louvre Glass Pyramid.' },
      },
      {
        title: 'Montmartre Artists & Sacré-Cœur Panorama',
        desc: 'Wander cobblestone lanes of Montmartre, Place du Tertre painters, and Sacré-Cœur basilica.',
        activities: [
          { time: '10:00 AM', activity: 'Sacré-Cœur Basilica & Hilltop View', location: 'Montmartre Hill', description: 'Take in panoramic views of all of Paris from the church steps.', duration: '2 hours', cost: 0, category: 'Heritage' },
          { time: '02:00 PM', activity: 'Place du Tertre Artist Square', location: 'Montmartre', description: 'Watch local portrait artists and visit vintage pastry shops.', duration: '2.5 hours', cost: 20, category: 'Culture' },
        ],
        meal: { type: 'Dinner', rest: 'Le Consulat', loc: 'Rue Norvins', cuisine: 'French Onion Soup & Wine', cost: 55, rec: 'Historic café frequented by Picasso and Van Gogh.' },
      },
    ],
    packing: ['Comfortable walking shoes', 'Light trench coat or jacket', 'Universal European power adapter', 'Crossbody anti-theft bag'],
  },

  tokyo: {
    hero: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
    weather: { temp: 19, desc: 'Mild & crisp with bright blue skies', main: 'Clear & Bright', bestSeason: 'March to May & Sept to Nov' },
    hotels: [
      { name: 'Keio Plaza Hotel Shinjuku', location: 'Shinjuku, Tokyo', pricePct: 0.07, rating: 4.8 },
      { name: 'The Gate Hotel Asakusa Kaminarimon', location: 'Asakusa, Tokyo', pricePct: 0.05, rating: 4.9 },
    ],
    airline: 'Japan Airlines / ANA',
    days: [
      {
        title: 'Historic Asakusa & Skytree Skyline',
        desc: 'Step into ancient Tokyo at Senso-ji Temple followed by breathtaking Skytree views.',
        activities: [
          { time: '09:30 AM', activity: 'Senso-ji Temple & Nakamise Street', location: 'Asakusa', description: 'Walk through Kaminarimon gate and sample matcha sweets.', duration: '2.5 hours', cost: 10, category: 'Culture' },
          { time: '02:00 PM', activity: 'Tokyo Skytree Observation Deck', location: 'Oshiage', description: 'Stand 450m above Tokyo with views stretching to Mount Fuji.', duration: '2 hours', cost: 30, category: 'Sightseeing' },
        ],
        meal: { type: 'Dinner', rest: 'Ichiran Ramen Shinjuku', loc: 'Shinjuku', cuisine: 'Tonkotsu Ramen', cost: 18, rec: 'Customizable rich pork bone broth ramen booths.' },
      },
      {
        title: 'Shibuya Crossing, Meiji Shrine & Harajuku',
        desc: 'Cross the world’s busiest intersection and find tranquility at Meiji Shrine.',
        activities: [
          { time: '10:00 AM', activity: 'Meiji Jingu Shrine & Forest Walk', location: 'Harajuku', description: 'Walk under towering wooden Torii gates into serene cedar forest.', duration: '2 hours', cost: 0, category: 'Nature & Shrine' },
          { time: '01:30 PM', activity: 'Takeshita Street Fashion & Crepes', location: 'Harajuku', description: 'Explore trendy pop culture shops and marionette crepe stands.', duration: '2 hours', cost: 15, category: 'Shopping' },
          { time: '05:00 PM', activity: 'Shibuya Scramble & Shibuya Sky Observatory', location: 'Shibuya', description: 'Experience the world-famous scramble crossing from above.', duration: '2 hours', cost: 22, category: 'Iconic View' },
        ],
        meal: { type: 'Lunch', rest: 'Sushi No Midori', loc: 'Shibuya', cuisine: 'Fresh Edomae Sushi', cost: 35, rec: 'Melt-in-your-mouth otoro tuna and sea urchin nigiri.' },
      },
      {
        title: 'Akihabara Tech & Shinjuku Neon Night Walk',
        desc: 'Immerse in anime technology arcades and evening izakaya alleyways.',
        activities: [
          { time: '11:00 AM', activity: 'Akihabara Electric Town & Retrogaming', location: 'Akihabara', description: 'Explore multi-story manga centers, arcades, and gadget shops.', duration: '3 hours', cost: 25, category: 'Pop Culture' },
          { time: '06:30 PM', activity: 'Omoide Yokocho & Kabukicho Alleyways', location: 'Shinjuku', description: 'Stroll through nostalgic lantern-lit yakitori skewers alleys.', duration: '2.5 hours', cost: 30, category: 'Nightlife' },
        ],
        meal: { type: 'Dinner', rest: 'Tori Shige Izakaya', loc: 'Omoide Yokocho', cuisine: 'Charcoal Yakitori & Sake', cost: 40, rec: 'Grilled chicken skewers seasoned with tare sauce.' },
      },
    ],
    packing: ['Suica / Pasmo transit card', 'Easy slip-on walking shoes', 'Pocket Wi-Fi device', 'Small hand towel for washrooms'],
  },

  bali: {
    hero: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    weather: { temp: 28, desc: 'Warm tropical sunshine with ocean breeze', main: 'Tropical Sunny', bestSeason: 'April to October' },
    hotels: [
      { name: 'Ubud Tropical Sanctuary & Pool Villa', location: 'Ubud, Bali', pricePct: 0.05, rating: 4.9 },
      { name: 'Seminyak Beach Resort & Spa', location: 'Seminyak, Bali', pricePct: 0.06, rating: 4.8 },
    ],
    airline: 'Garuda Indonesia / Singapore Airlines',
    days: [
      {
        title: 'Ubud Rice Terraces & Sacred Monkey Forest',
        desc: 'Explore emerald green Tegallalang rice paddies and meet playful macaques.',
        activities: [
          { time: '08:30 AM', activity: 'Tegallalang Rice Terrace Trek & Jungle Swing', location: 'Ubud', description: 'Walk along terraced rice fields and swing over palm canopy.', duration: '3 hours', cost: 15, category: 'Nature' },
          { time: '01:30 PM', activity: 'Sacred Monkey Forest Sanctuary', location: 'Padangtegal', description: 'Wander through ancient jungle temples guarded by monkeys.', duration: '2 hours', cost: 10, category: 'Wildlife' },
        ],
        meal: { type: 'Lunch', rest: 'Bebek Tepi Sawah', loc: 'Ubud', cuisine: 'Crispy Balinese Duck', cost: 25, rec: 'Crispy duck served with sambal matah and steamed rice.' },
      },
      {
        title: 'Uluwatu Cliff Temple & Kecak Sunset Fire Dance',
        desc: 'Watch dramatic waves crash on limestone cliffs and attend traditional fire dance.',
        activities: [
          { time: '03:00 PM', activity: 'Uluwatu Temple Cliff Walk', location: 'Uluwatu', description: 'Explore 70m high ocean cliff temple overlooking Indian Ocean.', duration: '2 hours', cost: 8, category: 'Temple' },
          { time: '06:00 PM', activity: 'Kecak & Fire Dance Performance', location: 'Uluwatu Amphitheater', description: 'Watch 50+ dancers perform Ramayana chant as sun sets.', duration: '1.5 hours', cost: 15, category: 'Culture' },
        ],
        meal: { type: 'Dinner', rest: 'Jimbaran Bay Seafood Cafe', loc: 'Jimbaran Beach', cuisine: 'Grilled Ocean Seafood', cost: 40, rec: 'Candlelight dinner on sand with grilled snapper and prawns.' },
      },
    ],
    packing: ['Reef-safe sunscreen', 'Mosquito repellent', 'Modest temple sarong', 'Flip flops & swimwear'],
  },
}

function generateDynamicLocationPlan(trip: Trip): TripPlan {
  const destination = trip.destination.trim()
  const city = destination.split(',')[0].trim()
  const country = destination.split(',')[1]?.trim() || 'Global'
  const profile = LOCATION_DATABASE[city.toLowerCase()]

  const start = new Date(trip.start_date)
  const end = new Date(trip.end_date)
  const diffTime = Math.max(end.getTime() - start.getTime(), 86400000)
  const daysCount = Math.min(Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1, 14)

  if (profile) {
    return {
      id: `plan-${trip.id}`,
      trip_id: trip.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ai_summary: `AI crafted a tailored ${trip.travel_style || 'personalized'} itinerary for ${trip.travelers} traveler(s) visiting ${destination}. Specifically designed for your interests in ${trip.interests.join(', ')} with a total budget of ${trip.currency} ${trip.budget.toLocaleString()}.`,
      hero_image: profile.hero,
      weather: {
        city: city,
        country: country,
        current: {
          temp: profile.weather.temp,
          feels_like: profile.weather.temp + 1,
          humidity: 55,
          pressure: 1013,
          wind_speed: 10,
          weather_main: profile.weather.main,
          weather_description: profile.weather.desc,
        },
        forecast: Array.from({ length: 3 }).map((_, i) => ({
          date_time: `Day ${i + 1}`,
          temp_max: profile.weather.temp + 2,
          temp_min: profile.weather.temp - 4,
          weather_description: profile.weather.desc,
        })),
        best_time_to_visit: profile.weather.bestSeason,
        packing_suggestions: profile.packing,
      },
      flights: {
        best_option: {
          airline: profile.airline,
          price: Math.round(trip.budget * 0.28),
          duration: '6h 30m',
          departure_time: '09:00 AM',
          arrival_time: '03:30 PM',
          booking_url: `https://www.google.com/travel/flights?q=flights+from+${encodeURIComponent(trip.origin)}+to+${encodeURIComponent(city)}`,
        },
        options: [
          {
            airline: profile.airline,
            price: Math.round(trip.budget * 0.28),
            duration: '6h 30m',
            departure_time: '09:00 AM',
            arrival_time: '03:30 PM',
            booking_url: `https://www.google.com/travel/flights?q=flights+from+${encodeURIComponent(trip.origin)}+to+${encodeURIComponent(city)}`,
          },
          {
            airline: 'Global Partner Express',
            price: Math.round(trip.budget * 0.24),
            duration: '8h 15m (1 stop)',
            departure_time: '01:15 PM',
            arrival_time: '09:30 PM',
            booking_url: `https://www.google.com/travel/flights?q=flights+from+${encodeURIComponent(trip.origin)}+to+${encodeURIComponent(city)}`,
          },
        ],
      },
      hotels: {
        best_option: {
          name: profile.hotels[0].name,
          price: Math.round(trip.budget * profile.hotels[0].pricePct),
          rating: profile.hotels[0].rating,
          location: profile.hotels[0].location,
          amenities: ['Free High-Speed Wi-Fi', 'Breakfast Buffet', 'Concierge Service', 'Central Location'],
          booking_url: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(city)}`,
          image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
        },
        options: profile.hotels.map((h) => ({
          name: h.name,
          price: Math.round(trip.budget * h.pricePct),
          rating: h.rating,
          location: h.location,
          amenities: ['Free Wi-Fi', 'Air Conditioning', 'Central Location'],
          booking_url: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(city)}`,
          image_url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80',
        })),
      },
      budget_breakdown: {
        total_budget: trip.budget,
        currency: trip.currency,
        breakdown: {
          flights: Math.round(trip.budget * 0.28),
          accommodation: Math.round(trip.budget * 0.35),
          food: Math.round(trip.budget * 0.18),
          activities: Math.round(trip.budget * 0.12),
          transport: Math.round(trip.budget * 0.04),
          emergency_buffer: Math.round(trip.budget * 0.03),
        },
        tips: [
          `Book main attractions in ${city} 48 hours early to bypass entry queues.`,
          `Use local metro or transit cards for efficient commuting in ${city}.`,
          `Try local lunch specials for premium regional dining at great value.`,
        ],
      },
      itinerary: {
        summary: `A ${daysCount}-day ${trip.travel_style || 'curated'} trip in ${city} focusing on ${trip.interests.join(', ')}.`,
        travel_tips: [
          `Keep digital copies of your travel documents accessible offline.`,
          `Notify your bank before making purchases in ${country}.`,
          `Download offline maps for ${city} for easy navigation.`,
        ],
        packing_suggestions: profile.packing,
        days: Array.from({ length: daysCount }).map((_, idx) => {
          const dayDate = new Date(start.getTime() + 86400000 * idx).toISOString().split('T')[0]
          const dayProfile = profile.days[idx % profile.days.length]
          return {
            day: idx + 1,
            date: dayDate,
            title: `Day ${idx + 1}: ${dayProfile.title}`,
            description: dayProfile.desc,
            tips: [`Best time for photos in ${city} is during early morning hours.`],
            activities: dayProfile.activities.map((a) => ({
              time: a.time,
              activity: a.activity,
              location: `${a.location}, ${city}`,
              description: a.description,
              duration: a.duration,
              cost: a.cost,
              category: a.category,
            })),
            meals: [
              {
                type: dayProfile.meal.type,
                restaurant: dayProfile.meal.rest,
                location: `${dayProfile.meal.loc}, ${city}`,
                cuisine: dayProfile.meal.cuisine,
                estimated_cost: dayProfile.meal.cost,
                recommendation: dayProfile.meal.rec,
              },
            ],
          }
        }),
      },
    }
  }

  // DYNAMIC ENGINE FOR ALL OTHER CITIES WORLDWIDE
  const cityImages: Record<string, string> = {
    rome: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
    london: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
    newyork: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
    delhi: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
    dubai: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    sydney: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80',
    santorini: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
    reykjavik: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1200&q=80',
  }

  const normalizedCityKey = city.toLowerCase().replace(/[^a-z]/g, '')
  const heroImg = cityImages[normalizedCityKey] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'

  return {
    id: `plan-${trip.id}`,
    trip_id: trip.id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ai_summary: `AI generated a custom ${trip.travel_style || 'signature'} itinerary for ${trip.travelers} traveler(s) visiting ${destination}. Optimized for interests in ${trip.interests.join(', ')} with an estimated target budget of ${trip.currency} ${trip.budget.toLocaleString()}.`,
    hero_image: heroImg,
    weather: {
      city: city,
      country: country,
      current: {
        temp: 22,
        feels_like: 23,
        humidity: 58,
        pressure: 1012,
        wind_speed: 11,
        weather_main: 'Clear & Sunny',
        weather_description: `Mild and sunny weather in ${city}, perfect for sightseeing and walking tours.`,
      },
      forecast: Array.from({ length: 3 }).map((_, i) => ({
        date_time: `Day ${i + 1}`,
        temp_max: 24,
        temp_min: 16,
        weather_description: 'Sunny & Pleasant',
      })),
      best_time_to_visit: 'Spring and Autumn peak seasons',
      packing_suggestions: [
        'Comfortable walking shoes',
        'Weather-appropriate layered apparel',
        'Universal power adapter & power bank',
        'Sun Protection & sunglasses',
        'Camera or smartphone tripod',
      ],
    },
    flights: {
      best_option: {
        airline: `International Express (${trip.origin} ➔ ${city})`,
        price: Math.round(trip.budget * 0.3),
        duration: '7h 15m',
        departure_time: '08:45 AM',
        arrival_time: '04:00 PM',
        booking_url: `https://www.google.com/travel/flights?q=flights+from+${encodeURIComponent(trip.origin)}+to+${encodeURIComponent(city)}`,
      },
      options: [
        {
          airline: `Direct Flight (${trip.origin} ➔ ${city})`,
          price: Math.round(trip.budget * 0.3),
          duration: '7h 15m',
          departure_time: '08:45 AM',
          arrival_time: '04:00 PM',
          booking_url: `https://www.google.com/travel/flights?q=flights+from+${encodeURIComponent(trip.origin)}+to+${encodeURIComponent(city)}`,
        },
        {
          airline: 'Global Connect Airline',
          price: Math.round(trip.budget * 0.25),
          duration: '9h 30m (1 stop)',
          departure_time: '11:20 AM',
          arrival_time: '08:50 PM',
          booking_url: `https://www.google.com/travel/flights?q=flights+from+${encodeURIComponent(trip.origin)}+to+${encodeURIComponent(city)}`,
        },
      ],
    },
    hotels: {
      best_option: {
        name: `Grand Palace & Spa ${city}`,
        price: Math.round((trip.budget * 0.35) / Math.max(daysCount, 1)),
        rating: 4.8,
        location: `Central ${city}`,
        amenities: ['Free High-Speed Wi-Fi', 'Breakfast Included', 'Rooftop Lounge', '24/7 Concierge'],
        booking_url: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(city)}`,
        image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
      },
      options: [
        {
          name: `Grand Palace & Spa ${city}`,
          price: Math.round((trip.budget * 0.35) / Math.max(daysCount, 1)),
          rating: 4.8,
          location: `Central ${city}`,
          amenities: ['Free Wi-Fi', 'Breakfast Buffet', 'Pool & Spa'],
          booking_url: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(city)}`,
          image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: `Boutique Heritage Hotel ${city}`,
          price: Math.round((trip.budget * 0.25) / Math.max(daysCount, 1)),
          rating: 4.7,
          location: `Old Town Quarter, ${city}`,
          amenities: ['Cozy Terrace', 'Local Art Decor', 'Bike Rentals'],
          booking_url: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(city)}`,
          image_url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80',
        },
      ],
    },
    budget_breakdown: {
      total_budget: trip.budget,
      currency: trip.currency,
      breakdown: {
        flights: Math.round(trip.budget * 0.3),
        accommodation: Math.round(trip.budget * 0.35),
        food: Math.round(trip.budget * 0.16),
        activities: Math.round(trip.budget * 0.11),
        transport: Math.round(trip.budget * 0.05),
        emergency_buffer: Math.round(trip.budget * 0.03),
      },
      tips: [
        `Book landmark entry passes in ${city} in advance to skip ticket lines.`,
        `Utilize city transit cards for economical local transport in ${city}.`,
        `Explore traditional lunch set menus for authentic dining at lower prices.`,
      ],
    },
    itinerary: {
      summary: `Custom ${daysCount}-day ${trip.travel_style || 'adventure'} itinerary exploring the highlights of ${destination}.`,
      travel_tips: [
        `Store digital backups of your passport and travel tickets offline.`,
        `Confirm international credit card activation prior to departure.`,
        `Download offline maps for ${city} for seamless walking directions.`,
      ],
      packing_suggestions: [
        'Comfortable walking shoes',
        'Weather-appropriate layered clothing',
        'Universal power adapter',
        'Rechargeable portable battery bank',
      ],
      days: Array.from({ length: daysCount }).map((_, idx) => {
        const dayDate = new Date(start.getTime() + 86400000 * idx).toISOString().split('T')[0]
        if (idx === 0) {
          return {
            day: 1,
            date: dayDate,
            title: `Arrival & ${city} City Center Walking Tour`,
            description: `Check into your hotel in ${city}, refresh, and explore the landmark historic square.`,
            tips: [`Exchange a small amount of local currency or use contactless cards at ${city} airport.`],
            activities: [
              {
                time: '02:00 PM',
                activity: `Hotel Check-in & Welcome Refreshments`,
                location: `Central ${city}`,
                description: `Unpack and unwind after your journey.`,
                duration: '1.5 hours',
                cost: 0,
                category: 'Check-in',
              },
              {
                time: '04:30 PM',
                activity: `Guided Historic Center Walking Tour`,
                location: `Downtown Quarter, ${city}`,
                description: `Discover iconic architecture, historic monuments, and vibrant street life in ${city}.`,
                duration: '2 hours',
                cost: 25,
                category: 'Sightseeing',
              },
            ],
            meals: [
              {
                type: 'Dinner',
                restaurant: `The Grand ${city} Bistro`,
                location: `Downtown ${city}`,
                cuisine: `Authentic Regional Cuisine`,
                estimated_cost: 45,
                recommendation: `Try chef's signature seasonal regional dish with local beverage pairing.`,
              },
            ],
          }
        } else if (idx === 1) {
          return {
            day: 2,
            date: dayDate,
            title: `Heritage, Museums & Famous Landmarks of ${city}`,
            description: `Immerse in the rich history, art galleries, and famed cultural sites of ${city}.`,
            tips: ['Early morning visits offer the best photo opportunities with fewer crowds.'],
            activities: [
              {
                time: '09:30 AM',
                activity: `Famous National Museum & Art Gallery`,
                location: `Cultural Hub, ${city}`,
                description: `Explore world-class exhibitions, historical artifacts, and art collections in ${city}.`,
                duration: '3 hours',
                cost: 35,
                category: 'Culture',
              },
              {
                time: '02:30 PM',
                activity: `Scenic Park & Botanical Garden Stroll`,
                location: `Royal Gardens, ${city}`,
                description: `Relax by peaceful fountains, botanical glasshouses, and scenic view points.`,
                duration: '2 hours',
                cost: 12,
                category: 'Relaxation',
              },
            ],
            meals: [
              {
                type: 'Lunch',
                restaurant: `Café De ${city}`,
                location: `Museum Quarter, ${city}`,
                cuisine: `Artisanal Pastries & Coffee`,
                estimated_cost: 25,
                recommendation: `Enjoy freshly baked pastries and hand-drip coffee.`,
              },
            ],
          }
        } else {
          return {
            day: idx + 1,
            date: dayDate,
            title: `Local Food Tasting & Sunset Skyline View in ${city}`,
            description: `Experience famous local food markets followed by panoramic sunset views over ${city}.`,
            tips: ['Wear comfortable walking shoes for market exploration.'],
            activities: [
              {
                time: '11:00 AM',
                activity: `Authentic Local Food & Market Crawl`,
                location: `Central Market, ${city}`,
                description: `Sample regional street food specialties and artisanal produce in ${city}.`,
                duration: '2.5 hours',
                cost: 40,
                category: 'Foodie',
              },
              {
                time: '06:00 PM',
                activity: `Sunset Observation Tower & Sky View`,
                location: `Sky Viewpoint, ${city}`,
                description: `Watch golden hour illuminate the skyline of ${city} from above.`,
                duration: '2 hours',
                cost: 20,
                category: 'Sightseeing',
              },
            ],
            meals: [
              {
                type: 'Dinner',
                restaurant: `Skyline Grill & Bar ${city}`,
                location: `Rooftop Terrace, ${city}`,
                cuisine: `Modern Fusion`,
                estimated_cost: 60,
                recommendation: `Signature craft drinks and wood-fired regional specialties.`,
              },
            ],
          }
        }
      }),
    },
  }
}

export const generateSampleItinerary = (trip: Trip): TripPlan => {
  return generateDynamicLocationPlan(trip)
}

class GuestStore {
  private userKey = 'voyageai_guest_user'
  private tripsKey = 'voyageai_guest_trips'
  private plansKey = 'voyageai_guest_plans'

  getUser(): User {
    const data = localStorage.getItem(this.userKey)
    if (!data) {
      this.setUser(DEFAULT_GUEST_USER)
      return DEFAULT_GUEST_USER
    }
    try {
      return JSON.parse(data)
    } catch {
      return DEFAULT_GUEST_USER
    }
  }

  setUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user))
  }

  updateAvatar(avatarUrl: string, name?: string): User {
    const currentUser = this.getUser()
    const updated: User = {
      ...currentUser,
      avatar_url: avatarUrl,
      full_name: name || currentUser.full_name,
    }
    this.setUser(updated)
    return updated
  }

  getTrips(): Trip[] {
    const data = localStorage.getItem(this.tripsKey)
    if (!data) {
      localStorage.setItem(this.tripsKey, JSON.stringify(INITIAL_TRIPS))
      INITIAL_TRIPS.forEach((t) => {
        this.savePlan(generateSampleItinerary(t))
      })
      return INITIAL_TRIPS
    }
    try {
      return JSON.parse(data)
    } catch {
      return INITIAL_TRIPS
    }
  }

  getTrip(id: string): Trip | undefined {
    const trips = this.getTrips()
    return trips.find((t) => t.id === id)
  }

  createTrip(newTripData: Partial<Trip>): Trip {
    const trips = this.getTrips()
    const user = this.getUser()
    const id = `trip-${Date.now()}`
    const trip: Trip = {
      id,
      user_id: user.id,
      origin: newTripData.origin || 'Home',
      destination: newTripData.destination || 'Dream Destination',
      start_date: newTripData.start_date || new Date().toISOString().split('T')[0],
      end_date: newTripData.end_date || new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
      travelers: newTripData.travelers || 1,
      budget: newTripData.budget || 2000,
      currency: newTripData.currency || user.preferred_currency || 'USD',
      interests: newTripData.interests || ['museums', 'foodie'],
      travel_style: newTripData.travel_style || 'general',
      status: 'planned',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    trips.unshift(trip)
    localStorage.setItem(this.tripsKey, JSON.stringify(trips))

    const plan = generateSampleItinerary(trip)
    this.savePlan(plan)

    return trip
  }

  updateTrip(id: string, updates: Partial<Trip>): Trip | undefined {
    const trips = this.getTrips()
    const index = trips.findIndex((t) => t.id === id)
    if (index === -1) return undefined
    trips[index] = {
      ...trips[index],
      ...updates,
      updated_at: new Date().toISOString(),
    }
    localStorage.setItem(this.tripsKey, JSON.stringify(trips))
    return trips[index]
  }

  deleteTrip(id: string): void {
    const trips = this.getTrips().filter((t) => t.id !== id)
    localStorage.setItem(this.tripsKey, JSON.stringify(trips))
  }

  duplicateTrip(id: string): Trip | undefined {
    const trip = this.getTrip(id)
    if (!trip) return undefined
    const duplicatedData = {
      ...trip,
      destination: `${trip.destination} (Copy)`,
    }
    delete (duplicatedData as any).id
    return this.createTrip(duplicatedData)
  }

  getPlan(tripId: string): TripPlan {
    const data = localStorage.getItem(this.plansKey)
    let plansMap: Record<string, TripPlan> = {}
    if (data) {
      try {
        plansMap = JSON.parse(data)
      } catch {
        plansMap = {}
      }
    }
    if (plansMap[tripId]) {
      return plansMap[tripId]
    }
    const trip = this.getTrip(tripId)
    const generated = generateSampleItinerary(
      trip || {
        id: tripId,
        user_id: 'guest',
        origin: 'Origin',
        destination: 'Destination',
        start_date: '2026-09-01',
        end_date: '2026-09-05',
        travelers: 1,
        budget: 1500,
        currency: 'USD',
        interests: ['sightseeing'],
        status: 'planned',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    )
    this.savePlan(generated)
    return generated
  }

  savePlan(plan: TripPlan): void {
    const data = localStorage.getItem(this.plansKey)
    let plansMap: Record<string, TripPlan> = {}
    if (data) {
      try {
        plansMap = JSON.parse(data)
      } catch {
        plansMap = {}
      }
    }
    plansMap[plan.trip_id] = plan
    localStorage.setItem(this.plansKey, JSON.stringify(plansMap))
  }
}

export const guestStore = new GuestStore()
