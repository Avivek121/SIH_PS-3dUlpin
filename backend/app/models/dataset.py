import uuid
from datetime import datetime
from typing import Optional, List, Any
from sqlalchemy import String, Boolean, Integer, DateTime, ForeignKey, JSON, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from geoalchemy2 import Geometry
from app.database import Base

class Dataset(Base):
    __tablename__ = "datasets"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String)
    dataset_type: Mapped[str] = mapped_column(String)
    description: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    file_path: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    file_size: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    file_count: Mapped[int] = mapped_column(Integer, default=0)
    format: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    status: Mapped[str] = mapped_column(String, default='uploaded')
    uploaded_by: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("users.id"), nullable=True)
    metadata_json: Mapped[Optional[Any]] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    jobs: Mapped[List["DatasetProcessingJob"]] = relationship(back_populates="dataset")
    point_clouds: Mapped[List["PointCloud"]] = relationship(back_populates="source_dataset")

    def __repr__(self) -> str:
        return f"<Dataset(id={self.id}, name={self.name})>"

class DatasetProcessingJob(Base):
    __tablename__ = "dataset_processing_jobs"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    dataset_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("datasets.id"))
    job_type: Mapped[str] = mapped_column(String)
    status: Mapped[str] = mapped_column(String, default='queued')
    progress: Mapped[int] = mapped_column(Integer, default=0)
    current_stage: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    error_message: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    started_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    result_path: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    dataset: Mapped["Dataset"] = relationship(back_populates="jobs")

    def __repr__(self) -> str:
        return f"<DatasetProcessingJob(id={self.id}, job_type={self.job_type})>"

ProcessingJob = DatasetProcessingJob

class GisLayer(Base):
    __tablename__ = "gis_layers"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String)
    layer_type: Mapped[str] = mapped_column(String)
    format: Mapped[str] = mapped_column(String)
    file_path: Mapped[str] = mapped_column(String)
    bounds: Mapped[Optional[str]] = mapped_column(Geometry('POLYGON', srid=4326, spatial_index=True), nullable=True)
    properties_json: Mapped[Optional[Any]] = mapped_column(JSON, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self) -> str:
        return f"<GisLayer(id={self.id}, name={self.name})>"

GISLayer = GisLayer

class PointCloud(Base):
    __tablename__ = "point_clouds"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String)
    source_dataset_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("datasets.id"), nullable=True)
    point_count: Mapped[int] = mapped_column(Integer)
    format: Mapped[str] = mapped_column(String)
    file_path: Mapped[str] = mapped_column(String)
    bounds: Mapped[Optional[str]] = mapped_column(Geometry('POLYGON', srid=4326, spatial_index=True), nullable=True)
    classification_available: Mapped[bool] = mapped_column(Boolean, default=False)
    intensity_available: Mapped[bool] = mapped_column(Boolean, default=False)
    trajectory_available: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    source_dataset: Mapped[Optional["Dataset"]] = relationship(back_populates="point_clouds")

    def __repr__(self) -> str:
        return f"<PointCloud(id={self.id}, name={self.name})>"
