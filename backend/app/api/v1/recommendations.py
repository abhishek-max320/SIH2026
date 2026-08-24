from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.db.session import get_db
from app.models.recommendation import Recommendation

router = APIRouter()

@router.get("/")
def get_recommendations(
    crop: Optional[str] = Query(None, description="Crop name filter"),
    disease: Optional[str] = Query(None, description="Disease name filter"),
    category: Optional[str] = Query(None, description="Category filter (CHEMICAL, BIOLOGICAL, CULTURAL, etc.)"),
    db: Session = Depends(get_db)
):
    """Retrieve verified ICAR agronomic management protocols."""
    query = db.query(Recommendation)
    if crop:
        query = query.filter(Recommendation.crop_name.ilike(f"%{crop}%"))
    if disease:
        query = query.filter(Recommendation.disease_or_pest_name.ilike(f"%{disease}%"))
    if category:
        query = query.filter(Recommendation.category.ilike(f"%{category}%"))
    
    recs = query.all()
    return [
        {
            "id": r.id,
            "crop": r.crop_name,
            "disease_or_pest": r.disease_or_pest_name,
            "category": r.category,
            "action_title": r.action_title,
            "description": r.description,
            "dosage_or_application": r.dosage_or_application,
            "safety_warning": r.safety_warning,
            "source": r.source_reference
        }
        for r in recs
    ]
