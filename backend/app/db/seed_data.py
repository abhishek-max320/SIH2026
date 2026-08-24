from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from app.db.session import engine, Base, SessionLocal
from app.models import (
    User, UserRole,
    Farm, Field,
    Crop, CropCycle,
    OutbreakReport, Recommendation, Alert
)
from app.core.security import get_password_hash

def seed_database():
    """Create tables and populate verified seed datasets for SIH 2026 judging."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 1. Seed Users if not present
        farmer = db.query(User).filter(User.email == "farmer@agrisentinel.ai").first()
        if not farmer:
            farmer = User(
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
            )
            db.add(farmer)
            db.commit()
            db.refresh(farmer)

        # 2. Seed Supported Crops
        if db.query(Crop).count() == 0:
            crops_data = [
                Crop(common_name="Wheat", scientific_name="Triticum aestivum", category="Cereal", icon="🌾", optimal_temp_min=15.0, optimal_temp_max=25.0, optimal_humidity_min=50.0, optimal_humidity_max=75.0),
                Crop(common_name="Rice", scientific_name="Oryza sativa", category="Cereal", icon="🌱", optimal_temp_min=20.0, optimal_temp_max=35.0, optimal_humidity_min=65.0, optimal_humidity_max=90.0),
                Crop(common_name="Tomato", scientific_name="Solanum lycopersicum", category="Horticulture", icon="🍅", optimal_temp_min=18.0, optimal_temp_max=28.0, optimal_humidity_min=55.0, optimal_humidity_max=75.0),
                Crop(common_name="Potato", scientific_name="Solanum tuberosum", category="Tuber", icon="🥔", optimal_temp_min=15.0, optimal_temp_max=22.0, optimal_humidity_min=60.0, optimal_humidity_max=85.0),
                Crop(common_name="Maize", scientific_name="Zea mays", category="Cereal", icon="🌽", optimal_temp_min=18.0, optimal_temp_max=32.0, optimal_humidity_min=50.0, optimal_humidity_max=80.0),
            ]
            db.add_all(crops_data)
            db.commit()

        # 3. Seed Farm, Field, and Crop Cycle for Demo Farmer
        if db.query(Farm).count() == 0:
            farm = Farm(
                user_id=farmer.id,
                name="Ludhiana Golden Acres",
                size_acres=12.5,
                state="Punjab",
                district="Ludhiana",
                village="Gill Patti",
                latitude=30.9010,
                longitude=75.8573
            )
            db.add(farm)
            db.commit()
            db.refresh(farm)

            field1 = Field(farm_id=farm.id, name="North Block - Plot A", soil_type="Alluvial Loam", irrigation_type="Canal + Tube Well", area_acres=6.0)
            field2 = Field(farm_id=farm.id, name="South Block - Plot B", soil_type="Clay Loam", irrigation_type="Drip Irrigation", area_acres=6.5)
            db.add_all([field1, field2])
            db.commit()
            db.refresh(field1)

            wheat_crop = db.query(Crop).filter(Crop.common_name == "Wheat").first()
            if wheat_crop:
                cycle = CropCycle(
                    field_id=field1.id,
                    crop_id=wheat_crop.id,
                    stage="Flowering / Grain Filling",
                    sowing_date=datetime.now(timezone.utc) - timedelta(days=75),
                    expected_harvest_date=datetime.now(timezone.utc) + timedelta(days=45),
                    health_score=87.0,
                    is_active=True
                )
                db.add(cycle)
                db.commit()

        # 4. Seed Verified Agronomic Protocols
        if db.query(Recommendation).count() == 0:
            recs = [
                # Wheat Leaf Rust
                Recommendation(crop_name="Wheat", disease_or_pest_name="Leaf Rust", category="IMMEDIATE", action_title="Field Scouting & Early Infection Isolation", description="Inspect flag leaves across a 'W' pattern in the field. Tag localized rust pustule clusters.", dosage_or_application="Within 24-48 hours", safety_warning="Do not walk through infected rows when leaves are wet to prevent spore dissemination."),
                Recommendation(crop_name="Wheat", disease_or_pest_name="Leaf Rust", category="BIOLOGICAL", action_title="Trichoderma harzianum Foliar Spray", description="Apply bio-control formulation to suppress Puccinia fungal spore germination.", dosage_or_application="5g / Liter of water", safety_warning="Apply during late evening to protect microbial viability."),
                Recommendation(crop_name="Wheat", disease_or_pest_name="Leaf Rust", category="CHEMICAL", action_title="Propiconazole 25% EC (Approved Triazole)", description="Systemic fungicide providing curative and translaminar protection against leaf rust.", dosage_or_application="1.0 ml / Liter of water (200 ml / acre)", safety_warning="Wear protective gloves and mask. Observe 25-day pre-harvest safety interval."),
                Recommendation(crop_name="Wheat", disease_or_pest_name="Leaf Rust", category="PREVENTIVE", action_title="Balanced Potassium & Avoid Excess Nitrogen", description="Excess nitrogen promotes succulent tissue susceptible to rapid rust sporulation.", dosage_or_application="Follow soil card recommendation", safety_warning="Avoid overhead sprinkler irrigation during high humidity periods."),

                # Potato Late Blight
                Recommendation(crop_name="Potato", disease_or_pest_name="Late Blight", category="IMMEDIATE", action_title="Prophylactic Canopy Protection", description="Inspect lower leaves for water-soaked lesions with white fuzzy mildew underneath.", dosage_or_application="Immediate action required", safety_warning="Destroy culled infected tubers; do not leave exposed on field edges."),
                Recommendation(crop_name="Potato", disease_or_pest_name="Late Blight", category="CHEMICAL", action_title="Mancozeb 75% WP + Metalaxyl 8%", description="Dual-action contact and systemic fungicide formulation for aggressive Phytophthora control.", dosage_or_application="2.5g / Liter of water", safety_warning="Do not apply within 14 days of tuber harvest."),

                # Tomato Early Blight
                Recommendation(crop_name="Tomato", disease_or_pest_name="Early Blight", category="CULTURAL", action_title="Lower Leaf Pruning & Stake Mulching", description="Remove bottom 30cm infected foliage to stop soil-borne Alternaria splashing onto healthy stems.", dosage_or_application="Weekly field sanitation", safety_warning="Disinfect pruning shears between plants with 70% alcohol."),
                Recommendation(crop_name="Tomato", disease_or_pest_name="Early Blight", category="CHEMICAL", action_title="Azoxystrobin 18.2% + Difenoconazole 11.4% SC", description="Broad-spectrum strobilurin fungicide preventing target-spot lesion expansion.", dosage_or_application="1.0 ml / Liter of water", safety_warning="Max 2 consecutive sprays to avoid fungal resistance."),

                # Rice Leaf Blast
                Recommendation(crop_name="Rice", disease_or_pest_name="Leaf Blast", category="CHEMICAL", action_title="Tricyclazole 75% WP", description="Targeted melanin-biosynthesis inhibitor highly specific against Magnaporthe blast.", dosage_or_application="0.6g / Liter of water (120g / acre)", safety_warning="Do not spray during full bloom to safeguard pollinators."),

                # Aphid Infestation
                Recommendation(crop_name="Wheat", disease_or_pest_name="Aphid", category="BIOLOGICAL", action_title="Release Chrysoperla carnea (Green Lacewing)", description="Predatory larvae actively consume 20-30 aphids per day.", dosage_or_application="1000-1500 eggs / acre", safety_warning="Do not apply chemical insecticides 10 days before or after release."),
                Recommendation(crop_name="Wheat", disease_or_pest_name="Aphid", category="CHEMICAL", action_title="Neem Oil (Azadirachtin 10000 ppm)", description="Botanical insect growth regulator causing anti-feedant and repellent effect.", dosage_or_application="3.0 ml / Liter of water", safety_warning="Safe for beneficial soil microbiome."),
            ]
            db.add_all(recs)
            db.commit()

        # 5. Seed Regional Outbreak Reports across Northern India for Heatmap & C++ Proximity
        if db.query(OutbreakReport).count() == 0:
            now = datetime.now(timezone.utc)
            outbreaks = [
                # Ludhiana & Punjab Cluster (Near Demo Farm)
                OutbreakReport(crop_name="Wheat", disease_name="Leaf Rust", latitude=30.9080, longitude=75.8620, severity_percent=42.0, confidence=95.0, state="Punjab", district="Ludhiana", reported_at=now - timedelta(days=1), status="Active"),
                OutbreakReport(crop_name="Wheat", disease_name="Leaf Rust", latitude=30.8850, longitude=75.8420, severity_percent=68.0, confidence=93.0, state="Punjab", district="Ludhiana", reported_at=now - timedelta(days=2), status="Active"),
                OutbreakReport(crop_name="Wheat", disease_name="Leaf Rust", latitude=30.9350, longitude=75.8900, severity_percent=55.0, confidence=96.0, state="Punjab", district="Ludhiana", reported_at=now - timedelta(days=3), status="Active"),
                OutbreakReport(crop_name="Wheat", disease_name="Yellow Rust", latitude=30.9500, longitude=75.8100, severity_percent=38.0, confidence=91.0, state="Punjab", district="Ludhiana", reported_at=now - timedelta(days=2), status="Active"),
                OutbreakReport(crop_name="Wheat", disease_name="Leaf Rust", latitude=31.3260, longitude=75.5762, severity_percent=72.0, confidence=97.0, state="Punjab", district="Jalandhar", reported_at=now - timedelta(days=2), status="Active"),
                OutbreakReport(crop_name="Wheat", disease_name="Leaf Rust", latitude=31.3100, longitude=75.5900, severity_percent=50.0, confidence=94.0, state="Punjab", district="Jalandhar", reported_at=now - timedelta(days=4), status="Active"),
                OutbreakReport(crop_name="Wheat", disease_name="Leaf Rust", latitude=30.3398, longitude=76.3869, severity_percent=60.0, confidence=92.0, state="Punjab", district="Patiala", reported_at=now - timedelta(days=3), status="Active"),
                OutbreakReport(crop_name="Wheat", disease_name="Yellow Rust", latitude=31.6340, longitude=74.8723, severity_percent=45.0, confidence=89.0, state="Punjab", district="Amritsar", reported_at=now - timedelta(days=5), status="Active"),

                # Haryana Cluster
                OutbreakReport(crop_name="Wheat", disease_name="Leaf Rust", latitude=29.6857, longitude=76.9905, severity_percent=58.0, confidence=94.0, state="Haryana", district="Karnal", reported_at=now - timedelta(days=1), status="Active"),
                OutbreakReport(crop_name="Wheat", disease_name="Leaf Rust", latitude=30.3782, longitude=76.7767, severity_percent=64.0, confidence=95.0, state="Haryana", district="Ambala", reported_at=now - timedelta(days=2), status="Active"),
                OutbreakReport(crop_name="Rice", disease_name="Leaf Blast", latitude=29.9695, longitude=76.8783, severity_percent=52.0, confidence=93.0, state="Haryana", district="Kurukshetra", reported_at=now - timedelta(days=4), status="Active"),

                # UP Cluster
                OutbreakReport(crop_name="Potato", disease_name="Late Blight", latitude=27.1767, longitude=78.0081, severity_percent=78.0, confidence=98.0, state="Uttar Pradesh", district="Agra", reported_at=now - timedelta(days=1), status="Active"),
                OutbreakReport(crop_name="Potato", disease_name="Late Blight", latitude=27.1950, longitude=78.0250, severity_percent=85.0, confidence=96.0, state="Uttar Pradesh", district="Agra", reported_at=now - timedelta(days=2), status="Active"),
                OutbreakReport(crop_name="Tomato", disease_name="Early Blight", latitude=28.9845, longitude=77.7064, severity_percent=40.0, confidence=91.0, state="Uttar Pradesh", district="Meerut", reported_at=now - timedelta(days=3), status="Active"),
            ]
            db.add_all(outbreaks)
            db.commit()

        # 6. Seed Sample Alerts for Demo Farmer
        if db.query(Alert).count() == 0:
            alerts = [
                Alert(
                    user_id=farmer.id,
                    alert_type="OUTBREAK_WARNING",
                    title="⚠ HIGH-RISK OUTBREAK WARNING",
                    message="Wheat Leaf Rust reported within 3.8 km of your farm. High humidity (84%) creates optimum sporulation conditions. Inspect your flag leaves immediately.",
                    severity="HIGH",
                    distance_km=3.8,
                    disease_name="Wheat Leaf Rust",
                    is_read=False
                ),
                Alert(
                    user_id=farmer.id,
                    alert_type="WEATHER_RISK",
                    title="🌦️ Microclimate Disease Risk Spike",
                    message="Forecast indicates continuous dew and 24°C temperatures over next 48h. Disease favorability index increased to 82%.",
                    severity="MODERATE",
                    distance_km=0.0,
                    disease_name="Environmental Vector",
                    is_read=False
                ),
            ]
            db.add_all(alerts)
            db.commit()

        print(f"[SUCCESS] Database seeding complete: {db.query(Crop).count()} crops, {db.query(Recommendation).count()} protocols, {db.query(OutbreakReport).count()} outbreak cases, {db.query(Alert).count()} alerts.")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
