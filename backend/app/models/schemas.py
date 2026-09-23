from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class ScanRequest(BaseModel):
    url: str

class Indicator(BaseModel):
    name: str
    status: str # PASS, WARNING, HIGH RISK
    reason: str

class ScanResponse(BaseModel):
    id: str
    url: str
    domain: str
    risk_score: int
    risk_level: str
    indicators: List[Indicator]
    risk_breakdown: Dict[str, int]
    summary: str
    recommendations: List[str]
    scanned_at: datetime
