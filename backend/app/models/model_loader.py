"""Centralized loading of the trained ASD model and its metadata.

The saved pipeline (an imbalanced-learn Pipeline that bundles the
ColumnTransformer, SMOTE, and the XGBoost classifier) is a single joblib
file. We load it once and keep it in memory so every request reuses the
same object instead of re-reading the file from disk on each call.
"""

import threading

import joblib

from ..config import settings

_model = None
_metadata = None
_schema = None
# RLock is reentrant: get_model_schema() calls get_model()/get_metadata()
# while already holding the lock, so a plain Lock would deadlock.
_lock = threading.RLock()


def _load(path: str):
    return joblib.load(path)


def get_model():
    """Return the cached trained pipeline, loading it on first use."""
    global _model
    if _model is None:
        with _lock:
            if _model is None:
                _model = _load(settings.model_path)
    return _model


def get_metadata():
    """Return the cached model metadata dictionary."""
    global _metadata
    if _metadata is None:
        with _lock:
            if _metadata is None:
                _metadata = _load(settings.metadata_path)
    return _metadata


def get_model_schema():
    """Describe the model's expected inputs in a UI-friendly structure."""
    global _schema
    if _schema is None:
        with _lock:
            if _schema is None:
                model = get_model()
                metadata = get_metadata()
                preprocessor = model.named_steps["preprocessor"]

                # Extract the exact categories the OneHotEncoder learned so the
                # frontend can present only valid options for each field.
                categorical_values = {}
                for name, transformer, columns in preprocessor.transformers_:
                    if name == "cat":
                        for column, categories in zip(columns, transformer.categories_):
                            categorical_values[column] = list(categories)

                _schema = {
                    "best_model_name": metadata["best_model_name"],
                    "features": list(metadata["features"]),
                    "categorical_features": list(metadata["categorical_features"]),
                    "numerical_features": list(metadata["numerical_features"]),
                    "categorical_values": categorical_values,
                    "all_model_test_metrics": metadata["all_model_test_metrics"],
                }
    return _schema

