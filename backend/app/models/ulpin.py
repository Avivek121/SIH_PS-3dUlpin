import uuid
from datetime import datetime
from typing import Optional, List
from sqlalchemy import String, Boolean, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base
from app.models.property import Parcel, Building, Floor, PropertyUnit

class Owner(Base):
    __tablename__ = "owners"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    full_name: Mapped[str] = mapped_column(String)
    email: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    phone: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    aadhaar_hash: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    pan_number: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    address: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    owner_type: Mapped[str] = mapped_column(String, default='individual')
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    ulpins: Mapped[List["Ulpin"]] = relationship(back_populates="owner")

    def __repr__(self) -> str:
        return f"<Owner(id={self.id}, full_name={self.full_name})>"

class Ulpin(Base):
    __tablename__ = "ulpins"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    ulpin_code: Mapped[str] = mapped_column(String, unique=True)
    state_code: Mapped[str] = mapped_column(String)
    city_code: Mapped[str] = mapped_column(String)
    ward_code: Mapped[str] = mapped_column(String)
    
    parcel_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("parcels.id"))
    building_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("buildings.id"), nullable=True)
    floor_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("floors.id"), nullable=True)
    unit_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("property_units.id"), nullable=True)
    owner_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("owners.id"), nullable=True)
    
    registration_status: Mapped[str] = mapped_column(String, default='pending')
    validation_status: Mapped[str] = mapped_column(String, default='pending')
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    owner: Mapped[Optional["Owner"]] = relationship(back_populates="ulpins")
    parcel: Mapped[Optional["Parcel"]] = relationship("Parcel")
    building: Mapped[Optional["Building"]] = relationship("Building")
    floor: Mapped[Optional["Floor"]] = relationship("Floor")
    unit: Mapped[Optional["PropertyUnit"]] = relationship("PropertyUnit")

    def __repr__(self) -> str:
        return f"<Ulpin(id={self.id}, ulpin_code={self.ulpin_code})>"

ULPIN = Ulpin
