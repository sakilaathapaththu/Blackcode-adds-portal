// src/Pages/Profile.jsx
import React, { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

export default function Profile() {
  const { user } = useContext(AuthContext);
  return (
    <div style={{ padding: 16 }}>
      <h2>Profile</h2>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
