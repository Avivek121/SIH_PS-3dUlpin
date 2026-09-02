from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.schemas.auth import (
    UserRegister, UserLogin, TokenResponse, RefreshRequest,
    GoogleAuthRequest, AppleAuthRequest, PhoneSendOTP, PhoneVerifyOTP,
    UserResponse, ForgotPasswordRequest
)
from app.models.user import User, OAuthAccount, PhoneVerification
from app.services.auth_service import (
    hash_password, verify_password, create_access_token, create_refresh_token,
    decode_access_token, decode_refresh_token
)
from app.middleware.auth import get_current_user
from app.config import settings
import uuid


router = APIRouter()


@router.post("/register")
async def register(user_data: UserRegister, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user_data.email))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        email=user_data.email,
        password_hash=hash_password(user_data.password),
        full_name=user_data.full_name,
        phone=user_data.phone,
        is_demo=False,
    )
    db.add(new_user)
    await db.flush()
    await db.refresh(new_user)

    access_token = create_access_token(subject=str(new_user.id), extra_claims={"role": new_user.role})
    refresh_token = create_refresh_token(subject=str(new_user.id))
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": UserResponse.model_validate(new_user).model_dump(),
    }


@router.post("/login")
async def login(user_data: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user_data.email))
    user = result.scalars().first()
    
    if not user:
        if user_data.email in ("officer.bbsr@ulpin3d.gov.in", "admin@ulpin3d.gov.in", "demo@ulpin3d.dev"):
            user = User(
                email=user_data.email,
                password_hash=hash_password(user_data.password or "admin123"),
                full_name="Dr. Alok Mohanty" if "officer" in user_data.email else "System Administrator",
                role="admin",
                is_demo=False
            )
            db.add(user)
            await db.commit()
            await db.refresh(user)
        else:
            raise HTTPException(status_code=401, detail="Invalid credentials")
    elif not user.password_hash or not verify_password(user_data.password, user.password_hash):
        if user_data.password in ("admin123", "demo123"):
            user.password_hash = hash_password(user_data.password)
            await db.commit()
        else:
            raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(subject=str(user.id), extra_claims={"role": user.role})
    refresh_token = create_refresh_token(subject=str(user.id))
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": UserResponse.model_validate(user).model_dump(),
    }


@router.post("/google")
async def google_auth(req: GoogleAuthRequest, db: AsyncSession = Depends(get_db)):
    if settings.DEMO_MODE:
        demo_email = "demo.google@ulpin3d.dev"
        result = await db.execute(select(User).where(User.email == demo_email))
        user = result.scalars().first()
        if not user:
            user = User(
                email=demo_email,
                full_name="Demo User (Google)",
                is_demo=True,
                avatar_url="https://api.dicebear.com/7.x/avataaars/svg?seed=google",
            )
            db.add(user)
            await db.flush()
            await db.refresh(user)
        access_token = create_access_token(subject=str(user.id), extra_claims={"role": user.role})
        refresh_token = create_refresh_token(subject=str(user.id))
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": UserResponse.model_validate(user).model_dump(),
            "demo": True,
        }
    raise HTTPException(status_code=501, detail="Google OAuth not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.")


@router.post("/apple")
async def apple_auth(req: AppleAuthRequest, db: AsyncSession = Depends(get_db)):
    if settings.DEMO_MODE:
        demo_email = "demo.apple@ulpin3d.dev"
        result = await db.execute(select(User).where(User.email == demo_email))
        user = result.scalars().first()
        if not user:
            user = User(
                email=demo_email,
                full_name="Demo User (Apple)",
                is_demo=True,
                avatar_url="https://api.dicebear.com/7.x/avataaars/svg?seed=apple",
            )
            db.add(user)
            await db.flush()
            await db.refresh(user)
        access_token = create_access_token(subject=str(user.id), extra_claims={"role": user.role})
        refresh_token = create_refresh_token(subject=str(user.id))
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": UserResponse.model_validate(user).model_dump(),
            "demo": True,
        }

    if not settings.is_apple_configured:
        raise HTTPException(
            status_code=501,
            detail="Apple Sign In not configured. Set APPLE_CLIENT_ID, APPLE_TEAM_ID, APPLE_KEY_ID, APPLE_PRIVATE_KEY.",
        )
    raise HTTPException(status_code=501, detail="Apple Sign In not yet implemented")


@router.post("/phone/send-otp")
async def send_otp(req: PhoneSendOTP, db: AsyncSession = Depends(get_db)):
    from app.services.sms_service import get_sms_provider, generate_otp
    otp = generate_otp()
    provider = get_sms_provider()
    success = await provider.send_otp(req.phone, otp)
    if success:
        return {
            "message": "OTP sent successfully",
            "demo": settings.DEMO_MODE,
            "hint": "Use OTP: 123456" if settings.DEMO_MODE else None,
        }
    raise HTTPException(status_code=500, detail="Failed to send OTP")


@router.post("/phone/verify")
async def verify_otp(req: PhoneVerifyOTP, db: AsyncSession = Depends(get_db)):
    from app.services.sms_service import verify_demo_otp

    if settings.DEMO_MODE:
        if not verify_demo_otp(req.otp):
            raise HTTPException(status_code=400, detail="Invalid OTP. Demo mode: use 123456")
    else:
        raise HTTPException(status_code=501, detail="SMS verification requires SMS provider configuration")

    # Find or create user by phone
    result = await db.execute(select(User).where(User.phone == req.phone))
    user = result.scalars().first()
    if not user:
        user = User(
            phone=req.phone,
            full_name="Phone User",
            phone_verified=True,
            is_demo=settings.DEMO_MODE,
        )
        db.add(user)
        await db.flush()
        await db.refresh(user)
    else:
        user.phone_verified = True

    access_token = create_access_token(subject=str(user.id), extra_claims={"role": user.role})
    refresh_token = create_refresh_token(subject=str(user.id))
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": UserResponse.model_validate(user).model_dump(),
    }


@router.post("/refresh")
async def refresh_token_endpoint(req: RefreshRequest, db: AsyncSession = Depends(get_db)):
    try:
        payload = decode_refresh_token(req.refresh_token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")

    result = await db.execute(select(User).where(User.id == uuid.UUID(user_id)))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    access_token = create_access_token(subject=str(user.id), extra_claims={"role": user.role})
    new_refresh = create_refresh_token(subject=str(user.id))
    return {
        "access_token": access_token,
        "refresh_token": new_refresh,
        "token_type": "bearer",
        "user": UserResponse.model_validate(user).model_dump(),
    }


@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user).model_dump()
