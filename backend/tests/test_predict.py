"""Sanity tests for the prediction API.

Run with:
    pytest tests/ -v
"""

import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c


# A realistic set of answers used throughout the tests. This example leans
# strongly toward ASD traits (high AQ-10 score) so we can assert a stable
# prediction and a well-formed response.
SAMPLE_PAYLOAD = {
    "A1_Score": 1,
    "A2_Score": 1,
    "A3_Score": 0,
    "A4_Score": 1,
    "A5_Score": 1,
    "A6_Score": 0,
    "A7_Score": 1,
    "A8_Score": 1,
    "A9_Score": 0,
    "A10_Score": 1,
    "age": 27,
    "gender": 1,
    "ethnicity": "White-European",
    "contry_of_res": "United States",
    "jundice": 0,
    "austim": 0,
    "used_app_before": 0,
    "relation": "Self",
}


def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_model_info(client):
    response = client.get("/api/v1/model-info")
    assert response.status_code == 200
    body = response.json()
    assert body["best_model_name"] == "XGBoost"
    assert "A1_Score" in body["features"]
    assert "ethnicity" in body["categorical_features"]
    assert len(body["categorical_values"]["relation"]) == 5


def test_predict_positive_case(client):
    response = client.post("/api/v1/predict", json=SAMPLE_PAYLOAD)
    assert response.status_code == 200
    body = response.json()
    assert body["prediction"] in (0, 1)
    assert body["prediction_label"] in ("ASD Detected", "No ASD Detected")
    assert 0.0 <= body["confidence"] <= 1.0
    assert body["probability"]["asd"] + body["probability"]["no_asd"] == pytest.approx(1.0, abs=0.001)
    assert isinstance(body["message"], str) and len(body["message"]) > 10


def test_predict_rejects_invalid_categorical(client):
    payload = {**SAMPLE_PAYLOAD, "ethnicity": "Not-A-Real-Ethnicity"}
    response = client.post("/api/v1/predict", json=payload)
    assert response.status_code == 422


def test_predict_rejects_invalid_score(client):
    payload = {**SAMPLE_PAYLOAD, "A1_Score": 5}
    response = client.post("/api/v1/predict", json=payload)
    assert response.status_code == 422

