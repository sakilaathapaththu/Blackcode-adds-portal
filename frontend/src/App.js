// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Box } from "@mui/material";

import { AuthProvider } from "./Context/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute";

import Home from "./Pages/Homepage";
import Dashboard from "./Pages/Dashboard";
import Profile from "./Pages/Profile";
import HomepageNavbar from "./Components/NavBar/Homepagenavbar";
import AuthPage from "./Pages/Auth/AuthPage";
import TestPosts from "./Pages/TestPosts";


const theme = createTheme({
  palette: { mode: "light", background: { default: "#F6F9FC" } },
  shape: { borderRadius: 12 },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <HomepageNavbar />
          <Box sx={{ minHeight: "calc(100vh - 160px)", pt: "15px" }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/test" element={<TestPosts />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute role="provider">
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Box>
          {/* If your Footer is a component, include it here */}
          {/* <Footer /> */}
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
