import React, { useState, useContext } from "react";
import {
  Box, Button, TextField, Typography, Link, Paper, CircularProgress
} from "@mui/material";
import { Formik, Form } from "formik";
import { loginSchema } from "../../Utils/validate";
import { loginUser } from "../../Api/Auth";
import { AuthContext } from "../../Context/AuthContext";

const Login = ({ onSwitch }) => {
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values, { setErrors }) => {
    setLoading(true);
    try {
      const { data } = await loginUser(values);
      login(data.token);
      alert("Login Successful!");
    } catch (err) {
      setErrors({ email: "Invalid email or password" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={4} sx={{ maxWidth: 420, mx: "auto", p: 4, mt: 8, borderRadius: 3 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Welcome Back
      </Typography>

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={loginSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange }) => (
          <Form>
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

            <Link
              component="button"
              variant="body2"
              sx={{ float: "right", mb: 2 }}
              onClick={() => onSwitch("forgot")}
            >
              Forgot Password?
            </Link>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ py: 1.2, fontWeight: 600 }}
            >
              {loading ? <CircularProgress size={24} /> : "Login"}
            </Button>

            <Typography align="center" sx={{ mt: 2 }}>
              Don’t have an account?{" "}
              <Link component="button" onClick={() => onSwitch("register")}>
                Sign Up
              </Link>
            </Typography>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

export default Login;
