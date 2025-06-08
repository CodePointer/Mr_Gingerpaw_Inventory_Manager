from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import (
    user, family, item, transaction, 
    membership, transfer, tag, auth,
    location
)
from app.core.config import settings
from app import __version__


app = FastAPI(title="GPT 家庭库存管理系统 API")

# Base.metadata.create_all(bind=engine)  # 可选：开发阶段自动建表

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router)
app.include_router(family.router)
app.include_router(item.router)
app.include_router(transaction.router)
app.include_router(membership.router)
app.include_router(transfer.router)
app.include_router(tag.router)
app.include_router(auth.router)
app.include_router(location.router)


@app.get("/ping")
def ping():
    return {"msg": "pong"}


@app.get("/version")
def version():
    return {"version": __version__}
