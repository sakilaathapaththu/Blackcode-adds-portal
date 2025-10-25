// src/Components/ProtectedRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

export default function ProtectedRoute({ children, role = "any" }) {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/auth" replace />;

  if (role !== "any" && user.role !== role) {
    return <Navigate to="/" replace />;
  }
  return children;
}
