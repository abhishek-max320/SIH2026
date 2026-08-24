from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.db.session import Base

class Crop(Base):
    __tablename__ = "crops"

    id = Column(Integer, primary_key=True, index=True)
    common_name = Column(String(100), unique=True, index=True, nullable=False)
    scientific_name = Column(String(150), nullable=True)
    category = Column(String(50), default="Cereal")
    icon = Column(String(20), default="🌾")
    optimal_temp_min = Column(Float, default=15.0)
    optimal_temp_max = Column(Float, default=28.0)
    optimal_humidity_min = Column(Float, default=50.0)
    optimal_humidity_max = Column(Float, default=80.0)

    crop_cycles = relationship("CropCycle", back_populates="crop")

class CropCycle(Base):
    __tablename__ = "crop_cycles"

    id = Column(Integer, primary_key=True, index=True)
    field_id = Column(Integer, ForeignKey("fields.id"), nullable=False, index=True)
    crop_id = Column(Integer, ForeignKey("crops.id"), nullable=False, index=True)
    stage = Column(String(50), default="Vegetative")  # Germination, Vegetative, Flowering, Fruiting, Maturity
    sowing_date = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    expected_harvest_date = Column(DateTime, nullable=True)
    health_score = Column(Float, default=88.0)
    is_active = Column(Boolean, default=True)

    field = relationship("Field", back_populates="crop_cycles")
    crop = relationship("Crop", back_populates="crop_cycles")
    scans = relationship("ScanReport", back_populates="crop_cycle", cascade="all, delete-orphan")
