/**
 * Simple confidence bar with a smooth fill animation.
 * Low confidence (below 0.7) uses an amber gradient, otherwise blue.
 */
export default function ConfidenceMeter({ value }) {
  const percent = Math.round(value * 100);
  const low = value < 0.7;

  return (
    <div>
      <div className="meter" aria-hidden="true">
        <div
          className={`meter-fill ${low ? "low" : ""}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

