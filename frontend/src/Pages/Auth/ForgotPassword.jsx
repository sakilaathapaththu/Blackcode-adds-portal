// src/Pages/Auth/ForgotPassword.jsx
import React, { useState } from "react";
import {
  Container, Paper, Typography, TextField, Button, Box, CircularProgress, Alert
} from "@mui/material";
import { useNavigate } from "react-router-dom";                 // ← added
import { requestPasswordReset, resetPassword } from "../../Api/Auth";

export default function ForgotPassword() {
  const navigate = useNavigate();                                // ← added

  const [step, setStep] = useState(1); // 1 = ask email, 2 = otp+new password
  const [email, setEmail] = useState("");
  const [resetId, setResetId] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const onRequestOTP = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });
    if (!email.trim()) return setMsg({ type: "error", text: "Email is required" });

    try {
      setLoading(true);
      const res = await requestPasswordReset(email.trim());
      setResetId(res.resetId);
      setStep(2);
      setMsg({ type: "success", text: "OTP sent to your email." });
    } catch (err) {
      setMsg({ type: "error", text: err?.message || "Failed to send OTP" });
    } finally {
      setLoading(false);
    }
  };

  const onReset = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });
    if (!otp.trim()) return setMsg({ type: "error", text: "OTP is required" });
    if (!password) return setMsg({ type: "error", text: "New password is required" });
    if (password !== confirm) return setMsg({ type: "error", text: "Passwords do not match" });

    try {
      setLoading(true);
      await resetPassword({ resetId, otp: otp.trim(), newPassword: password });
      setMsg({ type: "success", text: "Password updated. Redirecting to login..." });

      // ✅ Auto-navigate to login after 1.5s
      setTimeout(() => navigate("/auth?mode=login"), 1500);      // ← added
    } catch (err) {
      setMsg({ type: "error", text: err?.message || "Reset failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: "100dvh", display: "flex", alignItems: "center" }}>
      <Paper sx={{ p: 4, width: "100%", borderRadius: 3 }} elevation={4}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Forgot Password
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {step === 1
            ? "Enter your registered email. We'll send a one-time OTP."
            : "Enter the OTP we emailed you and set a new password."}
        </Typography>

        {msg.text ? <Alert severity={msg.type} sx={{ mb: 2 }}>{msg.text}</Alert> : null}

        {step === 1 ? (
          <Box component="form" onSubmit={onRequestOTP} noValidate>
            <TextField
              fullWidth
              label="Registered Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
              required
            />
            <Button type="submit" fullWidth variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={22} /> : "Send OTP"}
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={onReset} noValidate>
            <TextField
              fullWidth
              label="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              sx={{ mb: 2 }}
              inputProps={{ inputMode: "numeric" }}
              required
            />
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              sx={{ mb: 2 }}
              required
            />
            <Button type="submit" fullWidth variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={22} /> : "Reset Password"}
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
}
