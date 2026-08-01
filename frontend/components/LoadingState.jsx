export default function LoadingState({ text = "Analyzing your answers..." }) {
  return (
    <div className="loading-wrap">
      <div className="spinner" aria-hidden="true" />
      <p>{text}</p>
    </div>
  );
}

