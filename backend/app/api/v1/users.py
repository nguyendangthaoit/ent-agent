from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.repositories.user import UserRepository
from app.services.user import UserService
from app.schemas.user import UserCreate, UserResponse

router = APIRouter()


def get_service(db: Session = Depends(get_db)):
    repo = UserRepository(db)
    return UserService(repo)


@router.post("")
def create(user: UserCreate, service: UserService = Depends(get_service)):
    return service.create(user)


@router.get("", response_model=list[UserResponse])
def get_all(service: UserService = Depends(get_service)):
    return service.get_all()


@router.get("/{user_id}")
def get_by_id(user_id: str, service: UserService = Depends(get_service)):
    return service.get_by_id(user_id)
