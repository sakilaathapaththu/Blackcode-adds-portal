// src/Pages/Auth/AuthPage.jsx
import React, { useState } from "react";
import LoginPage from "../Auth/LoginPage";       // default import
import RegisterPage from "../Auth/RegisterPage"; // default import

export default function AuthPage() {
  const [mode, setMode] = useState("register"); // or "login"
  return (
    <>
      {mode === "login" && <LoginPage onSwitch={setMode} />}
      {mode === "register" && <RegisterPage onSwitch={setMode} />}
    </>
  );
}
