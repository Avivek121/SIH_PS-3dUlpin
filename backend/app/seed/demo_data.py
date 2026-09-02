"""Seed demo data for the 3D ULPIN application.

Creates realistic demo data for Bhubaneswar, Odisha including:
- 5 parcels in Ward 12
- 8 buildings across parcels
- Multiple floors and units per building
- ULPIN codes for all properties
- Demo owners, registry history, validation records
- Demo notifications
"""
import uuid
import json
import asyncio
from datetime import datetime, date, timedelta, timezone
from decimal import Decimal
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text, select, func
from geoalchemy2.elements import WKTElement

from app.database import AsyncSessionLocal, engine, Base
from app.models.user import User
from app.models.property import Parcel, Building, Floor, PropertyUnit
from app.models.ulpin import Ulpin as ULPIN, Owner
from app.models.registry import RegistryHistory, OwnershipHistory
from app.models.validation import ValidationRecord, ChangeDetection, FlaggedProperty
from app.models.dataset import Dataset, DatasetProcessingJob, GisLayer as GISLayer, PointCloud
from app.models.notification import Notification, AuditLog
from app.services.auth_service import hash_password


# Bhubaneswar coordinates (center: 20.2961° N, 85.8245° E)
BASE_LAT = 20.2961
BASE_LON = 85.8245


def make_parcel_geometry(idx: int) -> str:
    """Create a parcel polygon WKT near Bhubaneswar."""
    offsets = [
        (0.0, 0.0), (0.002, 0.001), (0.004, -0.001),
        (-0.001, 0.003), (0.003, 0.004),
    ]
    lat = BASE_LAT + offsets[idx % len(offsets)][0]
    lon = BASE_LON + offsets[idx % len(offsets)][1]
    size = 0.0008

    return (
        f"POLYGON(("
        f"{lon} {lat}, "
        f"{lon + size} {lat}, "
        f"{lon + size} {lat + size}, "
        f"{lon} {lat + size}, "
        f"{lon} {lat}"
        f"))"
    )


def make_building_geometry(lat: float, lon: float, size: float = 0.0003) -> str:
    """Create a building footprint polygon WKT."""
    return (
        f"POLYGON(("
        f"{lon} {lat}, "
        f"{lon + size} {lat}, "
        f"{lon + size} {lat + size}, "
        f"{lon} {lat + size}, "
        f"{lon} {lat}"
        f"))"
    )


def make_point(lat: float, lon: float) -> str:
    return f"POINT({lon} {lat})"


