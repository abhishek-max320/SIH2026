from pydantic import BaseModel
from typing import Dict, Any

class ModuleStatus(BaseModel):
    api: str
    database: str
    ai_pipeline: str
    cpp_risk_engine: str
    weather_service: str

class HealthResponse(BaseModel):
    status: str
    platform: str
    version: str
    tier: str
    modules: ModuleStatus
