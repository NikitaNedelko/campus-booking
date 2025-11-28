from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import BigInteger, DateTime, Enum as PgEnum, ForeignKey, Index, Text, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_model import Base
from .enums import EntityKind

if TYPE_CHECKING:  # pragma: no cover
    from .user import User


class AuditEvent(Base):
    __tablename__ = "audit_events"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    entity_kind: Mapped[EntityKind] = mapped_column(
        PgEnum(
            EntityKind,
            name="entity_kind",
            values_callable=lambda enum: [e.value for e in enum],
            validate_strings=True,
        ),
        nullable=False,
    )
    entity_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    action: Mapped[str] = mapped_column(Text, nullable=False)
    actor_user_id: Mapped[int | None] = mapped_column(
        BigInteger, ForeignKey("users.id", ondelete="SET NULL")
    )
    note: Mapped[str | None] = mapped_column(Text)
    diff: Mapped[dict | None] = mapped_column(JSONB)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    actor_user: Mapped[User | None] = relationship(back_populates="audit_events")

    __table_args__ = (Index("ix_audit_booking", "entity_kind", "entity_id"),)
