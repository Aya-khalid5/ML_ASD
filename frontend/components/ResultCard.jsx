import ConfidenceMeter from "./ConfidenceMeter";

/**
 * Displays the prediction result returned by the backend.
 * Includes the label, an animated confidence meter, the probability
 * breakdown, and a clear explanatory message.
 */
export default function ResultCard({ result, onReset }) {
  const isASD = result.prediction === 1;
  const confidencePercent = Math.round(result.confidence * 100);

  return (
    <div className="result-card card">
      <div className={`result-badge ${isASD ? "asd" : "no-asd"}`}>
        {isASD ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        )}
        {isASD ? "ASD Detected" : "No ASD Detected"}
      </div>

      <p className="result-confidence-label">Model confidence</p>
      <div className="result-percent">{confidencePercent}%</div>

      <ConfidenceMeter value={result.confidence} />

      <div className="probability-row">
        <div className="probability-box">
          <div className="label">Likelihood of ASD traits</div>
          <div className="value asd-text">
            {Math.round(result.probability.asd * 100)}%
          </div>
        </div>
        <div className="probability-box">
          <div className="label">Likelihood of no ASD traits</div>
          <div className="value no-asd-text">
            {Math.round(result.probability.no_asd * 100)}%
          </div>
        </div>
      </div>

      <div className="result-message">{result.message}</div>

      <button className="btn btn-secondary" onClick={onReset}>
        Run another screening
      </button>
    </div>
  );
}

