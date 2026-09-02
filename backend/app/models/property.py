import uuid
from datetime import datetime
from decimal import Decimal
from typing import Optional, List
from sqlalchemy import String, Integer, DateTime, Numeric, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from geoalchemy2 import Geometry
from app.database import Base

class Parcel(Base):
    __tablename__ = "parcels"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    parcel_id: Mapped[str] = mapped_column(String, unique=True)
    state_code: Mapped[str] = mapped_column(String)
    city_code: Mapped[str] = mapped_column(String)
    ward_code: Mapped[str] = mapped_column(String)
    geometry: Mapped[str] = mapped_column(Geometry('POLYGON', srid=4326, spatial_index=True))
    area: Mapped[Decimal] = mapped_column(Numeric)
    address: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    land_use: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    status: Mapped[str] = mapped_column(String, default='active')
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    buildings: Mapped[List["Building"]] = relationship(back_populates="parcel")

    def __repr__(self) -> str:
        return f"<Parcel(id={self.id}, parcel_id={self.parcel_id})>"

class Building(Base):
    __tablename__ = "buildings"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    building_id: Mapped[str] = mapped_column(String)
    parcel_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("parcels.id"))
    geometry: Mapped[str] = mapped_column(Geometry('POLYGON', srid=4326, spatial_index=True))
    centroid: Mapped[str] = mapped_column(Geometry('POINT', srid=4326, spatial_index=True))
    height: Mapped[Decimal] = mapped_column(Numeric)
    floor_count: Mapped[int] = mapped_column(Integer)
    building_type: Mapped[str] = mapped_column(String)
    construction_year: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    status: Mapped[str] = mapped_column(String, default='active')
    model_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    parcel: Mapped["Parcel"] = relationship(back_populates="buildings")
    floors: Mapped[List["Floor"]] = relationship(back_populates="building")
    units: Mapped[List["PropertyUnit"]] = relationship(back_populates="building")

    def __repr__(self) -> str:
        return f"<Building(id={self.id}, building_id={self.building_id})>"

class Floor(Base):
    __tablename__ = "floors"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    building_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("buildings.id"))
    floor_number: Mapped[int] = mapped_column(Integer)
    floor_label: Mapped[str] = mapped_column(String)
    height: Mapped[Optional[Decimal]] = mapped_column(Numeric, nullable=True)
    area: Mapped[Optional[Decimal]] = mapped_column(Numeric, nullable=True)
    unit_count: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    building: Mapped["Building"] = relationship(back_populates="floors")
    units: Mapped[List["PropertyUnit"]] = relationship(back_populates="floor")

    def __repr__(self) -> str:
        return f"<Floor(id={self.id}, floor_label={self.floor_label})>"

class PropertyUnit(Base):
    __tablename__ = "property_units"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    unit_id: Mapped[str] = mapped_column(String)
    floor_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("floors.id"))
    building_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("buildings.id"))
    unit_number: Mapped[str] = mapped_column(String)
    property_type: Mapped[str] = mapped_column(String)
    area: Mapped[Decimal] = mapped_column(Numeric)
    geometry: Mapped[Optional[str]] = mapped_column(Geometry('POLYGON', srid=4326, spatial_index=True), nullable=True)
    status: Mapped[str] = mapped_column(String, default='active')
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    building: Mapped["Building"] = relationship(back_populates="units")
    floor: Mapped["Floor"] = relationship(back_populates="units")

    def __repr__(self) -> str:
        return f"<PropertyUnit(id={self.id}, unit_id={self.unit_id})>"
