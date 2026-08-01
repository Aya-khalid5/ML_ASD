"""ASD Screening API — application entry point.

Run locally with:
    uvicorn app.main:app --reload

The app exposes:
    GET  /health              -> service health
    GET  /api/v1/model-info   -> model metadata + form schema
    POST /api/v1/predict      -> run the trained ASD model
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .models.model_loader import get_model, get_metadata, get_model_schema
from .routes import prediction


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Warm up the model cache so the first request is fast."""
    # Loading on startup surfaces missing-artifact errors immediately
    # instead of on the first user request.
    get_model()
    get_metadata()
    get_model_schema()
    yield


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description=(
        "FastAPI backend for the Autism Spectrum Disorder (ASD) screening "
        "application. Loads the trained XGBoost pipeline and serves "
        "predictions over a simple REST API."
    ),
    lifespan=lifespan,
)

# Allow the Next.js frontend (or any other client) to call this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins or ["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(prediction.router)


@app.get("/health", tags=["health"])
def health_check():
    """Basic liveness check used by load balancers and Docker healthchecks."""
    return {"status": "ok", "model": get_metadata().get("best_model_name")}

