// src/Pages/Auth/LoginPage.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Paper, Typography, TextField, Button, CircularProgress, Link,
  IconButton, InputAdornment, Box, Divider
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { loginUser, googleLogin } from "../../Api/Auth";
import { AuthContext } from "../../Context/AuthContext";

const GOOGLE_CLIENT_ID = "801008777970-q7dpn0jjusocfdfv7l6om5281ktue9vf.apps.googleusercontent.com"; // ← set this

export default function LoginPage({ onSwitch }) {
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const googleBtnRef = useRef(null);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // --- Normal login submit ---
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(form); // { message, token, user }
      login(res.token, res.user);
      if (res.user?.role === "provider") navigate("/dashboard");
      else navigate("/");
    } catch (err) {
      alert("Error: " + (err.message || "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  // --- Google Identity setup ---
  useEffect(() => {
    // load Google Identity Services script
    const scriptId = "google-identity";
    if (!document.getElementById(scriptId)) {
      const s = document.createElement("script");
      s.src = "https://accounts.google.com/gsi/client";
      s.async = true;
      s.defer = true;
      s.id = scriptId;
      s.onload = initGoogle;
      document.body.appendChild(s);
    } else {
      initGoogle();
    }

    function initGoogle() {
      /* global google */
      if (!window.google || !google.accounts?.id) return;
      try {
        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCredential,
          ux_mode: "popup",
        });

        if (googleBtnRef.current) {
          google.accounts.id.renderButton(googleBtnRef.current, {
            theme: "outline",
            size: "large",
            shape: "pill",
            text: "continue_with",
            width: 360,
          });
        }
      } catch (e) {
        // ignore if GIS not ready
      }
    }
    // no cleanup needed for GIS
  }, []);

  // Handle credential from Google (JWT)
  const handleGoogleCredential = async (response) => {
    const idToken = response?.credential;
    if (!idToken) {
      alert("Google sign-in failed: no credential");
      return;
    }
    setGLoading(true);
    try {
      const res = await googleLogin(idToken); // { token, user }
      login(res.token, res.user);
      if (res.user?.role === "provider") navigate("/dashboard");
      else navigate("/");
    } catch (err) {
      alert("Google login failed: " + (err.message || "Unknown error"));
    } finally {
      setGLoading(false);
    }
  };

  return (
    <Paper elevation={4} sx={{ maxWidth: 420, mx: "auto", p: 4, mt: 8, borderRadius: 3 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Login
      </Typography>

      {/* Native login */}
      <form onSubmit={onSubmit}>
        <TextField
          fullWidth name="identifier" label="Username or Phone"
          value={form.identifier} onChange={onChange} required sx={{ mb: 2 }}
        />

        <TextField
          fullWidth name="password" label="Password"
          type={showPw ? "text" : "password"} value={form.password}
          onChange={onChange} required sx={{ mb: 2 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton aria-label={showPw ? "Hide password" : "Show password"} onClick={() => setShowPw((s) => !s)} edge="end">
                  {showPw ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ py: 1.2, fontWeight: 600 }}>
          {loading ? <CircularProgress size={24} /> : "Login"}
        </Button>
      </form>

      {/* Separator */}
      <Box sx={{ my: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Divider sx={{ flex: 1 }} />
        <Typography variant="body2" color="text.secondary">or</Typography>
        <Divider sx={{ flex: 1 }} />
      </Box>

      {/* Google button */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
        <div ref={googleBtnRef} />
      </Box>
      {gLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <CircularProgress size={22} />
        </Box>
      )}

      <Typography align="center" sx={{ mt: 2 }}>
        Don’t have an account?{" "}
        <Link component="button" onClick={() => onSwitch?.("register")}>
          Register
        </Link>
      </Typography>
    </Paper>
  );
}
