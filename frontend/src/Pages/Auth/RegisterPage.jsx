import React, { useState } from "react";
import { Box, Button, TextField, Typography, Link, Paper, CircularProgress } from "@mui/material";
import { Formik, Form } from "formik";
import { registerSchema } from "../../Utils/validate";
import { registerUser } from "../../Api/Auth";

const Register = ({ onSwitch }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      await registerUser(values);
      alert("Registration successful! Please log in.");
      onSwitch("login");
      resetForm();
    } catch (err) {
      alert("Error: " + err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={4} sx={{ maxWidth: 420, mx: "auto", p: 4, mt: 8, borderRadius: 3 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Create Your Account
      </Typography>

      <Formik
        initialValues={{ name: "", email: "", password: "" }}
        validationSchema={registerSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange }) => (
          <Form>
            <TextField
              fullWidth
              name="name"
              label="Full Name"
              value={values.name}
              onChange={handleChange}
              error={touched.name && !!errors.name}
              helperText={touched.name && errors.name}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              name="email"
              label="Email"
              value={values.email}
              onChange={handleChange}
              error={touched.email && !!errors.email}
              helperText={touched.email && errors.email}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              name="password"
              label="Password"
              type="password"
              value={values.password}
              onChange={handleChange}
              error={touched.password && !!errors.password}
              helperText={touched.password && errors.password}
              sx={{ mb: 2 }}
            />

            <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ py: 1.2, fontWeight: 600 }}>
              {loading ? <CircularProgress size={24} /> : "Sign Up"}
            </Button>

            <Typography align="center" sx={{ mt: 2 }}>
              Already have an account?{" "}
              <Link component="button" onClick={() => onSwitch("login")}>
                Login
              </Link>
            </Typography>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

export default Register;
