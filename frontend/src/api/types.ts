export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  preferred_currency: string
  created_at: string
}

export interface Trip {
  id: string
  user_id: string
  origin: string
  destination: string
  start_date: string
  end_date: string
  travelers: number
  budget: number
  currency: string
  interests: string[]
  travel_style?: string
  status: string
  created_at: string
  updated_at: string
}

export interface TripPlan {
  id: string
  trip_id: string
  weather?: WeatherData
  flights?: FlightData
  hotels?: HotelData
  places?: PlacesData
  restaurants?: RestaurantsData
  budget_breakdown?: BudgetBreakdown
  hero_image?: string
  gallery?: ImageData[]
  itinerary?: ItineraryData
  ai_summary?: string
  created_at: string
  updated_at: string
}

export interface WeatherData {
  city: string
  country: string
  current: {
    temp: number
    feels_like: number
    humidity: number
    pressure: number
    wind_speed: number
    weather_main: string
    weather_description: string
  }
  forecast: Array<{
    date_time: string
    temp_max: number
    temp_min: number
    weather_description: string
  }>
  best_time_to_visit: string
  packing_suggestions: string[]
}

export interface FlightData {
  options: FlightOption[]
  best_option?: FlightOption
}

export interface FlightOption {
  airline: string
  price: number
  duration: string
  departure_time: string
  arrival_time: string
  booking_url: string
}

export interface HotelData {
  options: HotelOption[]
  best_option?: HotelOption
}

export interface HotelOption {
  name: string
  price: number
  rating: number
  location: string
  amenities: string[]
  booking_url: string
  image_url?: string
}

export interface PlacesData {
  attractions: Place[]
  activities: Place[]
}

export interface Place {
  name: string
  category: string
  description: string
  rating: number
  location: string
  image_url?: string
}

export interface RestaurantsData {
  breakfast: Restaurant[]
  lunch: Restaurant[]
  dinner: Restaurant[]
  street_food: Restaurant[]
}

export interface Restaurant {
  name: string
  cuisine: string
  price_range: string
  rating: number
  location: string
  image_url?: string
}

export interface BudgetBreakdown {
  total_budget: number
  breakdown: {
    flights: number
    accommodation: number
    food: number
    activities: number
    transport: number
    emergency_buffer: number
  }
  currency: string
  tips: string[]
}

export interface ItineraryData {
  summary: string
  days: ItineraryDay[]
  travel_tips: string[]
  packing_suggestions: string[]
}

export interface ItineraryDay {
  day: number
  date: string
  title: string
  description: string
  activities: Activity[]
  meals: Meal[]
  tips: string[]
}

export interface Activity {
  time: string
  activity: string
  location: string
  description: string
  duration: string
  cost: number
  category: string
}

export interface Meal {
  type: string
  restaurant: string
  location: string
  cuisine: string
  estimated_cost: number
  recommendation: string
}

export interface ImageData {
  url: string
  description: string
  photographer: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}
