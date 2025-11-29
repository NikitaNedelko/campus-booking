from __future__ import annotations

from datetime import date, datetime
from typing import TYPE_CHECKING

from sqlalchemy import (
    BigInteger,
    Date,
    DateTime,
    Enum as PgEnum,
    ForeignKey,
    Index,
    SmallInteger,
    Text,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_model import Base
from .enums import BookingStatus

if TYPE_CHECKING:  # pragma: no cover
    from .room import Room
    from .time_slot import TimeSlot
    from .user import User


class Booking(Base):
    __tablename__ = "bookings"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    user_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("users.id", ondelete="RESTRICT"), nullable=False
    )
    room_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("rooms.id", ondelete="RESTRICT"), nullable=False
    )
    booking_date: Mapped[date] = mapped_column(Date, nullable=False)
    slot_number: Mapped[int] = mapped_column(
        SmallInteger, ForeignKey("time_slots.slot_number", ondelete="RESTRICT"), nullable=False
    )
    subject_title: Mapped[str] = mapped_column(Text, nullable=False)
    notes: Mapped[str | None] = mapped_column(Text)
    status: Mapped[BookingStatus] = mapped_column(
        PgEnum(
            BookingStatus,
            name="booking_status",
            values_callable=lambda enum: [e.value for e in enum],
            validate_strings=True,
        ),
        nullable=False,
        server_default=BookingStatus.ACTIVE.value,
    )
    created_by_id: Mapped[int | None] = mapped_column(
        BigInteger, ForeignKey("users.id", ondelete="RESTRICT")
    )
    last_edited_by_id: Mapped[int | None] = mapped_column(
        BigInteger, ForeignKey("users.id", ondelete="SET NULL")
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now()
    )

    user: Mapped["User"] = relationship(
        back_populates="bookings", foreign_keys=[user_id]
    )
    room: Mapped["Room"] = relationship(back_populates="bookings")
    time_slot: Mapped["TimeSlot"] = relationship(back_populates="bookings")
    created_by: Mapped[User | None] = relationship(
        back_populates="created_bookings", foreign_keys=[created_by_id]
    )
    last_edited_by: Mapped[User | None] = relationship(
        back_populates="edited_bookings", foreign_keys=[last_edited_by_id]
    )

    __table_args__ = (
        Index("ix_bookings_user", "user_id", "booking_date"),
        Index("ix_bookings_room_date", "room_id", "booking_date"),
        Index(
            "uq_active_booking",
            "room_id",
            "booking_date",
            "slot_number",
            unique=True,
            postgresql_where=(status == BookingStatus.ACTIVE),
        ),
        Index(
            "ix_bookings_active_date_room",
            "booking_date",
            "room_id",
            postgresql_where=(status == BookingStatus.ACTIVE),
            postgresql_include=["slot_number"],
        ),
    )
