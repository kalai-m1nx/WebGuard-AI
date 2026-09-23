from fastapi import APIRouter, HTTPException
from app.models.schemas import ScanRequest, ScanResponse, Indicator
from app.services.scanner import PassiveScanner
from app.ml.scorer import RiskScorer
import uuid
from datetime import datetime

router = APIRouter()

# In-memory store for demo purposes
mock_db = {}

@router.post("/scan", response_model=ScanResponse)
async def scan_url(request: ScanRequest):
    url = request.url
    if not url.startswith("http"):
        url = "http://" + url
        
    scan_data = await PassiveScanner.analyze_url(url)
    
    score, level, breakdown, summary, recs = RiskScorer.calculate_risk(scan_data)
    
    scan_id = str(uuid.uuid4())
    
    indicators = [
        Indicator(**ind) for ind in scan_data.get("indicators", [])
    ]
    
    if "error" in scan_data:
        indicators.append(Indicator(name="Network Analysis", status="HIGH RISK", reason=f"Could not reach website: {scan_data['error']}"))
    
    response = ScanResponse(
        id=scan_id,
        url=url,
        domain=scan_data.get("domain", ""),
        risk_score=score,
        risk_level=level,
        indicators=indicators,
        risk_breakdown=breakdown,
        summary=summary,
        recommendations=recs,
        scanned_at=datetime.utcnow()
    )
    
    mock_db[scan_id] = response
    return response

@router.get("/scan/{scan_id}", response_model=ScanResponse)
async def get_scan(scan_id: str):
    if scan_id not in mock_db:
        raise HTTPException(status_code=404, detail="Scan not found")
    return mock_db[scan_id]

@router.get("/history")
async def get_history():
    return list(mock_db.values())

@router.get("/dashboard")
async def get_dashboard():
    scans = list(mock_db.values())
    total = len(scans)
    high = sum(1 for s in scans if s.risk_level == "HIGH RISK")
    suspicious = sum(1 for s in scans if s.risk_level == "SUSPICIOUS")
    low = sum(1 for s in scans if s.risk_level == "LOW RISK")
    avg = sum(s.risk_score for s in scans) / total if total > 0 else 0
    return {
        "total_scans": total,
        "high_risk": high,
        "suspicious": suspicious,
        "low_risk": low,
        "average_score": round(avg)
    }
