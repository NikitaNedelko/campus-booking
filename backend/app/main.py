from fastapi import FastAPI

from app.settings import settings

app = FastAPI(title=settings.app.service_name)


@app.get("/ping")
async def ping() -> dict[str, bool]:
    return {"pong": True}
