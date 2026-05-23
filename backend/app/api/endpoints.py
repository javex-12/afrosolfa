from fastapi import APIRouter, UploadFile, File, HTTPException
import shutil
import os
import uuid
from app.services.analyzer import AnalyzerService

router = APIRouter()

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@router.post("/analyze")
async def analyze_audio(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(('.mp3', '.wav', '.m4a')):
        raise HTTPException(status_code=400, detail="Invalid file type. Only mp3, wav, and m4a are supported.")
    
    file_id = str(uuid.uuid4())
    ext = os.path.splitext(file.filename)[1]
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}{ext}")
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        results = await AnalyzerService.analyze_audio(file_path)
        return {
            "id": file_id,
            "filename": file.filename,
            "analysis": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
    finally:
        # We keep the file for now, but in prod we might clean up or move to S3
        pass

@router.get("/config")
async def get_config():
    return {"supported_languages": ["Yoruba", "English", "Pidgin"], "version": "0.1.0"}
