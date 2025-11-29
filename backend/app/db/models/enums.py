from enum import Enum


class UserRole(str, Enum):
    TEACHER = "teacher"
    ADMIN = "admin"
    INFRA = "infra"


class RoomType(str, Enum):
    LECTURE = "lecture"
    COMPUTER_LAB = "computer_lab"
    PRACTICE = "practice"


class BookingStatus(str, Enum):
    ACTIVE = "active"
    CANCELLED = "cancelled"


class EntityKind(str, Enum):
    BOOKING = "booking"
