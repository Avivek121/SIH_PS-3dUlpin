from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.database import get_db

router = APIRouter(prefix="/database", tags=["database"])

ALLOWED_TABLES = [
    "ulpins", "buildings", "property_units", "parcels", 
    "floors", "owners", "validation_records", "datasets", "notifications", "users"
]

@router.get("/overview")
async def get_database_overview(db: AsyncSession = Depends(get_db)):
    """Return live PostgreSQL connection overview, version, and all table row counts."""
    try:
        ver_res = await db.execute(text("SELECT version();"))
        ver = ver_res.scalar()
        engine_str = " ".join(ver.split()[:2]) if ver else "PostgreSQL"
    except Exception as e:
        engine_str = "PostgreSQL (Error)"

    tables_info = []
    for tbl in ALLOWED_TABLES:
        try:
            cnt_res = await db.execute(text(f"SELECT count(*) FROM {tbl};"))
            cnt = cnt_res.scalar() or 0
            tables_info.append({
                "table_name": tbl,
                "row_count": cnt,
                "status": "ready"
            })
        except Exception:
            pass

    return {
        "engine": engine_str,
        "database_name": "ulpin3d",
        "host": "localhost:5432",
        "user": "postgres",
        "status": "Connected & Live",
        "tables": tables_info
    }

@router.get("/table/{table_name}")
async def get_table_data(
    table_name: str,
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db)
):
    """Fetch live records and columns from a specific PostgreSQL table."""
    if table_name not in ALLOWED_TABLES:
        raise HTTPException(status_code=400, detail=f"Invalid table name. Allowed: {', '.join(ALLOWED_TABLES)}")

    try:
        # Get count
        cnt_res = await db.execute(text(f"SELECT count(*) FROM {table_name};"))
        total = cnt_res.scalar() or 0

        # Get rows
        stmt = text(f"SELECT * FROM {table_name} LIMIT {limit} OFFSET {offset};")
        res = await db.execute(stmt)
        columns = list(res.keys())
        rows = [dict(zip(columns, [str(v) if v is not None else None for v in row])) for row in res.fetchall()]

        return {
            "table_name": table_name,
            "total_records": total,
            "limit": limit,
            "offset": offset,
            "columns": columns,
            "rows": rows
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

