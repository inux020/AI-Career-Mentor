import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="dashboard-grid">
      <div className="card">
        <p className="eyebrow">Welcome back</p>
        <h2>{user ? `Hello, ${user.name}` : "Dashboard"}</h2>
        <p>Continue with your career assessment and build a plan for the next step.</p>
      </div>

      <div className="card action-card">
        <h3>Quick actions</h3>
        <Link to="/recommendations" className="primary-btn">Explore careers</Link>
        <Link to="/roadmap" className="secondary-btn">Generate roadmap</Link>
      </div>
    </div>
  );
}
