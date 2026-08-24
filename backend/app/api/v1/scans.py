from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from typing import Optional, List
import json

from app.db.session import get_db
from app.models.user import User
from app.models.scan import ScanReport, DiseasePrediction, PestPrediction, SeverityReport
from app.models.recommendation import Recommendation
from app.models.farm import Farm
from app.api.deps import get_current_user
from app.services.image_qc_service import image_qc_service
from app.services.ai_service import ai_service
from app.services.risk_service import risk_service
from app.services.alert_service import alert_service

router = APIRouter()

@router.post("/analyze")
async def analyze_crop_image(
    file: UploadFile = File(...),
    crop: str = Form("Wheat"),
    latitude: float = Form(30.9010),
    longitude: float = Form(75.8573),
    field_id: Optional[int] = Form(None),
    user_id: Optional[int] = Form(1),
    db: Session = Depends(get_db)
):
    """
    Core Multi-Stage Intelligence Pipeline:
    1. Read Specimen -> 2. OpenCV Image QC -> 3. CNN Pathogen Detection ->
    4. YOLO Pest Scanning -> 5. Area Severity -> 6. Live Weather Retrieval ->
    7. C++ Risk Engine -> 8. ICAR Verified Recommendations -> 9. Early Warning Broadcast
    """
    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Empty image file uploaded.")

    # 1. Quality Control Inspection
    qc_result = image_qc_service.evaluate_image_quality(image_bytes)
    if not qc_result["is_valid"]:
        return {
            "success": False,
            "status": "QC_FAILED",
            "message": "Image quality insufficient for reliable diagnosis.",
            "qc_metrics": qc_result,
            "recommendations": qc_result["recommendations"]
        }

    # 2. AI Inference Engine Execution
    diag = ai_service.diagnose_crop_specimen(image_bytes, crop_hint=crop)

    # 3. Comprehensive Risk Assessment via Weather & Native C++ Engine
    risk_data = await risk_service.evaluate_comprehensive_risk(
        latitude=latitude,
        longitude=longitude,
        crop_name=diag["crop"],
        disease_name=diag["disease"]["name"],
        disease_confidence=diag["disease"]["confidence"],
        severity_percent=diag["severity"]["affected_area_percent"],
        db=db
    )

    # 4. Fetch ICAR-Verified Agronomic Management Protocol
    recs = db.query(Recommendation).filter(
        Recommendation.crop_name.ilike(f"%{diag['crop']}%"),
        Recommendation.disease_or_pest_name.ilike(f"%{diag['disease']['name']}%")
    ).all()

    if not recs:
        # Fallback to general crop protocols
        recs = db.query(Recommendation).filter(
            Recommendation.crop_name.ilike(f"%{diag['crop']}%")
        ).limit(4).all()

    recommendations_payload = [
        {
            "id": r.id,
            "category": r.category,
            "action_title": r.action_title,
            "description": r.description,
            "dosage_or_application": r.dosage_or_application,
            "safety_warning": r.safety_warning,
            "source": r.source_reference
        }
        for r in recs
    ]

    # 5. Persist Diagnostic Report in Database
    assigned_user_id = user_id or 1
    scan_report = ScanReport(
        user_id=assigned_user_id,
        crop_cycle_id=field_id,
        image_url=diag["original_image_url"],
        original_filename=file.filename,
        is_valid_image=True,
        blur_score=qc_result["blur_score"],
        brightness_score=qc_result["brightness_score"],
        resolution_w=qc_result["resolution"]["width"],
        resolution_h=qc_result["resolution"]["height"],
        qc_status="PASSED",
        latitude=latitude,
        longitude=longitude,
        temperature=risk_data["weather_telemetry"].get("temperature"),
        humidity=risk_data["weather_telemetry"].get("humidity"),
        rainfall_mm=risk_data["weather_telemetry"].get("precipitation_mm", 0.0),
        crop_health_score=diag["crop_health_score"],
        outbreak_risk_score=risk_data["composite_risk_score"]
    )
    db.add(scan_report)
    db.commit()
    db.refresh(scan_report)

    # Add Disease Prediction
    dis_pred = DiseasePrediction(
        scan_id=scan_report.id,
        crop_name=diag["crop"],
        disease_name=diag["disease"]["name"],
        scientific_name=diag["disease"]["scientific_name"],
        confidence=diag["disease"]["confidence"],
        gradcam_heatmap_url=diag["gradcam_heatmap_url"],
        is_primary=True
    )
    db.add(dis_pred)

    # Add Severity Report
    sev_rep = SeverityReport(
        scan_id=scan_report.id,
        affected_area_percent=diag["severity"]["affected_area_percent"],
        severity_grade=diag["severity"]["severity_grade"],
        mask_image_url=diag["gradcam_heatmap_url"],
        explanation_text=diag["explainable_ai"]["primary_attribution"]
    )
    db.add(sev_rep)

    # Add Pest Predictions if any
    for p in diag.get("pests", []):
        pest_pred = PestPrediction(
            scan_id=scan_report.id,
            pest_name=p["pest_name"],
            confidence=p["confidence"],
            detected_count=p["detected_count"],
            bounding_boxes=p["bounding_boxes"]
        )
        db.add(pest_pred)

    db.commit()

    # 6. Automatic Early Warning Outbreak Broadcast if High Risk
    warning_dispatch_result = None
    if risk_data["composite_risk_score"] >= 50.0:
        warning_dispatch_result = alert_service.dispatch_outbreak_warning(
            source_lat=latitude,
            source_lon=longitude,
            crop_name=diag["crop"],
            disease_name=diag["disease"]["name"],
            severity_percent=diag["severity"]["affected_area_percent"],
            confidence=diag["disease"]["confidence"],
            db=db,
            alert_radius_km=risk_data["recommended_alert_radius_km"]
        )

    # Return Complete Structured Payload
    return {
        "success": True,
        "report_id": scan_report.id,
        "scan_uuid": diag["scan_id"],
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "crop": diag["crop"],
        "disease": diag["disease"],
        "severity": diag["severity"],
        "pests": diag["pests"],
        "crop_health_score": diag["crop_health_score"],
        "outbreak_risk": {
            "score": risk_data["composite_risk_score"],
            "level": risk_data["risk_level"],
            "urgency": risk_data["urgency_action"],
            "breakdown": risk_data["risk_breakdown"],
            "cluster_metrics": risk_data["cluster_metrics"],
        },
        "weather": risk_data["weather_telemetry"],
        "images": {
            "original": diag["original_image_url"],
            "gradcam_heatmap": diag["gradcam_heatmap_url"],
        },
        "explainable_ai": diag["explainable_ai"],
        "recommendations": recommendations_payload,
        "early_warning_broadcast": warning_dispatch_result,
        "qc_metrics": qc_result
    }

