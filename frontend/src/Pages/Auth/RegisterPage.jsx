
// src/Pages/Auth/RegisterPage.jsx
import React, { useMemo, useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Link,
  Container,
  Box,
  useMediaQuery,
  Snackbar,
  Alert,
} from "@mui/material";

import { registerUser } from "../../Api/Auth";

const isValidEmail = (v = "") =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim());

export default function RegisterPage({ onSwitch }) {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  // Toast state
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info", // 'success' | 'error' | 'warning' | 'info'
  });

  const isXs = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  // --- derived validations ---
  const phoneDigits = useMemo(() => form.phone.replace(/\D/g, ""), [form.phone]);
  const phoneError = phoneDigits.length > 0 && phoneDigits.length !== 10;
  const emailError = form.email.length > 0 && !isValidEmail(form.email);
  const passwordsMismatch =
    form.confirmPassword.length > 0 && form.password !== form.confirmPassword;

  const formMissing =
    !form.name.trim() ||
    !form.username.trim() ||
    !form.email.trim() ||
    !form.phone.trim() ||
    !form.password ||
    !form.confirmPassword;

  const formHasErrors =
    phoneError || emailError || passwordsMismatch;

  const openToast = (message, severity = "info") =>
    setToast({ open: true, message, severity });

  const closeToast = (_, reason) => {
    if (reason === "clickaway") return;
    setToast((t) => ({ ...t, open: false }));
  };

  const onChangeGeneric = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // Phone: keep only digits and limit to 10
  const onChangePhone = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
    setForm((f) => ({ ...f, phone: digitsOnly }));
  };

  // Optional UX: block non-digit keys (still sanitize onChange for pasted input)
  const onPhoneKeyDown = (e) => {
    const allowedKeys = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
      "Home",
      "End",
    ];
    const isDigit = e.key >= "0" && e.key <= "9";
    if (!isDigit && !allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (formMissing) {
      openToast("Please fill all required fields.", "warning");
      return;
    }
    if (emailError) {
      openToast("Please enter a valid email address.", "error");
      return;
    }
    if (phoneError || phoneDigits.length !== 10) {
      openToast("Phone number must be exactly 10 digits.", "error");
      return;
    }
    if (passwordsMismatch) {
      openToast("Passwords do not match.", "error");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        phone: phoneDigits, // send normalized digits
        password: form.password,
      };
      await registerUser(payload);
      openToast("Registration successful! Redirecting to login…", "success");

      // Reset + go to login after a short delay
      setTimeout(() => {
        onSwitch?.("login");
        setForm({
          name: "",
          username: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
        });
      }, 900);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed.";
      openToast(`Registration failed: ${msg}`, "error");
    } finally {
      setLoading(false);
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
          Create Your Account
        </Typography>

        <Box component="form" onSubmit={onSubmit} noValidate>
          <TextField
            fullWidth
            name="name"
            label="Full Name"
            value={form.name}
            onChange={onChangeGeneric}
            required
            size="medium"
            sx={{ mb: 2 }}
            inputProps={{ autoComplete: "name" }}
          />

          <TextField
            fullWidth
            name="username"
            label="Username"
            value={form.username}
            onChange={onChangeGeneric}
            required
            size="medium"
            sx={{ mb: 2 }}
            inputProps={{ autoComplete: "username" }}
          />

          <TextField
            fullWidth
            name="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={onChangeGeneric}
            required
            size="medium"
            sx={{ mb: 2 }}
            error={emailError}
            helperText={emailError ? "Enter a valid email (e.g., name@example.com)" : " "}
            inputProps={{ autoComplete: "email", inputMode: "email" }}
          />

          <TextField
            fullWidth
            name="phone"
            label="Phone (10 digits)"
            value={form.phone}
            onChange={onChangePhone}
            onKeyDown={onPhoneKeyDown}
            required
            size="medium"
            sx={{ mb: 2 }}
            error={phoneError}
            helperText={
              phoneError
                ? "Phone number must be exactly 10 digits"
                : `${phoneDigits.length}/10`
            }
            inputProps={{
              inputMode: "numeric",
              pattern: "\\d*",
              maxLength: 10, // visual limit; real limit enforced in onChange
            }}
          />

          <TextField
            fullWidth
            name="password"
            label="Password"
            type="password"
            value={form.password}
            onChange={onChangeGeneric}
            required
            size="medium"
            sx={{ mb: 2 }}
            inputProps={{ autoComplete: "new-password" }}
          />

          <TextField
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            value={form.confirmPassword}
            onChange={onChangeGeneric}
            required
            size="medium"
            sx={{ mb: 2 }}
            error={passwordsMismatch}
            helperText={passwordsMismatch ? "Passwords do not match" : " "}
            inputProps={{ autoComplete: "new-password" }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading || formHasErrors || formMissing}
            sx={{
              py: 1.2,
              fontWeight: 600,
              fontSize: { xs: ".95rem", sm: "1rem" },
              mt: 0.5,
            }}
          >
            {loading ? <CircularProgress size={22} /> : "Sign Up"}
          </Button>

          <Typography align="center" sx={{ mt: 2 }}>
            Already have an account?{" "}
            <Link component="button" onClick={() => onSwitch?.("login")}>
              Login
            </Link>
          </Typography>
        </Box>
      </Paper>

      {/* Toast (top-right) */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3200}
        onClose={closeToast}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={closeToast}
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
