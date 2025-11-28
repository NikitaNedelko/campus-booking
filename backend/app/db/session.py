from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from typing import AsyncIterator

from app.settings import settings

engine = create_async_engine(settings.database.dsn, future=True, echo=False)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)


async def get_session() -> AsyncIterator[AsyncSession]:
    """
    Dependency-style helper that yields an AsyncSession.
    Prefer using it via dependency injection in FastAPI routes.
    """

    async with AsyncSessionLocal() as session:
        yield session
