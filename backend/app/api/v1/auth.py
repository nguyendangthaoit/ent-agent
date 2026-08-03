from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.repositories.user import UserRepository
from app.schemas.auth import LoginRequest, TokenResponse
from app.services.auth import AuthService

router = APIRouter()


def get_service(db: Session = Depends(get_db)):
    repo = UserRepository(db)
    return AuthService(repo)


@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, service: AuthService = Depends(get_service)):
    token = service.login(request)
    return TokenResponse(access_token=token)
