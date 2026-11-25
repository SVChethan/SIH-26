# CIVIC-EYE AI - Python FastAPI Engine Service Entry Point

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

# Change from 'from services.cnn_vision_engine import CNNVisionEngine' to:
from cnn_vision_engine import CNNVisionEngine
from nlp_clause_auditor import NLPClauseAuditor
from pandas_etl_scraper import PandasETLScraper

app = FastAPI(
    title="CIVIC-EYE AI Python Engine API",
    description="FastAPI Service for ResNet-152 CNN Vision Analysis, Llama-3 NLP Contract Clause Auditing, and Pandas BeautifulSoup Scraper ETL",
    version="4.0.0"
)

# Enable CORS for React Frontend and Node Backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Service Instances
cnn_engine = CNNVisionEngine()
nlp_auditor = NLPClauseAuditor()
etl_scraper = PandasETLScraper()

# Request Models
class ScanRequest(BaseModel):
    photo_id: str
    reported_progress: float

class ClauseAuditRequest(BaseModel):
    project_id: str
    contract_text: Optional[str] = "Default Tender Document"

@app.get("/")
def read_root():
    return {
        "status": "ONLINE",
        "service": "CIVIC-EYE AI Python Engine (FastAPI)",
        "modules": ["ResNet-152 CNN Vision", "Llama-3 NLP Clause Auditor", "Pandas ETL Scraper"]
    }

@app.post("/ai/scan-image")
def scan_site_image(req: ScanRequest):
    try:
        result = cnn_engine.analyze_site_photo(req.photo_id, req.reported_progress)
        return { "success": True, "data": result }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ai/audit-clause")
def audit_contract_clause(req: ClauseAuditRequest):
    try:
        result = nlp_auditor.audit_contract_clauses(req.project_id, req.contract_text)
        return { "success": True, "data": result }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/ai/anomalies-feed")
def get_anomalies_feed():
    try:
        result = etl_scraper.run_anomaly_etl_pipeline()
        return { "success": True, "data": result }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
