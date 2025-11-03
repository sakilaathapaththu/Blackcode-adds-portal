// // src/Pages/Auth/AuthPage.jsx
// import React, { useState } from "react";
// import LoginPage from "../Auth/LoginPage";       // default import
// import RegisterPage from "../Auth/RegisterPage"; // default import

// export default function AuthPage() {
//   const [mode, setMode] = useState("register"); // or "login"
//   return (
//     <>
//       {mode === "login" && <LoginPage onSwitch={setMode} />}
//       {mode === "register" && <RegisterPage onSwitch={setMode} />}
//     </>
//   );
// }
// src/Pages/Auth/AuthPage.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import LoginPage from "../Auth/LoginPage";
import RegisterPage from "../Auth/RegisterPage";

export default function AuthPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // read from URL, default to "register"
  const initial = useMemo(() => {
    const m = (searchParams.get("mode") || "").toLowerCase();
    return m === "login" ? "login" : "register";
  }, [searchParams]);

  const [mode, setMode] = useState(initial);

  // keep state in sync if URL changes
  useEffect(() => {
    if (mode !== initial) setMode(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

  // when switching inside the page, update URL too
  const onSwitch = (nextMode) => {
    const m = nextMode === "login" ? "login" : "register";
    setMode(m);
    setSearchParams({ mode: m });
  };

  return mode === "login" ? (
    <LoginPage onSwitch={onSwitch} />
  ) : (
    <RegisterPage onSwitch={onSwitch} />
  );
}
