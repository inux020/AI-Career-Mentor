import React from "react";
import { useState } from "react";
import { apiFetch } from "../services/api";

const initialForm = {
  education: "",
  skills: "JavaScript, Problem Solving",
  interests: "Technology, Data",
  strengths: "Communication, Learning quickly",
  goals: "I want a stable and growing career in software development.",
};

export default function Recommendations() {
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
        education: form.education,
        skills: form.skills.split(",").map((item) => item.trim()).filter(Boolean),
        interests: form.interests.split(",").map((item) => item.trim()).filter(Boolean),
        strengths: form.strengths.split(",").map((item) => item.trim()).filter(Boolean),
        goals: form.goals,
      };

      const data = await apiFetch("/career/recommendations", { method: "POST", body: JSON.stringify(payload) });
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
        <h2>Career recommendations</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Education
            <input name="education" value={form.education} onChange={handleChange} />
          </label>
          <label>
            Skills
            <textarea name="skills" value={form.skills} onChange={handleChange} />
          </label>
          <label>
            Interests
            <textarea name="interests" value={form.interests} onChange={handleChange} />
          </label>
          <label>
            Strengths
            <textarea name="strengths" value={form.strengths} onChange={handleChange} />
          </label>
          <label>
            Career goals
            <textarea name="goals" value={form.goals} onChange={handleChange} />
          </label>
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Generating..." : "Generate recommendations"}
          </button>
        </form>
      </div>

      <div className="card">
        <h2>Results</h2>
        {!result ? (
          <p className="muted-text">Your AI recommendations will appear here.</p>
        ) : (
          <div className="result-list">
            {(result.recommendations || []).map((item) => (
              <div key={item.careerTitle} className="result-item">
                <h3>{item.careerTitle}</h3>
                <p className="score">Match score: {item.matchScore}%</p>
                <p>{item.reason}</p>
                <p>
                  <strong>Skills:</strong> {(item.requiredSkills || []).join(", ")}
                </p>
                <p>
                  <strong>Industry outlook:</strong> {item.industryOutlook}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
