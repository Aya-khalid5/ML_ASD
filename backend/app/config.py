"""Application configuration.

All values can be overridden with environment variables so the same code
base works in local development, Docker, and cloud platforms like Render.
"""

import os
from pathlib import Path

# backend/ directory (one level up from this file)
BASE_DIR = Path(__file__).resolve().parent.parent
ARTIFACTS_DIR = BASE_DIR / "artifacts"


class Settings:
    """Runtime settings for the API."""

    app_name = "ASD Screening API"
    app_version = "1.0.0"
    api_prefix = "/api/v1"

    # Paths to the trained model and metadata. Override with env vars when
    # the artifacts live somewhere else (e.g. a mounted volume on Render).
    model_path = os.getenv(
        "ASD_MODEL_PATH", str(ARTIFACTS_DIR / "asd_best_model.joblib")
    )
    metadata_path = os.getenv(
        "ASD_METADATA_PATH", str(ARTIFACTS_DIR / "asd_model_metadata.joblib")
    )

    # Comma-separated list of allowed CORS origins.
    cors_origins = [
        origin.strip()
        for origin in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
        if origin.strip()
    ]


settings = Settings()

