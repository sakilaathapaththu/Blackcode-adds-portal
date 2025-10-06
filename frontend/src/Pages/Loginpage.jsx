import React, { useState } from 'react';
import { Container, Box, TextField, Button, Typography, Paper, Alert } from '@mui/material';
import API from '../Utils/api';
import { setToken } from '../Utils/auth';
import { useNavigate } from 'react-router-dom';
import HomepageNavbar from '../Components/NavBar/Homepagenavbar';
import Footer from '../Components/Home/Footer';

export default function Loginpage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await API.post('/auth/login', { email, password });
      setToken(res.data.token);
      nav('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>Login</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          <Button variant="contained" type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</Button>
        </Box>
        <Typography variant="caption" sx={{ mt: 2, display: 'block' }}>
          Note: first-time login will create account automatically.
        </Typography>
      </Paper>
    </Container>
  );
}
