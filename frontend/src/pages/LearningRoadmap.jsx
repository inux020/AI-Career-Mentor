import React from "react";
import { useState } from "react";
import { apiFetch } from "../services/api";

const initialForm = {
  careerTitle: "Software Developer",
  currentSkills: "HTML, CSS, JavaScript",
  timeframeMonths: 6,
};

export default function LearningRoadmap() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        careerTitle: form.careerTitle,
        currentSkills: form.currentSkills.split(",").map((item) => item.trim()).filter(Boolean),
        timeframeMonths: Number(form.timeframeMonths || 6),
      };
      const data = await apiFetch("/career/roadmap", { method: "POST", body: JSON.stringify(payload) });
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="two-column-layout">
      <div className="card">
        <h2>Learning roadmap</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Career title
            <input name="careerTitle" value={form.careerTitle} onChange={handleChange} />
          </label>
          <label>
            Current skills
            <textarea name="currentSkills" value={form.currentSkills} onChange={handleChange} />
          </label>
          <label>
            Preferred timeframe (months)
            <input type="number" name="timeframeMonths" value={form.timeframeMonths} onChange={handleChange} />
          </label>
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Generating..." : "Generate roadmap"}
          </button>
        </form>
      </div>

      <div className="card">
        <h2>Roadmap</h2>
        {!result ? (
          <p className="muted-text">Your personalized roadmap will appear here.</p>
        ) : (
          <div className="result-list">
            <h3>{result.careerTitle}</h3>
            <p className="score">Estimated duration: {result.estimatedDurationMonths} months</p>
            {(result.milestones || []).map((stage, index) => (
              <div key={`${stage.stage}-${index}`} className="result-item">
                <h4>{stage.stage}</h4>
                <p>
                  <strong>Skills:</strong> {(stage.skillsToLearn || []).join(", ")}
                </p>
                <p>
                  <strong>Courses:</strong> {(stage.recommendedCourses || []).join(", ")}
                </p>
                <p>
                  <strong>Certifications:</strong> {(stage.certifications || []).join(", ")}
                </p>
                <p>
                  <strong>Estimated weeks:</strong> {stage.estimatedWeeks}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
