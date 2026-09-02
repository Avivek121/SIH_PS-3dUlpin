import uuid
from datetime import datetime
from decimal import Decimal
from typing import Optional
from sqlalchemy import String, Boolean, DateTime, Numeric, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from geoalchemy2 import Geometry
from app.database import Base

class ValidationRecord(Base):
    __tablename__ = "validation_records"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    ulpin_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("ulpins.id"))
    validation_type: Mapped[str] = mapped_column(String)
    official_value: Mapped[str] = mapped_column(String)
    detected_value: Mapped[str] = mapped_column(String)
    difference: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    difference_percentage: Mapped[Optional[Decimal]] = mapped_column(Numeric, nullable=True)
    status: Mapped[str] = mapped_column(String)
    validated_by: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("users.id"), nullable=True)
    validated_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self) -> str:
        return f"<ValidationRecord(id={self.id}, validation_type={self.validation_type})>"

class ChangeDetection(Base):
    __tablename__ = "change_detection"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    ulpin_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("ulpins.id"), nullable=True)
    parcel_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("parcels.id"), nullable=True)
    building_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("buildings.id"), nullable=True)
    change_type: Mapped[str] = mapped_column(String)
    description: Mapped[str] = mapped_column(String)
    detected_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    geometry: Mapped[Optional[str]] = mapped_column(Geometry('POLYGON', srid=4326, spatial_index=True), nullable=True)
    before_image_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    after_image_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    confidence: Mapped[Optional[Decimal]] = mapped_column(Numeric, nullable=True)
    status: Mapped[str] = mapped_column(String, default='detected')
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self) -> str:
        return f"<ChangeDetection(id={self.id}, change_type={self.change_type})>"

class FlaggedProperty(Base):
    __tablename__ = "flagged_properties"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    ulpin_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("ulpins.id"))
    flag_type: Mapped[str] = mapped_column(String)
    severity: Mapped[str] = mapped_column(String, default='medium')
    description: Mapped[str] = mapped_column(String)
    evidence_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    reported_by: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("users.id"), nullable=True)
    resolved: Mapped[bool] = mapped_column(Boolean, default=False)
    resolved_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    resolved_by: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("users.id"), nullable=True)
    resolution_notes: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self) -> str:
        return f"<FlaggedProperty(id={self.id}, flag_type={self.flag_type})>"
