from pydantic import BaseModel, ConfigDict, field_validator
from typing import Optional, List, Any
from datetime import datetime


class DatasetCreate(BaseModel):
    name: str
    dataset_type: str  # building_images, aerial_images, aerial_lidar, etc.
    description: Optional[str] = None
    format: Optional[str] = None


class DatasetResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: Any
    name: str
    dataset_type: str
    description: Optional[str] = None
    file_path: Optional[str] = None
    file_size: Optional[int] = None
    file_count: int = 0
    format: Optional[str] = None
    status: str = "uploaded"
    metadata_json: Optional[dict] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    @field_validator("id", mode="before")
    @classmethod
    def serialize_id(cls, v):
        return str(v) if v is not None else v


class ProcessingJobResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: Any
    dataset_id: Optional[Any] = None
    job_type: str
    status: str = "queued"
    progress: int = 0
    current_stage: Optional[str] = None
    error_message: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    result_path: Optional[str] = None
    created_at: Optional[datetime] = None

    @field_validator("id", "dataset_id", mode="before")
    @classmethod
    def serialize_ids(cls, v):
        return str(v) if v is not None else v


class GISLayerResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: Any
    name: str
    layer_type: str
    format: str
    file_path: str
    is_active: bool = True
    properties_json: Optional[dict] = None
    created_at: Optional[datetime] = None

    @field_validator("id", mode="before")
    @classmethod
    def serialize_id(cls, v):
        return str(v) if v is not None else v


class PointCloudResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: Any
    name: str
    point_count: int = 0
    format: str
    file_path: str
    classification_available: bool = False
    intensity_available: bool = False
    trajectory_available: bool = False
    created_at: Optional[datetime] = None

    @field_validator("id", mode="before")
    @classmethod
    def serialize_id(cls, v):
        return str(v) if v is not None else v
