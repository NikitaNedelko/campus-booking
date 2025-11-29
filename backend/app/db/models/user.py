from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import (
    BigInteger,
    DateTime,
    Enum as PgEnum,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import CITEXT
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_model import Base
from .enums import UserRole

if TYPE_CHECKING:  # pragma: no cover - relationships only used for typing
    from .audit_event import AuditEvent
    from .booking import Booking
    from .refresh_token import RefreshToken


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    email: Mapped[str] = mapped_column(CITEXT, nullable=False)
    password_hash: Mapped[str] = mapped_column(Text, nullable=False)
    first_name: Mapped[str] = mapped_column(Text, nullable=False)
    middle_name: Mapped[str] = mapped_column(Text, nullable=False)
    last_name: Mapped[str | None] = mapped_column(Text)
    role: Mapped[UserRole] = mapped_column(
        PgEnum(
            UserRole,
            name="user_role",
            values_callable=lambda enum: [e.value for e in enum],
            validate_strings=True,
        ),
        nullable=False,
        server_default=UserRole.INFRA.value,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    bookings: Mapped[list["Booking"]] = relationship(
        back_populates="user", foreign_keys="Booking.user_id"
    )
    created_bookings: Mapped[list["Booking"]] = relationship(
        back_populates="created_by", foreign_keys="Booking.created_by_id"
    )
    edited_bookings: Mapped[list["Booking"]] = relationship(
        back_populates="last_edited_by", foreign_keys="Booking.last_edited_by_id"
    )
    refresh_tokens: Mapped[list["RefreshToken"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    audit_events: Mapped[list["AuditEvent"]] = relationship(back_populates="actor_user")

    __table_args__ = (UniqueConstraint("email", name="uq_users_email"),)
