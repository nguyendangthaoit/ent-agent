from fastapi import APIRouter
from app.api.v1 import users
from app.api.v1 import chat

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(chat.router, prefix="/chat", tags=["Chat"])
