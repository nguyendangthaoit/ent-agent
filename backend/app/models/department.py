import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, NVARCHAR, text
from sqlalchemy.dialects.mssql import UNIQUEIDENTIFIER
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Department(Base):
    __tablename__ = "departments"

    id: Mapped[uuid.UUID] = mapped_column(
        UNIQUEIDENTIFIER,
        primary_key=True,
        server_default=text("NEWID()"),
    )

    org_id: Mapped[uuid.UUID] = mapped_column(
        UNIQUEIDENTIFIER,
        ForeignKey("organizations.id"),
        nullable=False,
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
    organization: Mapped["Organization"] = relationship(back_populates="departments")  # type: ignore
    users: Mapped[list["User"]] = relationship(back_populates="department")  # type: ignore
