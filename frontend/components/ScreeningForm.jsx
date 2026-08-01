"use client";

import { useEffect, useState } from "react";
import { fetchModelInfo } from "../services/api";

/**
 * The AQ-10 questionnaire items, shown exactly as in the dataset.
 * Each maps to a model feature (A1_Score ... A10_Score).
 */
const AQ10_ITEMS = [
  { id: "A1_Score", text: "I often notice small sounds when others do not" },
  { id: "A2_Score", text: "I usually concentrate more on the whole picture rather than the small details" },
  { id: "A3_Score", text: "I find it easy to do more than one thing at once" },
  { id: "A4_Score", text: "If there is an interruption, I can switch back to what I was doing very quickly" },
  { id: "A5_Score", text: "I find it easy to read between the lines when someone is talking to me" },
  { id: "A6_Score", text: "I know how to tell if someone listening to me is getting bored" },
  { id: "A7_Score", text: "When I am on the phone, I am not sure when it is my turn to speak" },
  { id: "A8_Score", text: "I often make mistakes because I do not think about the consequences" },
  { id: "A9_Score", text: "I find it easy to work out what someone is thinking or feeling just by looking at their face" },
  { id: "A10_Score", text: "I find it difficult to work out people's intentions" },
];

const BINARY_OPTIONS = [
  { value: 0, label: "No / Disagree" },
  { value: 1, label: "Yes / Agree" },
];

const EMPTY_FORM = {
  A1_Score: 0,
  A2_Score: 0,
  A3_Score: 0,
  A4_Score: 0,
  A5_Score: 0,
  A6_Score: 0,
  A7_Score: 0,
  A8_Score: 0,
  A9_Score: 0,
  A10_Score: 0,
  age: "",
  gender: "",
  ethnicity: "",
  contry_of_res: "",
  jundice: 0,
  austim: 0,
  used_app_before: 0,
  relation: "",
};

/**
 * Full screening form for all 18 model features, with client-side
 * validation, a loading state, and error display.
 */
