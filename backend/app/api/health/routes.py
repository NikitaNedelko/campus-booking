from fastapi import APIRouter

from app.api.health.schema import PingResponse

router = APIRouter(tags=["health"])


@router.get("/ping", response_model=PingResponse)
async def ping() -> PingResponse:
    return PingResponse(pong=True)
