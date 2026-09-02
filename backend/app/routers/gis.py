from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Dict, Any
from app.database import get_db
from app.models.dataset import GISLayer
from app.models.property import Building, Parcel
from app.schemas.dataset import GISLayerResponse
from geoalchemy2.functions import ST_AsGeoJSON
import json

router = APIRouter(prefix="/gis", tags=["gis"])

@router.get("/layers", response_model=List[GISLayerResponse])
async def list_layers(db: AsyncSession = Depends(get_db)):
    stmt = select(GISLayer).where(GISLayer.is_active == True)
    result = await db.execute(stmt)
    return result.scalars().all()

@router.get("/buildings")
async def get_buildings_geojson(db: AsyncSession = Depends(get_db)):
    stmt = select(Building.id, Building.building_id, ST_AsGeoJSON(Building.geometry).label("geom"))
    result = await db.execute(stmt)
    
    features = []
    for row in result.all():
        if row.geom:
            features.append({
                "type": "Feature",
                "geometry": json.loads(row.geom),
                "properties": {
                    "id": str(row.id),
                    "building_id": row.building_id
                }
            })
    return {"type": "FeatureCollection", "features": features}

@router.get("/parcels")
async def get_parcels_geojson(db: AsyncSession = Depends(get_db)):
    stmt = select(Parcel.id, Parcel.parcel_id, ST_AsGeoJSON(Parcel.geometry).label("geom"))
    result = await db.execute(stmt)
    
    features = []
    for row in result.all():
        if row.geom:
            features.append({
                "type": "Feature",
                "geometry": json.loads(row.geom),
                "properties": {
                    "id": str(row.id),
                    "parcel_id": row.parcel_id
                }
            })
    return {"type": "FeatureCollection", "features": features}

@router.get("/demo-data")
async def get_demo_data(db: AsyncSession = Depends(get_db)):
    buildings = await get_buildings_geojson(db)
    parcels = await get_parcels_geojson(db)
    return {
        "buildings": buildings,
        "parcels": parcels
    }
