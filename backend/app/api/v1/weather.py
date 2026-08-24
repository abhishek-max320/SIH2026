from fastapi import APIRouter, Query
from app.services.weather_service import weather_service

router = APIRouter()

@router.get("/current")
async def get_current_weather(
    latitude: float = Query(30.9010, description="Latitude of farm"),
    longitude: float = Query(75.8573, description="Longitude of farm")
):
    """Retrieve real-time atmospheric metrics and pathogen disease transmission favorability index."""
    return await weather_service.get_current_weather(latitude, longitude)
