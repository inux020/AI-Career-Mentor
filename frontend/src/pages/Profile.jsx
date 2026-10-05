import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="card">
      <h2>Profile</h2>
      {user ? (
        <div className="profile-box">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      ) : (
        <p className="muted-text">Sign in to view your profile.</p>
      )}
    </div>
  );
}
