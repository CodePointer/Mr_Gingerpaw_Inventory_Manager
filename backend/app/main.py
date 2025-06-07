from dotenv import load_dotenv
import os

load_dotenv()


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import (
    user, family, item, transaction, 
    membership, transfer, tag, auth,
    location
)
from app.dependencies.db import engine
from app.models import Base


app = FastAPI(title="GPT 家庭库存管理系统 API")

# Base.metadata.create_all(bind=engine)  # 可选：开发阶段自动建表

app.add_middleware(
    CORSMiddleware,
    # allow_origins=["*"],
    allow_origins=[
        "http://localhost:8081",
        "http://192.168.1.112:8081"
    ],
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
