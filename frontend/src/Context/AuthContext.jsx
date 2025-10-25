// src/Context/AuthContext.jsx
import React, { createContext, useEffect, useState, useMemo } from "react";
import { saveAuth, loadAuth, clearAuth } from "../Utils/authStore";

export const AuthContext = createContext({ user: null });

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => loadAuth()); // { token, user }

  useEffect(() => {
    if (auth) saveAuth(auth);
  }, [auth]);

  const login = (token, user) => setAuth({ token, user });
  const logout = () => {
    clearAuth();
    setAuth(null);
  };

  const value = useMemo(() => ({ user: auth?.user || null, token: auth?.token || null, login, logout }), [auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
