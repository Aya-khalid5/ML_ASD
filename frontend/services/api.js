/**
 * API client for the ASD Screening backend.
 *
 * The base URL is read from NEXT_PUBLIC_API_URL so the same code works in
 * local development, Docker, and on Vercel (where you point this env var at
 * your hosted FastAPI backend).
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    // The backend returns a `detail` field for errors — surface it so the
    // user sees something meaningful instead of a generic failure.
    let detail = `Request failed with status ${response.status}`;
    try {
      const body = await response.json();
      if (body.detail) {
        detail = Array.isArray(body.detail)
          ? body.detail.map((item) => item.msg).join("; ")
          : body.detail;
      }
    } catch {
      // Keep the default message if the body is not JSON.
    }
    throw new Error(detail);
  }

  return response.json();
}

/**
 * Fetch model metadata (features, categorical options) used to render the
 * screening form dynamically.
 */
export function fetchModelInfo() {
  return request("/api/v1/model-info");
}

/**
 * Submit screening answers and receive a prediction.
 * @param {Object} payload - The 18 screening features expected by the API.
 */
export function predictASD(payload) {
  return request("/api/v1/predict", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

