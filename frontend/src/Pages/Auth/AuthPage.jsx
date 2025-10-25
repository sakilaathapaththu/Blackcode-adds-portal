import React, { useState } from "react";
import Login from "../Auth/LoginPage";
import Register from "../Auth/RegisterPage";

const AuthPage = () => {
  const [mode, setMode] = useState("login");

  const handleSwitch = (target) => setMode(target);

  return (
    <>
      {mode === "login" && <Login onSwitch={handleSwitch} />}
      {mode === "register" && <Register onSwitch={handleSwitch} />}
    </>
  );
};

export default AuthPage;
