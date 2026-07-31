from typing import Dict, Any, Optional
from datetime import datetime, timedelta
from app.agents.location_agent import LocationAgent
from app.agents.weather_agent import WeatherAgent
from app.agents.flight_agent import FlightAgent
from app.agents.hotel_agent import HotelAgent
from app.agents.places_agent import PlacesAgent
from app.agents.food_agent import FoodAgent
from app.agents.budget_agent import BudgetAgent
from app.agents.image_agent import ImageAgent
from app.agents.planner_agent import PlannerAgent
from app.database.repository import TripRepository
from app.logging import logger


class TripOrchestrator:
    """Orchestrates all AI agents including LocationAgent to generate a complete trip plan."""

    def __init__(self):
        self.location_agent = LocationAgent()
        self.weather_agent = WeatherAgent()
        self.flight_agent = FlightAgent()
        self.hotel_agent = HotelAgent()
        self.places_agent = PlacesAgent()
        self.food_agent = FoodAgent()
        self.budget_agent = BudgetAgent()
        self.image_agent = ImageAgent()
        self.planner_agent = PlannerAgent()
        self.trip_repo = TripRepository()

    async def generate_trip_plan(self, trip: Dict[str, Any], regenerate: bool = False) -> Dict[str, Any]:
        """Generate a complete trip plan using all AI agents."""
        try:
            logger.info(f"Starting trip plan generation for trip {trip.get('id')}")

            trip_id = trip.get("id")
            destination = trip.get("destination")
            origin = trip.get("origin")
            start_date = str(trip.get("start_date"))
            end_date = str(trip.get("end_date"))
            travelers = trip.get("travelers", 1)
            budget = float(trip.get("budget", 2000))
            currency = trip.get("currency", "USD")
            interests = trip.get("interests", [])
            travel_style = trip.get("travel_style", "general")

            start = datetime.strptime(start_date, "%Y-%m-%d")
            end = datetime.strptime(end_date, "%Y-%m-%d")
            days = (end - start).days + 1

            # Step 0: Generate Location Intelligence (LocationAgent & OpenRouteService)
            logger.info("Step 0: Generating location intelligence")
            loc_intel = await self.location_agent.generate_location_intelligence(
                destination=destination,
                origin=origin,
                interests=interests,
            )

            # Step 1: Fetch Weather Data
            weather_data = await self.weather_agent.fetch_weather(destination)

            # Step 2: Search Flights
            flight_data = await self.flight_agent.search_flights(origin, destination, start_date, end_date, travelers)
            best_flight = await self.flight_agent.recommend_best_flight(flight_data, budget) if flight_data else None

            # Step 3: Search Hotels
            hotel_data = await self.hotel_agent.search_hotels(destination, start_date, end_date, travelers)
            best_hotel = await self.hotel_agent.recommend_best_hotel(hotel_data, budget, days) if hotel_data else None

            # Step 4: Discover Places
            places_data = await self.places_agent.discover_places(destination, interests)
            recommended_attractions = await self.places_agent.recommend_attractions(places_data, travel_style) if places_data else []

            # Step 5: Discover Restaurants
            restaurants_data = await self.food_agent.discover_restaurants(destination)
            dining_recommendations = await self.food_agent.recommend_dining(restaurants_data, budget, days) if restaurants_data else {}

            # Step 6: Budget Allocation
            budget_breakdown = await self.budget_agent.allocate_budget(budget, currency, start_date, end_date, travelers)

            # Step 7: Fetch Images
            image_gallery = await self.image_agent.create_gallery(destination)
            hero_image = image_gallery.get("hero", {}).get("url") if image_gallery.get("hero") else None

            # Step 8: Generate AI Itinerary
            itinerary = await self.planner_agent.generate_itinerary(
                destination=destination,
                start_date=start_date,
                end_date=end_date,
                travelers=travelers,
                interests=interests,
                travel_style=travel_style,
                weather_data=weather_data or {},
                places_data={"attractions": recommended_attractions, "activities": places_data.get("activities", [])} if places_data else {},
                restaurants_data=dining_recommendations,
                budget=budget,
                currency=currency,
            )

            # Validate itinerary
            if itinerary and await self.planner_agent.validate_itinerary(itinerary):
                logger.info("Itinerary validation passed")
            else:
                logger.warning("Itinerary validation failed, creating dynamic location-aware itinerary")
                itinerary = self._create_fallback_itinerary(destination, start_date, end_date, days, interests, travel_style)

            # Step 9: Compile Trip Plan
            trip_plan_data = {
                "location_intelligence": loc_intel.model_dump() if hasattr(loc_intel, "model_dump") else loc_intel.dict(),
                "weather": weather_data,
                "flights": {
                    "options": flight_data.get("options", []) if flight_data else [],
                    "best_option": best_flight,
                },
                "hotels": {
                    "options": hotel_data.get("options", []) if hotel_data else [],
                    "best_option": best_hotel,
                },
                "places": {
                    "attractions": recommended_attractions,
                    "activities": places_data.get("activities", []) if places_data else [],
                },
                "restaurants": dining_recommendations,
                "budget_breakdown": budget_breakdown,
                "hero_image": hero_image,
                "gallery": image_gallery.get("gallery", []),
                "itinerary": itinerary,
                "ai_summary": itinerary.get("summary", "") if itinerary else "",
            }

            # Step 10: Save to Database
            user_id = trip.get("user_id")
            existing_plan = await self.trip_repo.get_trip_plan(trip_id, user_id)

            if existing_plan and not regenerate:
                await self.trip_repo.update_trip_plan(trip_id, user_id, trip_plan_data)
            else:
                plan_data = {
                    "trip_id": trip_id,
                    **trip_plan_data,
                }
                await self.trip_repo.create_trip_plan(plan_data)

            await self.trip_repo.update_trip(trip_id, user_id, {"status": "completed"})

            return {
                "success": True,
                "message": "Trip plan generated successfully",
                "data": trip_plan_data,
            }

        except Exception as e:
            logger.error(f"Error in TripOrchestrator: {str(e)}")
            return {
                "success": False,
                "message": f"Failed to generate trip plan: {str(e)}",
                "data": None,
            }

    def _create_fallback_itinerary(
        self, destination: str, start_date: str, end_date: str, days: int, interests: list, travel_style: str
    ) -> Dict[str, Any]:
        """Create a location-specific dynamic itinerary."""
        city = destination.split(",")[0].strip()
        start = datetime.strptime(start_date, "%Y-%m-%d")

        itinerary_days = []
        themes = [
            (f"Arrival & Historic {city} Walk", f"Check in to your hotel and explore the central landmark square of {city}."),
            (f"Heritage, Museums & Art of {city}", f"Immerse in world-class art collections and historical landmarks in {city}."),
            (f"Culinary Tasting & Sunset Viewpoint", f"Explore famous food markets and panoramic sunset vistas across {city}."),
            (f"Nature, Parks & Scenic Trails in {city}", f"Relax by tranquil gardens and scenic nature reserves around {city}."),
            (f"Local Boutiques & Iconic Architecture", f"Discover popular shopping quarters and historic architectural gems in {city}."),
        ]

        for i in range(days):
            current_date = start + timedelta(days=i)
            theme = themes[i % len(themes)]

            itinerary_days.append({
                "day": i + 1,
                "date": current_date.strftime("%Y-%m-%d"),
                "title": f"Day {i + 1}: {theme[0]}",
                "description": theme[1],
                "activities": [
                    {
                        "time": "09:30 AM",
                        "activity": f"Exploring {city} Landmark Quarter",
                        "location": f"Central {city}",
                        "description": f"Guided walk through iconic sites in {city}.",
                        "duration": "2.5 hours",
                        "cost": 25,
                        "category": "Sightseeing",
                    },
                    {
                        "time": "02:30 PM",
                        "activity": f"{city} Cultural & Heritage Tour",
                        "location": f"Old Town, {city}",
                        "description": f"Visit renowned museums and historic monuments in {city}.",
                        "duration": "2 hours",
                        "cost": 30,
                        "category": "Culture",
                    },
                ],
                "meals": [
                    {
                        "type": "Lunch",
                        "restaurant": f"Le Bistro De {city}",
                        "location": f"Downtown {city}",
                        "cuisine": f"Local Specialty Cuisine",
                        "estimated_cost": 35,
                        "recommendation": f"Famous regional dishes prepared with fresh ingredients.",
                    },
                    {
                        "type": "Dinner",
                        "restaurant": f"Skyline Grill {city}",
                        "location": f"Panoramic Terrace, {city}",
                        "cuisine": "Modern Fusion",
                        "estimated_cost": 65,
                        "recommendation": f"Dine with panoramic evening views over {city}.",
                    },
                ],
                "tips": [
                    f"Use contactless transit for easy travel around {city}.",
                    f"Early morning hours offer the best light for photography in {city}.",
                ],
            })

        return {
            "summary": f"A customized {days}-day {travel_style} trip to {destination} tailored to your interests in {', '.join(interests) if interests else 'sightseeing'}.",
            "days": itinerary_days,
            "travel_tips": [
                f"Keep digital backups of your passport and travel tickets.",
                f"Download offline map data for {city} before departure.",
                f"Verify local payment preferences in {city}.",
            ],
            "packing_suggestions": [
                "Comfortable walking shoes",
                "Weather-appropriate layered apparel",
                "Universal power adapter",
                "Portable battery charger",
            ],
            "emergency_contacts": [
                "Local emergency services: 112 / 911",
                "Hotel concierge & desk",
            ],
            "budget_tips": [
                f"Reserve major attraction tickets online to bypass queues in {city}.",
                f"Sample lunch set menus for premium dining at great value.",
            ],
        }
