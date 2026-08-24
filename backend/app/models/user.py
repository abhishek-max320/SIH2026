from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, Enum
from datetime import datetime, timezone
import enum
from app.db.session import Base

class UserRole(str, enum.Enum):
    FARMER = "farmer"
    EXPERT = "expert"
    OFFICER = "officer"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default=UserRole.FARMER.value, nullable=False, index=True)
    phone = Column(String(50), nullable=True)
    
    # Farmer / Regional Location fields
    farm_name = Column(String(255), nullable=True)
    primary_crop = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    district = Column(String(100), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
