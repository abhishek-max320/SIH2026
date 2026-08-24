"""
AgriSentinel AI - Comprehensive Outbreak Risk Coordinator
Coordinates:
- AI Diagnostic Confidence & Area Severity
- Open-Meteo Atmospheric Metrics
- Native C++ High-Performance Spatial Engine
"""
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from app.models.outbreak import OutbreakReport
from app.services.cpp_bridge import cpp_engine
from app.services.weather_service import weather_service

class RiskService:
    @classmethod
    async def evaluate_comprehensive_risk(
        cls,
        latitude: float,
        longitude: float,
        crop_name: str,
        disease_name: str,
        disease_confidence: float,
        severity_percent: float,
        db: Session
    ) -> Dict[str, Any]:
        """Compute multi-tier epidemiological risk using C++ engine and live weather."""
        
        # 1. Fetch real-time weather metrics
        weather_data = await weather_service.get_current_weather(latitude, longitude)
        humidity = weather_data.get("humidity", 75.0)
        temp_fav = weather_data.get("disease_favorability_index", 70.0)

        # 2. Query active outbreak records matching or related to this crop
        outbreak_records = db.query(OutbreakReport).filter(
            OutbreakReport.status == "Active"
        ).all()

        records_payload = [
            {
                "latitude": r.latitude,
                "longitude": r.longitude,
                "severity": r.severity_percent,
                "confidence": r.confidence
            }
            for r in outbreak_records
        ]

        # 3. Execute Native C++ Spatial Multi-Ring Cluster Analysis
        cluster_metrics = cpp_engine.analyze_clusters(latitude, longitude, records_payload)

        # 4. Execute Native C++ Composite 0-100 Risk Engine Calculation
        nearby_cases_10km = cluster_metrics.get("count_10km", 0)
        composite_risk = cpp_engine.compute_risk_score(
            disease_confidence=disease_confidence,
            severity_percent=severity_percent,
            humidity=humidity,
            temp_favorability=temp_fav,
            nearby_cases_10km=nearby_cases_10km,
            historical_risk_factor=30.0
        )

        # 5. Risk Category & Decision Explainability
        if composite_risk >= 75.0:
            risk_grade = "CRITICAL"
            urgency = "Immediate Prophylactic Intervention (24 Hours)"
            alert_radius_km = 25.0
        elif composite_risk >= 50.0:
            risk_grade = "HIGH"
            urgency = "Action Required within 48 Hours"
            alert_radius_km = 15.0
        elif composite_risk >= 25.0:
            risk_grade = "MODERATE"
            urgency = "Monitor Canopy Twice Weekly"
            alert_radius_km = 5.0
        else:
            risk_grade = "LOW"
            urgency = "Routine Maintenance"
            alert_radius_km = 0.0

        # Multi-variate Explainability Decomposition
        risk_breakdown = [
            {"factor": "AI Pathogen Confidence", "contribution": f"{round((disease_confidence/100.0)*25.0, 1)}%", "raw": f"{disease_confidence}%"},
            {"factor": "Leaf Area Severity", "contribution": f"{round((severity_percent/100.0)*25.0, 1)}%", "raw": f"{severity_percent}%"},
            {"factor": "Atmospheric Vector (Humidity & Temp)", "contribution": f"{round(((humidity/100.0*0.6)+(temp_fav/100.0*0.4))*25.0, 1)}%", "raw": f"{weather_data['temperature']}°C, {humidity}% RH"},
            {"factor": "C++ Spatial Proximity Clustering", "contribution": f"{round(min(1.0, nearby_cases_10km/10.0)*15.0, 1)}%", "raw": f"{nearby_cases_10km} cases within 10 km (Nearest {cluster_metrics['nearest_distance_km']} km)"},
            {"factor": "Regional Historical Prior", "contribution": "3.0%", "raw": "Baseline Rabi Season Prior"}
        ]

        return {
            "composite_risk_score": composite_risk,
            "risk_level": risk_grade,
            "urgency_action": urgency,
            "recommended_alert_radius_km": alert_radius_km,
            "cluster_metrics": cluster_metrics,
            "weather_telemetry": weather_data,
            "risk_breakdown": risk_breakdown,
            "cpp_engine_active": True,
        }

risk_service = RiskService()
