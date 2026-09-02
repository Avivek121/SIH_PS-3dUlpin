from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from typing import List, Optional
from app.database import get_db
from app.models.ulpin import Ulpin
from app.models.property import Parcel, Building, PropertyUnit
from app.models.validation import FlaggedProperty, ChangeDetection
from app.models.notification import Notification
from app.schemas.property import DashboardStats, NotificationResponse

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/statistics", response_model=DashboardStats)
async def get_statistics(db: AsyncSession = Depends(get_db)):
    total_ulpins = await db.scalar(select(func.count(Ulpin.id))) or 0
    registered = await db.scalar(select(func.count(Ulpin.id)).where(Ulpin.registration_status == 'registered')) or 0
    unregistered = await db.scalar(select(func.count(Ulpin.id)).where(Ulpin.registration_status != 'registered')) or 0
    flagged = await db.scalar(select(func.count(FlaggedProperty.id)).where(FlaggedProperty.resolved == False)) or 0
    pending_validation = await db.scalar(select(func.count(Ulpin.id)).where(Ulpin.validation_status == 'pending')) or 0
    new_construction = await db.scalar(select(func.count(ChangeDetection.id)).where(ChangeDetection.change_type == 'new_construction')) or 0
    ownership_changes = await db.scalar(select(func.count(ChangeDetection.id)).where(ChangeDetection.change_type == 'ownership_change')) or 0
    total_parcels = await db.scalar(select(func.count(Parcel.id))) or 0
    total_buildings = await db.scalar(select(func.count(Building.id))) or 0
    total_units = await db.scalar(select(func.count(PropertyUnit.id))) or 0

    return DashboardStats(
        total_ulpins=total_ulpins,
        registered=registered,
        unregistered=unregistered,
        flagged=flagged,
        total_parcels=total_parcels,
        total_buildings=total_buildings,
        total_units=total_units,
        pending_validation=pending_validation,
        new_construction=new_construction,
        ownership_changes=ownership_changes
    )

@router.get("/notifications", response_model=List[NotificationResponse])
async def list_notifications(db: AsyncSession = Depends(get_db)):
    stmt = select(Notification).order_by(Notification.created_at.desc()).limit(50)
    result = await db.execute(stmt)
    return result.scalars().all()

@router.post("/notifications/{id}/read", response_model=NotificationResponse)
async def mark_notification_read(id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(Notification).where(Notification.id == id)
    result = await db.execute(stmt)
    notification = result.scalars().first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
        
    notification.is_read = True
    await db.commit()
    await db.refresh(notification)
    return notification