@router.get("/recent")
def get_recent_scans(limit: int = 10, db: Session = Depends(get_db)):
    """Retrieve recent scans list with health score and diagnosis."""
    scans = db.query(ScanReport).order_by(ScanReport.created_at.desc()).limit(limit).all()
    results = []
    for s in scans:
        dis = db.query(DiseasePrediction).filter(DiseasePrediction.scan_id == s.id).first()
        sev = db.query(SeverityReport).filter(SeverityReport.scan_id == s.id).first()
        results.append({
            "id": s.id,
            "image_url": s.image_url,
            "created_at": s.created_at.isoformat(),
            "crop_health_score": s.crop_health_score,
            "outbreak_risk_score": s.outbreak_risk_score,
            "disease_name": dis.disease_name if dis else "Healthy",
            "confidence": dis.confidence if dis else 95.0,
            "severity_grade": sev.severity_grade if sev else "Moderate",
            "affected_area_percent": sev.affected_area_percent if sev else 15.0
        })
    return results

@router.get("/{scan_id}")
def get_scan_by_id(scan_id: int, db: Session = Depends(get_db)):
    """Retrieve full detail for a specific scan ID."""
    scan = db.query(ScanReport).filter(ScanReport.id == scan_id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan report not found.")
    
    dis = db.query(DiseasePrediction).filter(DiseasePrediction.scan_id == scan.id).first()
    sev = db.query(SeverityReport).filter(SeverityReport.scan_id == scan.id).first()
    pests = db.query(PestPrediction).filter(PestPrediction.scan_id == scan.id).all()
    
    recs = db.query(Recommendation).filter(
        Recommendation.disease_or_pest_name.ilike(f"%{dis.disease_name if dis else 'Leaf Rust'}%")
    ).all()

    return {
        "report_id": scan.id,
        "created_at": scan.created_at.isoformat(),
        "crop_health_score": scan.crop_health_score,
        "outbreak_risk_score": scan.outbreak_risk_score,
        "disease": {
            "name": dis.disease_name if dis else "Healthy",
            "scientific_name": dis.scientific_name if dis else "",
            "confidence": dis.confidence if dis else 95.0,
        },
        "severity": {
            "affected_area_percent": sev.affected_area_percent if sev else 15.0,
            "severity_grade": sev.severity_grade if sev else "Moderate",
        },
        "pests": [
            {
                "pest_name": p.pest_name,
                "confidence": p.confidence,
                "detected_count": p.detected_count,
                "bounding_boxes": p.bounding_boxes or []
            }
            for p in pests
        ],
        "images": {
            "original": scan.image_url,
            "gradcam_heatmap": dis.gradcam_heatmap_url if dis else scan.image_url
        },
        "weather": {
            "temperature": scan.temperature or 24.0,
            "humidity": scan.humidity or 80.0,
            "precipitation_mm": scan.rainfall_mm or 0.0
        },
        "recommendations": [
            {
                "id": r.id,
                "category": r.category,
                "action_title": r.action_title,
                "description": r.description,
                "dosage_or_application": r.dosage_or_application,
                "safety_warning": r.safety_warning,
                "source": r.source_reference
            }
            for r in recs
        ]
    }
