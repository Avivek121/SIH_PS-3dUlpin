from app.database import Base

from .user import User, OAuthAccount, PhoneVerification
from .property import Parcel, Building, Floor, PropertyUnit
from .ulpin import Ulpin, Owner
ULPIN = Ulpin
from .registry import RegistryHistory, OwnershipHistory
from .validation import ValidationRecord, ChangeDetection, FlaggedProperty
from .dataset import Dataset, DatasetProcessingJob, GisLayer, PointCloud
GISLayer = GisLayer
from .notification import Notification, AuditLog

__all__ = [
    "Base",
    "User",
    "OAuthAccount",
    "PhoneVerification",
    "Parcel",
    "Building",
    "Floor",
    "PropertyUnit",
    "Ulpin",
    "Owner",
    "RegistryHistory",
    "OwnershipHistory",
    "ValidationRecord",
    "ChangeDetection",
    "FlaggedProperty",
    "Dataset",
    "DatasetProcessingJob",
    "GisLayer",
    "PointCloud",
    "Notification",
    "AuditLog"
]
