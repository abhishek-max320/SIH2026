from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.outbreak import Alert

router = APIRouter()

@router.get("/")
def get_user_alerts(user_id: int = 1, db: Session = Depends(get_db)):
    """Retrieve active localized early warning alerts for user."""
    alerts = db.query(Alert).filter(Alert.user_id == user_id).order_by(Alert.created_at.desc()).all()
    return [
        {
            "id": a.id,
            "alert_type": a.alert_type,
            "title": a.title,
            "message": a.message,
            "severity": a.severity,
            "distance_km": a.distance_km,
            "disease_name": a.disease_name,
            "is_read": a.is_read,
            "created_at": a.created_at.isoformat()
        }
        for a in alerts
    ]

@router.post("/{alert_id}/read")
def mark_alert_read(alert_id: int, db: Session = Depends(get_db)):
    """Mark an alert notification as acknowledged."""
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert.is_read = True
    db.commit()
    return {"success": True, "alert_id": alert_id, "is_read": True}
