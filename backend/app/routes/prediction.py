"""Prediction API endpoints."""

from fastapi import APIRouter, HTTPException, status

from ..models.model_loader import get_model_schema
from ..models.schemas import PredictionResponse, ScreeningInput
from ..preprocessing.exceptions import InvalidFeatureValueError
from ..services import prediction_service

router = APIRouter(prefix="/api/v1", tags=["prediction"])


@router.post("/predict", response_model=PredictionResponse, summary="Predict ASD probability")
def predict(input_data: ScreeningInput):
    """Run the trained ASD model on a set of screening answers."""
    try:
        result = prediction_service.predict(input_data)
    except InvalidFeatureValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(exc),
        ) from exc
    except Exception as exc:  # pragma: no cover - defensive fallback
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while making the prediction.",
        ) from exc

    return result


@router.get("/model-info", summary="Describe the loaded model and its features")
def model_info():
    """Return model metadata so clients can render the form dynamically."""
    return get_model_schema()

