# ---------------------------------------------------------------------------
# ASD Screening Backend — FastAPI + trained model
# ---------------------------------------------------------------------------
FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# Install dependencies first for better layer caching.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code and the trained model artifacts.
COPY app ./app
COPY artifacts ./artifacts

# Run the API. Uvicorn binds to 0.0.0.0 so the container is reachable
# from outside (required by Docker and Render).
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

