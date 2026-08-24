from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.db.session import Base

class Farm(Base):
    __tablename__ = "farms"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    size_acres = Column(Float, default=5.0)
    state = Column(String(100), default="Punjab")
    district = Column(String(100), default="Ludhiana")
    village = Column(String(100), nullable=True)
    latitude = Column(Float, default=30.9010, index=True)
    longitude = Column(Float, default=75.8573, index=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    fields = relationship("Field", back_populates="farm", cascade="all, delete-orphan")

class Field(Base):
    __tablename__ = "fields"

    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, ForeignKey("farms.id"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    soil_type = Column(String(100), default="Alluvial Loam")
    irrigation_type = Column(String(100), default="Drip / Tube Well")
    area_acres = Column(Float, default=2.5)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    farm = relationship("Farm", back_populates="fields")
    crop_cycles = relationship("CropCycle", back_populates="field", cascade="all, delete-orphan")
