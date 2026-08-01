"""Core prediction logic.

The model file contains the full training pipeline (preprocessing + SMOTE +
classifier) so calling predict / predict_proba on a raw DataFrame is exactly
the same code path the notebook used during evaluation. We never re-encode
anything manually, which is what guarantees deployment predictions match the
trained model.
"""

import numpy as np
import pandas as pd

from ..models.model_loader import get_model, get_metadata
from ..preprocessing.input_validator import validate_and_build_frame
from ..utils.responses import build_result_message

# Expected column order — read once from the saved metadata.
_FEATURES = None


def _features() -> list:
    global _FEATURES
    if _FEATURES is None:
        _FEATURES = list(get_metadata()["features"])
    return _FEATURES


def predict(input_data) -> dict:
    """Run the trained pipeline on validated user input.

    Returns a dictionary shaped like the PredictionResponse schema.
    """

    frame = validate_and_build_frame(input_data)

    model = get_model()

    # predict_proba returns [P(no ASD), P(ASD)] because the training labels
    # were encoded as {0: no ASD, 1: ASD}.
    probabilities = model.predict_proba(frame)[0]
    probabilities = [float(p) for p in probabilities]

    prediction = int(model.predict(frame)[0])
    confidence = probabilities[prediction]

    return {
        "prediction": prediction,
        "prediction_label": "ASD Detected" if prediction == 1 else "No ASD Detected",
        "probability": {
            "asd": round(probabilities[1], 4),
            "no_asd": round(probabilities[0], 4),
        },
        "confidence": round(confidence, 4),
        "message": build_result_message(prediction, confidence),
    }

