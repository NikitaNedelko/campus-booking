# import sys
# from pathlib import Path

# ROOT_DIR = Path(__file__).resolve().parent.parent
# if str(ROOT_DIR) not in sys.path:
#     sys.path.insert(0, str(ROOT_DIR))

import uvicorn
from fastapi import FastAPI

from app.api import routers
from app.settings import settings

app = FastAPI(title=settings.app.service_name)


for router in routers:
    app.include_router(router, prefix=settings.app.path_prefix)

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.app.host,
        port=settings.app.port,
        reload=True,
    )
