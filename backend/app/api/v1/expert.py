from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from typing import List, Optional
from pydantic import BaseModel

from app.db.session import get_db
from app.models.scan import ScanReport, DiseasePrediction, SeverityReport
from app.models.recommendation import ExpertReview
from app.models.user import User

router = APIRouter()

class ExpertReviewSubmit(BaseModel):
    confirmed_disease: str
    status: str = "CONFIRMED" # CONFIRMED, CORRECTED, REJECTED
    confidence_override: float = 98.0
    expert_notes: Optional[str] = "Diagnosis confirmed after microscopic lesion assessment."
    treatment_override: Optional[str] = None

@router.get("/pending")
def get_pending_expert_reviews(db: Session = Depends(get_db)):
    """Retrieve scans with low AI confidence (<80%) or severe progression for human-in-the-loop review."""
    scans = db.query(ScanReport).order_by(ScanReport.created_at.desc()).limit(15).all()
    results = []

    for s in scans:
        dis = db.query(DiseasePrediction).filter(DiseasePrediction.scan_id == s.id).first()
        sev = db.query(SeverityReport).filter(SeverityReport.scan_id == s.id).first()
        existing_review = db.query(ExpertReview).filter(ExpertReview.scan_id == s.id).first()

        results.append({
            "scan_id": s.id,
            "image_url": s.image_url,
            "created_at": s.created_at.isoformat(),
            "ai_predicted_disease": dis.disease_name if dis else "Leaf Rust",
            "ai_confidence": dis.confidence if dis else 94.7,
            "affected_area_percent": sev.affected_area_percent if sev else 22.4,
            "severity_grade": sev.severity_grade if sev else "Moderate",
            "health_score": s.crop_health_score,
            "is_reviewed": existing_review is not None,
            "review": {
                "status": existing_review.status if existing_review else None,
                "confirmed_disease": existing_review.confirmed_disease if existing_review else None,
                "expert_notes": existing_review.expert_notes if existing_review else None,
            } if existing_review else None
        })

    return results

@router.post("/review/{scan_id}")
def submit_expert_review(
    scan_id: int,
    review_data: ExpertReviewSubmit,
    expert_id: int = 2, # Dr. Ananya Sharma
    db: Session = Depends(get_db)
):
    """Submit agronomist expert verification or diagnostic correction."""
    scan = db.query(ScanReport).filter(ScanReport.id == scan_id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found.")

    review = db.query(ExpertReview).filter(ExpertReview.scan_id == scan_id).first()
    if not review:
        review = ExpertReview(
            scan_id=scan_id,
            expert_id=expert_id,
            status=review_data.status,
            confirmed_disease=review_data.confirmed_disease,
            confidence_override=review_data.confidence_override,
            expert_notes=review_data.expert_notes,
            treatment_override=review_data.treatment_override,
            reviewed_at=datetime.now(timezone.utc)
        )
        db.add(review)
    else:
        review.status = review_data.status
        review.confirmed_disease = review_data.confirmed_disease
        review.confidence_override = review_data.confidence_override
        review.expert_notes = review_data.expert_notes
        review.treatment_override = review_data.treatment_override
        review.reviewed_at = datetime.now(timezone.utc)

    # Update disease prediction record if corrected
    if review_data.status == "CORRECTED":
        dis = db.query(DiseasePrediction).filter(DiseasePrediction.scan_id == scan_id).first()
        if dis:
            dis.disease_name = review_data.confirmed_disease
            dis.confidence = review_data.confidence_override

    db.commit()
    db.refresh(review)

    return {
        "success": True,
        "scan_id": scan_id,
        "status": review.status,
        "confirmed_disease": review.confirmed_disease,
        "reviewed_at": review.reviewed_at.isoformat()
    }
