"""
AgriSentinel AI - Weather Intelligence Service
Integrates Open-Meteo real-time atmospheric data and computes disease transmission favorability.
"""
import httpx
from typing import Dict, Any, Optional

class WeatherService:
    BASE_URL = "https://api.open-meteo.com/v1/forecast"

    @classmethod
    async def get_current_weather(cls, latitude: float, longitude: float) -> Dict[str, Any]:
        """Fetch current temperature, relative humidity, precipitation, and wind speed."""
        params = {
            "latitude": latitude,
            "longitude": longitude,
            "current": "temperature_2m,relative_humidity_2m,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m",
            "hourly": "temperature_2m,relative_humidity_2m,precipitation_probability",
            "timezone": "auto",
            "forecast_days": 1
        }

        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                res = await client.get(cls.BASE_URL, params=params)
                if res.status_code == 200:
                    data = res.json()
                    curr = data.get("current", {})
                    temp = curr.get("temperature_2m", 24.5)
                    humidity = curr.get("relative_humidity_2m", 78.0)
                    precip = curr.get("precipitation", 0.0)
                    wind = curr.get("wind_speed_10m", 12.0)
                    wind_dir = curr.get("wind_direction_10m", 180)

                    favorability = cls.calculate_disease_favorability(temp, humidity, precip)

                    return {
                        "temperature": round(temp, 1),
                        "humidity": round(humidity, 1),
                        "precipitation_mm": round(precip, 1),
                        "wind_speed_kmh": round(wind, 1),
                        "wind_direction_deg": wind_dir,
                        "disease_favorability_index": favorability["index"],
                        "disease_risk_category": favorability["category"],
                        "dew_risk": favorability["dew_risk"],
                        "summary": favorability["summary"],
                        "source": "Open-Meteo High-Resolution Model"
                    }
        except Exception as e:
            print(f"[WARN] Weather API unreachable ({e}). Using microclimate fallback model.")

        # Robust agricultural climatology fallback (e.g. Northern India Spring/Rabi baseline)
        fallback_fav = cls.calculate_disease_favorability(24.0, 82.0, 0.5)
        return {
            "temperature": 24.0,
            "humidity": 82.0,
            "precipitation_mm": 0.5,
            "wind_speed_kmh": 14.0,
            "wind_direction_deg": 210,
            "disease_favorability_index": fallback_fav["index"],
            "disease_risk_category": fallback_fav["category"],
            "dew_risk": fallback_fav["dew_risk"],
            "summary": fallback_fav["summary"],
            "source": "Microclimate Synthetic Climatology Fallback"
        }

    @staticmethod
    def calculate_disease_favorability(temperature: float, humidity: float, precipitation: float) -> Dict[str, Any]:
        """
        Calculates fungal & bacterial pathogen germination favorability index (0-100%).
        Fungal rusts/blights thrive when Temp is 18°C-28°C and Humidity > 75%.
        """
        # Temp factor
        if 18.0 <= temperature <= 28.0:
            temp_score = 100.0 - abs(temperature - 23.0) * 4.0
        elif 12.0 <= temperature < 18.0 or 28.0 < temperature <= 35.0:
            temp_score = 60.0
        else:
            temp_score = 25.0

        # Humidity factor
        if humidity >= 80.0:
            humidity_score = 95.0
        elif humidity >= 65.0:
            humidity_score = 70.0 + (humidity - 65.0) * 1.6
        else:
            humidity_score = max(10.0, humidity)

        # Moisture factor
        rain_bonus = 15.0 if precipitation > 0.1 else 0.0

        index = min(100.0, max(0.0, (temp_score * 0.45 + humidity_score * 0.55) + rain_bonus))

        if index >= 75.0:
            cat = "CRITICAL"
            dew = "High Leaf Wetness (>6 Hours Sustained)"
            summary = "Atmospheric conditions are highly conducive to rapid spore germination and lesion sporulation."
        elif index >= 50.0:
            cat = "MODERATE"
            dew = "Moderate Condensation"
            summary = "Favorable daytime temperature with moderate relative humidity."
        else:
            cat = "LOW"
            dew = "Dry Canopy"
            summary = "Dry and warm conditions suppress fungal pathogen vector transmission."

        return {
            "index": round(index, 1),
            "category": cat,
            "dew_risk": dew,
            "summary": summary
        }

weather_service = WeatherService()
