# ASD Screening API — Documentation

The backend exposes a small REST API under the `/api/v1` prefix. All
responses are JSON. Interactive Swagger documentation is available at
`http://localhost:8000/docs` when running locally.

---

## Base URL

| Environment          | Base URL                    |
| -------------------- | --------------------------- |
| Local (Docker)       | `http://localhost:8000`     |
| Local (uvicorn)      | `http://localhost:8000`     |
| Production (Render)  | `https://<your-service>.onrender.com` |

---

## Endpoints

### 1. Health check

```
GET /health
```

Checks that the API is running and that the model metadata loaded correctly.

**Response**

```json
{
  "status": "ok",
  "model": "XGBoost"
}
```

---

### 2. Model info

```
GET /api/v1/model-info
```

Returns metadata about the loaded model, the full feature list, and the
exact categorical values the model understands. The frontend uses this
endpoint to render the screening form dynamically.

**Response (abbreviated)**

```json
{
  "best_model_name": "XGBoost",
  "features": [
    "A1_Score",
    "A2_Score",
    "A3_Score",
    "A4_Score",
    "A5_Score",
    "A6_Score",
    "A7_Score",
    "A8_Score",
    "A9_Score",
    "A10_Score",
    "age",
    "gender",
    "ethnicity",
    "jundice",
    "austim",
    "contry_of_res",
    "used_app_before",
    "relation"
  ],
  "categorical_features": ["ethnicity", "contry_of_res", "relation"],
  "numerical_features": [
    "A1_Score", "A2_Score", "A3_Score", "A4_Score", "A5_Score",
    "A6_Score", "A7_Score", "A8_Score", "A9_Score", "A10_Score",
    "age", "gender", "jundice", "austim", "used_app_before"
  ],
  "categorical_values": {
    "ethnicity": ["Asian", "Black", "Hispanic", "Latino", "Middle Eastern", "Others", "Pasifika", "South Asian", "Turkish", "White-European"],
    "contry_of_res": ["Afghanistan", "Albania", "American Samoa", "...", "Vietnam"],
    "relation": ["Health care professional", "Others", "Parent", "Relative", "Self"]
  },
  "all_model_test_metrics": {
    "XGBoost": {
      "cv_f1": 0.8283,
      "test_accuracy": 0.9229,
      "test_precision": 0.839,
      "test_recall": 0.9083,
      "test_f1": 0.8722
    }
  }
}
```

---

### 3. Prediction

```
POST /api/v1/predict
```

Runs the trained ASD model on a set of screening answers.

**Request body** — all fields are required.

| Field              | Type   | Allowed values                                  |
| ------------------ | ------ | ----------------------------------------------- |
| `A1_Score` ... `A10_Score` | integer | `0` or `1` (AQ-10 item scores) |
| `age`              | integer | 1–100                                           |
| `gender`           | integer | `0` = male, `1` = female                        |
| `ethnicity`        | string | One of the values listed in `/model-info`       |
| `contry_of_res`    | string | One of the values listed in `/model-info`       |
| `jundice`          | integer | `0` or `1`                                      |
| `austim`           | integer | `0` or `1`                                      |
| `used_app_before`  | integer | `0` or `1`                                      |
| `relation`         | string | One of the values listed in `/model-info`       |

**Example request**

```json
{
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
  "relation": "Self"
}
```

**Response**

```json
{
  "prediction": 1,
  "prediction_label": "ASD Detected",
  "probability": {
    "asd": 0.6543,
    "no_asd": 0.3457
  },
  "confidence": 0.6543,
  "message": "The screening results lean toward the presence of ASD traits, but with moderate confidence. Discussing these results with a qualified professional would be a sensible next step."
}
```

| Field                | Description                                         |
| -------------------- | --------------------------------------------------- |
| `prediction`         | `1` = ASD traits, `0` = no ASD traits               |
| `prediction_label`   | Human-readable version of the prediction            |
| `probability.asd`    | Model probability for the ASD class (0–1)           |
| `probability.no_asd` | Model probability for the no-ASD class (0–1)        |
| `confidence`         | Probability of the winning class (0–1)              |
| `message`            | User-friendly explanation of the result             |

**Error responses**

| Status | Meaning                                            |
| ------ | -------------------------------------------------- |
| `422`  | Validation failed (missing field, score out of range, or an unknown categorical value) |
| `500`  | Unexpected server error                             |

---

## Quick test with curl

```bash
curl -X POST http://localhost:8000/api/v1/predict \
  -H "Content-Type: application/json" \
  -d '{
    "A1_Score": 1, "A2_Score": 1, "A3_Score": 0, "A4_Score": 1, "A5_Score": 1,
    "A6_Score": 0, "A7_Score": 1, "A8_Score": 1, "A9_Score": 0, "A10_Score": 1,
    "age": 27, "gender": 1, "ethnicity": "White-European",
    "contry_of_res": "United States", "jundice": 0, "austim": 0,
    "used_app_before": 0, "relation": "Self"
  }'
```

