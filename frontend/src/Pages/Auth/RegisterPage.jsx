// src/Pages/Auth/RegisterPage.jsx
import React, { useState } from "react";
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
} from "@mui/material";

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
  const isXs = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser(form); // role handled in API helper
      alert("Registration successful! Please log in.");
      onSwitch?.("login");
      setForm({
        name: "",
        username: "",
        email: "",
        phone: "",
        password: "",
      });
    } catch (err) {
      alert("Error: " + (err.message || "Registration failed"));
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
        px: { xs: 2, sm: 3 }, // horizontal padding
        py: { xs: "calc(16px + env(safe-area-inset-top))", sm: 4 }, // safe-area on iOS
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
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
            required
            size="medium"
            sx={{ mb: 2 }}
            inputProps={{ autoComplete: "email", inputMode: "email" }}
          />

          <TextField
            fullWidth
            name="phone"
            label="Phone"
            value={form.phone}
            onChange={onChange}
            required
            size="medium"
            sx={{ mb: 2 }}
            inputProps={{
              autoComplete: "tel",
              inputMode: "tel",
              maxLength: 15,
            }}
          />

          <TextField
            fullWidth
            name="password"
            label="Password"
            type="password"
            value={form.password}
            onChange={onChange}
            required
            size="medium"
            sx={{ mb: 2 }}
            inputProps={{ autoComplete: "new-password" }}
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
    </Container>
  );
}
