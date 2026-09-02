from pydantic import BaseModel, ConfigDict, field_validator
from typing import Optional, List, Any
from datetime import datetime
from decimal import Decimal


# --- Base Response with ID serializer ---
class BaseIDModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: Any

    @field_validator("id", mode="before", check_fields=False)
    @classmethod
    def serialize_id(cls, v):
        return str(v) if v is not None else v


# --- Parcel Schemas ---

class ParcelResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: Any
    parcel_id: str
    state_code: str
    city_code: str
    ward_code: str
    area: Optional[Decimal] = None
    address: Optional[str] = None
    land_use: Optional[str] = None
    status: str = "active"
    geometry_geojson: Optional[dict] = None

    @field_validator("id", mode="before")
    @classmethod
    def serialize_id(cls, v):
        return str(v) if v is not None else v


class ParcelCreate(BaseModel):
    parcel_id: str
    state_code: str
    city_code: str
    ward_code: str
    area: Optional[Decimal] = None
    address: Optional[str] = None
    land_use: Optional[str] = None
    geometry_wkt: Optional[str] = None


# --- Building Schemas ---

class BuildingResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: Any
    building_id: str
    parcel_id: Optional[Any] = None
    height: Optional[Decimal] = None
    floor_count: int = 0
    building_type: Optional[str] = None
    construction_year: Optional[int] = None
    status: str = "active"
    model_url: Optional[str] = None
    centroid_geojson: Optional[dict] = None
    geometry_geojson: Optional[dict] = None

    @field_validator("id", "parcel_id", mode="before")
    @classmethod
    def serialize_ids(cls, v):
        return str(v) if v is not None else v


class BuildingCreate(BaseModel):
    building_id: str
    parcel_id: str
    height: Optional[Decimal] = None
    floor_count: int = 1
    building_type: str = "residential"
    geometry_wkt: Optional[str] = None


# --- Property Unit Schemas ---

class PropertyUnitResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: Any
    unit_id: str
    unit_number: str
    property_type: str
    area: Optional[Decimal] = None
    floor_id: Optional[Any] = None
    building_id: Optional[Any] = None
    status: str = "active"

    @field_validator("id", "floor_id", "building_id", mode="before")
    @classmethod
    def serialize_ids(cls, v):
        return str(v) if v is not None else v


# --- Floor Schemas ---

class FloorResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: Any
    building_id: Any
    floor_number: int
    floor_label: str
    height: Optional[Decimal] = None
    area: Optional[Decimal] = None
    unit_count: int = 0
    units: List[PropertyUnitResponse] = []

    @field_validator("id", "building_id", mode="before")
    @classmethod
    def serialize_ids(cls, v):
        return str(v) if v is not None else v


# --- Owner Schemas ---

class OwnerResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: Any
    full_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    owner_type: str = "individual"

    @field_validator("id", mode="before")
    @classmethod
    def serialize_id(cls, v):
        return str(v) if v is not None else v


# --- ULPIN Schemas ---

class ULPINResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: Any
    ulpin_code: str
    state_code: str
    city_code: str
    ward_code: str
    parcel_id: Optional[Any] = None
    building_id: Optional[Any] = None
    floor_id: Optional[Any] = None
    unit_id: Optional[Any] = None
    owner_id: Optional[Any] = None
    registration_status: str = "pending"
    validation_status: str = "pending"
    is_active: bool = True

    parcel: Optional[ParcelResponse] = None
    building: Optional[BuildingResponse] = None
    floor: Optional[FloorResponse] = None
    unit: Optional[PropertyUnitResponse] = None
    owner: Optional[OwnerResponse] = None

    @field_validator("id", "parcel_id", "building_id", "floor_id", "unit_id", "owner_id", mode="before")
    @classmethod
    def serialize_ids(cls, v):
        return str(v) if v is not None else v


class ULPINGenerateRequest(BaseModel):
    state_code: str = "OD"
    city_code: str = "BBSR"
    ward_code: str = "W12"
    parcel_number: Any = "P001"
    building_number: Optional[Any] = "B03"
    floor_number: Optional[Any] = "F04"
    unit_number: Optional[Any] = "U02"
    owner_name: Optional[str] = None
    property_type: Optional[str] = "apartment"
    area: Optional[Decimal] = None


class ULPINSearchResult(BaseModel):
    ulpin_code: str
    property_type: Optional[str] = None
    parcel_id: Optional[str] = None
    building_id: Optional[str] = None
    floor_number: Optional[int] = None
    unit_number: Optional[str] = None
    area: Optional[Any] = None
    registration_status: str = "pending"
    validation_status: str = "pending"
    owner_name: Optional[str] = None
    address: Optional[str] = None
    coordinates: Optional[dict] = None
    match_type: str = "exact"
    match_score: float = 1.0


# --- Validation Schemas ---

class ValidationRecordResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: Any
    ulpin_id: Optional[Any] = None
    validation_type: str
    official_value: str
    detected_value: str
    difference: Optional[str] = None
    difference_percentage: Optional[Decimal] = None
    status: str
    notes: Optional[str] = None
    created_at: Optional[datetime] = None

    @field_validator("id", "ulpin_id", mode="before")
    @classmethod
    def serialize_ids(cls, v):
        return str(v) if v is not None else v


class ValidationRequest(BaseModel):
    ulpin_id: str
    validation_type: str
    official_value: str
    detected_value: str


# --- Registry History Schemas ---

class RegistryHistoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: Any
    ulpin_id: Optional[Any] = None
    action: str
    description: str
    old_value: Optional[str] = None
    new_value: Optional[str] = None
    document_url: Optional[str] = None
    status: str
    created_at: Optional[datetime] = None
    performed_by_name: Optional[str] = None

    @field_validator("id", "ulpin_id", mode="before")
    @classmethod
    def serialize_ids(cls, v):
        return str(v) if v is not None else v


# --- Change Detection Schemas ---

class ChangeDetectionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: Any
    change_type: str
    description: str
    detected_at: Optional[datetime] = None
    confidence: Optional[Decimal] = None
    status: str
    before_image_url: Optional[str] = None
    after_image_url: Optional[str] = None

    @field_validator("id", mode="before")
    @classmethod
    def serialize_id(cls, v):
        return str(v) if v is not None else v


# --- Flagged Property Schemas ---

class FlaggedPropertyResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: Any
    ulpin_id: Optional[Any] = None
    flag_type: str
    severity: str
    description: str
    resolved: bool = False
    created_at: Optional[datetime] = None
    ulpin_code: Optional[str] = None

    @field_validator("id", "ulpin_id", mode="before")
    @classmethod
    def serialize_ids(cls, v):
        return str(v) if v is not None else v


# --- Dashboard Schemas ---

class DashboardStats(BaseModel):
    total_ulpins: int = 0
    registered: int = 0
    unregistered: int = 0
    flagged: int = 0
    pending_validation: int = 0
    new_construction: int = 0
    ownership_changes: int = 0
    total_parcels: int = 0
    total_buildings: int = 0
    total_units: int = 0


# --- Notification Schemas ---

class NotificationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: Any
    title: str
    message: str
    notification_type: str
    category: str
    is_read: bool = False
    created_at: Optional[datetime] = None

    @field_validator("id", mode="before")
    @classmethod
    def serialize_id(cls, v):
        return str(v) if v is not None else v
