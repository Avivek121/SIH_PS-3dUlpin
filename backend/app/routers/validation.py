from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
from app.database import get_db
from app.models.validation import ValidationRecord, FlaggedProperty, ChangeDetection
from app.schemas.property import ValidationRecordResponse, ValidationRequest, FlaggedPropertyResponse, ChangeDetectionResponse
from app.middleware.auth import get_current_user_optional

router = APIRouter(prefix="/validation", tags=["validation"])

@router.get("", response_model=List[ValidationRecordResponse])
@router.get("/records", response_model=List[ValidationRecordResponse])
async def list_validations(db: AsyncSession = Depends(get_db)):
    stmt = select(ValidationRecord).order_by(ValidationRecord.created_at.desc()).limit(100)
    result = await db.execute(stmt)
    return result.scalars().all()

@router.post("", response_model=ValidationRecordResponse)
async def create_validation(req: ValidationRequest, db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user_optional)):
    new_record = ValidationRecord(
        ulpin_id=req.ulpin_id,
        validation_type=req.validation_type,
        official_value=req.official_value,
        detected_value=req.detected_value,
        status="pending"
    )
    db.add(new_record)
    await db.commit()
    await db.refresh(new_record)
    return new_record

@router.get("/flagged", response_model=List[FlaggedPropertyResponse])
async def list_flagged(db: AsyncSession = Depends(get_db)):
    stmt = select(FlaggedProperty)
    result = await db.execute(stmt)
    return result.scalars().all()

@router.post("/flagged/{id}/resolve")
async def resolve_flagged(id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(FlaggedProperty).where(FlaggedProperty.id == id)
    result = await db.execute(stmt)
    item = result.scalars().first()
    if item:
        item.resolved = True
        await db.commit()
    return {"status": "resolved", "id": id}

@router.get("/changes", response_model=List[ChangeDetectionResponse])
async def list_changes(db: AsyncSession = Depends(get_db)):
    stmt = select(ChangeDetection).order_by(ChangeDetection.detected_at.desc()).limit(100)
    result = await db.execute(stmt)
    return result.scalars().all()

@router.post("/changes/{id}/status")
async def update_change_status(id: str, status: str, db: AsyncSession = Depends(get_db)):
    stmt = select(ChangeDetection).where(ChangeDetection.id == id)
    result = await db.execute(stmt)
    item = result.scalars().first()
    if item:
        item.status = status
        await db.commit()
    return {"status": "updated", "id": id, "new_status": status}
