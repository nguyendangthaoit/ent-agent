from app.repositories.user import UserRepository
from app.core.security import hash_password


class UserService:
    def __init__(self, repo: UserRepository):
        self.repo = repo  # Service use Repo to work with DB

    def create(self, user):
        user_data = user.model_dump()  # convert Pydantic -> dict
        user_data["password_hash"] = hash_password(user.password)
        user_data.pop("password")  # remove plain password
        created_user = self.repo.create(user_data)
        return created_user

    def get_all(self):
        return self.repo.get_all()

    def get_by_id(self, user_id):
        return self.repo.get_by_id(user_id)
