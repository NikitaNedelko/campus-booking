from __future__ import annotations

from datetime import time
from typing import TYPE_CHECKING

from sqlalchemy import CheckConstraint, SmallInteger, Time
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_model import Base

if TYPE_CHECKING:  # pragma: no cover
    from .booking import Booking
    from .semester_slot import SemesterSlot


class TimeSlot(Base):
    __tablename__ = "time_slots"

    slot_number: Mapped[int] = mapped_column(SmallInteger, primary_key=True)
    start_time: Mapped[time] = mapped_column(Time, nullable=False)
    end_time: Mapped[time] = mapped_column(Time, nullable=False)

    bookings: Mapped[list["Booking"]] = relationship(back_populates="time_slot")
    semester_slots: Mapped[list["SemesterSlot"]] = relationship(
        back_populates="time_slot"
    )

    __table_args__ = (
        CheckConstraint("start_time < end_time", name="ck_time_slots_start_before_end"),
    )
