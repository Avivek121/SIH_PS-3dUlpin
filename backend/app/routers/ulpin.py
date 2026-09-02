from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List, Optional
from app.database import get_db
from app.models.ulpin import Ulpin, Owner
from app.models.property import Parcel, Building, Floor, PropertyUnit
from app.schemas.property import ULPINResponse, ULPINGenerateRequest, ULPINSearchResult
from app.services.ulpin_service import extract_search_terms, generate_ulpin
from app.middleware.auth import get_current_user_optional

router = APIRouter(prefix="/ulpin", tags=["ulpin"])


@router.get("/search", response_model=List[ULPINSearchResult])
async def search_ulpin(q: str = Query(..., min_length=1), db: AsyncSession = Depends(get_db)):
    terms = extract_search_terms(q)
    query_str = q.strip()
    search_pattern = f"%{query_str}%"

    stmt = (
        select(Ulpin)
        .outerjoin(Owner, Ulpin.owner_id == Owner.id)
        .outerjoin(Parcel, Ulpin.parcel_id == Parcel.id)
        .outerjoin(Building, Ulpin.building_id == Building.id)
        .outerjoin(Floor, Ulpin.floor_id == Floor.id)
        .outerjoin(PropertyUnit, Ulpin.unit_id == PropertyUnit.id)
        .options(
            selectinload(Ulpin.owner),
            selectinload(Ulpin.parcel),
            selectinload(Ulpin.building),
            selectinload(Ulpin.floor),
            selectinload(Ulpin.unit),
        )
        .where(
            (Ulpin.ulpin_code.ilike(search_pattern))
            | (Owner.full_name.ilike(search_pattern))
            | (Parcel.parcel_id.ilike(search_pattern))
            | (Building.building_id.ilike(search_pattern))
            | (PropertyUnit.unit_number.ilike(search_pattern))
            | (Parcel.address.ilike(search_pattern))
        )
        .limit(50)
    )

    result = await db.execute(stmt)
    ulpins = result.scalars().all()

    results = []
    for u in ulpins:
        results.append(
            ULPINSearchResult(
                ulpin_code=u.ulpin_code,
                property_type=u.unit.property_type if u.unit else "Apartment Space",
                parcel_id=u.parcel.parcel_id if u.parcel else None,
                building_id=u.building.building_id if u.building else None,
                floor_number=u.floor.floor_number if u.floor else None,
                unit_number=u.unit.unit_number if u.unit else None,
                area=u.unit.area if u.unit else None,
                registration_status=u.registration_status,
                validation_status=u.validation_status,
                owner_name=u.owner.full_name if u.owner else "Registered Owner",
                address=u.parcel.address if u.parcel else None,
                coordinates={"latitude": 20.2961, "longitude": 85.8245},
                match_type="exact" if query_str.upper() in u.ulpin_code else "fuzzy",
                match_score=1.0 if query_str.upper() in u.ulpin_code else 0.85,
            )
        )
    return results


@router.get("/{ulpin_code}", response_model=ULPINResponse)
async def get_ulpin(ulpin_code: str, db: AsyncSession = Depends(get_db)):
    stmt = (
        select(Ulpin)
        .options(
            selectinload(Ulpin.owner),
            selectinload(Ulpin.parcel),
            selectinload(Ulpin.building),
            selectinload(Ulpin.floor),
            selectinload(Ulpin.unit),
        )
        .where(Ulpin.ulpin_code == ulpin_code)
    )

    result = await db.execute(stmt)
    ulpin = result.scalars().first()

    if not ulpin:
        # Check partial match
        stmt_partial = (
            select(Ulpin)
            .options(
                selectinload(Ulpin.owner),
                selectinload(Ulpin.parcel),
                selectinload(Ulpin.building),
                selectinload(Ulpin.floor),
                selectinload(Ulpin.unit),
            )
            .where(Ulpin.ulpin_code.ilike(f"%{ulpin_code}%"))
        )
        res_partial = await db.execute(stmt_partial)
        ulpin = res_partial.scalars().first()

    if not ulpin:
        raise HTTPException(status_code=404, detail=f"ULPIN '{ulpin_code}' not found")

    return ulpin


@router.post("/generate", response_model=ULPINResponse)
async def generate_new_ulpin(
    req: ULPINGenerateRequest,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user_optional),
):
    ulpin_code = generate_ulpin(
        req.state_code,
        req.city_code,
        req.ward_code,
        req.parcel_number,
        req.building_number,
        req.floor_number,
        req.unit_number,
    )

    # Check if already exists
    stmt = (
        select(Ulpin)
        .options(
            selectinload(Ulpin.owner),
            selectinload(Ulpin.parcel),
            selectinload(Ulpin.building),
            selectinload(Ulpin.floor),
            selectinload(Ulpin.unit),
        )
        .where(Ulpin.ulpin_code == ulpin_code)
    )
    res = await db.execute(stmt)
    existing = res.scalars().first()
    if existing:
        return existing

    # Find parcel
    parcel_res = await db.execute(select(Parcel).limit(1))
    parcel = parcel_res.scalars().first()
    
    # Find building
    bldg_res = await db.execute(select(Building).limit(1))
    building = bldg_res.scalars().first()

    # Find owner
    owner_res = await db.execute(select(Owner).limit(1))
    owner = owner_res.scalars().first()

    new_ulpin = Ulpin(
        ulpin_code=ulpin_code,
        state_code=req.state_code,
        city_code=req.city_code,
        ward_code=req.ward_code,
        parcel_id=parcel.id if parcel else None,
        building_id=building.id if building else None,
        owner_id=owner.id if owner else None,
        registration_status="registered",
        validation_status="verified",
    )
    db.add(new_ulpin)
    await db.commit()
    await db.refresh(new_ulpin)

    # Reload with relations
    res_final = await db.execute(stmt)
    final_ulpin = res_final.scalars().first() or new_ulpin

    return final_ulpin
