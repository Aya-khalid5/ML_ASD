"use client";

import { useState } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import ScreeningForm from "../components/ScreeningForm";
import ResultCard from "../components/ResultCard";
import LoadingState from "../components/LoadingState";
import { predictASD } from "../services/api";

const HOW_IT_WORKS = [
  {
   
    title: "Answer the questionnaire",
    text: "Fill in the AQ-10 screening questions plus a few demographic and clinical details. Every field is required for the model to make a reliable estimate.",
  },
  {
   
    title: "The model analyzes your answers",
    text: "Your responses are sent to a FastAPI backend that runs a tuned XGBoost classifier trained on thousands of ASD screening records.",
  },
  {
   
    title: "Get a clear result",
    text: "You instantly see the predicted outcome, the model's confidence percentage, and an easy-to-understand explanation of what it means.",
  },
];

export default function HomePage() {
  const [phase, setPhase] = useState("form"); // "form" | "loading" | "result"
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (payload) => {
    setPhase("loading");
    setError("");
    try {
      const prediction = await predictASD(payload);
      setResult(prediction);
      setPhase("result");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong while getting the prediction. Please try again."
      );
      setPhase("form");
    }
  };

  const handleReset = () => {
    setResult(null);
    setError("");
    setPhase("form");
  };

  return (
    <>
      <Header />
      <main>
        <Hero />

        {/* About */}
        <section className="section" id="about">
          <div className="container">
            <h2 className="section-title">About this project</h2>
            <p className="section-subtitle">
              Autism Spectrum Disorder (ASD) is a developmental condition that
              affects communication and behavior. Early screening can help
              families take the next step toward a professional evaluation, and
              this tool makes an initial assessment accessible to everyone.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className="section" id="how-it-works" style={{ paddingTop: 0 }}>
          <div className="container">
            <h2 className="section-title">How it works</h2>
            <p className="section-subtitle">
              Three simple steps between you and your screening result.
            </p>
            <div className="features-grid">
              {HOW_IT_WORKS.map((item) => (
                <div className="feature" key={item.title}>
                  <div className="feature-icon">{item.icon}</div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Screening */}
        <section className="form-section" id="screening">
          <div className="container">
            {phase === "form" && (
              <>
                {error && <div className="form-error">{error}</div>}
                <ScreeningForm onSubmit={handleSubmit} loading={false} />
              </>
            )}

            {phase === "loading" && (
              <div className="card" style={{ maxWidth: 820, margin: "0 auto" }}>
                <LoadingState text="Analyzing your answers with the trained ASD model..." />
              </div>
            )}

            {phase === "result" && result && (
              <ResultCard result={result} onReset={handleReset} />
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

