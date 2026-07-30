import uuid
from datetime import datetime

from sqlalchemy import DateTime, NVARCHAR, text
from sqlalchemy.dialects.mssql import UNIQUEIDENTIFIER
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Organization(Base):
    __tablename__ = "organizations"

    id: Mapped[uuid.UUID] = mapped_column(
        UNIQUEIDENTIFIER,
        primary_key=True,
        server_default=text("NEWID()"),
    )

    name: Mapped[str] = mapped_column(
        NVARCHAR(255),
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=text("SYSUTCDATETIME()"),
    )

    # Relationships
    departments: Mapped[list["Department"]] = relationship(back_populates="organization")  # type: ignore
    users: Mapped[list["User"]] = relationship(back_populates="organization")  # type: ignore
