import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="home-hero">
      <div className="hero-visual">
        <div className="hero-card old-hero-card">
          <p className="eyebrow small-eyebrow">AI Career Mentor · TCC 2026</p>
          <h1>Plot your career route, one verified station at a time.</h1>
          <p className="subcopy">
            Real recommendations, real course links, and practical progress — all built for students and job seekers.
          </p>

          <div className="profile-form">
            <div className="field-group">
              <label>Skills</label>
              <input type="text" placeholder="JavaScript, communication, Excel" />
            </div>
            <div className="field-group">
              <label>Interests</label>
              <input type="text" placeholder="building apps, data, design" />
            </div>
            <div className="field-group">
              <label>Education</label>
              <input type="text" placeholder="undergraduate CS student" />
            </div>
            <Link to="/assessment" className="primary-btn">Get recommendations</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
