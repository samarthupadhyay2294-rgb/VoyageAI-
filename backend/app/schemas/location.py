from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional


class LocationGeocodeRequest(BaseModel):
    query: str = Field(..., example="Paris, France")


class LocationReverseGeocodeRequest(BaseModel):
    latitude: float = Field(..., example=48.8566)
    longitude: float = Field(..., example=2.3522)


class LocationGeocodeResponse(BaseModel):
    valid: bool
    query: str
    name: str
    label: str
    latitude: float
    longitude: float
    country: Optional[str] = None
    region: Optional[str] = None
    postal_code: Optional[str] = None


class DistanceMatrixRequest(BaseModel):
    origin: str = Field(..., example="New York (JFK)")
    destination: str = Field(..., example="Paris, France")
    mode: str = Field("driving-car", example="driving-car")  # driving-car, cycling-regular, foot-walking


class DistanceMatrixResponse(BaseModel):
    valid: bool
    origin: str
    destination: str
    distance_km: float
    duration_mins: float
    transport_mode: str
    route_summary: str
    estimated_travel_cost_usd: float
    recommendations: List[str]


class RouteOptimizeRequest(BaseModel):
    start_location: str = Field(..., example="Tokyo Station")
    stops: List[str] = Field(..., example=["Senso-ji Temple", "Shibuya Crossing", "Meiji Shrine"])
    end_location: Optional[str] = Field(None, example="Shinjuku Station")
    mode: str = Field("driving-car", example="driving-car")


class RouteLeg(BaseModel):
    from_name: str
    to_name: str
    distance_km: float
    duration_mins: float


class RouteOptimizeResponse(BaseModel):
    valid: bool
    start_location: str
    optimized_order: List[str]
    total_distance_km: float
    total_duration_mins: float
    legs: List[RouteLeg]
    route_summary: str
    recommendations: List[str]


class TransportHub(BaseModel):
    name: str
    hub_type: str  # airport, railway_station, bus_station
    distance_km: float
    duration_mins: float
    latitude: float
    longitude: float


class TransportHubsRequest(BaseModel):
    location: str = Field(..., example="Paris, France")
    radius_km: float = Field(50.0, example=50.0)


class TransportHubsResponse(BaseModel):
    valid: bool
    location: str
    latitude: float
    longitude: float
    airports: List[TransportHub]
    railway_stations: List[TransportHub]
    bus_stations: List[TransportHub]
    closest_hub: Optional[TransportHub] = None


class LocationIntelligenceRequest(BaseModel):
    destination: str = Field(..., example="Tokyo, Japan")
    origin: Optional[str] = Field(None, example="San Francisco, USA")
    interests: Optional[List[str]] = Field(default_factory=list, example=["temples", "foodie"])


class AgentLocationInsights(BaseModel):
    for_weather: Dict[str, Any]
    for_hotel: Dict[str, Any]
    for_planner: Dict[str, Any]
    for_budget: Dict[str, Any]
    for_recommendation: Dict[str, Any]


class LocationIntelligenceResponse(BaseModel):
    valid: bool
    destination: str
    geocoded: LocationGeocodeResponse
    transport_hubs: TransportHubsResponse
    travel_accessibility_score: float  # 0 to 10
    agent_insights: AgentLocationInsights
