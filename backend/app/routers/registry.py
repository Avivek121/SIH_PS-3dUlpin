from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from app.database import get_db
from app.models.registry import RegistryHistory
from app.schemas.property import RegistryHistoryResponse
from pydantic import BaseModel
from typing import Optional
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/registry", tags=["registry"])

class RegistryCreate(BaseModel):
    ulpin_id: str
    action: str
    description: str
    old_value: Optional[str] = None
    new_value: Optional[str] = None

@router.get("/history", response_model=List[RegistryHistoryResponse])
@router.get("", response_model=List[RegistryHistoryResponse])
async def list_registry_history(db: AsyncSession = Depends(get_db)):
    stmt = select(RegistryHistory).order_by(RegistryHistory.created_at.desc()).limit(100)
    result = await db.execute(stmt)
    return result.scalars().all()

@router.get("/{ulpin_id}/history", response_model=List[RegistryHistoryResponse])
async def get_registry_history(ulpin_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(RegistryHistory).where(RegistryHistory.ulpin_id == ulpin_id).order_by(RegistryHistory.created_at.desc())
    result = await db.execute(stmt)
    return result.scalars().all()

@router.post("", response_model=RegistryHistoryResponse)
async def create_registry_entry(req: RegistryCreate, db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    new_entry = RegistryHistory(
        ulpin_id=req.ulpin_id,
        action=req.action,
        description=req.description,
        old_value=req.old_value,
        new_value=req.new_value,
        status="completed",
        performed_by=current_user.id
    )
    db.add(new_entry)
    await db.commit()
    await db.refresh(new_entry)
    return new_entry
