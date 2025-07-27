import json
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.routers import (
    user, family, item, transaction, 
    membership, transfer, tag, auth,
    location, admin
)
from app.core.config import settings
from app import __version__
from app.schemas.item import ItemUpdate


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
app.include_router(admin.router)


@app.get("/ping")
def ping():
    return {"msg": "pong"}


@app.get("/version")
def version():
    return {"version": __version__}


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    print(f"Validation error from {request.url}")
    body = await request.body()
    print(f"Request body: {body}")
    data = json.loads(body)
    print(f'Parsed data: {data}')
    # item_update = ItemUpdate(**data[0])
    # print(f'Parsed item update: {item_update}')
    # print(f"Validation error details: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": data},
    )