async def seed_demo_data():
    """Main seeding function."""
    async with AsyncSessionLocal() as db:
        # Check if already seeded
        result = await db.execute(select(func.count()).select_from(User))
        count = result.scalar()
        if count and count > 0:
            print("Demo data already exists, skipping seed.")
            return

        print("Seeding demo data...")

        # === DEMO USERS ===
        admin_id = uuid.uuid4()
        demo_user_id = uuid.uuid4()
        authority_id = uuid.uuid4()

        users = [
            User(
                id=admin_id,
                email="admin@ulpin3d.dev",
                password_hash=hash_password("admin123"),
                full_name="System Administrator",
                role="admin",
                is_demo=True,
                avatar_url="https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
            ),
            User(
                id=demo_user_id,
                email="demo@ulpin3d.dev",
                password_hash=hash_password("demo123"),
                full_name="Demo User",
                role="user",
                phone="+919876543210",
                phone_verified=True,
                is_demo=True,
                avatar_url="https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
            ),
            User(
                id=authority_id,
                email="authority@ulpin3d.dev",
                password_hash=hash_password("authority123"),
                full_name="Land Authority Officer",
                role="authority",
                is_demo=True,
                avatar_url="https://api.dicebear.com/7.x/avataaars/svg?seed=authority",
            ),
        ]
        db.add_all(users)
        await db.flush()

        # === DEMO OWNERS ===
        owners_data = [
            ("Rajesh Kumar Patel", "rajesh.patel@demo.com", "+919876543001", "individual"),
            ("Sunita Sharma", "sunita.sharma@demo.com", "+919876543002", "individual"),
            ("Priya Mohanty", "priya.mohanty@demo.com", "+919876543003", "individual"),
            ("Vikram Singh", "vikram.singh@demo.com", "+919876543004", "individual"),
            ("Ananya Das", "ananya.das@demo.com", "+919876543005", "individual"),
            ("Odisha Housing Board", "ohb@demo.com", "+919876543006", "organization"),
            ("Meera Nayak", "meera.nayak@demo.com", "+919876543007", "individual"),
            ("Sanjay Mishra", "sanjay.mishra@demo.com", "+919876543008", "individual"),
            ("Kavita Rath", "kavita.rath@demo.com", "+919876543009", "individual"),
            ("Amit Pradhan", "amit.pradhan@demo.com", "+919876543010", "individual"),
            ("Municipal Corporation", "bmc@demo.com", "+919876543011", "government"),
            ("Deepak Behera", "deepak.behera@demo.com", "+919876543012", "individual"),
        ]
        owners = []
        for name, email, phone, otype in owners_data:
            owner = Owner(
                id=uuid.uuid4(),
                full_name=name,
                email=email,
                phone=phone,
                owner_type=otype,
            )
            owners.append(owner)
            db.add(owner)
        await db.flush()

        # === PARCELS ===
        parcels_data = [
            ("P001", "OD", "BBSR", "W12", 2500.0, "Plot 12, Saheed Nagar", "residential"),
            ("P002", "OD", "BBSR", "W12", 3200.0, "Plot 45, Jaydev Vihar", "mixed"),
            ("P003", "OD", "BBSR", "W12", 1800.0, "Plot 8, Nayapalli", "residential"),
            ("P004", "OD", "BBSR", "W12", 5000.0, "Plot 22, Chandrasekharpur", "commercial"),
            ("P005", "OD", "BBSR", "W12", 4200.0, "Plot 67, Patia", "residential"),
        ]
        parcels = []
        for i, (pid, state, city, ward, area, addr, use) in enumerate(parcels_data):
            geom_wkt = make_parcel_geometry(i)
            parcel = Parcel(
                id=uuid.uuid4(),
                parcel_id=pid,
                state_code=state,
                city_code=city,
                ward_code=ward,
                area=Decimal(str(area)),
                address=addr,
                land_use=use,
                geometry=WKTElement(geom_wkt, srid=4326),
            )
            parcels.append(parcel)
            db.add(parcel)
        await db.flush()

        # === BUILDINGS ===
        buildings_config = [
            # (building_id, parcel_idx, height, floors, type, year, lat_offset, lon_offset)
            ("B01", 0, 12.0, 4, "residential", 2018, 0.0001, 0.0001),
            ("B02", 0, 18.5, 6, "residential", 2020, 0.0001, 0.0005),
            ("B03", 1, 24.0, 8, "mixed", 2019, 0.0012, 0.0003),
            ("B04", 1, 15.0, 5, "commercial", 2021, 0.0015, 0.0008),
            ("B05", 2, 9.0, 3, "residential", 2015, -0.0005, 0.0015),
            ("B06", 3, 30.0, 10, "commercial", 2022, 0.0018, -0.0005),
            ("B07", 3, 21.0, 7, "mixed", 2017, 0.0022, 0.0000),
            ("B08", 4, 27.0, 9, "residential", 2023, 0.0025, 0.0020),
        ]

        buildings = []
        for bid, pidx, height, floors, btype, year, lat_off, lon_off in buildings_config:
            b_lat = BASE_LAT + lat_off
            b_lon = BASE_LON + lon_off
            building = Building(
                id=uuid.uuid4(),
                building_id=bid,
                parcel_id=parcels[pidx].id,
                geometry=WKTElement(make_building_geometry(b_lat, b_lon), srid=4326),
                centroid=WKTElement(make_point(b_lat + 0.00015, b_lon + 0.00015), srid=4326),
                height=Decimal(str(height)),
                floor_count=floors,
                building_type=btype,
                construction_year=year,
                status="active",
            )
            buildings.append(building)
            db.add(building)
        await db.flush()

        # === FLOORS ===
        all_floors = []
        floor_plan_info = []
        for bidx, building in enumerate(buildings):
            for floor_num in range(building.floor_count):
                floor_label = "Ground Floor" if floor_num == 0 else f"Floor {floor_num}"
                units_on_floor = 4 if building.building_type == "residential" else 3

                floor = Floor(
                    id=uuid.uuid4(),
                    building_id=building.id,
                    floor_number=floor_num,
                    floor_label=floor_label,
                    height=Decimal("3.0"),
                    area=Decimal(str(150 * units_on_floor)),
                    unit_count=units_on_floor,
                )
                all_floors.append(floor)
                db.add(floor)
                floor_plan_info.append((building, floor, floor_num, units_on_floor, bidx))
        await db.flush()

        # === PROPERTY UNITS ===
        unit_types = ["apartment", "apartment", "apartment", "shop", "office"]
        all_units = []
        unit_plan_info = []
        for building, floor, floor_num, units_on_floor, bidx in floor_plan_info:
            for unit_num in range(1, units_on_floor + 1):
                unit_number = f"{floor_num}{unit_num:02d}" if floor_num > 0 else f"G{unit_num:02d}"
                unit_id_str = f"U{unit_num:02d}"
                ptype = unit_types[unit_num % len(unit_types)]

                unit = PropertyUnit(
                    id=uuid.uuid4(),
                    unit_id=unit_id_str,
                    floor_id=floor.id,
                    building_id=building.id,
                    unit_number=unit_number,
                    property_type=ptype,
                    area=Decimal(str(80 + (unit_num * 15))),
                    status="active",
                )
                all_units.append(unit)
                db.add(unit)
                unit_plan_info.append((building, floor, unit, floor_num, unit_id_str, bidx))
        await db.flush()

        # === ULPINS ===
        all_ulpins = []
        owner_idx = 0
        for building, floor, unit, floor_num, unit_id_str, bidx in unit_plan_info:
            parcel = parcels[bidx % len(parcels)]
            ulpin_code = f"OD-BBSR-W12-{parcel.parcel_id}-{building.building_id}-F{floor_num:02d}-{unit_id_str}"

            owner = owners[owner_idx % len(owners)]
            reg_status = "registered" if (owner_idx % 3 != 2) else "pending"
            val_status = ["verified", "verified", "flagged", "pending"][owner_idx % 4]

            ulpin = ULPIN(
                id=uuid.uuid4(),
                ulpin_code=ulpin_code,
                state_code="OD",
                city_code="BBSR",
                ward_code="W12",
                parcel_id=parcel.id,
                building_id=building.id,
                floor_id=floor.id,
                unit_id=unit.id,
                owner_id=owner.id,
                registration_status=reg_status,
                validation_status=val_status,
            )
            all_ulpins.append(ulpin)
            db.add(ulpin)
            owner_idx += 1
        await db.flush()

        # === REGISTRY HISTORY ===
        history_actions = [
            ("created", "ULPIN record created", "completed"),
            ("registered", "Property registered with authority", "completed"),
            ("validated", "Spatial validation completed", "completed"),
            ("updated", "Ownership information updated", "completed"),
            ("verified", "Property verification completed", "completed"),
        ]

        for i, ulpin in enumerate(all_ulpins[:20]):
            base_date = datetime(2024, 1, 1, tzinfo=timezone.utc) + timedelta(days=i * 15)
            for j, (action, desc, status) in enumerate(history_actions):
                history = RegistryHistory(
                    id=uuid.uuid4(),
                    ulpin_id=ulpin.id,
                    action=action,
                    description=desc,
                    status=status,
                    performed_by=admin_id,
                    created_at=base_date + timedelta(days=j * 7),
                )
                db.add(history)
        await db.flush()

        # === VALIDATION RECORDS ===
        validations_data = [
            ("height", "18.2m", "19.1m", "0.9m", Decimal("4.9"), "flagged"),
            ("area", "125 sqm", "124.8 sqm", "0.2 sqm", Decimal("0.16"), "verified"),
            ("floor_count", "6", "6", "0", Decimal("0"), "verified"),
            ("boundary", "Match", "Match", "0m", Decimal("0"), "verified"),
            ("height", "24.0m", "26.5m", "2.5m", Decimal("10.4"), "flagged"),
            ("coordinates", "20.2961, 85.8245", "20.2962, 85.8244", "1.2m", Decimal("0.001"), "verified"),
        ]

        for i, (vtype, official, detected, diff, pct, status) in enumerate(validations_data):
            if i < len(all_ulpins):
                vr = ValidationRecord(
                    id=uuid.uuid4(),
                    ulpin_id=all_ulpins[i].id,
                    validation_type=vtype,
                    official_value=official,
                    detected_value=detected,
                    difference=diff,
                    difference_percentage=pct,
                    status=status,
                    validated_by=authority_id,
                    validated_at=datetime.now(timezone.utc),
                )
                db.add(vr)
        await db.flush()

        # === CHANGE DETECTIONS ===
        changes_data = [
            ("new_construction", "New building detected in parcel P003", Decimal("0.85"), "detected"),
            ("floor_addition", "Additional floor detected on building B03", Decimal("0.92"), "confirmed"),
            ("modification", "Building facade modification detected on B01", Decimal("0.78"), "detected"),
            ("boundary_change", "Parcel boundary change detected for P004", Decimal("0.88"), "detected"),
        ]

        for i, (ctype, desc, confidence, status) in enumerate(changes_data):
            cd = ChangeDetection(
                id=uuid.uuid4(),
                ulpin_id=all_ulpins[i].id if i < len(all_ulpins) else None,
                parcel_id=parcels[i % len(parcels)].id,
                building_id=buildings[i % len(buildings)].id,
                change_type=ctype,
                description=desc,
                detected_at=datetime.now(timezone.utc) - timedelta(days=i * 10),
                confidence=confidence,
                status=status,
            )
            db.add(cd)
        await db.flush()

        # === FLAGGED PROPERTIES ===
        flags_data = [
            ("height_violation", "high", "Building exceeds permitted height by 2.5m"),
            ("encroachment", "medium", "Building extends 1.2m beyond parcel boundary"),
            ("unauthorized_modification", "low", "Minor facade modification without permit"),
            ("illegal_construction", "critical", "Unauthorized construction on restricted land"),
        ]

        for i, (ftype, severity, desc) in enumerate(flags_data):
            if i < len(all_ulpins):
                fp = FlaggedProperty(
                    id=uuid.uuid4(),
                    ulpin_id=all_ulpins[i].id,
                    flag_type=ftype,
                    severity=severity,
                    description=desc,
                    reported_by=authority_id,
                )
                db.add(fp)
        await db.flush()

        # === DEMO NOTIFICATIONS ===
        notif_data = [
            ("New Property Detected", "A new building has been detected via drone imagery in Ward 12", "info", "property"),
            ("ULPIN Generated", "ULPIN OD-BBSR-W12-P001-B03-F04-U02 has been successfully generated", "success", "ulpin"),
            ("Validation Failed", "Building B03 height validation shows 10.4% deviation", "warning", "validation"),
            ("Ownership Updated", "Ownership of unit 402 transferred to Priya Mohanty", "info", "property"),
            ("New Construction", "New construction detected in parcel P003 via change detection", "warning", "property"),
            ("Verification Complete", "Spatial verification of Ward 12 properties completed", "success", "system"),
        ]

        for title, msg, ntype, cat in notif_data:
            notification = Notification(
                id=uuid.uuid4(),
                user_id=demo_user_id,
                title=title,
                message=msg,
                notification_type=ntype,
                category=cat,
            )
            db.add(notification)
        await db.flush()

        # === DEMO DATASETS ===
        datasets_data = [
            ("Building Facade Dataset", "building_images", "50 terrestrial images for facade 3D model", 50, "jpg", "ready"),
            ("Aerial Survey 2024", "aerial_images", "444 aerial images with 18 GCPs", 444, "tif", "ready"),
            ("LiDAR Point Cloud", "aerial_lidar", "148 million points with trajectory", 1, "laz", "ready"),
            ("Terrestrial Scans", "terrestrial_lidar", "9 E57 scan files", 9, "e57", "processing"),
        ]

        for name, dtype, desc, fcount, fmt, status in datasets_data:
            dataset = Dataset(
                id=uuid.uuid4(),
                name=name,
                dataset_type=dtype,
                description=desc,
                file_count=fcount,
                format=fmt,
                status=status,
                uploaded_by=admin_id,
                metadata_json={
                    "source": "Agisoft Metashape Sample Data",
                    "url": "https://www.agisoft.com/downloads/sample-data/",
                    "demo": True,
                },
            )
            db.add(dataset)
        await db.flush()

        # === GIS LAYERS ===
        layers_data = [
            ("Land Parcels", "parcels", "geojson", "/static/geojson/parcels.geojson"),
            ("Building Footprints", "buildings", "geojson", "/static/geojson/buildings.geojson"),
            ("Roads Network", "roads", "geojson", "/static/geojson/roads.geojson"),
            ("Terrain Model", "terrain", "geojson", "/static/geojson/terrain.geojson"),
        ]

        for name, ltype, fmt, path in layers_data:
            layer = GISLayer(
                id=uuid.uuid4(),
                name=name,
                layer_type=ltype,
                format=fmt,
                file_path=path,
            )
            db.add(layer)

        await db.commit()
        print(f"✅ Demo data seeded successfully:")
        print(f"   Users: {len(users)}")
        print(f"   Owners: {len(owners)}")
        print(f"   Parcels: {len(parcels)}")
        print(f"   Buildings: {len(buildings)}")
        print(f"   Floors: {len(all_floors)}")
        print(f"   Units: {len(all_units)}")
        print(f"   ULPINs: {len(all_ulpins)}")


async def create_tables():
    """Create all database tables."""
    async with engine.begin() as conn:
        await conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis"))
        await conn.run_sync(Base.metadata.create_all)
    print("✅ Database tables created")


async def init_db():
    """Initialize database and seed demo data."""
    await create_tables()
    await seed_demo_data()


if __name__ == "__main__":
    asyncio.run(init_db())
