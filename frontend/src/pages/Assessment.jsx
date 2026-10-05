import React from "react";

export default function Assessment() {
  return (
    <section className="assessment-page">
      <div className="card assessment-card">
        <p className="eyebrow">Career assessment</p>
        <h2>Tell us about your profile</h2>
        <form className="stacked-form">
          <label>
            Skills
            <input type="text" placeholder="JavaScript, communication, Excel" />
          </label>
          <label>
            Interests
            <input type="text" placeholder="building apps, data, design" />
          </label>
          <label>
            Education
            <input type="text" placeholder="undergraduate CS student" />
          </label>
          <button type="button" className="primary-btn">Get recommendations</button>
        </form>
      </div>
    </section>
  );
}
