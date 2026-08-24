from fastapi import APIRouter
from app.api.v1 import (
    health,
    auth,
    scans,
    weather,
    risk,
    alerts,
    recommendations,
    expert,
    admin
)

api_router = APIRouter()

api_router.include_router(health.router, prefix="", tags=["System Health"])
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication & RBAC"])
api_router.include_router(scans.router, prefix="/scans", tags=["Crop Diagnostics & Scanning"])
api_router.include_router(weather.router, prefix="/weather", tags=["Weather Intelligence"])
api_router.include_router(risk.router, prefix="/risk", tags=["Outbreak Risk & Clusters"])
api_router.include_router(alerts.router, prefix="/alerts", tags=["Early Warning Alerts"])
api_router.include_router(recommendations.router, prefix="/recommendations", tags=["Verified Protocols"])
api_router.include_router(expert.router, prefix="/expert", tags=["Expert Verification"])
api_router.include_router(admin.router, prefix="/admin", tags=["Government Surveillance & Telemetry"])
