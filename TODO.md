# Development Roadmap — End-to-End ASD Screening Application

> Living progress tracker. Each phase is checked off as the work is completed.

## Phase 1 — Model Review & Artifact Preparation
- [x] Review the ASD training notebook
- [x] Verify the trained pipeline (`asd_best_model.joblib`) loads and predicts correctly
- [x] Extract feature lists and one-hot category values for the frontend form
- [x] Copy model artifacts into `backend/artifacts/`

## Phase 2 — Backend (FastAPI)
- [x] Create the app structure (`main`, `config`, `routes`, `services`, `preprocessing`, `models`, `utils`)
- [x] Implement the model loader and metadata loader with caching
- [x] Implement Pydantic schemas with input validation
- [x] Implement the prediction service (same pipeline as the notebook)
- [x] Add `/predict` and `/model-info` endpoints
- [x] Add CORS, health check, and startup model warm-up

## Phase 3 — Frontend (Next.js)
- [x] Scaffold the Next.js app (App Router, JSX)
- [x] Build the landing page (header, hero, about / how-it-works sections)
- [x] Build the screening form with all 18 model features
- [x] Add client-side validation
- [x] Build the result card, confidence meter, and loading state
- [x] Wire the API client with loading and error handling

## Phase 4 — Testing & Polish
- [x] Run the backend locally and test `/api/v1/predict`
- [x] Run the frontend locally and test the end-to-end flow
- [x] Verify predictions match the training notebook
- [x] Improve UX and responsive styling

## Phase 5 — Docker
- [x] Backend Dockerfile
- [x] Frontend Dockerfile (standalone output)
- [x] `docker-compose.yml`
- [x] Verify `docker-compose up` runs the full stack

## Phase 6 — GitHub
- [x] Create `.gitignore` and `.env.example`
- [x] Document the GitHub upload flow in the README

## Phase 7 — Deployment
- [x] Vercel (frontend) — documented in the README
- [x] Render (backend) — `render.yaml` blueprint + README instructions

## Phase 8 — Delivery
- [x] `README.md` complete
- [x] `docs/API.md` complete
- [x] Verification notebooks (`notebooks/`)
- [x] Final review and cleanup

