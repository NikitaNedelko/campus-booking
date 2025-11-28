from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import (
    BigInteger,
    Boolean,
    DateTime,
    Enum as PgEnum,
    Index,
    SmallInteger,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import CITEXT
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_model import Base
from .enums import RoomType

if TYPE_CHECKING:  # pragma: no cover
    from .booking import Booking
    from .semester_slot import SemesterSlot


class Room(Base):
    __tablename__ = "rooms"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    code: Mapped[str] = mapped_column(CITEXT, nullable=False)
    building: Mapped[str] = mapped_column(Text, nullable=False)
    floor: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    room_number: Mapped[str] = mapped_column(Text, nullable=False)
    room_suffix: Mapped[str | None] = mapped_column(Text)
    room_type: Mapped[RoomType] = mapped_column(
        PgEnum(
            RoomType,
            name="room_type",
            values_callable=lambda enum: [e.value for e in enum],
            validate_strings=True,
        ),
        nullable=False,
    )
    has_projector: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default="false")
    description: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now()
    )

    bookings: Mapped[list["Booking"]] = relationship(back_populates="room")
    semester_slots: Mapped[list["SemesterSlot"]] = relationship(back_populates="room")

    __table_args__ = (
        UniqueConstraint("code", name="uq_rooms_code"),
        Index("ix_rooms_building_floor", "building", "floor"),
        Index("ix_rooms_bld_floor_num", "building", "floor", "room_number"),
        Index(
            "ix_rooms_bld_floor_num_suf",
            "building",
            "floor",
            "room_number",
            "room_suffix",
        ),
    )
