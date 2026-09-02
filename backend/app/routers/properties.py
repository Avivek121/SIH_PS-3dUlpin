from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List, Optional
from app.database import get_db
from app.models.property import Parcel, Building, Floor, PropertyUnit
from app.schemas.property import ParcelResponse, BuildingResponse, FloorResponse, PropertyUnitResponse
from app.middleware.auth import get_current_user

router = APIRouter(tags=["properties"])

@router.get("/properties", response_model=List[ParcelResponse])
@router.get("/properties/parcels", response_model=List[ParcelResponse])
async def list_properties(skip: int = 0, limit: int = 50, db: AsyncSession = Depends(get_db)):
    stmt = select(Parcel).offset(skip).limit(limit)
    result = await db.execute(stmt)
    return result.scalars().all()

@router.get("/properties/buildings", response_model=List[BuildingResponse])
async def list_buildings(skip: int = 0, limit: int = 50, db: AsyncSession = Depends(get_db)):
    stmt = select(Building).offset(skip).limit(limit)
    result = await db.execute(stmt)
    return result.scalars().all()

@router.get("/properties/{id}", response_model=ParcelResponse)
async def get_property(id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(Parcel).where(Parcel.id == id)
    result = await db.execute(stmt)
    parcel = result.scalars().first()
    if not parcel:
        raise HTTPException(status_code=404, detail="Property not found")
    return parcel

@router.get("/buildings/{id}", response_model=BuildingResponse)
async def get_building(id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(Building).where(Building.id == id)
    result = await db.execute(stmt)
    building = result.scalars().first()
    if not building:
        raise HTTPException(status_code=404, detail="Building not found")
    return building

@router.get("/buildings/{id}/floors", response_model=List[FloorResponse])
async def get_building_floors(id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(Floor).options(selectinload(Floor.units)).where(Floor.building_id == id)
    result = await db.execute(stmt)
    return result.scalars().all()
