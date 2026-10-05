import React from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
const AuthContext = createContext(null);

function readStoredUser() {
  const raw = localStorage.getItem("ai-career-user");
  return raw ? JSON.parse(raw) : null;
}

function readStoredToken() {
  return localStorage.getItem("ai-career-token");
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser());
  const [token, setToken] = useState(readStoredToken());

  useEffect(() => {
    if (user) localStorage.setItem("ai-career-user", JSON.stringify(user));
    else localStorage.removeItem("ai-career-user");
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem("ai-career-token", token);
    else localStorage.removeItem("ai-career-token");
  }, [token]);

  const value = useMemo(() => ({
    user,
    token,
    isAuthenticated: Boolean(token),
    login: (userData, authToken) => {
      setUser(userData);
      setToken(authToken);
    },
    logout: () => {
      setUser(null);
      setToken(null);
    },
  }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
