export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container">
        <span className="hero-badge">🧬 Machine Learning · AQ-10 Based</span>
        <h1>
          A smart screening aid for <span>Autism Spectrum Disorder</span>
        </h1>
        <p>
          Answer a few simple questions about behavioral traits, demographics,
          and family history. Our trained XGBoost model estimates the
          likelihood of ASD traits and gives you a clear, easy-to-read result.
        </p>
        <div className="hero-actions">
          <a href="#screening" className="btn btn-primary">
            Start the screening
          </a>
          <a href="#about" className="btn btn-secondary">
            Learn more
          </a>
        </div>
      </div>
    </section>
  );
}

