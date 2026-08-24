from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.db.session import Base

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    crop_name = Column(String(100), nullable=False, index=True)
    disease_or_pest_name = Column(String(150), nullable=False, index=True)
    category = Column(String(50), default="IMMEDIATE") # IMMEDIATE, PREVENTIVE, CULTURAL, BIOLOGICAL, CHEMICAL, MONITORING
    action_title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    dosage_or_application = Column(String(255), nullable=True)
    safety_warning = Column(Text, nullable=True)
    source_reference = Column(String(255), default="ICAR-Central Plant Protection Protocols")

class ExpertReview(Base):
    __tablename__ = "expert_reviews"

    id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(Integer, ForeignKey("scan_reports.id"), nullable=False, index=True)
    expert_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    status = Column(String(50), default="CONFIRMED") # CONFIRMED, CORRECTED, REJECTED
    confirmed_disease = Column(String(150), nullable=False)
    confidence_override = Column(Float, default=98.0)
    expert_notes = Column(Text, nullable=True)
    treatment_override = Column(Text, nullable=True)
    reviewed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    scan = relationship("ScanReport", back_populates="expert_reviews")
    expert = relationship("User")
