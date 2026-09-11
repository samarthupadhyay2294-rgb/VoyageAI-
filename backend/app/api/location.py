from fastapi import APIRouter, HTTPException, Query, status
from app.agents.location_agent import LocationAgent
from app.schemas.location import (
    LocationGeocodeRequest,
    LocationReverseGeocodeRequest,
    LocationGeocodeResponse,
    DistanceMatrixRequest,
    DistanceMatrixResponse,
    RouteOptimizeRequest,
    RouteOptimizeResponse,
    TransportHubsRequest,
    TransportHubsResponse,
    LocationIntelligenceRequest,
    LocationIntelligenceResponse,
)
from app.schemas.response import APIResponse
from app.logging import logger

router = APIRouter()
location_agent = LocationAgent()


@router.get("/geocode", response_model=APIResponse[LocationGeocodeResponse])
async def geocode_location_get(query: str = Query(..., example="Paris, France")):
    """Convert place name into latitude & longitude coordinates (Geocoding)."""
    try:
        res = await location_agent.validate_and_geocode(query)
        return APIResponse(success=True, data=res, message="Location geocoded successfully")
    except Exception as e:
        logger.error(f"Error in geocode_location_get: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/geocode", response_model=APIResponse[LocationGeocodeResponse])
async def geocode_location_post(body: LocationGeocodeRequest):
    """Geocode place name via POST payload."""
    try:
        res = await location_agent.validate_and_geocode(body.query)
        return APIResponse(success=True, data=res, message="Location geocoded successfully")
    except Exception as e:
        logger.error(f"Error in geocode_location_post: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/reverse-geocode", response_model=APIResponse[LocationGeocodeResponse])
async def reverse_geocode_location(body: LocationReverseGeocodeRequest):
    """Convert latitude and longitude coordinates into address text."""
    try:
        res = await location_agent.reverse_geocode(body.latitude, body.longitude)
        return APIResponse(success=True, data=res, message="Reverse geocoded successfully")
    except Exception as e:
        logger.error(f"Error in reverse_geocode_location: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/distance", response_model=APIResponse[DistanceMatrixResponse])
async def calculate_distance(body: DistanceMatrixRequest):
    """Calculate travel distance, duration, and transit cost between origin and destination."""
    try:
        res = await location_agent.calculate_distance_and_time(body.origin, body.destination, mode=body.mode)
        return APIResponse(success=True, data=res, message="Distance and travel time calculated successfully")
    except Exception as e:
        logger.error(f"Error in calculate_distance: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/optimize-route", response_model=APIResponse[RouteOptimizeResponse])
async def optimize_route(body: RouteOptimizeRequest):
    """Optimize multi-stop tour itinerary order to minimize total travel time and distance."""
    try:
        res = await location_agent.optimize_route(
            start_location=body.start_location,
            stops=body.stops,
            end_location=body.end_location,
            mode=body.mode,
        )
        return APIResponse(success=True, data=res, message="Route optimized successfully")
    except Exception as e:
        logger.error(f"Error in optimize_route: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/transport-hubs", response_model=APIResponse[TransportHubsResponse])
async def find_transport_hubs(body: TransportHubsRequest):
    """Find nearby airports, railway stations, and bus terminals for a location."""
    try:
        res = await location_agent.find_nearby_transport_hubs(body.location, radius_km=body.radius_km)
        return APIResponse(success=True, data=res, message="Transport hubs discovered successfully")
    except Exception as e:
        logger.error(f"Error in find_transport_hubs: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/intelligence", response_model=APIResponse[LocationIntelligenceResponse])
async def generate_location_intelligence(body: LocationIntelligenceRequest):
    """Generate structured location intelligence for Weather, Hotel, Planner, Budget, and Recommendation agents."""
    try:
        res = await location_agent.generate_location_intelligence(
            destination=body.destination,
            origin=body.origin,
            interests=body.interests,
        )
        return APIResponse(success=True, data=res, message="Location intelligence generated successfully")
    except Exception as e:
        logger.error(f"Error in generate_location_intelligence: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
