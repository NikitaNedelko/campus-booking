from pydantic import BaseModel


class PingResponse(BaseModel):
    pong: bool


class ReadyResponse(BaseModel):
    database: bool