export default function ScreeningForm({ onSubmit, loading }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [ethnicities, setEthnicities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [relations, setRelations] = useState([]);
  const [error, setError] = useState("");

  // Load the categorical options from the backend so the form always
  // shows exactly the values the model understands.
  useEffect(() => {
    let active = true;
    fetchModelInfo()
      .then((info) => {
        if (!active) return;
        setEthnicities(info.categorical_values?.ethnicity ?? []);
        setCountries(info.categorical_values?.contry_of_res ?? []);
        setRelations(info.categorical_values?.relation ?? []);
      })
      .catch(() => {
        if (active) setError("Could not load the screening options. Please try again later.");
      });
    return () => {
      active = false;
    };
  }, []);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    if (!form.age || Number(form.age) < 1 || Number(form.age) > 100) {
      return "Please enter a valid age between 1 and 100.";
    }
    if (form.gender === "") return "Please select a gender.";
    if (!form.ethnicity) return "Please select an ethnicity.";
    if (!form.contry_of_res) return "Please select a country of residence.";
    if (!form.relation) return "Please select your relation to the person being screened.";
    return "";
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }
    setError("");
    onSubmit({
      ...form,
      age: Number(form.age),
      gender: Number(form.gender),
      jundice: Number(form.jundice),
      austim: Number(form.austim),
      used_app_before: Number(form.used_app_before),
    });
  };

  const handleReset = () => {
    setForm(EMPTY_FORM);
    setError("");
  };

  return (
    <form className="form-card card" onSubmit={handleSubmit} noValidate>
      <h2>ASD Screening Form</h2>
      <p className="form-intro">
        Answer honestly based on the person&apos;s usual behavior. All fields are
        required for an accurate prediction.
      </p>

      {error && <div className="form-error">{error}</div>}

      {/* AQ-10 questionnaire */}
      <div className="form-group-title">AQ-10 Screening Questions</div>
      <div className="form-grid">
        {AQ10_ITEMS.map((item) => (
          <div className="form-field" key={item.id}>
            <label htmlFor={item.id}>{item.text}</label>
            <div className="radio-row" role="radiogroup">
              {BINARY_OPTIONS.map((opt) => {
                const selected = Number(form[item.id]) === opt.value;
                return (
                  <button
                    type="button"
                    key={opt.value}
                    className={`radio-option ${selected ? "selected" : ""}`}
                    onClick={() => updateField(item.id, opt.value)}
                    aria-pressed={selected}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Demographic information */}
      <div className="form-group-title">Demographics</div>
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="age">Age</label>
          <input
            id="age"
            type="number"
            min="1"
            max="100"
            placeholder="e.g. 27"
            value={form.age}
            onChange={(e) => updateField("age", e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Gender</label>
          <div className="radio-row" role="radiogroup">
            <button
              type="button"
              className={`radio-option ${form.gender === 0 ? "selected" : ""}`}
              onClick={() => updateField("gender", 0)}
              aria-pressed={form.gender === 0}
            >
              Male
            </button>
            <button
              type="button"
              className={`radio-option ${form.gender === 1 ? "selected" : ""}`}
              onClick={() => updateField("gender", 1)}
              aria-pressed={form.gender === 1}
            >
              Female
            </button>
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="ethnicity">Ethnicity</label>
          <select
            id="ethnicity"
            value={form.ethnicity}
            onChange={(e) => updateField("ethnicity", e.target.value)}
            disabled={ethnicities.length === 0}
          >
            <option value="">{ethnicities.length ? "Select ethnicity" : "Loading..."}</option>
            {ethnicities.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="contry_of_res">Country of residence</label>
          <select
            id="contry_of_res"
            value={form.contry_of_res}
            onChange={(e) => updateField("contry_of_res", e.target.value)}
            disabled={countries.length === 0}
          >
            <option value="">{countries.length ? "Select country" : "Loading..."}</option>
            {countries.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="relation">Your relation</label>
          <select
            id="relation"
            value={form.relation}
            onChange={(e) => updateField("relation", e.target.value)}
            disabled={relations.length === 0}
          >
            <option value="">{relations.length ? "Select relation" : "Loading..."}</option>
            {relations.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clinical background */}
      <div className="form-group-title">Clinical Background</div>
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="jundice">Born with jaundice?</label>
          <div className="radio-row" role="radiogroup">
            <button
              type="button"
              className={`radio-option ${form.jundice === 0 ? "selected" : ""}`}
              onClick={() => updateField("jundice", 0)}
              aria-pressed={form.jundice === 0}
            >
              No
            </button>
            <button
              type="button"
              className={`radio-option ${form.jundice === 1 ? "selected" : ""}`}
              onClick={() => updateField("jundice", 1)}
              aria-pressed={form.jundice === 1}
            >
              Yes
            </button>
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="austim">Family member with ASD?</label>
          <div className="radio-row" role="radiogroup">
            <button
              type="button"
              className={`radio-option ${form.austim === 0 ? "selected" : ""}`}
              onClick={() => updateField("austim", 0)}
              aria-pressed={form.austim === 0}
            >
              No
            </button>
            <button
              type="button"
              className={`radio-option ${form.austim === 1 ? "selected" : ""}`}
              onClick={() => updateField("austim", 1)}
              aria-pressed={form.austim === 1}
            >
              Yes
            </button>
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="used_app_before">Used this screening app before?</label>
          <div className="radio-row" role="radiogroup">
            <button
              type="button"
              className={`radio-option ${form.used_app_before === 0 ? "selected" : ""}`}
              onClick={() => updateField("used_app_before", 0)}
              aria-pressed={form.used_app_before === 0}
            >
              No
            </button>
            <button
              type="button"
              className={`radio-option ${form.used_app_before === 1 ? "selected" : ""}`}
              onClick={() => updateField("used_app_before", 1)}
              aria-pressed={form.used_app_before === 1}
            >
              Yes
            </button>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Analyzing..." : "Get prediction"}
        </button>
        <button className="btn btn-secondary" type="button" onClick={handleReset} disabled={loading}>
          Reset form
        </button>
      </div>

      <p className="disclaimer">
        <strong>Important:</strong> This screening is based on the AQ-10
        questionnaire and an AI model trained on research data. It is an
        educational tool and does <em>not</em> provide a medical diagnosis.
        Please consult a qualified healthcare professional for any concerns.
      </p>
    </form>
  );
}

