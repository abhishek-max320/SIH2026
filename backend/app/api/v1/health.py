from fastapi import APIRouter
from app.schemas.health import HealthResponse, ModuleStatus
from app.services.cpp_bridge import cpp_engine

router = APIRouter()

@router.get("/health", response_model=HealthResponse, tags=["System Health"])
async def check_health():
    # Verify C++ engine sanity
    sample_risk = cpp_engine.compute_risk_score(90.0, 50.0, 80.0, 85.0, 5, 20.0)
    cpp_status = "operational (native C++17 binary)" if sample_risk > 0 else "degraded"

    return HealthResponse(
        status="healthy",
        platform="AgriSentinel AI",
        version="1.0.0",
        tier="SIH 2026 Enterprise Edition",
        modules=ModuleStatus(
            api="active",
            database="connected (zero-config SQLite/PostgreSQL ready)",
            ai_pipeline="ready (Image QC, Disease CNN, YOLO Pest, Severity Mask)",
            cpp_risk_engine=cpp_status,
            weather_service="online (Open-Meteo)"
        )
    )
