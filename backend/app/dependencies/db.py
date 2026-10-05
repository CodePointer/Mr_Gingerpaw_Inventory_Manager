from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool
from app.models import Base
from app.core.config import settings


engine_options = {"echo": False, "pool_pre_ping": True}
if settings.DB_USE_NULL_POOL:
    # Supabase recommends avoiding a second client-side pool when the app uses
    # its transaction pooler (the normal choice for serverless deployments).
    engine_options["poolclass"] = NullPool

engine = create_engine(settings.DATABASE_URL, **engine_options)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
