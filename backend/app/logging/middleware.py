import time
import uuid

from backend.app.logging.context import request_id_var
from backend.app.logging.logger import logger
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp


class LoggingMiddleware(BaseHTTPMiddleware):
    def __init__(self, app: ASGIApp):
        super().__init__(app)

    async def dispatch(self, request: Request, call_next):
        rid = uuid.uuid4().hex
        token = request_id_var.set(rid)
        start_time = time.time()

        def _safe_headers(h: dict[str, str]) -> dict[str, str]:
            drop = {"authorization", "cookie", "set-cookie"}
            return {k: v for k, v in h.items() if k.lower() not in drop}

        try:
            raw = await request.body()
            body_str = raw.decode("utf-8", errors="ignore")
        except Exception:
            body_str = "<unreadable>"

        if request.method == "POST" and "api/images/?" in str(request.url):
            body_str = "<image content omitted>"

        logger.info(
            "Request started",
            extra={
                "request_id": rid,
                "method": request.method,
                "url": str(request.url),
                "headers": _safe_headers(dict(request.headers)),
                "body": body_str,
            },
        )

        try:
            response = await call_next(request)

            process_time = time.time() - start_time

            logger.info(
                "Response sent",
                extra={
                    "request_id": rid,
                    "status_code": response.status_code,
                    "headers": dict(response.headers),
                    "latency": round(process_time, 3),
                },
            )

            return response

        except Exception as e:
            logger.error(
                "Error logging request",
                extra={
                    "request_id": rid,
                    "error": str(e),
                },
            )
            raise e
        finally:
            request_id_var.reset(token)
