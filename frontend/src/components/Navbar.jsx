import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="top-nav">
      <div className="brand-wrap">
        <Link to="/" className="brand-link">AI Career Mentor</Link>
      </div>

      <div className="nav-menu">
        <Link to="/">Home</Link>
        <Link to="/assessment">Assessment</Link>
        <Link to="/recommendations">Recommendations</Link>
        <Link to="/roadmap">Roadmap</Link>
        {!isAuthenticated ? (
          <Link to="/login">Login</Link>
        ) : (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/profile">Profile</Link>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>

      {!isAuthenticated && (
        <Link to="/register" className="header-cta">Get Started</Link>
      )}

      {user && <span className="user-badge">Hi, {user.name}</span>}
    </nav>
  );
}
