from pydantic import BaseModel, EmailStr
from enum import Enum


class UserRole(str, Enum):
    ORG_ADMIN = "org_admin"
    DEP_ADMIN = "dep_admin"
    MEMBER = "member"


class UserCreate(BaseModel):
    org_id: str
    department_id: str
    email: EmailStr
    password: str
    name: str
    role: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    org_id: str
    department_id: str
    email: str
    password: str
    name: str
    role: str

    class ConfigDict:
        from_attributes = True
