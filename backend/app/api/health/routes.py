from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db_session
from app.api.health.schema import PingResponse, ReadyResponse

router = APIRouter(tags=["health"])


@router.get("/ping", response_model=PingResponse)
async def ping() -> PingResponse:
    return PingResponse(pong=True)


@router.get(
    "/readyz",
    response_model=ReadyResponse,
    status_code=status.HTTP_200_OK,
    summary="Readiness probe: checks database connectivity",
)
async def readyz(session: AsyncSession = Depends(get_db_session)) -> ReadyResponse:
    try:
        await session.execute(text("SELECT 1"))
    except Exception as exc:  # pragma: no cover - defensive guard for readiness
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="database not ready",
        ) from exc

    return ReadyResponse(database=True)
