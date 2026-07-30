import os
from app.core.config import settings
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

if not settings.DATABASE_URL:
    raise ValueError("DATABASE_URL is not set in the environment variables")

# Create the SQLAlchemy engine
engine = create_engine(settings.DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


# 👇 ADD THIS (important)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
