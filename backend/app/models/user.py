import enum
import uuid
from datetime import datetime

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, NVARCHAR, text
from sqlalchemy.dialects.mssql import UNIQUEIDENTIFIER
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class UserRole(str, enum.Enum):
    ORG_ADMIN = "org_admin"
    DEP_ADMIN = "dep_admin"
    MEMBER = "member"


class User(Base):
    __tablename__ = "users"
    __table_args__ = (
        # org_admin must NOT have a department; dep_admin/member MUST have one
        CheckConstraint(
            "(role = 'org_admin' AND department_id IS NULL) "
            "OR (role IN ('dep_admin', 'member') AND department_id IS NOT NULL)",
            name="CHK_role_dept_consistency",
        ),
    )

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

    department_id: Mapped[uuid.UUID | None] = mapped_column(
        UNIQUEIDENTIFIER,
        ForeignKey("departments.id"),
        nullable=True,
    )

    email: Mapped[str] = mapped_column(
        NVARCHAR(255),
        unique=True,
        nullable=False,
    )

    password_hash: Mapped[str] = mapped_column(
        NVARCHAR(255),
        nullable=False,
    )

    name: Mapped[str] = mapped_column(
        NVARCHAR(255),
        nullable=False,
    )

    role: Mapped[UserRole] = mapped_column(
        NVARCHAR(50),
        nullable=False,
        default=UserRole.MEMBER,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=text("SYSUTCDATETIME()"),
    )

    # Relationships
    organization: Mapped["Organization"] = relationship(back_populates="users")  # type: ignore
    department: Mapped["Department | None"] = relationship(back_populates="users")  # type: ignore
