import uuid
from datetime import datetime, date
from typing import Optional
from sqlalchemy import String, Boolean, DateTime, Date, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

class RegistryHistory(Base):
    __tablename__ = "registry_history"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    ulpin_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("ulpins.id"))
    action: Mapped[str] = mapped_column(String)
    description: Mapped[str] = mapped_column(String)
    old_value: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    new_value: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    performed_by: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("users.id"), nullable=True)
    document_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    status: Mapped[str] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self) -> str:
        return f"<RegistryHistory(id={self.id}, action={self.action})>"

class OwnershipHistory(Base):
    __tablename__ = "ownership_history"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    ulpin_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("ulpins.id"))
    previous_owner_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("owners.id"), nullable=True)
    new_owner_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("owners.id"))
    transfer_type: Mapped[str] = mapped_column(String)
    transfer_date: Mapped[date] = mapped_column(Date)
    document_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    verified: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self) -> str:
        return f"<OwnershipHistory(id={self.id}, transfer_type={self.transfer_type})>"
