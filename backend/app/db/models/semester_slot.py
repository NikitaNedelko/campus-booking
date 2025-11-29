from __future__ import annotations

from datetime import date, datetime
from typing import TYPE_CHECKING

from sqlalchemy import BigInteger, Date, DateTime, ForeignKey, SmallInteger, Text, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_model import Base

if TYPE_CHECKING:  # pragma: no cover
    from .room import Room
    from .time_slot import TimeSlot


class SemesterSlot(Base):
    __tablename__ = "semester_slots"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    room_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("rooms.id", ondelete="RESTRICT"), nullable=False
    )
    slot_date: Mapped[date] = mapped_column(Date, nullable=False)
    slot_number: Mapped[int] = mapped_column(
        SmallInteger, ForeignKey("time_slots.slot_number", ondelete="RESTRICT"), nullable=False
    )
    title: Mapped[str | None] = mapped_column(Text)
    group_name: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    room: Mapped["Room"] = relationship(back_populates="semester_slots")
    time_slot: Mapped["TimeSlot"] = relationship(back_populates="semester_slots")

    __table_args__ = (
        UniqueConstraint("room_id", "slot_date", "slot_number", name="uq_semester_slot"),
    )
