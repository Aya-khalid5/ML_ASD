"""Validate incoming screening answers before they reach the model.

The saved pipeline expects a pandas DataFrame with the exact column order
it saw during training. This module converts the validated Pydantic payload
into that DataFrame and also checks that categorical values are ones the
OneHotEncoder actually learned — anything else would silently produce a
row of all zeros after encoding.
"""

import pandas as pd

from ..models.model_loader import get_metadata, get_model_schema
from .exceptions import InvalidFeatureValueError


def _categorical_rules() -> dict:
    """Return {column: set(allowed values)} from the loaded schema."""
    schema = get_model_schema()
    return {
        column: set(values)
        for column, values in schema["categorical_values"].items()
    }


def validate_and_build_frame(input_data) -> pd.DataFrame:
    """Turn a validated request payload into a model-ready DataFrame.

    Raises InvalidFeatureValueError if a categorical value was not seen
    during training, or HTTPException-style validation errors if a
    required field is missing.
    """

    metadata = get_metadata()
    features = list(metadata["features"])

    # Pydantic has already coerced and range-checked numeric fields.
    payload = input_data.model_dump()

    rules = _categorical_rules()
    for column in rules:
        value = payload.get(column)
        if value is None:
            raise InvalidFeatureValueError(column, "missing value")
        if value not in rules[column]:
            raise InvalidFeatureValueError(column, value)

    row = {feature: payload[feature] for feature in features}
    return pd.DataFrame([row], columns=features)


def validate_categorical_value(column: str, value: str) -> str:
    """Return the value if valid, otherwise raise InvalidFeatureValueError."""
    rules = _categorical_rules()
    allowed = rules.get(column)
    if allowed is None:
        return value
    if value not in allowed:
        raise InvalidFeatureValueError(column, value)
    return value

