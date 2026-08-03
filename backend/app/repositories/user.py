from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload
from app.models.user import User


class UserRepository:
    def __init__(self, db: Session):
        self.db = db  # keep session as instance

    def create(self, user_data):
        user = User(**user_data)
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def get_all(self):
        stmt = select(User).options(
            joinedload(User.organization),
            joinedload(User.department),
        )
        return self.db.execute(stmt).scalars().all()

    def get_by_id(self, user_id):
        return self.db.query(User).filter(User.id == user_id).first()

    def get_by_email(self, email):
        return self.db.query(User).filter(User.email == email).first()
