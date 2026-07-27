from fastapi import APIRouter

# from app.schemas.user_schema import UserCreate
# from app.services.user_service import UserService

router = APIRouter()


@router.get("/")
def get_user():
    return {"id": "01", "name": "user1"}


# @router.post("/")
# def create_user(user: UserCreate):
#     return UserService.create_user(user)
