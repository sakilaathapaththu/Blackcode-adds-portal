// src/Pages/Auth/LoginPage.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Paper, Typography, TextField, Button, CircularProgress, Link,
  IconButton, InputAdornment, Box, Divider, useMediaQuery, Container
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
  const isXs = useMediaQuery((theme) => theme.breakpoints.down("sm"));

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

  // --- Google Identity setup (responsive width) ---
  useEffect(() => {
    const scriptId = "google-identity";
    const initGoogle = () => {
      /* global google */
      if (!window.google || !google.accounts?.id) return;
      try {
        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCredential,
          ux_mode: "popup",
        });

        // adapt button width to screen (leave margins for padding)
        const calcWidth = () => Math.min(360, Math.max(220, window.innerWidth - 48));
        if (googleBtnRef.current) {
          googleBtnRef.current.innerHTML = ""; // clear re-renders on hot reload
          google.accounts.id.renderButton(googleBtnRef.current, {
            theme: "outline",
            size: isXs ? "large" : "large",
            shape: "pill",
            text: "continue_with",
            width: calcWidth(),
          });
        }
      } catch {}
    };

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
  }, [isXs]);

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
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // iOS safe-areas
        px: { xs: 2, sm: 3 },
        py: { xs: "calc(16px + env(safe-area-inset-top))", sm: 4 },
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 3,
          p: { xs: 3, sm: 4 },
          boxShadow: { xs: "0 8px 24px rgba(0,0,0,0.08)", sm: undefined },
        }}
      >
        <Typography
          variant={isXs ? "h6" : "h5"}
          fontWeight={600}
          gutterBottom
          sx={{ textAlign: "center", mb: { xs: 2, sm: 3 } }}
        >
          Login
        </Typography>

        {/* Native login */}
        <Box component="form" onSubmit={onSubmit} noValidate>
          <TextField
            fullWidth
            name="identifier"
            label="Username or Phone"
            value={form.identifier}
            onChange={onChange}
            required
            size={isXs ? "medium" : "medium"}
            sx={{ mb: 2 }}
            inputProps={{ inputMode: "text", autoComplete: "username" }}
          />

          <TextField
            fullWidth
            name="password"
            label="Password"
            type={showPw ? "text" : "password"}
            value={form.password}
            onChange={onChange}
            required
            size={isXs ? "medium" : "medium"}
            sx={{ mb: 2 }}
            inputProps={{ autoComplete: "current-password" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPw ? "Hide password" : "Show password"}
                    onClick={() => setShowPw((s) => !s)}
                    edge="end"
                  >
                    {showPw ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              py: 1.2,
              fontWeight: 600,
              fontSize: { xs: ".95rem", sm: "1rem" },
              mt: 0.5,
            }}
          >
            {loading ? <CircularProgress size={22} /> : "Login"}
          </Button>
        </Box>

        {/* Separator */}
        <Box
          sx={{
            my: 3,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Divider sx={{ flex: 1 }} />
          <Typography variant="body2" color="text.secondary">
            or
          </Typography>
          <Divider sx={{ flex: 1 }} />
        </Box>

        {/* Google button (auto width) */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
          <div ref={googleBtnRef} style={{ width: "100%", display: "flex", justifyContent: "center" }} />
        </Box>
        {gLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <CircularProgress size={20} />
          </Box>
        )}

        <Typography align="center" sx={{ mt: 2 }}>
          Don’t have an account?{" "}
          <Link component="button" onClick={() => onSwitch?.("register")}>
            Register
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
}
