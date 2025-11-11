from contextvars import ContextVar

# Доступен в любом месте кода для корреляции логов
request_id_var: ContextVar[str | None] = ContextVar("request_id", default=None)
