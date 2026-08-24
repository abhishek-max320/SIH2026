from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.db.session import Base

class ScanReport(Base):
    __tablename__ = "scan_reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    crop_cycle_id = Column(Integer, ForeignKey("crop_cycles.id"), nullable=True, index=True)
    
    # Image & Quality Metrics
    image_url = Column(String(500), nullable=False)
    original_filename = Column(String(255), nullable=True)
    is_valid_image = Column(Boolean, default=True)
    blur_score = Column(Float, default=120.0)         # Laplacian variance (>100 is sharp)
    brightness_score = Column(Float, default=135.0)   # 0 - 255
    resolution_w = Column(Integer, default=1024)
    resolution_h = Column(Integer, default=1024)
    qc_status = Column(String(50), default="PASSED")  # PASSED, BLURRY, POOR_LIGHTING, LOW_RES

    # Environmental & Calculated Scores
    latitude = Column(Float, default=30.9010)
    longitude = Column(Float, default=75.8573)
    temperature = Column(Float, nullable=True)
    humidity = Column(Float, nullable=True)
    rainfall_mm = Column(Float, default=0.0)
    
    crop_health_score = Column(Float, default=75.0)  # 0 to 100
    outbreak_risk_score = Column(Float, default=35.0) # 0 to 100
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)

    # Relationships
    crop_cycle = relationship("CropCycle", back_populates="scans")
    disease_predictions = relationship("DiseasePrediction", back_populates="scan", cascade="all, delete-orphan")
    pest_predictions = relationship("PestPrediction", back_populates="scan", cascade="all, delete-orphan")
    severity_report = relationship("SeverityReport", back_populates="scan", uselist=False, cascade="all, delete-orphan")
    expert_reviews = relationship("ExpertReview", back_populates="scan", cascade="all, delete-orphan")

class DiseasePrediction(Base):
    __tablename__ = "disease_predictions"

    id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(Integer, ForeignKey("scan_reports.id"), nullable=False, index=True)
    crop_name = Column(String(100), default="Wheat")
    disease_name = Column(String(150), nullable=False, index=True)
    scientific_name = Column(String(150), nullable=True)
    confidence = Column(Float, nullable=False) # 0 to 100
    gradcam_heatmap_url = Column(String(500), nullable=True)
    is_primary = Column(Boolean, default=True)

    scan = relationship("ScanReport", back_populates="disease_predictions")

class PestPrediction(Base):
    __tablename__ = "pest_predictions"

    id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(Integer, ForeignKey("scan_reports.id"), nullable=False, index=True)
    pest_name = Column(String(150), nullable=False, index=True)
    confidence = Column(Float, nullable=False)
    detected_count = Column(Integer, default=1)
    bounding_boxes = Column(JSON, nullable=True) # [{"x1": 0.2, "y1": 0.3, "x2": 0.4, "y2": 0.5, "label": "aphid", "conf": 0.92}]

    scan = relationship("ScanReport", back_populates="pest_predictions")

class SeverityReport(Base):
    __tablename__ = "severity_reports"

    id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(Integer, ForeignKey("scan_reports.id"), unique=True, nullable=False, index=True)
    affected_area_percent = Column(Float, default=15.0) # 0 to 100%
    severity_grade = Column(String(50), default="Moderate") # Healthy, Mild, Moderate, Severe, Critical
    mask_image_url = Column(String(500), nullable=True)
    explanation_text = Column(Text, nullable=True)

    scan = relationship("ScanReport", back_populates="severity_report")
