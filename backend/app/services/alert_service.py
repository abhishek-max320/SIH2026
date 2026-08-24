"""
AgriSentinel AI - Geo-Targeted Outbreak Early Warning Dispatcher
Broadcasts targeted warnings to susceptible farms within C++ computed radius.
"""
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from typing import List, Dict, Any
from app.models.user import User
from app.models.farm import Farm
from app.models.outbreak import OutbreakReport, Alert
from app.services.cpp_bridge import cpp_engine

class AlertService:
    @classmethod
    def dispatch_outbreak_warning(
        cls,
        source_lat: float,
        source_lon: float,
        crop_name: str,
        disease_name: str,
        severity_percent: float,
        confidence: float,
        db: Session,
        alert_radius_km: float = 25.0
    ) -> Dict[str, Any]:
        """Broadcasts early warnings to nearby farmers with susceptible crops."""
        
        # 1. Register new anonymized regional outbreak report
        new_report = OutbreakReport(
            crop_name=crop_name,
            disease_name=disease_name,
            latitude=source_lat,
            longitude=source_lon,
            severity_percent=severity_percent,
            confidence=confidence,
            state="Punjab",
            district="Ludhiana",
            reported_at=datetime.now(timezone.utc),
            status="Active"
        )
        db.add(new_report)
        db.commit()
        db.refresh(new_report)

        # 2. Find all farms in database
        all_farms = db.query(Farm).all()
        warned_farmers = []

        for farm in all_farms:
            dist = cpp_engine.haversine_distance(source_lat, source_lon, farm.latitude, farm.longitude)
            if 0.0 < dist <= alert_radius_km:
                # Generate localized alert record
                alert_msg = (
                    f"⚠ HIGH-RISK OUTBREAK WARNING: {crop_name} {disease_name} detected within {dist:.1f} km of your farm. "
                    f"Current humidity and temperature favor rapid sporulation. Inspect your crops within 24-48 hours."
                )
                alert = Alert(
                    user_id=farm.user_id,
                    alert_type="OUTBREAK_WARNING",
                    title=f"🚨 Nearby {disease_name} Outbreak Alert ({dist:.1f} km)",
                    message=alert_msg,
                    severity="HIGH" if severity_percent > 30 else "MODERATE",
                    distance_km=round(dist, 1),
                    disease_name=f"{crop_name} {disease_name}",
                    is_read=False
                )
                db.add(alert)
                warned_farmers.append({
                    "farm_id": farm.id,
                    "farm_name": farm.name,
                    "user_id": farm.user_id,
                    "distance_km": round(dist, 1)
                })

        db.commit()

        return {
            "outbreak_report_id": new_report.id,
            "warned_count": len(warned_farmers),
            "alert_radius_km": alert_radius_km,
            "warned_farms": warned_farmers
        }

alert_service = AlertService()
