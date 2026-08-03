from fastapi import HTTPException

from app.repositories.user import UserRepository
from app.core.security import create_access_token, verify_password
from app.core.logger import logger


class AuthService:
    def __init__(self, repo: UserRepository):
        self.repo = repo

    def login(self, user):
        result = self.repo.get_by_email(user.email)

        if not result or not verify_password(user.password, result.password_hash):
            # Same error message for both cases — don't reveal whether the email exists, to avoid user enumeration.
            raise HTTPException(status_code=401, detail="Incorrect email or password")

        return create_access_token(
            data={
                "sub": str(result.id),
                "org_id": str(result.org_id),
                "department_id": (
                    str(result.department_id) if result.department_id else None
                ),
                "role": result.role,
            }
        )
