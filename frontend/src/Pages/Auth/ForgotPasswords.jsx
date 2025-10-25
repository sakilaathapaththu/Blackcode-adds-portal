import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // For now just simulate success — backend can be added later
      // await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      setMessage("If this email exists, a reset link has been sent.");
      setError("");
    } catch (err) {
      setError("Something went wrong. Try again later.");
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Paper sx={{ p: 4, width: 400, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h5" mb={2} textAlign="center" fontWeight={600}>
          Forgot Password
        </Typography>

        {message && <Typography color="green" mb={1}>{message}</Typography>}
        {error && <Typography color="error" mb={1}>{error}</Typography>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2, py: 1 }}
            type="submit"
          >
            Send Reset Link
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
