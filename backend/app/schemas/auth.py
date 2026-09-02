from pydantic import BaseModel, EmailStr, ConfigDict, field_validator
from typing import Optional, Any, Union
from datetime import datetime
import uuid


# --- Auth Schemas ---

class UserRegister(BaseModel):
    full_name: str
    email: str
    password: str
    confirm_password: str
    phone: Optional[str] = None

    @field_validator("confirm_password")
    @classmethod
    def passwords_match(cls, v, info):
        if "password" in info.data and v != info.data["password"]:
            raise ValueError("Passwords do not match")
        return v


class UserLogin(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: "UserResponse"


class RefreshRequest(BaseModel):
    refresh_token: str


class GoogleAuthRequest(BaseModel):
    code: Optional[str] = None
    id_token: Optional[str] = None
    redirect_uri: Optional[str] = None


class AppleAuthRequest(BaseModel):
    id_token: Optional[str] = None
    authorization_code: Optional[str] = None
    user_info: Optional[dict] = None


class PhoneSendOTP(BaseModel):
    phone: str

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v):
        cleaned = v.replace(" ", "").replace("-", "")
        if not cleaned.startswith("+"):
            cleaned = "+91" + cleaned
        if len(cleaned) < 10:
            raise ValueError("Invalid phone number")
        return cleaned


class PhoneVerifyOTP(BaseModel):
    phone: str
    otp: str


class ForgotPasswordRequest(BaseModel):
    email: str


# --- User Schemas ---

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: Any
    email: Optional[str] = None
    full_name: str
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    role: str = "user"
    is_active: bool = True
    is_demo: bool = False
    created_at: Optional[datetime] = None

    @field_validator("id", mode="before")
    @classmethod
    def serialize_id(cls, v):
        return str(v) if v is not None else v


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
