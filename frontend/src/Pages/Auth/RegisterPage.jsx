// src/Pages/Auth/RegisterPage.jsx
import React, { useState } from "react";
import { Paper, Typography, TextField, Button, CircularProgress, Link } from "@mui/material";
import { registerUser } from "../../Api/Auth";

export default function RegisterPage({ onSwitch }) {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault(); // prevent page reload
    setLoading(true);
    try {
      await registerUser(form); // role added in API helper
      alert("Registration successful! Please log in.");
      onSwitch?.("login");
      setForm({ name: "", username: "", email: "", phone: "", password: "" });
    } catch (err) {
      alert("Error: " + (err.message || "Registration failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={4} sx={{ maxWidth: 420, mx: "auto", p: 4, mt: 8, borderRadius: 3 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Create Your Account
      </Typography>

      <form onSubmit={onSubmit}>
        <TextField fullWidth name="name" label="Full Name" value={form.name} onChange={onChange} required sx={{ mb: 2 }} />
        <TextField fullWidth name="username" label="Username" value={form.username} onChange={onChange} required sx={{ mb: 2 }} />
        <TextField fullWidth name="email" label="Email" type="email" value={form.email} onChange={onChange} required sx={{ mb: 2 }} />
        <TextField fullWidth name="phone" label="Phone" value={form.phone} onChange={onChange} required sx={{ mb: 2 }} />
        <TextField fullWidth name="password" label="Password" type="password" value={form.password} onChange={onChange} required sx={{ mb: 2 }} />

        <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ py: 1.2, fontWeight: 600 }}>
          {loading ? <CircularProgress size={24} /> : "Sign Up"}
        </Button>

        <Typography align="center" sx={{ mt: 2 }}>
          Already have an account?{" "}
          <Link component="button" onClick={() => onSwitch?.("login")}>
            Login
          </Link>
        </Typography>
      </form>
    </Paper>
  );
}
