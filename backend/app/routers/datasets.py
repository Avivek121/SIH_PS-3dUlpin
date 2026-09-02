from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from app.database import get_db
from app.models.dataset import Dataset, ProcessingJob
from app.schemas.dataset import DatasetResponse, DatasetCreate, ProcessingJobResponse
from app.middleware.auth import get_current_user_optional
from app.config import settings

router = APIRouter(prefix="/datasets", tags=["datasets"])

@router.get("", response_model=List[DatasetResponse])
async def list_datasets(db: AsyncSession = Depends(get_db)):
    stmt = select(Dataset).order_by(Dataset.created_at.desc())
    result = await db.execute(stmt)
    return result.scalars().all()

@router.post("/upload", response_model=DatasetResponse)
async def upload_dataset(name: str, dataset_type: str, file: UploadFile = File(...), db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user_optional)):
    new_dataset = Dataset(
        name=name,
        dataset_type=dataset_type,
        file_path=f"/uploads/{file.filename}",
        file_size=0,
        format=file.content_type,
        status="uploaded"
    )
    db.add(new_dataset)
    await db.commit()
    await db.refresh(new_dataset)
    return new_dataset

@router.get("/{id}/status", response_model=ProcessingJobResponse)
async def get_dataset_status(id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(ProcessingJob).where(ProcessingJob.dataset_id == id).order_by(ProcessingJob.created_at.desc())
    result = await db.execute(stmt)
    job = result.scalars().first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.post("/{id}/process", response_model=ProcessingJobResponse)
async def process_dataset(id: str, db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user_optional)):
    stmt = select(Dataset).where(Dataset.id == id)
    result = await db.execute(stmt)
    dataset = result.scalars().first()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
        
    job = ProcessingJob(
        dataset_id=id,
        job_type="processing",
        status="completed",
        progress=100
    )
    db.add(job)
    await db.commit()
    await db.refresh(job)
    return job
