from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, Text
from datetime import datetime, timezone
from app.db.session import Base

class OutbreakReport(Base):
    __tablename__ = "outbreak_reports"

    id = Column(Integer, primary_key=True, index=True)
    crop_name = Column(String(100), nullable=False, index=True)
    disease_name = Column(String(150), nullable=False, index=True)
    latitude = Column(Float, nullable=False, index=True)
    longitude = Column(Float, nullable=False, index=True)
    severity_percent = Column(Float, default=45.0)
    confidence = Column(Float, default=92.0)
    state = Column(String(100), default="Punjab", index=True)
    district = Column(String(100), default="Ludhiana", index=True)
    reported_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    status = Column(String(50), default="Active") # Active, Contained, Resolved

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    alert_type = Column(String(50), default="OUTBREAK_WARNING") # OUTBREAK_WARNING, WEATHER_RISK, FOLLOW_UP, EXPERT_REVIEW
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    severity = Column(String(50), default="HIGH") # LOW, MODERATE, HIGH, CRITICAL
    distance_km = Column(Float, nullable=True)
    disease_name = Column(String(150), nullable=True)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
