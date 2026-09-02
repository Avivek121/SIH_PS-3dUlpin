"""3D ULPIN - FastAPI Application Entry Point."""
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.config import settings
from app.seed.demo_data import init_db

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    logger.info("🚀 Starting 3D ULPIN Backend...")
    logger.info(f"   Environment: {settings.ENVIRONMENT}")
    logger.info(f"   Demo Mode: {settings.DEMO_MODE}")

    # Initialize database and seed demo data
    try:
        await init_db()
        logger.info("✅ Database initialized & demo data ready")
    except Exception as e:
        logger.error(f"❌ Database initialization failed: {e}")

    yield

    logger.info("👋 Shutting down 3D ULPIN Backend...")


app = FastAPI(
    title="3D ULPIN API",
    description="Vertical Property Mapping & Intelligence System - REST API",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*", "http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files
static_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")
if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Import routers
from app.routers import auth, ulpin, properties, registry, validation, datasets, gis, dashboard

# Create /api/v1 router
api_v1 = APIRouter(prefix="/api/v1")
api_v1.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_v1.include_router(ulpin.router, tags=["ULPIN"])
api_v1.include_router(properties.router, tags=["Properties"])
api_v1.include_router(registry.router, tags=["Registry"])
api_v1.include_router(validation.router, tags=["Validation"])
api_v1.include_router(datasets.router, tags=["Datasets"])
api_v1.include_router(gis.router, tags=["GIS"])
api_v1.include_router(dashboard.router, tags=["Dashboard"])

app.include_router(api_v1)


@app.get("/")
@app.get("/health")
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "3D ULPIN API",
        "version": "1.0.0",
        "demo_mode": settings.DEMO_MODE,
    }


@app.get("/api/v1/config")
async def get_app_config():
    """Public config for frontend."""
    return {
        "demo_mode": settings.DEMO_MODE,
        "google_auth_available": settings.is_google_configured or settings.DEMO_MODE,
        "apple_auth_available": settings.is_apple_configured or settings.DEMO_MODE,
        "phone_auth_available": True,
        "project_name": settings.PROJECT_NAME,
    }
