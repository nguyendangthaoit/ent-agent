from enum import Enum
import uuid
from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
    computed_field,
    model_validator,
)


class UserRole(str, Enum):
    ORG_ADMIN = "org_admin"
    DEP_ADMIN = "dep_admin"
    MEMBER = "member"


class UserCreate(BaseModel):
    org_id: uuid.UUID
    department_id: uuid.UUID | None = None
    email: EmailStr
    password: str
    name: str
    role: str

    @model_validator(mode="after")
    def check_role_department_consistency(self):
        if self.role == "org_admin" and self.department_id is not None:
            raise ValueError("org_admin must not have a department_id")
        if self.role in ("dep_admin", "member") and self.department_id is None:
            raise ValueError("dep_admin and member must have a department_id")
        return self


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class DepartmentRef(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str


class OrganizationRef(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    email: str
    name: str
    role: str

    organization: OrganizationRef | None = Field(default=None, exclude=True)
    org_id: uuid.UUID

    @computed_field
    @property
    def org_name(self) -> str | None:
        return self.organization.name if self.organization else None

    department: DepartmentRef | None = Field(default=None, exclude=True)
    department_id: uuid.UUID | None = None

    @computed_field
    @property
    def department_name(self) -> str | None:
        return self.department.name if self.department else None
