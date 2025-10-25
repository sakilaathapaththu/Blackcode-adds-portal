import React, { createContext, useState, useEffect } from "react";
import { saveToken, getToken, removeToken } from "../Utils/jwt";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (token) setUser({ token });
  }, []);

  const login = (token) => {
    saveToken(token);
    setUser({ token });
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};
