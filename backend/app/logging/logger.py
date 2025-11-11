import logging
import sys
from datetime import datetime
from typing import Any

from backend.app.settings import settings
from pythonjsonlogger.jsonlogger import JsonFormatter


class CustomJsonFormatter(JsonFormatter):
    def add_fields(
        self,
        log_record: dict[str, Any],
        record: logging.LogRecord,
        message_dict: dict[str, Any],
    ) -> None:
        log_record["timestamp"] = datetime.now().isoformat()
        log_record["level"] = record.levelname
        log_record["service"] = settings.app.service_name
        log_record["env"] = settings.app.environment
        log_record["message"] = record.getMessage()
        return super().add_fields(log_record, record, message_dict)


def get_console_logger() -> logging.Logger:
    logger = logging.getLogger("console_logger")
    logger.setLevel(logging.INFO)

    handler = logging.StreamHandler(sys.stdout)
    formatter = CustomJsonFormatter(
        json_ensure_ascii=False,
    )

    handler.setFormatter(formatter)
    logger.handlers = [handler]

    return logger


if settings.app.environment in {"development", "production"}:
    logger = get_console_logger()
