from sqlalchemy.orm import Session
from app.db.session import engine, Base, SessionLocal
from app.models.user import User, UserRole
from app.core.security import get_password_hash

def init_database():
    """Create all tables and seed default SIH judge test personas."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Check if users already seeded
        existing = db.query(User).first()
        if not existing:
            demo_users = [
                User(
                    email="farmer@agrisentinel.ai",
                    hashed_password=get_password_hash("farmer123"),
                    full_name="Rajesh Kumar (Farmer)",
                    role=UserRole.FARMER.value,
                    phone="+91 98765 43210",
                    farm_name="Ludhiana Golden Acres",
                    primary_crop="Wheat",
                    state="Punjab",
                    district="Ludhiana",
                    latitude=30.9010,
                    longitude=75.8573
                ),
                User(
                    email="expert@agrisentinel.ai",
                    hashed_password=get_password_hash("expert123"),
                    full_name="Dr. Ananya Sharma (Principal Agronomist)",
                    role=UserRole.EXPERT.value,
                    phone="+91 98765 11223",
                    farm_name="ICAR Central Crop Lab",
                    primary_crop="Pathology / Diagnostics",
                    state="Delhi",
                    district="New Delhi",
                    latitude=28.6139,
                    longitude=77.2090
                ),
                User(
                    email="officer@agrisentinel.ai",
                    hashed_password=get_password_hash("officer123"),
                    full_name="Vikram Singh (State Agriculture Officer)",
                    role=UserRole.OFFICER.value,
                    phone="+91 98765 44556",
                    farm_name="Ministry of Agriculture Surveillance Dept",
                    primary_crop="Surveillance Network",
                    state="Punjab",
                    district="Chandigarh",
                    latitude=30.7333,
                    longitude=76.7794
                ),
                User(
                    email="admin@agrisentinel.ai",
                    hashed_password=get_password_hash("admin123"),
                    full_name="System Administrator",
                    role=UserRole.ADMIN.value,
                    phone="+91 98765 99999",
                    farm_name="AgriSentinel HQ",
                    primary_crop="Platform Systems",
                    state="National",
                    district="Central Hub",
                    latitude=28.6139,
                    longitude=77.2090
                )
            ]
            db.add_all(demo_users)
            db.commit()
            print("[SUCCESS] Initialized database and seeded 4 SIH demo personas.")
    finally:
        db.close()

if __name__ == "__main__":
    init_database()
