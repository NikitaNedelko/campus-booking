from pathlib import Path

import yaml  # poetry add pyyaml
from fastapi.openapi.utils import get_openapi

from app.main import create_app  # или from app.main import app, если уже создан

app = create_app()  # если app уже создан, просто: app = app

# (опционально) указать base url, контакт, безопасность и т.д.
openapi = get_openapi(
    title=app.title,
    version="0.1.0",
    description=app.description if hasattr(app, "description") else "",
    routes=app.routes,
)
openapi["servers"] = [{"url": "/api"}]  # если фронт ходит через /api

out = Path(__file__).resolve().parents[2] / "shared" / "openapi.yaml"
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(yaml.safe_dump(openapi, sort_keys=False, allow_unicode=True), encoding="utf-8")
print(f"schema written to {out}")
