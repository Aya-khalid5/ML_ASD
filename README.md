# 🧩 ASD Screening — End-to-End Machine Learning Application

A complete, production-ready web application that screens for Autism
Spectrum Disorder (ASD) traits using a trained **XGBoost** machine learning
model. Users answer the AQ-10 questionnaire plus a few demographic and
clinical questions, and the app returns an instant prediction with a clear
confidence score and an easy-to-understand explanation.

Built as a portfolio-grade full-stack project: **FastAPI** backend,
**Next.js** frontend, **Docker** support, and deployment-ready configuration
for **Vercel** and **Render**.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Problem Statement](#problem-statement)
3. [Machine Learning Approach](#machine-learning-approach)
4. [Technologies Used](#technologies-used)
5. [Project Architecture](#project-architecture)
6. [Installation](#installation)
7. [Running Locally](#running-locally)
8. [Docker Usage](#docker-usage)
9. [API Documentation](#api-documentation)
10. [Deployment](#deployment)
11. [Screenshots](#screenshots)
12. [Future Improvements](#future-improvements)

---

## Project Overview

Early identification of ASD traits can make a real difference for families
seeking guidance and professional support. This project turns a trained
machine learning model into a friendly, accessible web application:

- A modern landing page that explains what the tool does.
- A structured screening form with the **AQ-10** questionnaire and key
  demographic / clinical features.
- Real-time prediction with the model's confidence percentage and a
  professional, human-readable explanation.
- A clean REST API that can be reused by any client.

The screening result is presented responsibly: the app always reminds the
user that this is **not a medical diagnosis** and encourages them to consult
a qualified healthcare professional.

---

## Problem Statement

Autism Spectrum Disorder is a developmental condition that affects how a
person communicates, interacts, and behaves. Diagnosis requires a full
clinical evaluation, but **screening tools** like the AQ-10 questionnaire
can flag traits worth investigating. However, raw questionnaire scores can
be hard to interpret on their own.

This project combines questionnaire answers with demographic and clinical
background information (age, gender, ethnicity, country, family history of
ASD, and more) and feeds them to a machine learning model. The model learns
complex patterns across thousands of labeled screening records and outputs a
single, interpretable probability — making the screening result much more
meaningful than a raw score.

---

## Machine Learning Approach

### Data

The model was trained on the public **Autism Screening datasets** (adult,
child, and adolescent versions) which contain AQ-10 answers plus demographic
and clinical attributes. The datasets were combined, cleaned, and deduplicated
into a single training corpus.

### Preprocessing

- AQ-10 item scores were coerced to integers (`0`/`1`).
- Categorical text was normalized (whitespace, `?` placeholders, inconsistent
  labels like `Viet Nam` → `Vietnam`).
- Binary fields (`gender`, `jundice`, `austim`, `used_app_before`) were
  encoded to `0`/`1`.
- Unrealistic ages and rows with missing target values were removed.
- A `ColumnTransformer` was built: numerical features are standardized with
  `StandardScaler`, categorical features are one-hot encoded with
  `OneHotEncoder(handle_unknown="ignore")`.

### Class imbalance

The ASD class is the minority in the data. Instead of naive oversampling,
**SMOTE** (Synthetic Minority Oversampling Technique) is applied *inside the
training pipeline only* — never to the test set — so evaluation stays honest
and there is no synthetic leakage.

### Model selection

Four model families were compared using 5-fold stratified cross-validation
(optimizing **F1 score**), with grid-search hyperparameter tuning:

| Model                  | CV F1  | Test Accuracy | Test F1 |
| ---------------------- | ------ | ------------- | ------- |
| **XGBoost (selected)** | 0.8283 | 0.9229        | 0.8722  |
| Logistic Regression    | 0.8390 | 0.9149        | 0.8678  |
| Random Forest          | 0.8216 | 0.9176        | 0.8658  |
| SVM (RBF)              | 0.8371 | 0.9096        | 0.8618  |

**XGBoost** won on test F1 and is saved as `asd_best_model.joblib`. The full
pipeline (preprocessor + SMOTE + classifier) is persisted, so the deployed
API applies the exact same transformations as training with no manual
re-encoding.

### Features (18 total)

- **AQ-10 scores:** `A1_Score` … `A10_Score` (each `0`/`1`)
- **Demographics:** `age`, `gender` (0/1)
- **Clinical:** `jundice` (0/1), `austim` (0/1), `used_app_before` (0/1)
- **Categorical:** `ethnicity` (10 values), `contry_of_res` (89 values),
  `relation` (5 values)

---

## Technologies Used

| Layer      | Technology                                              |
| ---------- | ------------------------------------------------------- |
| Backend    | Python 3.13, FastAPI, Uvicorn, Pydantic                 |
| ML         | scikit-learn, imbalanced-learn (SMOTE), XGBoost, joblib |
| Frontend   | Next.js 14 (App Router), React 18, CSS                  |
| Deployment | Docker, Docker Compose, Vercel, Render                  |
| Testing    | pytest, FastAPI TestClient                              |

---

## Project Architecture

```
ASD_Prediction/
│
├── backend/                      # FastAPI API
│   ├── app/
│   │   ├── main.py               # App entry, CORS, router wiring
│   │   ├── config.py             # Settings + env vars
│   │   ├── routes/
│   │   │   └── prediction.py     # /predict and /model-info endpoints
│   │   ├── services/
│   │   │   └── prediction_service.py
│   │   ├── preprocessing/
│   │   │   ├── input_validator.py
│   │   │   └── exceptions.py
│   │   ├── models/
│   │   │   ├── model_loader.py   # joblib loading + caching
│   │   │   └── schemas.py        # Pydantic request/response models
│   │   └── utils/
│   │       └── responses.py      # Human-friendly result messages
│   ├── artifacts/                # Trained model + metadata
│   │   ├── asd_best_model.joblib
│   │   └── asd_model_metadata.joblib
│   ├── tests/
│   │   └── test_predict.py
